import { z } from 'zod/v4';
import type { PromptBundle } from './bundle.js';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface AIProvider {
  chat(
    messages: ChatMessage[],
    config?: {
      model?: string;
      temperature?: number;
      jsonMode?: boolean;
    }
  ): Promise<string>;
}

export type TestCaseInput = {
  id: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
};

export type EvalAttempt =
  | { ok: true; testCaseId: string; result: { passed: boolean; actualOutput: string; reason: string } }
  | { ok: false; testCaseId: string; message: string };

export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  if (start === -1) throw new SyntaxError('No JSON object found in response');

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return JSON.parse(text.slice(start, i + 1));
    }
  }

  throw new SyntaxError('No complete JSON object found in response');
}

const evaluationResultSchema = z.object({
  passed: z.boolean(),
  reason: z.string(),
});

const DEFAULT_CONCURRENCY = 10;

export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number = DEFAULT_CONCURRENCY
): Promise<T[]> {
  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new RangeError('Concurrency limit must be a positive safe integer');
  }
  if (tasks.length === 0) return [];

  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex++;
      if (index >= tasks.length) return;
      results[index] = await tasks[index]();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  );
  return results;
}

function buildMessages(bundle: PromptBundle, userInput: string): ChatMessage[] {
  const messages: ChatMessage[] = [];

  if (bundle.systemPrompt) {
    messages.push({ role: 'system', content: bundle.systemPrompt });
    messages.push({
      role: 'user',
      content: bundle.userTemplate ? `${bundle.userTemplate}\n\n${userInput}` : userInput,
    });
    return messages;
  }

  messages.push({ role: 'system', content: bundle.userTemplate });
  messages.push({ role: 'user', content: userInput });
  return messages;
}

async function executePrompt(
  provider: AIProvider,
  bundle: PromptBundle,
  userInput: string
): Promise<string> {
  return provider.chat(buildMessages(bundle, userInput), {
    model: bundle.modelConfig.model,
    temperature: bundle.modelConfig.temperature,
  });
}

async function evaluateOutput(
  provider: AIProvider,
  actualOutput: string,
  expectedCriteria: string
): Promise<{ passed: boolean; reason: string }> {
  const evaluationPrompt = [
    'You are a strict test evaluator for AI prompt outputs.',
    '',
    'Actual output from the AI:',
    '"""',
    actualOutput,
    '"""',
    '',
    'Evaluation criteria:',
    '"""',
    expectedCriteria,
    '"""',
    '',
    'Does the actual output satisfy the criteria?',
    'Respond ONLY with valid JSON in this exact format, no markdown, no explanation:',
    '{"passed": true, "reason": "Brief reason why it passed or failed"}',
  ].join('\n');

  const response = await provider.chat([{ role: 'user', content: evaluationPrompt }], {
    jsonMode: true,
  });

  try {
    const parsed = evaluationResultSchema.safeParse(extractJson(response));
    return parsed.success
      ? parsed.data
      : { passed: false, reason: 'Evaluator returned an invalid response format' };
  } catch {
    return { passed: false, reason: 'Evaluator returned an invalid response format' };
  }
}

export async function runSingleTestCase(
  provider: AIProvider,
  bundle: PromptBundle,
  testCase: { inputText: string; expectedCriteria: string }
): Promise<{ passed: boolean; actualOutput: string; reason: string }> {
  const actualOutput = await executePrompt(provider, bundle, testCase.inputText);
  const evaluation = await evaluateOutput(provider, actualOutput, testCase.expectedCriteria);
  return { passed: evaluation.passed, actualOutput, reason: evaluation.reason };
}

export async function runEvaluations(
  provider: AIProvider,
  bundle: PromptBundle,
  cases: TestCaseInput[],
  concurrency: number = DEFAULT_CONCURRENCY
): Promise<EvalAttempt[]> {
  return runWithConcurrency(
    cases.map((testCase) => async (): Promise<EvalAttempt> => {
      try {
        return {
          ok: true,
          testCaseId: testCase.id,
          result: await runSingleTestCase(provider, bundle, testCase),
        };
      } catch (error) {
        return {
          ok: false,
          testCaseId: testCase.id,
          message: error instanceof Error ? error.message : String(error),
        };
      }
    }),
    concurrency
  );
}

export async function runEvaluationsLegacy(
  provider: AIProvider,
  promptContent: string,
  cases: TestCaseInput[],
  concurrency: number = DEFAULT_CONCURRENCY
): Promise<EvalAttempt[]> {
  const { createBundleFromLegacy } = await import('./bundle.js');
  return runEvaluations(provider, createBundleFromLegacy(promptContent), cases, concurrency);
}
