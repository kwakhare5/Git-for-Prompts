/**
 * Prompt variable utilities — re-exported from @gfp/core.
 *
 * This file is a thin re-export wrapper so existing imports like
 * `import { extractVariables } from '@/lib/variables'` continue working.
 *
 * All logic now lives in packages/core/src/variables.ts.
 */

export {
  extractVariables,
  interpolateVariables,
} from '@gfp/core';

