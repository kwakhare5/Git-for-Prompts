/**
 * @gfp/core — public API barrel export.
 *
 * This is the single entry point for all consumers:
 *   - Next.js cloud app (import { PromptBundle, validateBundle } from '@gfp/core')
 *   - CLI (import { extractVariables, diffBundles } from '@gfp/core')
 *
 * Re-exports everything from the internal modules.
 */

// Bundle: types, schemas, validation, factory helpers
export {
  // Zod schemas
  modelConfigSchema,
  toolDefinitionSchema,
  responseFormatSchema,
  promptBundleSchema,
  // Types
  type ModelConfig,
  type ToolDefinition,
  type ResponseFormat,
  type PromptBundle,
  // Validation
  validateBundle,
  safeParseBundleResult,
  // Factory helpers
  createBundleFromLegacy,
  createEmptyBundle,
  extractContentFromBundle,
} from './bundle.js';

// Variables: extraction, interpolation (string-level + bundle-level)
export {
  extractVariables,
  extractBundleVariables,
  interpolateVariables,
  interpolateBundle,
} from './variables.js';

// Storage: adapter interface + shared entity types
export {
  type Prompt,
  type Version,
  type TestCase,
  type TestResult,
  type StorageAdapter,
} from './storage.js';

// Eval: provider interface, test runner, concurrency, JSON extraction
export {
  type ChatMessage,
  type AIProvider,
  type TestCaseInput,
  type EvalAttempt,
  extractJson,
  runWithConcurrency,
  runSingleTestCase,
  runEvaluations,
  runEvaluationsLegacy,
} from './eval.js';

// Diff: structural bundle comparison
export {
  type FieldDiffType,
  type FieldDiff,
  type BundleDiff,
  diffBundles,
  diffVersions,
} from './diff.js';

// AI Config: centralized provider & model defaults
export {
  GROQ_URL,
  OPENROUTER_URL,
  DEFAULT_GROQ_EXECUTION_MODEL,
  DEFAULT_GROQ_EVALUATION_MODEL,
  DEFAULT_OPENROUTER_EXECUTION_MODEL,
  DEFAULT_OPENROUTER_EVALUATION_MODEL,
  FRONTIER_OPENROUTER_EVALUATION_MODEL,
  DEFAULT_AI_TIMEOUT_MS,
  DEFAULT_MAX_CONCURRENT_TESTS,
} from './ai-config.js';
