import { describe, it, expect } from 'vitest';
import { extractJson } from '../ai';

// ─── Original suite — must still pass unmodified ──────────────────────────
describe('extractJson (existing coverage)', () => {
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
    expect(() => extractJson('{passed: true}')).toThrow();
  });
});

// ─── New adversarial cases the OLD indexOf/lastIndexOf implementation
// silently mangled or corrupted. Each of these reproduces a realistic LLM
// response shape and pins the FIXED behavior.
describe('extractJson (adversarial cases exposing the old bug)', () => {
  it('ignores a brace that appears in trailing prose after the JSON', () => {
    // OLD BEHAVIOR: lastIndexOf('}') finds the '}' in "(see docs {here})",
    // producing "...criteria\"} extra text (see docs {here" -> JSON.parse throws,
    // and evaluateOutput silently degrades to a false negative on a passing test.
    const input = '{"passed": true, "reason": "met criteria"} (see docs {here})';
    expect(extractJson(input)).toEqual({ passed: true, reason: 'met criteria' });
  });

  it('ignores a curly-brace emoticon after the JSON', () => {
    const input = '{"passed": true, "reason": "all good"} :}';
    expect(extractJson(input)).toEqual({ passed: true, reason: 'all good' });
  });

  it('is not confused by a brace character inside a string value', () => {
    const input = '{"passed": false, "reason": "output used a { placeholder } instead of real data"}';
    const result = extractJson(input) as { passed: boolean; reason: string };
    expect(result.passed).toBe(false);
    expect(result.reason).toBe('output used a { placeholder } instead of real data');
  });

  it('is not confused by an escaped quote adjacent to a brace inside a string', () => {
    const input = String.raw`{"passed": true, "reason": "the output said \"done}\" verbatim"}`;
    const result = extractJson(input) as { passed: boolean; reason: string };
    expect(result.passed).toBe(true);
    expect(result.reason).toBe('the output said "done}" verbatim');
  });

  it('takes the first complete object when two JSON objects appear in one reply', () => {
    // OLD BEHAVIOR: lastIndexOf('}') would span across both objects, merging
    // them into one invalid slice and throwing.
    const input = '{"passed": true, "reason": "first"} then here is another one {"passed": false, "reason": "second"}';
    expect(extractJson(input)).toEqual({ passed: true, reason: 'first' });
  });
});
