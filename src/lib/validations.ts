import { z } from 'zod';
import { promptBundleSchema } from '@gfp/core';

// ─── Prompts ────────────────────────────────────────────────────────────────
export const createPromptSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
});

export const updatePromptSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  description: z.string().max(1000).optional(),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;

export const deletePromptSchema = z.object({
  promptId: z.string().uuid('Invalid prompt ID'),
});

// ─── Versions ───────────────────────────────────────────────────────────────
export const createVersionSchema = z
  .object({
    promptId: z.string().uuid('Invalid prompt ID'),
    content: z.string().optional(),
    bundle: promptBundleSchema.optional(),
    commitMessage: z.string().max(500).optional(),
  })
  .refine((data) => data.content || data.bundle, {
    message: 'Either content or bundle is required',
  });

export const restoreVersionSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
  promptId: z.string().uuid('Invalid prompt ID'),
});

// ─── Test Cases ─────────────────────────────────────────────────────────────
export const createTestCaseSchema = z.object({
  promptId: z.string().uuid('Invalid prompt ID'),
  name: z.string().min(1, 'Test case name is required').max(255),
  inputText: z.string().min(1, 'Input text is required'),
  expectedCriteria: z.string().min(1, 'Expected criteria is required'),
});

export const runTestsSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
});

export const runComparisonSchema = z.object({
  versionIdA: z.string().uuid('Invalid version ID for A'),
  versionIdB: z.string().uuid('Invalid version ID for B'),
});

export const deleteTestCaseSchema = z.object({
  testCaseId: z.string().uuid('Invalid test case ID'),
});

// ─── API Keys ───────────────────────────────────────────────────────────────
export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(255),
  expiresAt: z.string().datetime().optional().nullable(),
  scopes: z.array(z.enum(['prompts:read', 'prompts:write', 'versions:write'])).optional(),
});

export const deleteApiKeySchema = z.object({
  id: z.string().uuid(),
});

// ─── Webhooks ───────────────────────────────────────────────────────────────
export const createWebhookSchema = z.object({
  url: z.string().url('Must be a valid URL').max(2048),
  promptId: z.string().uuid().optional(),
  label: z.string().max(255).optional(),
});

export const deleteWebhookSchema = z.object({
  webhookId: z.string().uuid('Invalid webhook ID'),
});
