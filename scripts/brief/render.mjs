// Renders the brief (src/pages/[lang]/brief.astro) to the PDFs its button downloads, public/brief/*.pdf, one A4
// page per language: `pnpm brief`. Run it again after changing the brief's words or design, then commit the PDFs.
// It prints the real page with the browser's own PDF printer (scripts/lib/chrome.mjs), from the dev server if
// `pnpm dev` is running, otherwise from one it starts for the job. Needs internet for the Google Fonts and the portrait.
// The stage is laid into the PDF as one picture (see `flatten` below); the same picture without its confetti is saved
// beside the PDF (…-stage.jpg), for the page to draw a download's stage afresh (brief.astro).
// It stops instead of writing a PDF if a language's sheet is too full for one page, or would use a fallback font.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome } from '../lib/chrome.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const minGap = 3; // mm of air to keep between the sheet's rows

let origin = 'http://localhost:4321';
let server;
if (!(await fetch(`${origin}/en/brief/`).then((response) => response.ok, () => false))) {
  const { dev } = await import('astro');
  server = await dev({ root, logLevel: 'error' });
  origin = `http://localhost:${server.address.port}`;
}

// Runs in the page, laid out for print: waits for the fonts and pictures, has the stage's 3D canvas photographed
// (window.briefShot, see brief.astro: a PDF cannot hold the live canvas), then measures what is left over.
// The body's rows share its height (inside its padding), so their spare room is that minus theirs; the stage's words are stacked,
// so theirs is what remains around them. (Both in millimetres; negative means it sticks out.)
const measure = (faces) => `(async () => {
  const sheet = document.querySelector('[data-brief-sheet]');
  if (document.readyState !== 'complete' || !sheet) return null;
  const loaded = await Promise.all(${JSON.stringify(faces)}.map((face) => document.fonts.load(face, sheet.textContent))).catch(() => []);
  await document.fonts.ready;
  if (!window.briefShot) return null;
  const confetti = sheet.dataset.briefConfetti === 'on'; // the switch: confettiInPdf in src/lib/brief.ts
  const stageShot = confetti ? await window.briefShot() : true;
  const pictures = await Promise.all([...document.images].filter((image) => image.getAttribute('src')).map((image) => image.decode().then(() => true, () => false)));
  const mm = (px) => px * 25.4 / 96;
  const box = (el) => el.getBoundingClientRect();
  const style = (el, name) => parseFloat(getComputedStyle(el)[name]);
  const body = sheet.querySelector('.brief-body');
  const words = sheet.querySelector('.brief-hero-words');
  return {
    file: sheet.dataset.briefSheet,
    fonts: loaded.length > 0 && loaded.every((list) => list.length > 0),
    pictures: pictures.every(Boolean),
    confetti,
    stageShot,
    gap: mm(body.clientHeight - style(body, 'paddingTop') - style(body, 'paddingBottom') - [...body.children].reduce((sum, row) => sum + row.offsetHeight, 0)) / (body.children.length - 1),
    rows: body.children.length,
    stage: mm(words.clientHeight - style(words, 'paddingTop') - style(words, 'paddingBottom') - (box(words.lastElementChild).bottom - box(words.firstElementChild).top))
  };
})()`;
// The stage's gradient is several soft see-through layers, which PDF viewers redraw slowly at every scroll and zoom.
// So the stage (gradient and confetti, without the words and the portrait that lie over it) is photographed, and the
// photograph becomes its whole background: one picture in the PDF instead of the layers. With confetti in the PDF
// switched off (confettiInPdf in src/lib/brief.ts) that picture is the gradient alone. Only these PDFs get this;
// the page itself, and a print from the browser, keep the live gradient.
const bare = `(() => {
  const sheet = document.querySelector('[data-brief-sheet]');
  for (const el of sheet.querySelectorAll('.brief-hero-words, .brief-photo')) el.style.visibility = 'hidden';
  const { x, y, width, height } = sheet.querySelector('.brief-hero').getBoundingClientRect();
  return { x, y, width, height };
})()`;
const flatten = (picture) => `(async () => {
  const sheet = document.querySelector('[data-brief-sheet]');
  const url = ${JSON.stringify(picture)};
  const image = new Image();
  image.src = url;
  await image.decode();
  sheet.querySelector('.brief-hero').style.background = 'url(' + url + ') center / 100% 100% no-repeat';
  sheet.querySelector('[data-brief-shot]').remove(); // the confetti is in the picture now
  for (const el of sheet.querySelectorAll('.brief-hero-words, .brief-photo')) el.style.visibility = '';
  return true;
})()`;
const faces = { en: ['800 20px "DM Sans"', '400 20px "DM Sans"'], ar: ['700 20px "Readex Pro"', '400 20px "Readex Pro"'] };

