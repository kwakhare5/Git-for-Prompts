/**
 * Eval — provider-agnostic evaluation runner for @gfp/core.
 *
 * The core eval engine does NOT know about Groq, OpenRouter, or any
 * specific AI provider. Consumers inject an AIProvider implementation.
 *
 * Cloud (Next.js): injects Groq/OpenRouter via src/lib/ai.ts
 * Local (CLI): injects user's own API key provider
 *
 * This module extracts the orchestration logic from src/lib/test-runner.ts
 * while leaving the DB-specific persistence in the cloud app.
 */

import { z } from 'zod/v4';
import type { PromptBundle } from './bundle.js';

// ─── AI Provider interface ───────────────────────────────────────────────────

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

/**
 * Minimal AI provider contract.
 * Any OpenAI-compatible API can satisfy this interface.
 */
export interface AIProvider {
  /**
   * Send messages to an AI model and get a text response.
   * @param messages - Chat messages to send
   * @param config - Optional overrides (model, temperature, json mode)
   */
  chat(
    messages: ChatMessage[],
    config?: {
      model?: string;
      temperature?: number;
      jsonMode?: boolean;
    }
  ): Promise<string>;
}

// ─── Eval types ──────────────────────────────────────────────────────────────

export type TestCaseInput = {
  id: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
};

export type EvalAttempt =
  | { ok: true; testCaseId: string; result: { passed: boolean; actualOutput: string; reason: string } }
  | { ok: false; testCaseId: string; message: string };

// ─── JSON extraction (portable, no deps) ─────────────────────────────────────

/**
 * Robustly extracts the first complete JSON object from a string.
 * Depth-balanced, string/escape-aware. Handles markdown fences, prose.
 */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  if (start === -1) {
    throw new SyntaxError('No JSON object found in response');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        return JSON.parse(candidate);
      }
    }
  }

  throw new SyntaxError('No JSON object found in response');
}

// ─── Evaluation result schema ────────────────────────────────────────────────

const evaluationResultSchema = z.object({
  passed: z.boolean(),
  reason: z.string(),
});

// ─── Concurrency limiter ─────────────────────────────────────────────────────

const DEFAULT_CONCURRENCY = 10;

export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number = DEFAULT_CONCURRENCY
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

// ─── Core evaluation functions ───────────────────────────────────────────────

/**
 * Run a prompt (or bundle) against a single user input.
 * Uses the bundle's systemPrompt if available, otherwise treats content as system message.
 */
async function executePrompt(
  provider: AIProvider,
  bundle: PromptBundle,
  userInput: string
): Promise<string> {
  const messages: ChatMessage[] = [];

  if (bundle.systemPrompt) {
    messages.push({ role: 'system', content: bundle.systemPrompt });
  }

  // Use userTemplate as system context if no systemPrompt, otherwise as user message
  if (!bundle.systemPrompt) {
    messages.push({ role: 'system', content: bundle.userTemplate });
    messages.push({ role: 'user', content: userInput });
  } else {
    // Combine userTemplate with actual user input
    const fullUserMessage = bundle.userTemplate
      ? `${bundle.userTemplate}\n\n${userInput}`
      : userInput;
    messages.push({ role: 'user', content: fullUserMessage });
  }

  return provider.chat(messages, {
    model: bundle.modelConfig.model,
    temperature: bundle.modelConfig.temperature,
  });
}

/**
 * Evaluate whether an output satisfies expected criteria.
 * Uses the provider as an LLM-as-a-judge.
 */
async function evaluateOutput(
  provider: AIProvider,
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

  const response = await provider.chat(
    [{ role: 'user', content: evaluationPrompt }],
    { jsonMode: true }
  );

  try {
    const candidate = extractJson(response);
    const parsed = evaluationResultSchema.safeParse(candidate);
    if (!parsed.success) {
      return { passed: false, reason: 'Evaluator returned an invalid response format' };
    }
    return parsed.data;
  } catch {
    return { passed: false, reason: 'Evaluator returned an invalid response format' };
  }
}

/**
 * Run a single test case end-to-end: execute → evaluate.
 * Deliberately does NOT catch — infrastructure failures must propagate.
 */
export async function runSingleTestCase(
  provider: AIProvider,
  bundle: PromptBundle,
  testCase: { inputText: string; expectedCriteria: string }
): Promise<{ passed: boolean; actualOutput: string; reason: string }> {
  const actualOutput = await executePrompt(provider, bundle, testCase.inputText);
  const evaluation = await evaluateOutput(provider, actualOutput, testCase.expectedCriteria);

  return {
    passed: evaluation.passed,
    actualOutput,
    reason: evaluation.reason,
  };
}

/**
 * Run AI evaluation for every test case against a prompt bundle.
 * Concurrency-limited. No DB writes — pure AI orchestration.
 *
 * This is the provider-agnostic equivalent of src/lib/test-runner.ts runEvaluations.
 */
export async function runEvaluations(
  provider: AIProvider,
  bundle: PromptBundle,
  cases: TestCaseInput[],
  concurrency: number = DEFAULT_CONCURRENCY
): Promise<EvalAttempt[]> {
  return runWithConcurrency(
    cases.map((tc) => async (): Promise<EvalAttempt> => {
      try {
        const result = await runSingleTestCase(provider, bundle, tc);
        return { ok: true, testCaseId: tc.id, result };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, testCaseId: tc.id, message };
      }
    }),
    concurrency
  );
}
