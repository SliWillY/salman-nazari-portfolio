import { z } from 'astro/zod';
import { categories } from '../../lib/content-schemas';

export const meta = { label: 'Projects', group: 'Site', description: 'Automatic grid of project cards from src/content/projects/<category>/. Defaults to the current page’s category.' };

export const schema = z.object({
  type: z.literal('projects'),
  category: z.enum(categories).optional(),
  columns: z.coerce.number().int().min(1).max(3).default(2),
  limit: z.coerce.number().int().positive().optional()
}).strict();

export const example = { type: 'projects', category: '3d-renders', columns: 2 };
