import { z } from 'astro/zod';
import { projectCategoryNames } from '../blocks/projects/schema';
import { L } from './i18n';

// Shapes of the YAML files. Blocks are checked loosely here and strictly
// after prefabs are expanded (see src/lib/prefabs.ts).

export { categories } from './site';

export const prefabInstance = z.object({
  prefab: z.string(),
  props: z.record(z.any()).default({}),
  overrides: z.record(z.any()).default({})
}).strict();

export const block = z.object({ type: z.string() }).passthrough();
export const blockEntry = z.union([prefabInstance, block]);

export const section = z.object({
  theme: z.enum(['paper', 'light', 'dark', 'accent']).default('paper'),
  width: z.enum(['narrow', 'contained', 'wide', 'full']).default('contained'),
  spacing: z.enum(['none', 's', 'm', 'l']).default('m'),
  align: z.enum(['start', 'center']).default('start'),
  background: z.object({ image: z.string(), overlay: z.number().min(0).max(1).default(0.5) }).optional(),
  id: z.string().optional(),
  blocks: z.array(blockEntry).default([])
}).strict();

export const sectionEntry = z.union([prefabInstance, section]);

const pageFields = {
  title: L,
  description: L,
  eyebrow: L.optional(),
  header: z.enum(['auto', 'none']).default('auto'),
  sections: z.array(sectionEntry).default([]),
  blocks: z.array(blockEntry).optional()
};

export const page = z.object({ ...pageFields }).strict();

export const project = z.object({
  ...pageFields,
  description: L.optional(),
  summary: L,
  cover: z.string().optional(),
  tags: z.array(L).default([]),
  role: L.optional(),
  tools: z.array(L).default([]),
  // Heading the card is grouped under on the category page: one of the names in
  // src/blocks/projects/schema.ts (projectCategories).
  projectCategory: z.enum(projectCategoryNames),
  // Position inside its project category (lower first).
  order: z.number().default(0),
  draft: z.boolean().default(false)
}).strict();

export const prefab = z.object({
  name: z.string(),
  description: z.string().optional(),
  extends: z.string().optional(),
  props: z.record(z.any()).default({}),
  // Sample props used to preview the prefab in the /dev/blocks/ catalog.
  example: z.record(z.any()).optional(),
  // Template values like "{{theme}}" are only checked after expansion.
  section: z.record(z.any()).optional(),
  blocks: z.array(z.record(z.any())).optional()
}).strict();

export type SectionData = z.infer<typeof section>;
