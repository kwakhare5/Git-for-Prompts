import { describe, expect, it } from 'vitest';
import {
  createBundleFromLegacy,
  createEmptyBundle,
  extractContentFromBundle,
  safeParseBundleResult,
  validateBundle,
} from '../bundle.js';
import { diffBundles, diffVersions } from '../diff.js';

describe('@gfp/core bundle and diff engine', () => {
  it('creates a valid legacy bundle', () => {
    const bundle = createBundleFromLegacy('Hello {{name}}, welcome!');

    expect(bundle.userTemplate).toBe('Hello {{name}}, welcome!');
    expect(bundle.systemPrompt).toBeNull();
    expect(bundle.modelConfig.provider).toBe('groq');
    expect(extractContentFromBundle(bundle)).toBe(bundle.userTemplate);
  });

  it('creates a valid empty editor draft', () => {
    const bundle = createEmptyBundle();

    expect(bundle.userTemplate).toBe('');
    expect(safeParseBundleResult(bundle).success).toBe(true);
    expect(bundle.modelConfig).toMatchObject({ provider: 'openai', model: 'gpt-4o', temperature: 0.7 });
  });

  it('applies schema defaults and strips unknown fields', () => {
    const parsed = validateBundle({
      userTemplate: 'Summarize {{text}}',
      modelConfig: { provider: 'groq', model: 'llama', temperature: 0.2 },
      unexpected: 'removed',
    });

    expect(parsed.systemPrompt).toBeNull();
    expect(parsed.modelConfig.temperature).toBe(0.2);
    expect('unexpected' in parsed).toBe(false);
  });

  it('rejects invalid model configuration', () => {
    const result = safeParseBundleResult({
      userTemplate: 'Test prompt',
      modelConfig: { provider: '', model: '' },
    });

    expect(result.success).toBe(false);
  });

  it('detects identical bundles', () => {
    const diff = diffBundles(createBundleFromLegacy('Same text'), createBundleFromLegacy('Same text'));

    expect(diff.hasChanges).toBe(false);
    expect(diff.summary).toBe('No changes');
  });

  it('detects independent field changes', () => {
    const before = createBundleFromLegacy('Original text');
    const after = {
      ...before,
      userTemplate: 'Modified text',
      modelConfig: { ...before.modelConfig, temperature: 0.9 },
    };

    const diff = diffBundles(before, after);

    expect(diff.hasChanges).toBe(true);
    expect(diff.fields.find((field) => field.field === 'userTemplate')?.type).toBe('modified');
    expect(diff.fields.find((field) => field.field === 'modelConfig')?.type).toBe('modified');
    expect(diff.summary).toContain('2 field(s) changed');
  });

  it('falls back to content diff for V1 versions', () => {
    const diff = diffVersions(
      { content: 'V1 text', bundle: null },
      { content: 'V1 text modified', bundle: null },
    );

    expect(diff.hasChanges).toBe(true);
    expect(diff.summary).toBe('1 field(s) changed: content');
  });
});
