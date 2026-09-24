import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import type { AstroIntegration } from 'astro';

// During `pnpm dev`, writes JSON Schemas for pages, projects and prefabs to .vscode/schemas/
// and refreshes them when a block schema or prefab changes. See .vscode/settings.json.
export default function contentSchema(): AstroIntegration {
  return {
    name: 'content-schema',
    hooks: {
      'astro:server:setup': ({ server, logger }) => {
        const root = server.config.root;
        const generate = async () => {
          try {
            const { buildSchemas } = await server.ssrLoadModule('/src/blocks/json-schema.ts');
            const prefabs = readdirSync(`${root}/src/content/prefabs`).filter((f) => f.endsWith('.yaml')).map((f) => f.replace(/\.yaml$/, ''));
            mkdirSync(`${root}/.vscode/schemas`, { recursive: true });
            for (const [name, schema] of Object.entries(buildSchemas(prefabs))) {
              writeFileSync(`${root}/.vscode/schemas/${name}`, `${JSON.stringify(schema, null, 2)}\n`);
            }
          } catch (error) {
            logger.warn(`could not write .vscode/schemas: ${(error as Error).message}`);
          }
        };
        let timer: ReturnType<typeof setTimeout> | undefined;
        const schedule = () => { clearTimeout(timer); timer = setTimeout(generate, 300); };
        server.watcher.on('all', (_event, file) => {
          if (/src[\\/](blocks[\\/].+[\\/]schema\.ts|lib[\\/]content-schemas\.ts|content[\\/]prefabs[\\/])/.test(file)) schedule();
        });
        schedule();
      }
    }
  };
}
