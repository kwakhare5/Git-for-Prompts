/**
 * Shared Monaco editor theme definition for Git for Prompts.
 * Used by both PromptEditor and DiffViewer to ensure visual consistency.
 *
 * Design: "Terminal Stripe"
 * — Gutter (zinc-900) is visually separated from the writing canvas (zinc-950)
 *   via a 1px right-border on the gutter, creating an unambiguous two-zone layout.
 */

export const GFP_THEME_NAME = 'gfp-dark';

const GFP_THEME_DEFINITION = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#09090b',           // zinc-950 — the writing canvas
    'editorGutter.background': '#09090b',     // same as canvas — no "box" effect
    'editorLineNumber.foreground': '#3f3f46', // zinc-700 — subtle, not distracting
    'editorLineNumber.activeForeground': '#71717a', // zinc-500 — active line readable
    'editor.lineHighlightBackground': '#18181b40', // very subtle active line tint
    'editorIndentGuide.background1': '#27272a',
    'editorRuler.foreground': '#27272a',
  },
};

/**
 * Clean line number options — VS Code style.
 * lineNumbersMinChars: 3 → right-aligned number with natural left padding
 * lineDecorationsWidth: 8 → 8px breathing gap between gutter and first text char
 */
export const GFP_LINE_NUMBER_OPTIONS = {
  lineNumbers: 'on' as const,
  lineNumbersMinChars: 3,
  lineDecorationsWidth: 16,
};

/**
 * Register the gfp-dark theme on a Monaco instance.
 * Safe to call multiple times — Monaco handles re-registration gracefully.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerGfpTheme(monaco: any): void {
  monaco.editor.defineTheme(GFP_THEME_NAME, GFP_THEME_DEFINITION);
}
