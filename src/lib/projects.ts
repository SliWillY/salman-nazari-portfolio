import { getCollection, type CollectionEntry } from 'astro:content';
import { projectCategories } from '../blocks/projects/schema';
import { categories } from './content-schemas';
import type { Localized } from './i18n';

export type Project = CollectionEntry<'projects'> & { category: string; route: string };
export interface ProjectGroup { name: string; title: Localized; projects: Project[] }

// Project files live at src/content/projects/<category>/<route>.yaml.
// Drafts are visible in `pnpm dev` but left out of the production build.
async function loadProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries
    .map((entry) => {
      const [category, route] = entry.id.split('/');
      if (!(categories as readonly string[]).includes(category)) {
        throw new Error(`src/content/projects/${entry.id}.yaml: folder "${category}" is not a category (${categories.join(', ')})`);
      }
      return Object.assign(entry, { category, route });
    })
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

// A category's projects, one group per project category in the order of the
// projectCategories list (src/blocks/projects/schema.ts); empty groups are left out.
// Inside a group, projects follow their `order`.
export async function getProjectGroups(category: string): Promise<ProjectGroup[]> {
  const projects = (await loadProjects()).filter((p) => p.category === category);
  return projectCategories
    .map((pc) => ({ name: pc.en, title: pc, projects: projects.filter((p) => p.data.projectCategory === pc.en) }))
    .filter((group) => group.projects.length > 0);
}

// Projects in display order: category by category, then group by group, then `order`.
export async function getProjects(filter: { category?: string } = {}): Promise<Project[]> {
  const wanted = filter.category ? [filter.category] : [...categories];
  const lists = await Promise.all(wanted.map(async (category) => (await getProjectGroups(category)).flatMap((g) => g.projects)));
  return lists.flat();
}

// Card image: explicit cover, else the first image found in the project's blocks.
export function coverOf(project: Project): string {
  if (project.data.cover) return project.data.cover;
  const found = JSON.stringify([project.data.blocks ?? [], project.data.sections]).match(/"(?:publicId|image|cover)":"([^"{]+)"|"(?:items|images)":\["([^"{]+)"/);
  return found?.[1] ?? found?.[2] ?? '';
}
