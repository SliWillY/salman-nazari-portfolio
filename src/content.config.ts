import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { page, prefab, project } from './lib/content-schemas';

const pages = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/pages' }),
  schema: page
});

// File path = <category>/<route>.yaml
const projects = defineCollection({
  loader: glob({ pattern: '*/*.yaml', base: './src/content/projects' }),
  schema: project
});

const prefabs = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/prefabs' }),
  schema: prefab
});

export const collections = { pages, projects, prefabs };
