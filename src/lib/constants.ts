// src/lib/constants.ts

/**
 * Shared limits for UI-facing list/dropdown queries.
 *
 * A prompt's version history is unbounded — a heavy user can accumulate
 * thousands of rows. Every server component that renders a version
 * <select> or list must cap its query, or a single power-user prompt can
 * hang/crash every visitor's browser tab (thousands of DOM nodes) and put
 * unnecessary load on Postgres for a page that only ever needs a handful
 * of recent options.
 *
 * 50 covers the overwhelming majority of real usage while keeping the
 * dropdown scannable. Bump to 100 by changing this one line if needed —
 * every consumer picks it up automatically.
 */
export const RECENT_VERSIONS_LIMIT = 50;
