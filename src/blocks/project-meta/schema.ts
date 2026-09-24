import { z } from 'astro/zod';

export const meta = { label: 'Project info', group: 'Site', description: 'Year, role and tools from the project file. Added automatically under the project title; place it yourself when using `header: none`.' };

export const schema = z.object({
  type: z.literal('project-meta')
}).strict();

export const example = { type: 'project-meta' };
