/**
 * Variable utilities — extracted from src/lib/variables.ts for @gfp/core.
 *
 * Variables are {{double-brace}} placeholders in prompt content.
 * Extracts from both systemPrompt and userTemplate fields of a bundle.
 */
import type { PromptBundle } from './bundle.js';
/**
 * Extract unique variable names from a string.
 * e.g. "Hello {{name}}, you are a {{role}}" → ["name", "role"]
 */
export declare function extractVariables(content: string): string[];
/**
 * Extract unique variable names from an entire PromptBundle.
 * Scans both systemPrompt and userTemplate.
 */
export declare function extractBundleVariables(bundle: PromptBundle): string[];
/**
 * Interpolate {{variable}} placeholders with provided values.
 * Missing variables are left as-is (safe degradation).
 */
export declare function interpolateVariables(content: string, values: Record<string, string>): string;
/**
 * Interpolate variables across an entire PromptBundle.
 * Returns a new bundle with variables replaced — original is not mutated.
 */
export declare function interpolateBundle(bundle: PromptBundle, values: Record<string, string>): PromptBundle;
//# sourceMappingURL=variables.d.ts.map