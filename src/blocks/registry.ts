import { blockSchemas, type BlockDefinition } from './schemas';

// Pairs each block's schema with the .astro component in the same folder.
// Adding a block = adding a folder with schema.ts + one .astro file. Nothing to edit here.
const components = import.meta.glob('./*/*.astro', { eager: true, import: 'default' });

export const registry: Record<string, BlockDefinition & { component: any }> = Object.fromEntries(
  Object.entries(blockSchemas).map(([type, definition]) => {
    const component = Object.entries(components).find(([path]) => path.startsWith(`./${type}/`))?.[1];
    if (!component) throw new Error(`Block "${type}" has a schema.ts but no .astro component in src/blocks/${type}/`);
    return [type, { ...definition, component }];
  })
);
