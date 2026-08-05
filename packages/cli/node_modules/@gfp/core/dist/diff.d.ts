/**
 * Diff — structural bundle diff engine for @gfp/core.
 *
 * Produces per-field diffs between two PromptBundles. The output is
 * consumed by the Monaco diff viewer (cloud UI) and terminal diff (CLI).
 *
 * Text fields use a simple line-based diff. JSON fields (tools, schema,
 * modelConfig) use serialized JSON string comparison.
 */
import type { PromptBundle } from './bundle.js';
export type FieldDiffType = 'unchanged' | 'modified' | 'added' | 'removed';
export type FieldDiff = {
    field: string;
    type: FieldDiffType;
    before: string | null;
    after: string | null;
};
export type BundleDiff = {
    /** True if any field changed */
    hasChanges: boolean;
    /** Per-field diffs */
    fields: FieldDiff[];
    /** Human-readable summary of what changed */
    summary: string;
};
/**
 * Compute structural diff between two PromptBundles.
 * Returns per-field comparison for: systemPrompt, userTemplate,
 * modelConfig, tools, and responseFormat.
 */
export declare function diffBundles(a: PromptBundle, b: PromptBundle): BundleDiff;
/**
 * Compute diff between two versions that may or may not have bundles.
 * Falls back to text-only diff if either side lacks a bundle.
 */
export declare function diffVersions(a: {
    content: string;
    bundle: PromptBundle | null;
}, b: {
    content: string;
    bundle: PromptBundle | null;
}): BundleDiff;
//# sourceMappingURL=diff.d.ts.map