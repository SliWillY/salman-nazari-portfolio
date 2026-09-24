import type { ZodTypeAny } from 'astro/zod';
import { page, prefab, project, section } from '../lib/content-schemas';
import { L } from '../lib/i18n';
import { blockSchemas, blockTypes } from './schemas';

// Builds JSON Schemas for the YAML content files so VS Code (Red Hat YAML extension)
// can autocomplete block types, fields and prefab names. Written to .vscode/schemas/
// by src/integrations/content-schema.ts whenever `pnpm dev` runs.

type Json = Record<string, any>;

function convert(schema: ZodTypeAny, key?: string): Json {
  const def = (schema as any)._def;
  switch (def.typeName) {
    case 'ZodObject': {
      const shape = def.shape();
      const properties: Json = {};
      const required: string[] = [];
      for (const [name, value] of Object.entries<ZodTypeAny>(shape)) {
        properties[name] = convert(value, name);
        if (!value.isOptional()) required.push(name);
      }
      return { type: 'object', properties, ...(required.length && { required }), additionalProperties: def.unknownKeys !== 'strict' };
    }
    case 'ZodArray':
      if (key === 'blocks') return { type: 'array', items: { $ref: '#/definitions/blockEntry' } };
      if (key === 'sections') return { type: 'array', items: { $ref: '#/definitions/sectionEntry' } };
      return { type: 'array', items: convert(def.type) };
    case 'ZodString': return { type: 'string' };
    case 'ZodNumber': return { type: 'number' };
    case 'ZodBoolean': return { type: 'boolean' };
    case 'ZodEnum': return { enum: def.values };
    case 'ZodLiteral': return { const: def.value };
    case 'ZodUnion': return { anyOf: def.options.map((option: ZodTypeAny) => convert(option, key)) };
    case 'ZodOptional':
    case 'ZodNullable': return convert(def.innerType, key);
    case 'ZodDefault': return { ...convert(def.innerType, key), default: def.defaultValue() };
    case 'ZodEffects': return convert(def.schema, key);
    case 'ZodRecord': return { type: 'object', additionalProperties: convert(def.valueType) };
    default: return {};
  }
}

export function buildSchemas(prefabNames: string[]) {
  const definitions = {
    localized: convert(L),
    prefabInstance: {
      type: 'object',
      title: 'Prefab instance',
      required: ['prefab'],
      properties: {
        prefab: { enum: prefabNames, description: 'A prefab from src/content/prefabs/' },
        props: { type: 'object', description: 'Values for the prefab’s exposed props' },
        overrides: { type: 'object', description: 'Unity-style overrides, e.g. "blocks.1.layout": slider' }
      },
      additionalProperties: false
    },
    block: {
      anyOf: blockTypes.map((type) => ({
        ...convert(blockSchemas[type].schema),
        title: blockSchemas[type].meta.label,
        description: blockSchemas[type].meta.description
      }))
    },
    blockEntry: { anyOf: [{ $ref: '#/definitions/prefabInstance' }, { $ref: '#/definitions/block' }] },
    section: { ...convert(section), title: 'Section' },
    sectionEntry: { anyOf: [{ $ref: '#/definitions/prefabInstance' }, { $ref: '#/definitions/section' }] }
  };
  const file = (root: ZodTypeAny) => ({ $schema: 'http://json-schema.org/draft-07/schema#', ...convert(root), definitions });
  return {
    'page.schema.json': file(page),
    'project.schema.json': file(project),
    'prefab.schema.json': file(prefab)
  };
}
