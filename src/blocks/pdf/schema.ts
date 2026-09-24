import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'PDF', group: 'Media', description: 'A PDF from Cloudinary (`publicId`) or any `url`. Shows a card with a page-1 thumbnail, or the full PDF with `embed: true`.' };

export const schema = z.object({
  type: z.literal('pdf'),
  publicId: z.string().optional(),
  url: z.string().url().optional(),
  title: L,
  text: L.optional(),
  embed: z.boolean().default(false),
  caption: L.optional()
}).strict().refine((b) => b.publicId || b.url, 'set either publicId or url');

export const example = {
  type: 'pdf',
  publicId: 'portfolio/games/example/gdd',
  title: { en: 'Game Design Document', ar: 'وثيقة تصميم اللعبة' },
  text: { en: 'Core loop, mechanics and progression.', ar: 'الحلقة الأساسية والآليات والتقدم.' }
};
