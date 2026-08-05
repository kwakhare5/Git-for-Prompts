/**
 * Bundle — the atomic unit of versioning in Git for Prompts V2.
 *
 * A PromptBundle captures everything that determines AI behavior:
 * system prompt, user template, model configuration, tool definitions,
 * and output format constraints. When ANY of these change, a new
 * immutable version is created.
 *
 * This module owns:
 *   - The canonical PromptBundle TypeScript type
 *   - Zod validation schema (used by CLI, API, and UI)
 *   - Bundle creation helpers (from legacy text, from scratch)
 *   - Content extraction (for backward-compatible `content` column)
 */

import { z } from 'zod/v4';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const modelConfigSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).optional(),
  maxTokens: z.number().int().positive().optional(),
});

export const toolDefinitionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  parameters: z.record(z.string(), z.unknown()).default({}),
});

export const responseFormatSchema = z.object({
  type: z.enum(['text', 'json_object', 'json_schema']),
  schema: z.record(z.string(), z.unknown()).optional(),
});

export const promptBundleSchema = z.object({
  systemPrompt: z.string().nullable().default(null),
  userTemplate: z.string().min(1),
  modelConfig: modelConfigSchema,
  tools: z.array(toolDefinitionSchema).optional(),
  responseFormat: responseFormatSchema.optional(),
});

// ─── Types (inferred from Zod — single source of truth) ─────────────────────

export type ModelConfig = z.infer<typeof modelConfigSchema>;
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;
export type ResponseFormat = z.infer<typeof responseFormatSchema>;
export type PromptBundle = z.infer<typeof promptBundleSchema>;

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Validate and parse an unknown input into a PromptBundle.
 * Strips unknown fields. Throws ZodError on invalid input.
 */
export function validateBundle(input: unknown): PromptBundle {
  return promptBundleSchema.parse(input);
}

/**
 * Safe validation — returns success/error discriminated union.
 */
export function safeParseBundleResult(input: unknown) {
  return promptBundleSchema.safeParse(input);
}

// ─── Factory helpers ─────────────────────────────────────────────────────────

/**
 * Create a PromptBundle from legacy V1 text-only content.
 * Used during migration: old versions have `content` but no `bundle`.
 */
export function createBundleFromLegacy(content: string): PromptBundle {
  return {
    systemPrompt: null,
    userTemplate: content,
    modelConfig: {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    },
    tools: undefined,
    responseFormat: undefined,
  };
}

/**
 * Create a minimal PromptBundle with sensible defaults.
 */
export function createEmptyBundle(): PromptBundle {
  return {
    systemPrompt: null,
    userTemplate: '',
    modelConfig: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
    },
    tools: undefined,
    responseFormat: undefined,
  };
}

/**
 * Extract the user-facing prompt text from a bundle.
 * Used to populate the legacy `content` column for backward compatibility.
 */
export function extractContentFromBundle(bundle: PromptBundle): string {
  return bundle.userTemplate;
}
