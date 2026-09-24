import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Gallery', group: 'Media', description: 'Several images as a `grid`, `masonry` (natural heights) or `slider`. Items are public IDs, or objects with alt/caption.' };

const item = z.union([
  z.string(),
  z.object({ publicId: z.string(), alt: L.optional(), caption: L.optional() }).strict()
]);

export const schema = z.object({
  type: z.literal('gallery'),
  title: L.optional(),
  layout: z.enum(['grid', 'masonry', 'slider']).default('grid'),
  columns: z.coerce.number().int().min(1).max(4).default(3),
  aspect: z.string().optional(),
  gap: z.enum(['none', 's', 'm']).default('s'),
  lightbox: z.boolean().default(true),
  items: z.array(item).min(1, 'add at least one image to items')
}).strict();

export const example = {
  type: 'gallery',
  layout: 'grid',
  columns: 3,
  items: [
    'portfolio/games/example/shot-01',
    { publicId: 'portfolio/games/example/shot-02', caption: { en: 'Night lighting', ar: 'إضاءة ليلية' } },
    'portfolio/games/example/shot-03'
  ]
};
