import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Hero', group: 'Site', description: 'Big page title. Empty fields fall back to the page/project title, description and eyebrow. `size: home` is the full-screen home intro.' };

export const schema = z.object({
  type: z.literal('hero'),
  eyebrow: L.optional(),
  title: L.optional(),
  intro: L.optional(),
  size: z.enum(['page', 'home']).default('page')
}).strict();

export const example = {
  type: 'hero',
  eyebrow: { en: 'Selected work', ar: 'أعمال مختارة' },
  title: { en: 'Games Dev', ar: 'تطوير الألعاب' },
  intro: { en: 'Game art, level design and systems.', ar: 'فن الألعاب وتصميم المراحل والأنظمة.' }
};
