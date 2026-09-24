import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Video', group: 'Media', description: 'YouTube / Vimeo (use the video ID from the URL) or a Cloudinary video (use its public ID).' };

export const schema = z.object({
  type: z.literal('video'),
  provider: z.enum(['youtube', 'vimeo', 'cloudinary']),
  id: z.string().min(1, 'set the video id'),
  title: L.optional(),
  caption: L.optional(),
  aspect: z.string().default('16 / 9'),
  autoplay: z.boolean().default(false)
}).strict();

export const example = {
  type: 'video',
  provider: 'youtube',
  id: 'aqz-KE-bpKQ',
  title: { en: 'Gameplay trailer', ar: 'عرض اللعب' }
};
