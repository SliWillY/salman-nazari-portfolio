import { z } from 'astro/zod';

export const meta = { label: 'Spacer', group: 'Layout', description: 'Empty vertical space between blocks.' };

export const schema = z.object({
  type: z.literal('spacer'),
  size: z.enum(['s', 'm', 'l', 'xl']).default('m')
}).strict();

export const example = { type: 'spacer', size: 'l' };
