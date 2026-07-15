/**
 * Unit tests for prompt variable utilities.
 *
 * These functions are pure — no DB, no network, no auth.
 * Fast feedback loop for the extraction and interpolation logic.
 */

import { extractVariables, interpolateVariables } from '@/lib/variables';

// ─── extractVariables ────────────────────────────────────────────────────────

describe('extractVariables', () => {
  it('returns empty array when no variables present', () => {
    expect(extractVariables('Hello world')).toEqual([]);
  });

  it('extracts a single variable', () => {
    expect(extractVariables('Hello {{name}}')).toEqual(['name']);
  });

  it('extracts multiple variables in order of first appearance', () => {
    expect(extractVariables('Hi {{name}}, your role is {{role}}')).toEqual(['name', 'role']);
  });

  it('deduplicates repeated variables', () => {
    expect(extractVariables('{{name}} and {{name}} again')).toEqual(['name']);
  });

  it('handles variable names with underscores and numbers', () => {
    expect(extractVariables('{{user_name}} {{product_2}}')).toEqual(['user_name', 'product_2']);
  });

  it('ignores single-brace syntax (not a variable)', () => {
    expect(extractVariables('{name}')).toEqual([]);
  });

  it('ignores variables starting with a digit (invalid identifier)', () => {
    expect(extractVariables('{{1bad}}')).toEqual([]);
  });

  it('ignores variables starting with a hyphen', () => {
    expect(extractVariables('{{-bad}}')).toEqual([]);
  });

  it('handles empty string', () => {
    expect(extractVariables('')).toEqual([]);
  });

  it('handles multiline prompt content', () => {
    const content = `You are a helpful assistant.
Your name is {{assistant_name}}.
Today you are helping {{user_name}} with {{topic}}.`;
    expect(extractVariables(content)).toEqual(['assistant_name', 'user_name', 'topic']);
  });

  it('handles variable at the very start of content', () => {
    expect(extractVariables('{{greeting}} world')).toEqual(['greeting']);
  });

  it('handles variable at the very end of content', () => {
    expect(extractVariables('Hello {{name}}')).toEqual(['name']);
  });
});

// ─── interpolateVariables ────────────────────────────────────────────────────

describe('interpolateVariables', () => {
  it('interpolates a single variable', () => {
    expect(interpolateVariables('Hello {{name}}', { name: 'Alice' })).toBe('Hello Alice');
  });

  it('interpolates multiple variables', () => {
    expect(
      interpolateVariables('Hi {{name}}, your role is {{role}}', { name: 'Bob', role: 'admin' })
    ).toBe('Hi Bob, your role is admin');
  });

  it('leaves missing variables in place (safe degradation)', () => {
    expect(interpolateVariables('Hello {{name}} {{surname}}', { name: 'Alice' })).toBe(
      'Hello Alice {{surname}}'
    );
  });

  it('replaces all occurrences of the same variable', () => {
    expect(interpolateVariables('{{x}} and {{x}}', { x: 'foo' })).toBe('foo and foo');
  });

  it('returns original string when no variables match', () => {
    const content = 'Hello world';
    expect(interpolateVariables(content, { name: 'Alice' })).toBe(content);
  });

  it('handles empty values map', () => {
    expect(interpolateVariables('Hello {{name}}', {})).toBe('Hello {{name}}');
  });

  it('handles empty content', () => {
    expect(interpolateVariables('', { name: 'Alice' })).toBe('');
  });

  it('handles values with special regex characters safely', () => {
    // Values containing $, (, ), etc. should be treated as literal strings
    const result = interpolateVariables('Price: {{price}}', { price: '$100 (USD)' });
    expect(result).toBe('Price: $100 (USD)');
  });
});
