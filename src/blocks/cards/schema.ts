import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Cards', group: 'Site', description: 'Link cards with an optional image or animated icon (render | game | ux). `href` can be a site page (`games-dev`) or a full URL. `layout: space` is the home scene: the cards scattered down a sun-gradient stage of floating 3D toys; hovering one brings its toys onto the stage to act out its story (keep the hero in the same section so the toys fill it too).' };

export const schema = z.object({
  type: z.literal('cards'),
  layout: z.enum(['grid', 'space']).default('grid'),
  columns: z.coerce.number().int().min(1).max(4).default(3),
  items: z.array(z.object({
    title: L,
    text: L.optional(),
    href: z.string(),
    image: z.string().optional(),
    icon: z.enum(['render', 'game', 'ux']).optional(),
    cta: L.optional()
  }).strict()).min(1)
}).strict();

export const example = {
  type: 'cards',
  columns: 2,
  items: [
    { title: { en: '3D Renders', ar: 'تصاميم ثلاثية الأبعاد' }, text: { en: 'Light, composition, detail.', ar: 'الضوء والتكوين والتفاصيل.' }, href: '3d-renders', icon: 'render' },
    { title: { en: 'Games Dev', ar: 'تطوير الألعاب' }, text: { en: 'Art, levels and systems.', ar: 'الفن والمراحل والأنظمة.' }, href: 'games-dev', icon: 'game' }
  ]
};
