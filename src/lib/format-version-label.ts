/**
 * Formats a version object into a human-readable label.
 * Used by DiffVersionSelector, CompareRunner, and TestRunner
 * to avoid duplicating the `v{n} — {message}` string inline.
 *
 * @example formatVersionLabel(v)         → "v3 — Made tone friendlier"
 * @example formatVersionLabel(v, '·')    → "v3 · Made tone friendlier"
 * @example formatVersionLabel(v) (no msg) → "v3"
 */
export function formatVersionLabel(
  v: { versionNumber: number; commitMessage: string | null | undefined },
  separator = '—'
): string {
  return v.commitMessage
    ? `v${v.versionNumber} ${separator} ${v.commitMessage}`
    : `v${v.versionNumber}`;
}
