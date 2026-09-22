const cloud = 'vwkbtzdh';

export function cloudinaryUrl(publicId: string, width = 1600, quality = 'auto') {
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_${quality},c_limit,w_${width}/${publicId}`;
}

export function cloudinarySrcSet(publicId: string) {
  return [480, 768, 1024, 1440, 1920].map((width) => `${cloudinaryUrl(publicId, width)} ${width}w`).join(', ');
}
