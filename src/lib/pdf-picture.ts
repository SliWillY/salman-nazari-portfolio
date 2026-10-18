// Swaps the widest JPEG picture inside a PDF for another one, in the browser, without rewriting the file: the new
// picture is appended as a newer version of the same object (a PDF "incremental update"), which every viewer reads
// in place of the old one. The brief uses it so that a download shows its banner as it is at that moment
// (src/pages/[lang]/brief.astro); there the widest picture is the banner.
// It reads the PDF as text, so it only suits the plain files `pnpm brief` writes (uncompressed object headers and a
// classic cross-reference table). Anything else throws, and the caller falls back to the PDF as it is.
export function replaceWidestJpeg(pdf: Uint8Array, jpeg: Uint8Array, width: number, height: number): Uint8Array {
  // One character per byte, so positions in the text are positions in the file.
  const text = new TextDecoder('latin1').decode(pdf);
  let picture: { id: string; dict: string; width: number } | undefined;
  for (const [, id, dict] of text.matchAll(/(\d+) 0 obj\s*<<((?:(?!>>)[\s\S])*?)>>\s*stream/g)) {
    if (!/\/Subtype\s*\/Image/.test(dict) || !/\/Filter\s*\/DCTDecode/.test(dict)) continue;
    const wide = Number(/\/Width\s+(\d+)/.exec(dict)?.[1]);
    if (!picture || wide > picture.width) picture = { id, dict, width: wide };
  }
  const trailer = [...text.matchAll(/trailer\s*<<([\s\S]*?)>>/g)].at(-1)?.[1];
  const previous = [...text.matchAll(/startxref\s+(\d+)/g)].at(-1)?.[1];
  if (!picture || !trailer || !previous) throw new Error('Not a PDF this can edit');

  // The same picture object, with the new size and length. /ColorTransform goes: a canvas's JPEG is an ordinary
  // (YCbCr) one, which is what a viewer assumes when nothing is said.
  const dict = picture.dict
    .replace(/\/Width\s+\d+/, `/Width ${width}`).replace(/\/Height\s+\d+/, `/Height ${height}`)
    .replace(/\/Length\s+\d+/, `/Length ${jpeg.length}`).replace(/\/ColorTransform\s+\d+\s*/, '');
  const bytes = (value: string) => new TextEncoder().encode(value);
  const head = bytes(`\n${picture.id} 0 obj\n<<${dict}>>\nstream\n`);
  const foot = bytes('\nendstream\nendobj\n');
  const objectAt = pdf.length + 1; // after the line break that starts the update
  const tableAt = pdf.length + head.length + jpeg.length + foot.length;
  // A one-entry cross-reference table (each entry is exactly 20 bytes) and a trailer pointing back at the old one.
  const table = bytes(`xref\n${picture.id} 1\n${String(objectAt).padStart(10, '0')} 00000 n \ntrailer\n<<${trailer.replace(/\/Prev\s+\d+\s*/, '').trim()}\n/Prev ${previous}>>\nstartxref\n${tableAt}\n%%EOF\n`);

  const out = new Uint8Array(tableAt + table.length);
  let at = 0;
  for (const part of [pdf, head, jpeg, foot, table]) { out.set(part, at); at += part.length; }
  return out;
}
