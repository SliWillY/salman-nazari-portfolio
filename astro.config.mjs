import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import contentSchema from './src/integrations/content-schema.ts';
import { visuals } from './src/visuals/content.ts';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  // /go/ share links are redirects, not pages, and the brief is unlisted: keep them out of the sitemap. /visuals/
  // joins it only once its content.ts marks it indexed.
  integrations: [
    sitemap({ filter: (page) => !page.includes('/go/') && !page.includes('/brief/') && (visuals.indexed || !page.includes('/visuals/')) }),
    contentSchema()
  ],
  build: { format: 'directory' }
});
