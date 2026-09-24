import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Heading', group: 'Text', description: 'A title with optional small eyebrow text above it.' };

export const schema = z.object({
  type: z.literal('heading'),
  text: L,
  eyebrow: L.optional(),
  level: z.coerce.number().int().min(1).max(3).default(2),
  size: z.enum(['s', 'm', 'l', 'xl']).optional(),
  align: z.enum(['start', 'center']).optional()
}).strict();

export const example = {
  type: 'heading',
  eyebrow: { en: 'Game art', ar: 'فن الألعاب' },
  text: { en: 'Pixel Art', ar: 'فن البكسل' }
};
