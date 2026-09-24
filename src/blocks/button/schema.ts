import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Button', group: 'Text', description: 'A call-to-action link. `href` can be a full URL, `mailto:`, or a site page like `games-dev`.' };

export const schema = z.object({
  type: z.literal('button'),
  label: L,
  href: z.string(),
  style: z.enum(['primary', 'outline']).default('primary'),
  align: z.enum(['start', 'center']).optional()
}).strict();

export const example = {
  type: 'button',
  label: { en: 'Play on itch.io', ar: 'العب على itch.io' },
  href: 'https://itch.io'
};
