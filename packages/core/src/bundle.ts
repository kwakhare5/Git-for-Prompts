/** Canonical schema and helpers for immutable prompt bundles. */

import { z } from 'zod/v4';

const nonEmptyString = z.string().trim().min(1);

export const modelConfigSchema = z.object({
  provider: nonEmptyString,
  model: nonEmptyString,
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).optional(),
  maxTokens: z.number().int().positive().optional(),
});

export const toolDefinitionSchema = z.object({
  name: nonEmptyString,
  description: z.string(),
  parameters: z.record(z.string(), z.unknown()).default({}),
});

export const responseFormatSchema = z.object({
  type: z.enum(['text', 'json_object', 'json_schema']),
  schema: z.record(z.string(), z.unknown()).optional(),
}).superRefine((value, ctx) => {
  if (value.type === 'json_schema' && !value.schema) {
    ctx.addIssue({ code: 'custom', path: ['schema'], message: 'json_schema response format requires schema' });
  }
  if (value.type !== 'json_schema' && value.schema) {
    ctx.addIssue({ code: 'custom', path: ['schema'], message: 'schema is only valid for json_schema response format' });
  }
});

export const promptBundleSchema = z.object({
  systemPrompt: z.string().nullable().default(null),
  userTemplate: z.string(),
  modelConfig: modelConfigSchema,
  tools: z.array(toolDefinitionSchema).optional(),
  responseFormat: responseFormatSchema.optional(),
});

export type ModelConfig = z.infer<typeof modelConfigSchema>;
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;
export type ResponseFormat = z.infer<typeof responseFormatSchema>;
export type PromptBundle = z.infer<typeof promptBundleSchema>;

export function validateBundle(input: unknown): PromptBundle {
  return promptBundleSchema.parse(input);
}

export function safeParseBundleResult(input: unknown) {
  return promptBundleSchema.safeParse(input);
}

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

/** Create a draft bundle; an empty user template is valid until the draft is saved. */
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

export function extractContentFromBundle(bundle: PromptBundle): string {
  return bundle.userTemplate;
}
