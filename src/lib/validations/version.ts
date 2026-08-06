import { z } from 'zod';
import { promptBundleSchema } from '@gfp/core';

export const createVersionSchema = z.object({
  promptId: z.string().uuid('Invalid prompt ID'),
  // content is required when bundle is absent; when bundle provided it's derived from bundle.userTemplate
  content: z.string().optional(),
  bundle: promptBundleSchema.optional(),
  commitMessage: z.string().max(500).optional(),
}).refine(
  (data) => data.content || data.bundle,
  { message: 'Either content or bundle is required' }
);

export const restoreVersionSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  promptId: z.string().uuid('Invalid prompt ID'),
});


