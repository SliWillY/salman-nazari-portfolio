// The Chrome or Edge already installed (or CHROME_PATH), run headless and driven over the DevTools protocol, so the
// render scripts (scripts/og, scripts/brief) need no packages; a real browser gets Arabic letter shaping right.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);

// Starts the browser. send(method, params, sessionId) calls the DevTools protocol; close() quits it and cleans up.
export async function launchChrome() {
  const executable = browsers.find((file) => existsSync(file));
  if (!executable) throw new Error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.');

  const profile = mkdtempSync(join(tmpdir(), 'render-'));
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

  const close = async () => {
    await send('Browser.close').catch(() => {});
    ws.close();
    await new Promise((r) => (browser.exitCode === null ? browser.on('exit', r) : r()));
    rmSync(profile, { recursive: true, force: true });
  };
  return { send, close };
}
