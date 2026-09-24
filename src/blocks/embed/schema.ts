import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Embed', group: 'Media', description: 'An interactive embed: Sketchfab 3D model, itch.io game, Figma prototype, YouTube playlist, ArtStation… Paste the embed URL.' };

// Add a domain here to allow embedding it.
export const allowedHosts = ['sketchfab.com', 'itch.io', 'figma.com', 'youtube.com', 'youtube-nocookie.com', 'player.vimeo.com', 'artstation.com', 'github.io', 'codepen.io', 'google.com'];

const allowed = (url: string) => {
  try {
    const host = new URL(url).hostname;
    return allowedHosts.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
};

export const schema = z.object({
  type: z.literal('embed'),
  url: z.string().url().refine(allowed, `host not allowed; add it to allowedHosts in src/blocks/embed/schema.ts (${allowedHosts.join(', ')})`),
  title: L.optional(),
  caption: L.optional(),
  aspect: z.string().default('16 / 9'),
  height: z.coerce.number().optional()
}).strict();

export const example = {
  type: 'embed',
  url: 'https://sketchfab.com/models/442c548d94744641ba279ae94b5f45ec/embed',
  title: { en: '3D model viewer', ar: 'عارض النموذج ثلاثي الأبعاد' }
};
