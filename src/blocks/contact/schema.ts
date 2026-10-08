import { z } from 'astro/zod';

export const meta = { label: 'Contact', group: 'Site', description: 'Two cards: the email (opens the mail app, with a line under it to copy the address instead) and LinkedIn. The address and profile are set once in src/lib/site.ts (contact).' };

export const schema = z.object({
  type: z.literal('contact')
}).strict();

export const example = { type: 'contact' };
