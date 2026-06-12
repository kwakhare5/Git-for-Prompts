import { z } from 'zod';

export const createVersionSchema = z.object({
  promptId: z.string().uuid('Invalid prompt ID'),
  content: z.string().min(1, 'Prompt content cannot be empty'),
  commitMessage: z.string().max(500).optional(),
});

export const restoreVersionSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  promptId: z.string().uuid('Invalid prompt ID'),
});

export type CreateVersionInput = z.infer<typeof createVersionSchema>;
export type RestoreVersionInput = z.infer<typeof restoreVersionSchema>;
