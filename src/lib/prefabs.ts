import { getCollection } from 'astro:content';
import { blockSchemas, blockTypes } from '../blocks/schemas';
import { section as sectionSchema, type SectionData } from './content-schemas';

// Turns the YAML `sections:` / `blocks:` of a page into validated sections:
// 1. prefab instances are expanded (props → {{placeholders}}, then overrides),
// 2. every block is checked against its schema in src/blocks/<type>/schema.ts.
// In dev a broken block renders as a red error box; the production build fails instead.

type Obj = Record<string, any>;
export type ResolvedBlock = { type: string } & Obj;
export type ResolvedSection = Omit<SectionData, 'blocks'> & { blocks: ResolvedBlock[] };
type Prefab = { name: string; description?: string; extends?: string; props: Obj; example?: Obj; section?: Obj; blocks?: Obj[] };

const MAX_DEPTH = 5;

class ContentError extends Error {}

const isObj = (v: unknown): v is Obj => v !== null && typeof v === 'object' && !Array.isArray(v);
const isInstance = (v: unknown): v is { prefab: string; props?: Obj; overrides?: Obj } => isObj(v) && typeof v.prefab === 'string';
const isLocalized = (v: unknown): v is { en: string; ar?: string } => isObj(v) && typeof v.en === 'string';
const clone = <T>(v: T): T => structuredClone(v);

function fail(where: string, message: string): never {
  throw new ContentError(`${where}\n  → ${message}`);
}

function errorBlock(error: unknown): ResolvedBlock {
  if (!import.meta.env.DEV || !(error instanceof ContentError)) throw error;
  console.error(`[content] ${error.message}`);
  return { type: '__error', message: error.message };
}

// ---------- prefab loading ----------

async function loadPrefabs(): Promise<Map<string, Prefab>> {
  const entries = await getCollection('prefabs');
  return new Map(entries.map((entry) => [entry.id, entry.data as Prefab]));
}

// A prefab and its `extends` parents, root first (Unity prefab variants).
function chain(name: string, prefabs: Map<string, Prefab>, where: string, seen: string[] = []): Prefab[] {
  const prefab = prefabs.get(name);
  if (!prefab) fail(where, `prefab "${name}" not found. Available: ${[...prefabs.keys()].join(', ')}`);
  if (seen.includes(name)) fail(where, `prefab loop: ${[...seen, name].join(' → ')}`);
  return prefab.extends ? [...chain(prefab.extends, prefabs, where, [...seen, name]), prefab] : [prefab];
}

// ---------- templating ----------

function substitute(value: unknown, props: Obj, where: string): unknown {
  if (typeof value === 'string') {
    const whole = value.match(/^\{\{\s*([\w-]+)\s*\}\}$/);
    if (whole) {
      if (!(whole[1] in props)) fail(where, `unknown prop {{${whole[1]}}}`);
      return clone(props[whole[1]]);
    }
    if (!value.includes('{{')) return value;
    const names = [...value.matchAll(/\{\{\s*([\w-]+)\s*\}\}/g)].map((m) => m[1]);
    for (const name of names) if (!(name in props)) fail(where, `unknown prop {{${name}}}`);
    const render = (lang?: 'en' | 'ar') => value.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_, name) => {
      const v = props[name];
      if (isLocalized(v)) return (lang === 'ar' ? v.ar : undefined) ?? v.en;
      return v == null ? '' : String(v);
    });
    // Interpolating localized props yields localized text.
    return names.some((n) => isLocalized(props[n])) ? { en: render('en'), ar: render('ar') } : render();
  }
  if (Array.isArray(value)) return value.map((v) => substitute(v, props, where));
  if (isObj(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, substitute(v, props, where)]));
  return value;
}

// Unity-style property override: "blocks.1.layout": slider
function setPath(target: Obj, path: string, value: unknown, where: string) {
  const keys = path.split('.');
  let node: any = target;
  for (const key of keys.slice(0, -1)) {
    if (node?.[key] === undefined) fail(where, `override path "${path}" does not exist (stopped at "${key}")`);
    node = node[key];
  }
  node[keys.at(-1)!] = clone(value);
}

type Expanded = { kind: 'section'; section: Obj } | { kind: 'blocks'; blocks: Obj[] };

