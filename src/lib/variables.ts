/**
 * Prompt variable utilities.
 *
 * Variables are {{double-brace}} placeholders in prompt content.
 * They are extracted on version save and stored in versions.variables[].
 * When a prompt is fetched via the public API, callers can pass
 * ?variables[name]=value to interpolate them server-side.
 */

const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

/**
 * Extract unique variable names from prompt content.
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
 * Interpolate {{variable}} placeholders with provided values.
 * Missing variables are left as-is (safe degradation — callers should check
 * the variables[] list in the API response to know what's expected).
 */
export function interpolateVariables(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(VARIABLE_REGEX, (match, name) => values[name] ?? match);
}
