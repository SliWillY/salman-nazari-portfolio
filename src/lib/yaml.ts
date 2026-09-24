// Minimal YAML printer for the block catalog's copy-paste snippets.

const needsQuotes = (s: string) => s === '' || /^[\s\-?:,[\]{}#&*!|>'"%@`]|: | #|\s$|^(true|false|null|yes|no|~|\d[\d.]*)$/i.test(s) || s.includes('{{');

function scalar(value: unknown): string {
  if (typeof value === 'string') return needsQuotes(value) ? JSON.stringify(value) : value;
  return String(value);
}

const isLocalized = (v: unknown) => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every((k) => k === 'en' || k === 'ar');

export function toYaml(value: unknown, indent = 0): string {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.every((v) => typeof v !== 'object' || v === null)) return `[${value.map(scalar).join(', ')}]`;
    return value.map((item) => {
      const body = toYaml(item, indent + 2);
      return `\n${pad}- ${body.trimStart()}`;
    }).join('');
  }
  if (value !== null && typeof value === 'object') {
    if (isLocalized(value)) return `{ ${Object.entries(value).map(([k, v]) => `${k}: ${scalar(v)}`).join(', ')} }`;
    return Object.entries(value).map(([key, v]) => {
      const body = toYaml(v, indent + 2);
      const nested = v !== null && typeof v === 'object' && !isLocalized(v) && !(Array.isArray(v) && (v.length === 0 || v.every((x) => typeof x !== 'object')));
      return `\n${pad}${key}:${nested ? body : ` ${body}`}`;
    }).join('');
  }
  if (typeof value === 'string' && value.includes('\n')) return `|\n${value.split('\n').map((l) => `${pad}${l}`).join('\n')}`;
  return scalar(value);
}

export const yamlSnippet = (value: unknown) => toYaml(value).replace(/^\n/, '');
