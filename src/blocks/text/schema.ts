import { z } from 'astro/zod';
import { L } from '../../lib/i18n';

export const meta = { label: 'Text', group: 'Text', description: 'Paragraphs written in Markdown: **bold**, *italic*, [links](https://…), lists, ### subheadings.' };

export const schema = z.object({
  type: z.literal('text'),
  text: L,
  size: z.enum(['normal', 'large']).default('normal'),
  align: z.enum(['start', 'center']).optional()
}).strict();

export const example = {
  type: 'text',
  text: {
    en: 'From early blockouts to final frames, these studies explore **atmosphere** and [spatial storytelling](https://example.com).\n\n- Blender\n- Unreal Engine',
    ar: 'من التخطيط الأولي إلى اللقطة النهائية، تستكشف هذه الأعمال **الأجواء** و[السرد المكاني](https://example.com).\n\n- Blender\n- Unreal Engine'
  }
};
