const cloud = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'vwkbtzdh';

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
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_${quality},c_limit,w_${width}/${id}`;
}

export function cloudinarySrcSet(publicId: string) {
  const id = normalizePublicId(publicId);
  return [480, 768, 1024, 1440, 1920].map((width) => `${cloudinaryUrl(id, width)} ${width}w`).join(', ');
}
