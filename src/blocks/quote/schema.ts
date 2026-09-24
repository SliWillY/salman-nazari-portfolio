import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Quote', group: 'Text', description: 'A large pull quote or testimonial with an optional source.' };

export const schema = z.object({
  type: z.literal('quote'),
  text: L,
  cite: L.optional()
}).strict();

export const example = {
  type: 'quote',
  text: { en: 'Design is how it works, not just how it looks.', ar: 'التصميم هو كيف يعمل الشيء، لا كيف يبدو فقط.' },
  cite: 'Steve Jobs'
};
