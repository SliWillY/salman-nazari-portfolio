// Renders the social preview cards (scripts/og/card.html) to public/og/en.jpg and public/og/ar.jpg: `pnpm og`.
// Run it again after changing the card's words or design, then commit the images. Pages add a hash of each image
// to its og:image URL (src/lib/og.ts), so apps that cache images by URL fetch the new one.
// Uses the Chrome or Edge already installed (or CHROME_PATH) over the DevTools protocol, so it needs no packages;
// a real browser gets Arabic letter shaping right. Needs internet for the Google Fonts.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const card = pathToFileURL(join(root, 'scripts/og/card.html'));
const out = join(root, 'public/og');
const [width, height] = [1200, 630];

const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);
const executable = browsers.find((file) => existsSync(file));
if (!executable) throw new Error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.');

const profile = mkdtempSync(join(tmpdir(), 'og-card-'));
const browser = spawn(executable, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--force-color-profile=srgb', '--allow-file-access-from-files', 'about:blank'
]);
const endpoint = await new Promise((resolve, reject) => {
  let log = '';
  browser.stderr.on('data', (chunk) => {
    log += chunk;
    const match = log.match(/DevTools listening on (ws:\S+)/);
    if (match) resolve(match[1]);
  });
  browser.on('exit', () => reject(new Error(`The browser quit before starting:\n${log}`)));
});

// A tiny DevTools protocol client.
const ws = new WebSocket(endpoint);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  const call = pending.get(message.id);
  if (!call) return;
  pending.delete(message.id);
  message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result);
};
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});

try {
  mkdirSync(out, { recursive: true });
  for (const lang of ['en', 'ar']) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send('Page.navigate', { url: `${card.href}?lang=${lang}` }, sessionId);
    // The card sets window.cardReady once its fonts have loaded.
    let ready;
    for (const started = Date.now(); !ready; await new Promise((r) => setTimeout(r, 100))) {
      if (Date.now() - started > 20000) throw new Error(`${lang}: the card did not finish loading (offline?)`);
      const { result } = await send('Runtime.evaluate', { expression: 'location.search && window.cardReady', returnByValue: true }, sessionId);
      ready = result.value;
    }
    if (!ready.ok) throw new Error(`${lang}: the Google Fonts did not load, so the card would use a fallback font`);
    const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 0, y: 0, width, height, scale: 1 } }, sessionId);
    const file = join(out, `${lang}.jpg`);
    writeFileSync(file, Buffer.from(data, 'base64'));
    console.log(`public/og/${lang}.jpg  ${Math.round(Buffer.byteLength(data, 'base64') / 1024)} KB`);
    await send('Target.closeTarget', { targetId });
  }
} finally {
  await send('Browser.close').catch(() => {});
  ws.close();
  await new Promise((r) => (browser.exitCode === null ? browser.on('exit', r) : r()));
  rmSync(profile, { recursive: true, force: true });
}
