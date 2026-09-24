import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Cards', group: 'Site', description: 'Link cards with optional image, e.g. the home page sections. `href` can be a site page (`games-dev`) or a full URL.' };

export const schema = z.object({
  type: z.literal('cards'),
  columns: z.coerce.number().int().min(1).max(4).default(3),
  items: z.array(z.object({
    title: L,
    text: L.optional(),
    href: z.string(),
    image: z.string().optional(),
    cta: L.optional()
  }).strict()).min(1)
}).strict();

export const example = {
  type: 'cards',
  columns: 2,
  items: [
    { title: { en: '3D Renders', ar: 'تصاميم ثلاثية الأبعاد' }, text: { en: 'Light, composition, detail.', ar: 'الضوء والتكوين والتفاصيل.' }, href: '3d-renders' },
    { title: { en: 'Games Dev', ar: 'تطوير الألعاب' }, text: { en: 'Art, levels and systems.', ar: 'الفن والمراحل والأنظمة.' }, href: 'games-dev' }
  ]
};
