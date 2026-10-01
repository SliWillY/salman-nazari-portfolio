import type { Lang } from '../lib/i18n';

// What every block receives besides its own fields.
export interface BlockContext {
  lang: Lang;
  route: string;
  title?: unknown;
  description?: unknown;
  eyebrow?: unknown;
  eyebrowHref?: string;
  category?: string;
  project?: { tags?: unknown[]; role?: unknown; tools?: unknown[] };
  catalog?: boolean;
}
