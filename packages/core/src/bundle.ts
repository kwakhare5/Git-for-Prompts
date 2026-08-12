import { z } from 'zod/v4';

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
