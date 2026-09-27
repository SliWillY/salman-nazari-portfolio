import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'PDF', group: 'Media', description: 'A PDF from Cloudinary (`publicId`) or any `url`. Shows a card with a page-1 thumbnail, the full PDF viewer with `embed: true`, or clean page images (click for full screen) with `pages: N` (Cloudinary only) — stacked, or one at a time with arrows via `layout: slider`.' };

export const schema = z.object({
  type: z.literal('pdf'),
  publicId: z.string().optional(),
  url: z.string().url().optional(),
  title: L,
  eyebrow: L.optional(),
  text: L.optional(),
  tags: z.array(L).optional(),
  embed: z.boolean().default(false),
  pages: z.number().int().min(1).optional(),
  layout: z.enum(['stack', 'slider']).default('stack'),
  size: z.enum(['s', 'm', 'l', 'full']).default('l'),
  caption: L.optional()
}).strict()
  .refine((b) => b.publicId || b.url, 'set either publicId or url')
  .refine((b) => !b.pages || b.publicId, '`pages` needs a Cloudinary publicId');

export const example = {
  type: 'pdf',
  publicId: 'portfolio/games/example/gdd',
  title: { en: 'Game Design Document', ar: 'وثيقة تصميم اللعبة' },
  text: { en: 'Core loop, mechanics and progression.', ar: 'الحلقة الأساسية والآليات والتقدم.' }
};
