import { z } from 'astro/zod';

export type Lang = 'en' | 'ar';
export const langs: Lang[] = ['en', 'ar'];

// Localized text: a plain string (same in both languages) or { en, ar }.
export const L = z.union([z.string(), z.object({ en: z.string(), ar: z.string().optional() }).strict()]);
export type Localized = z.infer<typeof L>;

const warned = new Set<string>();

export function t(value: unknown, lang: Lang): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && 'en' in value) {
    const text = value as { en: string; ar?: string };
    if (lang === 'ar' && !text.ar && import.meta.env.DEV && !warned.has(text.en)) {
      warned.add(text.en);
      console.warn(`[i18n] missing Arabic text for "${text.en.slice(0, 60)}"`);
    }
    return (lang === 'ar' ? text.ar : undefined) ?? text.en;
  }
  return '';
}
