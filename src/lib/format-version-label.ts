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
  if (!v.commitMessage) {
    return `v${v.versionNumber}`;
  }

  // Strip redundant leading "v{versionNumber} -", "v{versionNumber} ·", "v{versionNumber} —", or "v{versionNumber} "
  const prefixRegex = new RegExp(`^v${v.versionNumber}\\s*[-·—:]?\\s*`, 'i');
  const cleanMessage = v.commitMessage.replace(prefixRegex, '').trim();

  return cleanMessage ? `v${v.versionNumber} ${separator} ${cleanMessage}` : `v${v.versionNumber}`;
}
