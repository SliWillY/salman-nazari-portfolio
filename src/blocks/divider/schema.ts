import { z } from 'astro/zod';

export const meta = { label: 'Divider', group: 'Layout', description: 'A horizontal line: full width, a short accent mark, a short thin line (`short-line`), or an `ornament` (fading lines around the page’s world shape: star, triangle, d-pad or tile) with generous space, to open a new group of content. `above` / `below` (none, s, m, l, xl) set the space before and after it; when either is set it replaces the default spacing.' };

export const schema = z.object({
  type: z.literal('divider'),
  style: z.enum(['line', 'short', 'short-line', 'ornament']).default('line'),
  above: z.enum(['none', 's', 'm', 'l', 'xl']).optional(),
  below: z.enum(['none', 's', 'm', 'l', 'xl']).optional()
}).strict();

export const example = { type: 'divider', style: 'short', above: 'l', below: 'm' };
