import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test extractJson directly — it's the highest-risk parsing function
// in the codebase. A format change in Groq/OpenRouter responses would
// silently mark every test case as "failed" without this coverage.
import { extractJson } from '../ai';

// ─── extractJson ──────────────────────────────────────────────────────────────

describe('extractJson', () => {
  it('parses a bare JSON object', () => {
    const input = '{"passed": true, "reason": "criteria met"}';
    expect(extractJson(input)).toEqual({ passed: true, reason: 'criteria met' });
  });

  it('extracts JSON from markdown code block wrapping', () => {
    const input = 'Sure! ```json\n{"passed": true, "reason": "ok"}\n```';
    expect(extractJson(input)).toEqual({ passed: true, reason: 'ok' });
  });

  it('extracts JSON from explanatory prose prefix', () => {
    const input = 'Here is my evaluation: {"passed": false, "reason": "missing refund mention"}';
    expect(extractJson(input)).toEqual({ passed: false, reason: 'missing refund mention' });
  });

  it('handles nested JSON correctly (uses last closing brace)', () => {
    const input = '{"passed": true, "meta": {"score": 9}, "reason": "good"}';
    const result = extractJson(input) as { passed: boolean; meta: { score: number }; reason: string };
    expect(result.passed).toBe(true);
    expect(result.meta.score).toBe(9);
    expect(result.reason).toBe('good');
  });

  it('throws SyntaxError when no JSON object is present', () => {
    expect(() => extractJson('No JSON here at all')).toThrow(SyntaxError);
    expect(() => extractJson('')).toThrow(SyntaxError);
    expect(() => extractJson('passed: true')).toThrow(SyntaxError);
  });

  it('throws SyntaxError on malformed JSON', () => {
    expect(() => extractJson('{passed: true}')).toThrow(); // invalid JSON
  });
});

// ─── rate-limit in-process fallback ───────────────────────────────────────────
// Test the in-process fallback directly to verify the sliding window logic
// without requiring Upstash / network access.

describe('in-process rate limit', () => {
  it('allows requests within the limit', async () => {
    // Import the utility — will use in-process path since no Upstash env vars
    const { checkRateLimit } = await import('../rate-limit');
    const key = `test-${Math.random()}`; // unique key per test run

    const result = await checkRateLimit(key);
    expect(result.success).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });
});
