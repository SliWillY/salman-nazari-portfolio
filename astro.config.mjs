import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import contentSchema from './src/integrations/content-schema.ts';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  // /go/ share links are redirects, not pages, and the brief is unlisted: keep them out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/go/') && !page.includes('/brief/') }), contentSchema()],
  build: { format: 'directory' }
});
