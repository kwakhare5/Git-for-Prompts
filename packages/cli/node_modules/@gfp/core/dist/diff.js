/**
 * Diff — structural bundle diff engine for @gfp/core.
 *
 * Produces per-field diffs between two PromptBundles. The output is
 * consumed by the Monaco diff viewer (cloud UI) and terminal diff (CLI).
 *
 * Text fields use a simple line-based diff. JSON fields (tools, schema,
 * modelConfig) use serialized JSON string comparison.
 */
// ─── Helpers ─────────────────────────────────────────────────────────────────
function serialize(value) {
    if (value === null || value === undefined)
        return null;
    if (typeof value === 'string')
        return value;
    return JSON.stringify(value, null, 2);
}
function diffField(field, before, after) {
    const beforeStr = serialize(before);
    const afterStr = serialize(after);
    if (beforeStr === afterStr) {
        return { field, type: 'unchanged', before: beforeStr, after: afterStr };
    }
    if (beforeStr === null) {
        return { field, type: 'added', before: null, after: afterStr };
    }
    if (afterStr === null) {
        return { field, type: 'removed', before: beforeStr, after: null };
    }
    return { field, type: 'modified', before: beforeStr, after: afterStr };
}
// ─── Public API ──────────────────────────────────────────────────────────────
/**
 * Compute structural diff between two PromptBundles.
 * Returns per-field comparison for: systemPrompt, userTemplate,
 * modelConfig, tools, and responseFormat.
 */
export function diffBundles(a, b) {
    const fields = [
        diffField('systemPrompt', a.systemPrompt, b.systemPrompt),
        diffField('userTemplate', a.userTemplate, b.userTemplate),
        diffField('modelConfig', a.modelConfig, b.modelConfig),
        diffField('tools', a.tools, b.tools),
        diffField('responseFormat', a.responseFormat, b.responseFormat),
    ];
    const changed = fields.filter((f) => f.type !== 'unchanged');
    const hasChanges = changed.length > 0;
    const summary = hasChanges
        ? `${changed.length} field(s) changed: ${changed.map((f) => f.field).join(', ')}`
        : 'No changes';
    return { hasChanges, fields, summary };
}
/**
 * Compute diff between two versions that may or may not have bundles.
 * Falls back to text-only diff if either side lacks a bundle.
 */
export function diffVersions(a, b) {
    // Both have bundles — full structural diff
    if (a.bundle && b.bundle) {
        return diffBundles(a.bundle, b.bundle);
    }
    // Fallback: text-only diff
    const textDiff = diffField('content', a.content, b.content);
    return {
        hasChanges: textDiff.type !== 'unchanged',
        fields: [textDiff],
        summary: textDiff.type === 'unchanged' ? 'No changes' : '1 field(s) changed: content',
    };
}
//# sourceMappingURL=diff.js.map