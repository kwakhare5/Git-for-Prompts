import { z } from 'zod';

export const createPromptSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
});

export const updatePromptSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  description: z.string().max(1000).optional(),
  // isPublic will be added in Phase 8 when the settings UI is built
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;


export const deletePromptSchema = z.object({
  promptId: z.string().uuid('Invalid prompt ID'),
});
