export type { Lang } from './i18n';
import type { Lang } from './i18n';

export const nav = [
  { slug: 'about-me', en: 'About', ar: 'نبذة' },
  { slug: '3d-renders', en: '3D Renders', ar: 'تصاميم ثلاثية الأبعاد' },
  { slug: 'games-dev', en: 'Games Dev', ar: 'تطوير الألعاب' },
  { slug: 'ux-and-gamification', en: 'UX & Gamification', ar: 'تجربة المستخدم والتلعيب' },
  { slug: 'animations', en: 'Animations', ar: 'الرسوم المتحركة' },
  { slug: 'certificates', en: 'Certificates', ar: 'الشهادات' }
];

export const labels = {
  en: { menu: 'Menu', home: 'Home', explore: 'Explore', contact: 'Contact', language: 'العربية', back: 'Back to home' },
  ar: { menu: 'القائمة', home: 'الرئيسية', explore: 'استكشف', contact: 'تواصل', language: 'English', back: 'العودة للرئيسية' }
} as const;

export const path = (value: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;

// Link targets in content: full URLs pass through; "games-dev" or "games-dev/my-game" become /<lang>/games-dev/…/
export function href(value: string, lang: Lang) {
  if (/^([a-z]+:|#)/i.test(value)) return value;
  if (value.startsWith('/')) return path(value);
  const clean = value.replace(/^\/+|\/+$/g, '');
  return path(clean === '' || clean === 'home' ? `/${lang}/` : `/${lang}/${clean}/`);
}
