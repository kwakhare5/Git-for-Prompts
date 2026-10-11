import { describe, it, expect } from 'vitest';
import {
  extractVariables,
  extractBundleVariables,
  interpolateVariables,
  interpolateBundle,
} from '../variables';
import type { PromptBundle } from '../bundle';

describe('@gfp/core Variables Engine', () => {
  describe('extractVariables', () => {
    it('returns empty array when no variables present', () => {
      expect(extractVariables('Hello world')).toEqual([]);
    });

    it('extracts unique variable placeholders from strings', () => {
      const text = 'Hello {{name}}, your account tier is {{tier}}. Welcome {{name}}!';
      const vars = extractVariables(text);
      expect(vars).toEqual(['name', 'tier']);
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
  });

  describe('extractBundleVariables', () => {
    it('extracts variables from both systemPrompt and userTemplate in a PromptBundle', () => {
      const bundle: PromptBundle = {
        systemPrompt: 'System context for role: {{role}} in department: {{dept}}',
        userTemplate: 'Evaluate user {{username}} with context {{context}} and {{role}}',
        modelConfig: {
          provider: 'groq',
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
        },
      };

      const vars = extractBundleVariables(bundle);
      expect(vars).toEqual(['role', 'dept', 'username', 'context']);
    });
  });

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
      const result = interpolateVariables('Price: {{price}}', { price: '$100 (USD)' });
      expect(result).toBe('Price: $100 (USD)');
    });
  });

  describe('interpolateBundle', () => {
    it('interpolates a PromptBundle returning a clean new bundle without mutating original', () => {
      const originalBundle: PromptBundle = {
        systemPrompt: 'Act as {{persona}}',
        userTemplate: 'Help with {{task}}',
        modelConfig: {
          provider: 'groq',
          model: 'llama-3.3-70b-versatile',
          temperature: 0.5,
        },
      };

      const interpolated = interpolateBundle(originalBundle, {
        persona: 'senior architect',
        task: 'code audit',
      });

      expect(interpolated.systemPrompt).toBe('Act as senior architect');
      expect(interpolated.userTemplate).toBe('Help with code audit');
      expect(originalBundle.systemPrompt).toBe('Act as {{persona}}');
    });
  });
});
