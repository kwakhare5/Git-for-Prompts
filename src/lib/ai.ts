/**
 * AI Engine Wrapper - Dual Provider (Groq + OpenRouter)
 * Groq is the primary provider for ultra-fast inference.
 * OpenRouter serves as a reliable free fallback.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openrouter/free';

const AI_TIMEOUT_MS = 30_000; 
const MAX_CONCURRENT_TESTS = 10; // Groq is fast enough for high concurrency

/**
 * Robustly extracts a JSON object from a string.
 */
function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new SyntaxError('No JSON object found in response');
  }
  return JSON.parse(text.slice(start, end + 1));
}

/**
 * Simple concurrency limiter.
 */
export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Core fetch wrapper with Fallback logic.
 * Try Groq first -> Fallback to OpenRouter.
 */
async function callAI(messages: Message[]): Promise<string> {
  // 1. Try Groq (Primary)
  if (process.env.GROQ_API_KEY) {
    try {
      return await fetchWithTimeout(GROQ_URL, process.env.GROQ_API_KEY, GROQ_MODEL, messages);
    } catch (err) {
      console.warn('[AI] Groq failed, falling back to OpenRouter:', err instanceof Error ? err.message : String(err));
    }
  }

  // 2. Try OpenRouter (Fallback)
  if (process.env.OPENROUTER_API_KEY) {
    return await fetchWithTimeout(OPENROUTER_URL, process.env.OPENROUTER_API_KEY, OPENROUTER_MODEL, messages);
  }

  throw new Error('No AI provider API keys configured (GROQ_API_KEY or OPENROUTER_API_KEY)');
}

/**
 * Shared fetch logic for OpenAI-compatible endpoints.
 */
async function fetchWithTimeout(url: string, key: string, model: string, messages: Message[]): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        // OpenRouter specific headers (ignored by Groq)
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Git for Prompts',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1, // Keep it deterministic for tests
      }),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json() as AIResponse;
    return data.choices[0].message.content;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') throw new Error(`AI request timed out after ${AI_TIMEOUT_MS}ms`);
      throw error;
    }
    throw new Error(String(error));
  }
}

/**
 * Runs a prompt against a user input.
 */
export async function runPromptAgainstInput(
  promptContent: string,
  userInput: string
): Promise<string> {
  const messages: Message[] = [
    { role: 'system', content: promptContent },
    { role: 'user', content: userInput },
  ];

  return await callAI(messages);
}

/**
 * Evaluates whether the output satisfies the expected criteria.
 */
export async function evaluateOutput(
  actualOutput: string,
  expectedCriteria: string
): Promise<{ passed: boolean; reason: string }> {
  const evaluationPrompt = `
You are a strict test evaluator for AI prompt outputs.

Actual output from the AI:
"""
${actualOutput}
"""

Evaluation criteria:
"""
${expectedCriteria}
"""

Does the actual output satisfy the criteria?
Respond ONLY with valid JSON in this exact format, no markdown, no explanation:
{"passed": true, "reason": "Brief reason why it passed or failed"}
  `.trim();

  const messages: Message[] = [{ role: 'user', content: evaluationPrompt }];
  const response = await callAI(messages);

  try {
    const parsed = extractJson(response) as { passed: boolean; reason: string };
    if (typeof parsed.passed !== 'boolean') throw new TypeError('Invalid shape');
    return parsed;
  } catch {
    return { passed: false, reason: 'Evaluator returned an invalid response format' };
  }
}

/**
 * Runs a single test case end-to-end.
 */
export async function runSingleTestCase(
  promptContent: string,
  testCase: { inputText: string; expectedCriteria: string }
): Promise<{ passed: boolean; actualOutput: string; reason: string }> {
  try {
    const actualOutput = await runPromptAgainstInput(promptContent, testCase.inputText);
    const evaluation = await evaluateOutput(actualOutput, testCase.expectedCriteria);

    return {
      passed: evaluation.passed,
      actualOutput,
      reason: evaluation.reason,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      passed: false,
      actualOutput: '',
      reason: `AI Error: ${message}`,
    };
  }
}

export { MAX_CONCURRENT_TESTS };
