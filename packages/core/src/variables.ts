/**
 * Variable utilities — extracted from src/lib/variables.ts for @gfp/core.
 *
 * Variables are {{double-brace}} placeholders in prompt content.
 * Extracts from both systemPrompt and userTemplate fields of a bundle.
 */

import type { PromptBundle } from './bundle.js';

const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

/**
 * Extract unique variable names from a string.
 * e.g. "Hello {{name}}, you are a {{role}}" → ["name", "role"]
 */
export function extractVariables(content: string): string[] {
  const seen = new Set<string>();
  for (const match of content.matchAll(VARIABLE_REGEX)) {
    seen.add(match[1]);
  }
  return [...seen];
}

/**
 * Extract unique variable names from an entire PromptBundle.
 * Scans both systemPrompt and userTemplate.
 */
export function extractBundleVariables(bundle: PromptBundle): string[] {
  const seen = new Set<string>();

  if (bundle.systemPrompt) {
    for (const v of extractVariables(bundle.systemPrompt)) {
      seen.add(v);
    }
  }

  for (const v of extractVariables(bundle.userTemplate)) {
    seen.add(v);
  }

  return [...seen];
}

/**
 * Interpolate {{variable}} placeholders with provided values.
 * Missing variables are left as-is (safe degradation).
 */
export function interpolateVariables(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(VARIABLE_REGEX, (match, name) => {
    if (Object.hasOwn(values, name) && typeof values[name] === 'string') {
      return values[name];
    }
    return match;
  });
}

/**
 * Interpolate variables across an entire PromptBundle.
 * Returns a new bundle with variables replaced — original is not mutated.
 */
export function interpolateBundle(
  bundle: PromptBundle,
  values: Record<string, string>
): PromptBundle {
  return {
    ...bundle,
    systemPrompt: bundle.systemPrompt
      ? interpolateVariables(bundle.systemPrompt, values)
      : null,
    userTemplate: interpolateVariables(bundle.userTemplate, values),
  };
}
