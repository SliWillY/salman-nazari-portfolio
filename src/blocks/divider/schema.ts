import { z } from 'astro/zod';

export const meta = { label: 'Divider', group: 'Layout', description: 'A horizontal line: full width, a short accent mark, or an `ornament` (fading lines around a small accent diamond) with generous space, to open a new group of content.' };

export const schema = z.object({
  type: z.literal('divider'),
  style: z.enum(['line', 'short', 'ornament']).default('line')
}).strict();

export const example = { type: 'divider', style: 'short' };
