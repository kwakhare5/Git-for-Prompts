import { describe, it, expect } from 'vitest';
import {
  validateBundle,
  safeParseBundleResult,
  createBundleFromLegacy,
  createEmptyBundle,
  extractContentFromBundle,
} from '../bundle.js';
import { diffBundles, diffVersions } from '../diff.js';

describe('@gfp/core — bundle & diff engine', () => {
  describe('bundle validation & factory helpers', () => {
    it('creates a valid bundle from legacy text content', () => {
      const bundle = createBundleFromLegacy('Hello {{name}}, welcome!');
      expect(bundle.userTemplate).toBe('Hello {{name}}, welcome!');
      expect(bundle.systemPrompt).toBeNull();
      expect(bundle.modelConfig.provider).toBe('groq');
      expect(bundle.modelConfig.model).toBe('llama-3.3-70b-versatile');
      expect(extractContentFromBundle(bundle)).toBe('Hello {{name}}, welcome!');
    });

    it('creates an empty bundle with defaults', () => {
      const bundle = createEmptyBundle();
      expect(bundle.userTemplate).toBe('');
      expect(bundle.modelConfig.provider).toBe('openai');
      expect(bundle.modelConfig.model).toBe('gpt-4o');
    });

    it('validates a complete PromptBundle payload', () => {
      const raw = {
        systemPrompt: 'You are a helpful assistant.',
        userTemplate: 'Summarize {{text}}',
        modelConfig: {
          provider: 'groq',
          model: 'llama-3.3-70b-versatile',
          temperature: 0.2,
        },
      };

      const parsed = validateBundle(raw);
      expect(parsed.systemPrompt).toBe('You are a helpful assistant.');
      expect(parsed.userTemplate).toBe('Summarize {{text}}');
      expect(parsed.modelConfig.temperature).toBe(0.2);
    });

    it('fails validation gracefully on invalid modelConfig', () => {
      const invalid = {
        userTemplate: 'Test prompt',
        modelConfig: {
          provider: '',
          model: '',
        },
      };

      const result = safeParseBundleResult(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('structural diff engine', () => {
    it('detects no changes for identical bundles', () => {
      const a = createBundleFromLegacy('Same text');
      const b = createBundleFromLegacy('Same text');

      const diff = diffBundles(a, b);
      expect(diff.hasChanges).toBe(false);
      expect(diff.summary).toBe('No changes');
    });

    it('detects changes when userTemplate or modelConfig changes', () => {
      const a = createBundleFromLegacy('Original text');
      const b = {
        ...a,
        userTemplate: 'Modified text',
        modelConfig: {
          ...a.modelConfig,
          temperature: 0.9,
        },
      };

      const diff = diffBundles(a, b);
      expect(diff.hasChanges).toBe(true);
      expect(diff.fields.find((f) => f.field === 'userTemplate')?.type).toBe('modified');
      expect(diff.fields.find((f) => f.field === 'modelConfig')?.type).toBe('modified');
      expect(diff.summary).toContain('2 field(s) changed');
    });

    it('falls back to text-only diff when version lacks a bundle (V1 migration)', () => {
      const v1 = { content: 'V1 text', bundle: null };
      const v2 = { content: 'V1 text modified', bundle: null };

      const diff = diffVersions(v1, v2);
      expect(diff.hasChanges).toBe(true);
      expect(diff.summary).toBe('1 field(s) changed: content');
    });
  });
});
