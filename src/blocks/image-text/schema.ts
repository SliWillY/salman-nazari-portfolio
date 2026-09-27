import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Image + Text', group: 'Layout', description: 'An image beside a heading, Markdown text and an optional button. `side: end` puts the image on the other side. Optional: `eyebrow` above the heading, `details` rows (a label with text or chips) for things like hypothesis / role, and `frame: browser` to present a screenshot as a product, and `gallery` (extra screens) to turn it into a hover-to-reveal screen stack.' };

export const schema = z.object({
  type: z.literal('image-text'),
  image: z.string().default(''),
  alt: L.optional(),
  eyebrow: L.optional(),
  heading: L.optional(),
  level: z.union([z.literal(2), z.literal(3)]).default(3),
  text: L,
  details: z.array(z.object({ label: L, text: L.optional(), tags: z.array(L).optional() }).strict()).optional(),
  side: z.enum(['start', 'end']).default('start'),
  aspect: z.string().default('4 / 3'),
  frame: z.enum(['none', 'browser']).default('none'),
  // Optional extra screens: with 2+ screens (counting `image`) the image becomes an interactive screen stack.
  // `image` stays the resting/front screen; list it here too to give it a caption. Entries with an empty image are skipped.
  gallery: z.array(z.object({ image: z.string(), alt: L.optional(), caption: L.optional() }).strict()).optional(),
  button: z.object({ label: L, href: z.string(), style: z.enum(['primary', 'outline']).default('outline') }).strict().optional()
}).strict();

export const example = {
  type: 'image-text',
  image: 'portfolio/ux/example/journey-map',
  heading: { en: 'Research', ar: 'البحث' },
  text: { en: 'Interviews with 12 players shaped the reward loop.', ar: 'شكّلت مقابلات مع ١٢ لاعباً حلقة المكافآت.' },
  side: 'start'
};
