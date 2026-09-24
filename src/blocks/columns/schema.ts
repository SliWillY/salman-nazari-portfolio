import { z } from 'astro/zod';

export const meta = { label: 'Columns', group: 'Layout', description: 'Side-by-side columns, each with its own blocks (any block, even prefabs). `widths` like "2fr 1fr" sets proportions. Stacks on phones.' };

export const schema = z.object({
  type: z.literal('columns'),
  widths: z.string().optional(),
  gap: z.enum(['s', 'm', 'l']).default('m'),
  valign: z.enum(['start', 'center', 'end']).default('start'),
  columns: z.array(z.object({ blocks: z.array(z.any()).default([]) }).strict()).min(1).max(4)
}).strict();

export const example = {
  type: 'columns',
  widths: '1fr 1fr',
  columns: [
    { blocks: [{ type: 'heading', level: 3, text: { en: 'The brief', ar: 'الفكرة' } }, { type: 'text', text: { en: 'A short puzzle game about light.', ar: 'لعبة ألغاز قصيرة عن الضوء.' } }] },
    { blocks: [{ type: 'image', publicId: 'portfolio/games/example/concept', aspect: '4 / 3' }] }
  ]
};
