import type { ZodTypeAny } from 'astro/zod';

// Every folder in src/blocks/ with a schema.ts is a block type named after the folder.
export interface BlockDefinition {
  schema: ZodTypeAny;
  example: Record<string, unknown>;
  meta: { label: string; group: string; description: string };
}

const modules = import.meta.glob<BlockDefinition>('./*/schema.ts', { eager: true });

export const blockSchemas: Record<string, BlockDefinition> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/')[1], mod])
);

export const blockTypes = Object.keys(blockSchemas).sort();
