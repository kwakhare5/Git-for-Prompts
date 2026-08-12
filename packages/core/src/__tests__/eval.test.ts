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

  it('preserves legacy execution semantics when no system prompt is configured', async () => {
    const provider: AIProvider = { chat: vi.fn().mockResolvedValue('answer') };
    const bundle = createBundleFromLegacy('Answer using this context.');

    await runSingleTestCase(provider, bundle, {
      inputText: 'What is 2+2?',
      expectedCriteria: 'Must say 4',
    });

    expect(vi.mocked(provider.chat).mock.calls[0][0]).toEqual([
      { role: 'system', content: 'Answer using this context.' },
      { role: 'user', content: 'What is 2+2?' },
    ]);
  });

  it('preserves the system prompt and appends the template to the user message', async () => {
    const provider: AIProvider = { chat: vi.fn().mockResolvedValue('answer') };
    const bundle = {
      ...createBundleFromLegacy('Use concise language.'),
      systemPrompt: 'You are a technical assistant.',
    };

    await runSingleTestCase(provider, bundle, {
      inputText: 'Explain HTTP.',
      expectedCriteria: 'Must mention requests and responses',
    });

    expect(vi.mocked(provider.chat).mock.calls[0][0]).toEqual([
      { role: 'system', content: 'You are a technical assistant.' },
      { role: 'user', content: 'Use concise language.\n\nExplain HTTP.' },
    ]);
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
