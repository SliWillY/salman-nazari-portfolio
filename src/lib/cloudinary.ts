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
export function placeholderImage(label = '') {
  const text = label.replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="#dedbd2"/><text x="400" y="${text ? 215 : 232}" font-family="sans-serif" font-size="26" fill="#686862" text-anchor="middle">Media coming soon</text>${text ? `<text x="400" y="255" font-family="monospace" font-size="18" fill="#c95738" text-anchor="middle">${text}</text>` : ''}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
