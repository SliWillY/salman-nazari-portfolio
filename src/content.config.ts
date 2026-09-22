import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const media = z.object({
  type: z.enum(['image', 'video', 'document', 'link']),
  title: z.string().optional(),
  alt: z.string().optional(),
  publicId: z.string().optional(),
  provider: z.enum(['youtube', 'vimeo']).optional(),
  id: z.string().optional(),
  url: z.string().url().optional(),
  aspect: z.string().optional(),
  caption: z.string().optional()
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    lang: z.enum(['en', 'ar']),
    route: z.string(),
    title: z.string(),
    description: z.string(),
    navLabel: z.string(),
    order: z.number().default(0),
    kind: z.enum(['home', 'standard']).default('standard'),
    eyebrow: z.string().optional(),
    heroImage: z.string().optional(),
    featured: z.array(z.object({
      title: z.string(),
      text: z.string(),
      href: z.string(),
      image: z.string().optional()
    })).default([]),
    media: z.array(media).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([])
  })
});

export const collections = { pages };
