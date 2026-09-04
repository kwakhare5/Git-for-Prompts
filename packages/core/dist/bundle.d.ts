/**
 * Bundle — the atomic unit of versioning in Git for Prompts.
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
export declare const modelConfigSchema: z.ZodObject<{
    provider: z.ZodString;
    model: z.ZodString;
    temperature: z.ZodDefault<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const toolDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const responseFormatSchema: z.ZodObject<{
    type: z.ZodEnum<{
        text: "text";
        json_object: "json_object";
        json_schema: "json_schema";
    }>;
    schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const promptBundleSchema: z.ZodObject<{
    systemPrompt: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    userTemplate: z.ZodString;
    modelConfig: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        temperature: z.ZodDefault<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    responseFormat: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<{
            text: "text";
            json_object: "json_object";
            json_schema: "json_schema";
        }>;
        schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ModelConfig = z.infer<typeof modelConfigSchema>;
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;
export type ResponseFormat = z.infer<typeof responseFormatSchema>;
export type PromptBundle = z.infer<typeof promptBundleSchema>;
/**
 * Validate and parse an unknown input into a PromptBundle.
 * Strips unknown fields. Throws ZodError on invalid input.
 */
export declare function validateBundle(input: unknown): PromptBundle;
/**
 * Safe validation — returns success/error discriminated union.
 */
export declare function safeParseBundleResult(input: unknown): z.ZodSafeParseResult<{
    systemPrompt: string | null;
    userTemplate: string;
    modelConfig: {
        provider: string;
        model: string;
        temperature: number;
        topP?: number | undefined;
        maxTokens?: number | undefined;
    };
    tools?: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    }[] | undefined;
    responseFormat?: {
        type: "text" | "json_object" | "json_schema";
        schema?: Record<string, unknown> | undefined;
    } | undefined;
}>;
/**
 * Create a PromptBundle from legacy V1 text-only content.
 * Used during migration: old versions have `content` but no `bundle`.
 */
export declare function createBundleFromLegacy(content: string): PromptBundle;
/**
 * Create a minimal PromptBundle with sensible defaults.
 */
export declare function createEmptyBundle(): PromptBundle;
/**
 * Extract the user-facing prompt text from a bundle.
 * Used to populate the legacy `content` column for backward compatibility.
 */
export declare function extractContentFromBundle(bundle: PromptBundle): string;
//# sourceMappingURL=bundle.d.ts.map