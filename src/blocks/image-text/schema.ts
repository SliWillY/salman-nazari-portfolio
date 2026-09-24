import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Image + Text', group: 'Layout', description: 'An image beside a heading, Markdown text and an optional button. `side: end` puts the image on the other side.' };

export const schema = z.object({
  type: z.literal('image-text'),
  image: z.string().default(''),
  alt: L.optional(),
  heading: L.optional(),
  text: L,
  side: z.enum(['start', 'end']).default('start'),
  aspect: z.string().default('4 / 3'),
  button: z.object({ label: L, href: z.string() }).strict().optional()
}).strict();

export const example = {
  type: 'image-text',
  image: 'portfolio/ux/example/journey-map',
  heading: { en: 'Research', ar: 'البحث' },
  text: { en: 'Interviews with 12 players shaped the reward loop.', ar: 'شكّلت مقابلات مع ١٢ لاعباً حلقة المكافآت.' },
  side: 'start'
};
