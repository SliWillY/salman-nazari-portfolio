// Renders the social preview cards (scripts/og/card.html) to public/og/en.jpg and public/og/ar.jpg: `pnpm og`.
// Run it again after changing the card's words or design, then commit the images. Pages add a hash of each image
// to its og:image URL (src/lib/og.ts), so apps that cache images by URL fetch the new one.
// Uses the Chrome or Edge already installed (scripts/lib/chrome.mjs), so it needs no packages. Needs internet for
// the Google Fonts.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchChrome } from '../lib/chrome.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const card = pathToFileURL(join(root, 'scripts/og/card.html'));
const out = join(root, 'public/og');
const [width, height] = [1200, 630];

const { send, close } = await launchChrome();
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
  await close();
}
