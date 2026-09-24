import { z } from 'astro/zod';

export const meta = { label: 'Divider', group: 'Layout', description: 'A horizontal line: full width or a short accent mark.' };

export const schema = z.object({
  type: z.literal('divider'),
  style: z.enum(['line', 'short']).default('line')
}).strict();

export const example = { type: 'divider', style: 'short' };
