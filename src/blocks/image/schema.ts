import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Image', group: 'Media', description: 'One Cloudinary image. Omit `aspect` to keep its natural shape; `lightbox` opens it full screen on click.' };

export const schema = z.object({
  type: z.literal('image'),
  publicId: z.string().default(''),
  alt: L.optional(),
  caption: L.optional(),
  aspect: z.string().optional(),
  fit: z.enum(['cover', 'contain']).default('cover'),
  size: z.enum(['s', 'm', 'l', 'full']).default('full'),
  href: z.string().optional(),
  lightbox: z.boolean().default(false)
}).strict();

export const example = {
  type: 'image',
  publicId: 'portfolio/3d/example/render-01',
  alt: { en: 'Sci-fi corridor render', ar: 'لقطة لممر خيال علمي' },
  caption: { en: 'Rendered in Blender Cycles', ar: 'مُخرجة في Blender Cycles' },
  aspect: '16 / 9'
};