function expandInstance(instance: { prefab: string; props?: Obj; overrides?: Obj }, prefabs: Map<string, Prefab>, where: string): Expanded {
  const here = `${where} › prefab "${instance.prefab}"`;
  const lineage = chain(instance.prefab, prefabs, here);
  const defaults = Object.assign({}, ...lineage.map((p) => p.props));
  for (const key of Object.keys(instance.props ?? {})) {
    if (!(key in defaults)) fail(here, `has no prop "${key}". Props: ${Object.keys(defaults).join(', ') || '(none)'}`);
  }
  const props = { ...defaults, ...instance.props };
  const body = [...lineage].reverse().find((p) => p.section || p.blocks);
  if (!body) fail(here, 'prefab defines neither `section:` nor `blocks:`');
  const root: any = substitute(clone(body.section ?? body.blocks), props, here);
  for (const [path, value] of Object.entries(instance.overrides ?? {})) setPath(root, path, value, here);
  return body.section ? { kind: 'section', section: root } : { kind: 'blocks', blocks: root };
}

// ---------- expansion + validation ----------

function resolveBlocks(list: unknown[], prefabs: Map<string, Prefab>, where: string, depth = 0): ResolvedBlock[] {
  if (depth > MAX_DEPTH) return [errorBlock(new ContentError(`${where}\n  → prefabs nested more than ${MAX_DEPTH} levels deep`))];
  return list.flatMap((entry, i) => {
    const here = `${where} › block ${i + 1}`;
    try {
      if (isInstance(entry)) {
        const expanded = expandInstance(entry, prefabs, here);
        if (expanded.kind === 'section') fail(here, `"${entry.prefab}" is a section prefab; put it under sections:, not blocks:`);
        return resolveBlocks(expanded.blocks, prefabs, `${here} (${entry.prefab})`, depth + 1);
      }
      return [validateBlock(entry, prefabs, here, depth)];
    } catch (error) {
      return [errorBlock(error)];
    }
  });
}

function validateBlock(entry: unknown, prefabs: Map<string, Prefab>, where: string, depth: number): ResolvedBlock {
  if (!isObj(entry) || typeof entry.type !== 'string') fail(where, 'each block needs a `type:` (or `prefab:`)');
  const definition = blockSchemas[entry.type];
  if (!definition) fail(where, `unknown block type "${entry.type}". Types: ${blockTypes.join(', ')}`);
  const result = definition.schema.safeParse(entry);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.') || entry.type}: ${issue.message}`).join('\n  → ');
    fail(`${where} (${entry.type})`, issues);
  }
  return resolveNested(result.data, prefabs, `${where} (${entry.type})`, depth);
}

// Blocks that contain blocks (e.g. columns[].blocks) are resolved recursively.
function resolveNested(value: any, prefabs: Map<string, Prefab>, where: string, depth: number): any {
  if (Array.isArray(value)) return value.map((v, i) => resolveNested(v, prefabs, `${where} › ${i + 1}`, depth));
  if (!isObj(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, v]) => [
    key,
    key === 'blocks' && Array.isArray(v) ? resolveBlocks(v, prefabs, where, depth + 1) : resolveNested(v, prefabs, where, depth)
  ]));
}

function resolveSection(raw: Obj, prefabs: Map<string, Prefab>, where: string, depth: number): ResolvedSection {
  const { blocks = [], ...rest } = raw;
  const result = sectionSchema.safeParse({ ...rest, blocks: [] });
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n  → ');
    return { ...sectionSchema.parse({}), blocks: [errorBlock(new ContentError(`${where}\n  → ${issues}`))] };
  }
  return { ...result.data, blocks: resolveBlocks(blocks, prefabs, where, depth) };
}

export async function resolveSections(data: { sections?: unknown[]; blocks?: unknown[] }, file: string): Promise<ResolvedSection[]> {
  const prefabs = await loadPrefabs();
  const entries = [...(data.blocks ? [{ blocks: data.blocks }] : []), ...(data.sections ?? [])];
  return entries.map((entry, i) => {
    const where = `${file} › section ${i + 1}`;
    try {
      if (isInstance(entry)) {
        const expanded = expandInstance(entry, prefabs, where);
        const raw = expanded.kind === 'section' ? expanded.section : { blocks: expanded.blocks };
        return resolveSection(raw, prefabs, `${where} (${entry.prefab})`, 1);
      }
      return resolveSection(entry as Obj, prefabs, where, 0);
    } catch (error) {
      return { ...sectionSchema.parse({}), blocks: [errorBlock(error)] };
    }
  });
}

export { loadPrefabs };
