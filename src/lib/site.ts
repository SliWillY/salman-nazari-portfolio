export type { Lang } from './i18n';
import type { Lang } from './i18n';

// Each world has its own candy colour (global.css, .hue-*): UX grape, Games mint, 3D sky; the site is sun and tangerine.
// Category pages and their projects take it from the category; home cards from their icon.
export type Hue = 'ux' | 'games' | '3d';
// Worlds that hold projects: each is a folder in src/content/projects/ and a page in src/content/pages/.
export const categories = ['3d-renders', 'games-dev', 'ux-and-gamification'] as const;
export const categoryHue: Record<string, Hue> = { 'ux-and-gamification': 'ux', 'games-dev': 'games', '3d-renders': '3d' };
export const iconHue: Record<'ux' | 'game' | 'render', Hue> = { ux: 'ux', game: 'games', render: '3d' };

// Worlds in the same order as on the home page.
export const nav = [
  { slug: 'about-me', en: 'About', ar: 'نبذة' },
  { slug: 'ux-and-gamification', en: 'UX & Gamification', ar: 'تجربة المستخدم والتلعيب' },
  { slug: 'games-dev', en: 'Games Dev', ar: 'تطوير الألعاب' },
  { slug: '3d-renders', en: '3D Renders', ar: 'تصاميم ثلاثية الأبعاد' },
  { slug: 'certificates', en: 'Certificates', ar: 'الشهادات' }
];

// A page's number, shown as a superscript (About⁰⁰, UX & Gamification⁰¹…): About is 00 in the site's own orange,
// the worlds count on from it in menu order.
const worlds = nav.filter((item) => item.slug in categoryHue).map((item) => item.slug);
export const worldNumber = (slug: string) => { const i = worlds.indexOf(slug); return i < 0 ? '' : String(i + 1).padStart(2, '0'); };
export const pageNumber = (slug: string) => (slug === 'about-me' ? '00' : worldNumber(slug));

export const labels = {
  en: { menu: 'Menu', close: 'Close menu', home: 'Home', explore: 'Explore', contact: 'Contact', language: 'Language', back: 'Back to home', skip: 'Skip to content', nav: 'Main', homeLink: 'Salman Nazari — home' },
  ar: { menu: 'القائمة', close: 'إغلاق القائمة', home: 'الرئيسية', explore: 'استكشف', contact: 'تواصل', language: 'اللغة', back: 'العودة للرئيسية', skip: 'انتقل إلى المحتوى', nav: 'التنقل الرئيسي', homeLink: 'سلمان نظري — الصفحة الرئيسية' }
} as const;

// Theme toggle wording. The button's label reads e.g. "Theme: Dark. Switch to System."
export const themeLabels = {
  en: { name: 'Theme', template: 'Theme: {current}. Switch to {next}.', light: 'Light', dark: 'Dark', system: 'System' },
  ar: { name: 'المظهر', template: 'المظهر: {current}. التبديل إلى {next}.', light: 'فاتح', dark: 'داكن', system: 'تلقائي (حسب النظام)' }
} as const;

// Browser UI colour per theme (<meta name="theme-color">); keep equal to --paper / --dusk in global.css.
export const themeColor = { light: '#fffaf3', dark: '#17142b' } as const;

// Link previews (Open Graph, src/components/SocialMeta.astro). The cards in public/og/ are made by `pnpm og` from
// scripts/og/card.html; keep the alt text in step with the card's words.
export const siteName = { en: 'Salman Nazari', ar: 'سلمان نظري' } as const;
export const ogImage = {
  width: 1200, height: 630,
  en: { file: 'og/en.jpg', alt: 'Salman Nazari, designer of UX, games & 3D worlds, among colourful candy shapes and paper confetti' },
  ar: { file: 'og/ar.jpg', alt: 'سلمان نظري، مصمم تجارب وألعاب وعوالم ثلاثية الأبعاد، بين أشكال ملونة وقصاصات ورق' }
} as const;

export const path = (value: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;

// Link targets in content: full URLs pass through; "games-dev" or "games-dev/my-game" become /<lang>/games-dev/…/
export function href(value: string, lang: Lang) {
  if (/^([a-z]+:|#)/i.test(value)) return value;
  if (value.startsWith('/')) return path(value);
  const clean = value.replace(/^\/+|\/+$/g, '');
  return path(clean === '' || clean === 'home' ? `/${lang}/` : `/${lang}/${clean}/`);
}
