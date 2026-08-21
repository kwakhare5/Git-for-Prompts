import { describe, it, expect, vi } from 'vitest';
import {
  extractJson,
  runWithConcurrency,
  runSingleTestCase,
  runEvaluations,
  type AIProvider,
} from '../eval';
import type { PromptBundle } from '../bundle';

describe('@gfp/core Eval Engine', () => {
  describe('extractJson helper', () => {
    it('extracts clean JSON objects from markdown fences', () => {
      const input = 'Here is the response:\n```json\n{"passed": true, "reason": "All checks passed"}\n```';
      const parsed = extractJson(input) as { passed: boolean; reason: string };
      expect(parsed.passed).toBe(true);
      expect(parsed.reason).toBe('All checks passed');
    });

    it('extracts nested JSON with strings containing braces', () => {
      const input = 'Result: {"passed": false, "reason": "Output contained {invalid} format"} and extra text';
      const parsed = extractJson(input) as { passed: boolean; reason: string };
      expect(parsed.passed).toBe(false);
      expect(parsed.reason).toBe('Output contained {invalid} format');
    });

    it('throws SyntaxError when no JSON object is present', () => {
      expect(() => extractJson('Just plain text without JSON')).toThrow(SyntaxError);
    });
  });

  describe('runWithConcurrency', () => {
    it('executes tasks with bounded concurrency limit', async () => {
      let activeCount = 0;
      let maxActive = 0;

      const tasks = Array.from({ length: 12 }, (_, i) => async () => {
        activeCount++;
        maxActive = Math.max(maxActive, activeCount);
        await new Promise((resolve) => setTimeout(resolve, 10));
        activeCount--;
        return i * 2;
      });

      const results = await runWithConcurrency(tasks, 3);
      expect(results).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);
      expect(maxActive).toBeLessThanOrEqual(3);
    });
  });

  describe('runEvaluations with mock AIProvider', () => {
    const mockProvider: AIProvider = {
      chat: vi.fn(async (messages, config) => {
        if (config?.jsonMode) {
          return JSON.stringify({ passed: true, reason: 'Satisfied criteria' });
        }
        return 'Mock LLM generation output for prompt';
      }),
    };

    const bundle: PromptBundle = {
      systemPrompt: 'You are a test evaluator subject.',
      userTemplate: 'Echo input {{input}}',
      modelConfig: {
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
      },
    };

    it('runs single test case execution and evaluation', async () => {
      const result = await runSingleTestCase(mockProvider, bundle, {
        inputText: 'Hello World',
        expectedCriteria: 'Must contain greeting',
      });

      expect(result.passed).toBe(true);
      expect(result.actualOutput).toBe('Mock LLM generation output for prompt');
      expect(result.reason).toBe('Satisfied criteria');
    });

    it('runs batch evaluations across multiple test cases', async () => {
      const cases = [
        { id: 'c1', name: 'check-1', inputText: 'input 1', expectedCriteria: 'valid 1' },
        { id: 'c2', name: 'check-2', inputText: 'input 2', expectedCriteria: 'valid 2' },
      ];

      const results = await runEvaluations(mockProvider, bundle, cases);
      expect(results).toHaveLength(2);
      expect(results[0].ok).toBe(true);
      if (results[0].ok) {
        expect(results[0].result.passed).toBe(true);
      }
    });
  });
});
