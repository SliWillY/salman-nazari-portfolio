import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from './content-schemas';

export type Project = CollectionEntry<'projects'> & { category: string; route: string };

// Project files live at src/content/projects/<category>/<route>.yaml.
// Drafts are visible in `pnpm dev` but left out of the production build.
export async function getProjects(filter: { category?: string } = {}): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  const projects = entries.map((entry) => {
    const [category, route] = entry.id.split('/');
    if (!(categories as readonly string[]).includes(category)) {
      throw new Error(`src/content/projects/${entry.id}.yaml: folder "${category}" is not a category (${categories.join(', ')})`);
    }
    return Object.assign(entry, { category, route });
  });
  return projects
    .filter((p) => !filter.category || p.category === filter.category)
    .sort((a, b) => a.data.order - b.data.order || String(b.data.year ?? '').localeCompare(String(a.data.year ?? '')));
}

// Card image: explicit cover, else the first image found in the project's blocks.
export function coverOf(project: Project): string {
  if (project.data.cover) return project.data.cover;
  const found = JSON.stringify([project.data.blocks ?? [], project.data.sections]).match(/"(?:publicId|image|cover)":"([^"{]+)"|"(?:items|images)":\["([^"{]+)"/);
  return found?.[1] ?? found?.[2] ?? '';
}
