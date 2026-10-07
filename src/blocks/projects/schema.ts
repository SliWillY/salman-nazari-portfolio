import { z } from 'astro/zod';
import { categories } from '../../lib/site';

// Project categories: the headings that project cards are grouped under on a category page.
// Headings appear in THIS order (only the ones that have projects); move a line to move its heading.
// A project joins one with `projectCategory: <en name>`; inside it, projects follow their `order`.
export const projectCategories = [
  { en: 'Environment/Lighting Design', ar: 'تصميم البيئة/الإضاءة' },
  { en: 'Game Development', ar: 'تطوير الألعاب' },
  { en: 'Game Art', ar: 'فن الألعاب' },
  { en: 'Projects', ar: 'المشاريع' }
] as const;

export type ProjectCategory = (typeof projectCategories)[number]['en'];
export const projectCategoryNames = projectCategories.map((c) => c.en) as [ProjectCategory, ...ProjectCategory[]];

export const meta = { label: 'Projects', group: 'Site', description: 'Automatic grid of project cards from src/content/projects/<category>/, grouped under the project categories listed in src/blocks/projects/schema.ts. Defaults to the current page’s category.' };

export const schema = z.object({
  type: z.literal('projects'),
  category: z.enum(categories).optional(),
  columns: z.coerce.number().int().min(1).max(3).default(2),
  limit: z.coerce.number().int().positive().optional(),
  // Show a heading above each project category's cards.
  headings: z.boolean().default(true)
}).strict();

export const example = { type: 'projects', category: '3d-renders', columns: 2 };
