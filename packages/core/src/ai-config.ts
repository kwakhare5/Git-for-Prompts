/**
 * Core AI model configuration defaults.
 * Single source of truth for provider endpoints and default execution/evaluation models
 * used across CLI local evals and Cloud SaaS backend runners.
 */

export const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const DEFAULT_GROQ_EXECUTION_MODEL = 'llama-3.3-70b-versatile';
export const DEFAULT_GROQ_EVALUATION_MODEL = DEFAULT_GROQ_EXECUTION_MODEL;

export const DEFAULT_OPENROUTER_EXECUTION_MODEL = 'meta-llama/llama-3.3-70b-instruct';
export const DEFAULT_OPENROUTER_EVALUATION_MODEL = 'meta-llama/llama-3.3-70b-instruct';
export const FRONTIER_OPENROUTER_EVALUATION_MODEL = 'anthropic/claude-3.5-sonnet';

/**
 * Resilient fallback model chains for OpenRouter.
 * If the primary model encounters rate limits, capacity constraints, or provider downtime,
 * the executor smoothly attempts the next model in the chain before failing.
 */
export const OPENROUTER_FALLBACK_EXECUTION_MODELS = [
  'meta-llama/llama-3.3-70b-instruct',
  'mistralai/mistral-small-24b-instruct-2501',
  'anthropic/claude-3.5-haiku',
];

export const OPENROUTER_FALLBACK_EVALUATION_MODELS = [
  'meta-llama/llama-3.3-70b-instruct',
  'mistralai/mistral-small-24b-instruct-2501',
];

export const DEFAULT_AI_TIMEOUT_MS = 30_000;
export const DEFAULT_MAX_CONCURRENT_TESTS = 10;
