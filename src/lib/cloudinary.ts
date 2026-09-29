const cloud = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'vwkbtzdh';
const base = `https://res.cloudinary.com/${cloud}`;

export function normalizePublicId(publicId: string): string {
  if (!publicId) return '';
  const trimmed = publicId.trim().replace(/^\/+/, '');
  const urlMatch = trimmed.match(/res\.cloudinary\.com\/[^/]+\/(?:image|raw|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  if (urlMatch) {
    return urlMatch[1];
  }
  return trimmed;
}

export function cloudinaryUrl(publicId: string, width = 1600, quality = 'auto') {
  const id = normalizePublicId(publicId);
  return `${base}/image/upload/f_auto,q_${quality},c_limit,w_${width}/${id}`;
}

export function cloudinarySrcSet(publicId: string) {
  const id = normalizePublicId(publicId);
  return [480, 768, 1024, 1440, 1920].map((width) => `${cloudinaryUrl(id, width)} ${width}w`).join(', ');
}

// Cloudinary stores PDFs as image assets, so the original file is served from image/upload with a .pdf extension.
export function cloudinaryPdfUrl(publicId: string) {
  if (/^https?:\/\//.test(publicId.trim()) && !publicId.includes('res.cloudinary.com')) return publicId.trim();
  const id = normalizePublicId(publicId).replace(/\.pdf$/i, '');
  return `${base}/image/upload/${id}.pdf`;
}

// Renders one page of a Cloudinary PDF as an image, for document previews.
export function cloudinaryPdfPreview(publicId: string, width = 900, page = 1) {
  const id = normalizePublicId(publicId).replace(/\.pdf$/i, '');
  return `${base}/image/upload/pg_${page},f_auto,q_auto,c_limit,w_${width}/${id}.jpg`;
}

export function cloudinaryVideoUrl(publicId: string) {
  return `${base}/video/upload/q_auto,f_auto/${normalizePublicId(publicId)}.mp4`;
}

// Shown while media has not been uploaded yet; in dev it names the missing public ID.
// Three paper confetti dots above the text, in the site's style. Colours mirror the --placeholder / --text-muted
// tokens and the --toy-* candy colours; an <img> can't read CSS variables,
// but it does follow the page's color-scheme through prefers-color-scheme.
export function placeholderImage(label = '') {
  const text = label.replace(/[<>&"]/g, '');
  const style = '<style>rect{fill:#f3eadd}.t{fill:#5f586b}.id{fill:#c2500a}.a{fill:#ffc43d}.b{fill:#9b7bff}.c{fill:#ff7eb9}@media (prefers-color-scheme:dark){rect{fill:#221c3e}.t{fill:#c2b8d6}.id{fill:#ffa15c}}</style>';
  const y = text ? 0 : 17;
  const dots = `<g transform="translate(0 ${y})"><circle class="a" cx="374" cy="164" r="9"/><ellipse class="b" cx="402" cy="150" rx="7" ry="3.5"/><circle class="c" cx="426" cy="170" r="6"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">${style}<rect width="800" height="450"/>${dots}<text class="t" x="400" y="${text ? 222 : 239}" font-family="sans-serif" font-size="26" text-anchor="middle">Media coming soon</text>${text ? `<text class="id" x="400" y="262" font-family="monospace" font-size="18" text-anchor="middle">${text}</text>` : ''}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
