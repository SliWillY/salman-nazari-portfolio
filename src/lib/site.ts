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
  en: { menu: 'Menu', close: 'Close menu', home: 'Home', explore: 'Explore', contact: 'Contact', language: 'Language', back: 'Back to home', skip: 'Skip to content', nav: 'Main', tagline: 'Game, 3D & UX Designer' },
  ar: { menu: 'القائمة', close: 'إغلاق القائمة', home: 'الرئيسية', explore: 'استكشف', contact: 'تواصل', language: 'اللغة', back: 'العودة للرئيسية', skip: 'انتقل إلى المحتوى', nav: 'التنقل الرئيسي', tagline: 'مصمم ألعاب وثلاثي الأبعاد وتجربة مستخدم' }
} as const;

// Theme toggle wording. The button's label reads e.g. "Theme: Dark. Switch to System."
export const themeLabels = {
  en: { name: 'Theme', template: 'Theme: {current}. Switch to {next}.', light: 'Light', dark: 'Dark', system: 'System' },
  ar: { name: 'المظهر', template: 'المظهر: {current}. التبديل إلى {next}.', light: 'فاتح', dark: 'داكن', system: 'تلقائي (حسب النظام)' }
} as const;

// Browser UI colour per theme (<meta name="theme-color">); keep equal to --bg in global.css.
export const themeColor = { light: '#f4f2ed', dark: '#1a1917' } as const;

export const path = (value: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;

// Link targets in content: full URLs pass through; "games-dev" or "games-dev/my-game" become /<lang>/games-dev/…/
export function href(value: string, lang: Lang) {
  if (/^([a-z]+:|#)/i.test(value)) return value;
  if (value.startsWith('/')) return path(value);
  const clean = value.replace(/^\/+|\/+$/g, '');
  return path(clean === '' || clean === 'home' ? `/${lang}/` : `/${lang}/${clean}/`);
}
