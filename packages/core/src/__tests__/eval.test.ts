import { describe, expect, it, vi } from 'vitest';
import { createBundleFromLegacy } from '../bundle.js';
import { extractJson, runEvaluations, runSingleTestCase, runWithConcurrency } from '../eval.js';
import type { AIProvider } from '../eval.js';

describe('@gfp/core evaluation engine', () => {
  it('extracts JSON containing braces inside strings', () => {
    expect(extractJson('Result: {"passed":true,"reason":"value {x}"}')).toEqual({
      passed: true,
      reason: 'value {x}',
    });
  });

  it('rejects incomplete JSON', () => {
    expect(() => extractJson('{"passed":true')).toThrow(SyntaxError);
  });

  it('rejects invalid concurrency limits', async () => {
    await expect(runWithConcurrency([], 0)).rejects.toThrow(RangeError);
    await expect(runWithConcurrency([], 1.5)).rejects.toThrow(RangeError);
  });

  it('preserves task order while respecting concurrency', async () => {
    let active = 0;
    let peak = 0;
    const tasks = Array.from({ length: 8 }, (_, index) => async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, index % 2 ? 2 : 1));
      active -= 1;
      return index;
    });

    await expect(runWithConcurrency(tasks, 2)).resolves.toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(peak).toBeLessThanOrEqual(2);
  });

  it('builds a user message without duplicating the prompt as a system message', async () => {
    const provider: AIProvider = { chat: vi.fn().mockResolvedValue('answer') };
    const bundle = createBundleFromLegacy('Answer using this context.');

    await runSingleTestCase(provider, bundle, {
      inputText: 'What is 2+2?',
      expectedCriteria: 'Must say 4',
    });

    expect(vi.mocked(provider.chat).mock.calls[0][0]).toEqual([
      { role: 'user', content: 'Answer using this context.\n\nWhat is 2+2?' },
    ]);
  });

  it('passes JSON mode for structured response formats', async () => {
    const provider: AIProvider = {
      chat: vi
        .fn()
        .mockResolvedValueOnce('{"answer":4}')
        .mockResolvedValueOnce('{"passed":true,"reason":"Correct"}'),
    };
    const bundle = {
      ...createBundleFromLegacy('Return JSON.'),
      responseFormat: { type: 'json_object' as const },
    };

    await runSingleTestCase(provider, bundle, {
      inputText: '2+2?',
      expectedCriteria: 'Must contain 4',
    });

    expect(vi.mocked(provider.chat).mock.calls[0][1]?.jsonMode).toBe(true);
  });

  it('returns per-case failures without aborting the whole evaluation', async () => {
    const provider: AIProvider = {
      chat: vi
        .fn()
        .mockRejectedValueOnce(new Error('provider unavailable'))
        .mockResolvedValueOnce('answer')
        .mockResolvedValueOnce('{"passed":true,"reason":"ok"}'),
    };

    const results = await runEvaluations(
      provider,
      createBundleFromLegacy('Answer.'),
      [
        { id: '1', name: 'first', inputText: 'a', expectedCriteria: 'ok' },
        { id: '2', name: 'second', inputText: 'b', expectedCriteria: 'ok' },
      ],
      1,
    );

    expect(results[0]).toEqual({ ok: false, testCaseId: '1', message: 'provider unavailable' });
    expect(results[1]).toEqual({
      ok: true,
      testCaseId: '2',
      result: { passed: true, actualOutput: 'answer', reason: 'ok' },
    });
  });
});