const { send, close } = await launchChrome();
try {
  for (const lang of ['en', 'ar']) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    // An A4 page at 96 dpi, in print layout, so the measurements are the printed page's.
    await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send('Emulation.setEmulatedMedia', { media: 'print' }, sessionId);
    await send('Page.navigate', { url: `${origin}/${lang}/brief/` }, sessionId);
    let sheet;
    for (const started = Date.now(); !sheet; await new Promise((r) => setTimeout(r, 150))) {
      if (Date.now() - started > 30000) throw new Error(`${lang}: the brief did not finish loading`);
      const { result } = await send('Runtime.evaluate', { expression: measure(faces[lang]), awaitPromise: true, returnByValue: true }, sessionId);
      sheet = result.value;
    }
    if (!sheet.fonts) throw new Error(`${lang}: the Google Fonts did not load, so the brief would use a fallback font (offline?)`);
    if (!sheet.pictures) throw new Error(`${lang}: the portrait did not load (offline, or a wrong public ID in src/lib/brief.ts?)`);
    if (!sheet.stageShot) throw new Error(`${lang}: the stage's 3D confetti could not be drawn (no WebGL in this browser?)`);
    const tooFull = sheet.gap < minGap ? `its rows are ${((minGap - sheet.gap) * (sheet.rows - 1)).toFixed(0)} mm too tall`
      : sheet.stage < 0 ? `the words on the stage are ${(-sheet.stage).toFixed(0)} mm too tall` : '';
    if (tooFull) throw new Error(`${lang}: the sheet no longer fits one A4 page (${tooFull}). Shorten a text in src/lib/brief.ts.`);

    const { result: stage } = await send('Runtime.evaluate', { expression: bare, returnByValue: true }, sessionId);
    const clip = { ...stage.value, scale: 3 };
    const confetti = (visibility) => send('Runtime.evaluate', { expression: `document.querySelector('[data-brief-shot]').style.visibility = '${visibility}'` }, sessionId);
    await confetti('hidden');
    const plain = await send('Page.captureScreenshot', { format: 'jpeg', quality: 92, clip }, sessionId);
    writeFileSync(join(root, 'public', sheet.file.replace(/\.pdf$/, '-stage.jpg')), Buffer.from(plain.data, 'base64'));
    await confetti('');
    const shot = sheet.confetti ? await send('Page.captureScreenshot', { format: 'jpeg', quality: 92, clip }, sessionId) : plain;
    await send('Runtime.evaluate', { expression: flatten(`data:image/jpeg;base64,${shot.data}`), awaitPromise: true }, sessionId);

    const { data } = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 }, sessionId);
    const pdf = Buffer.from(data, 'base64');
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)?.length;
    if (pages !== 1) throw new Error(`${lang}: the PDF came out as ${pages} pages instead of 1`);
    const file = join(root, 'public', sheet.file);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pdf);
    console.log(`public/${sheet.file}  ${Math.round(pdf.length / 1024)} KB  (${(sheet.gap * (sheet.rows - 1)).toFixed(1)} mm to spare${sheet.confetti ? '' : ', confetti off'})`);
    await send('Target.closeTarget', { targetId });
  }
} finally {
  await close();
  await server?.stop();
}
