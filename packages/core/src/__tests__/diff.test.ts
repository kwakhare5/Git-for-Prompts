import { describe, it, expect } from 'vitest';
import { diffBundles, diffVersions } from '../diff';
import type { PromptBundle } from '../bundle';

describe('@gfp/core Diff Engine', () => {
  const baseBundle: PromptBundle = {
    systemPrompt: 'You are a customer support assistant for Acme Corp.',
    userTemplate: 'Help customer {{name}} with {{issue}}',
    modelConfig: {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 1024,
    },
    tools: [],
    responseFormat: { type: 'text' },
  };

  it('detects no changes when two bundles are identical', () => {
    const diff = diffBundles(baseBundle, { ...baseBundle });
    expect(diff.hasChanges).toBe(false);
    expect(diff.summary).toBe('No changes');
    expect(diff.fields.every((f) => f.type === 'unchanged')).toBe(true);
  });

  it('detects systemPrompt and modelConfig temperature modifications', () => {
    const updatedBundle: PromptBundle = {
      ...baseBundle,
      systemPrompt: 'You are an empathetic customer support assistant for Acme Corp.',
      modelConfig: {
        ...baseBundle.modelConfig,
        temperature: 0.2,
      },
    };

    const diff = diffBundles(baseBundle, updatedBundle);
    expect(diff.hasChanges).toBe(true);
    expect(diff.summary).toContain('systemPrompt');
    expect(diff.summary).toContain('modelConfig');

    const systemPromptDiff = diff.fields.find((f) => f.field === 'systemPrompt');
    expect(systemPromptDiff?.type).toBe('modified');
    expect(systemPromptDiff?.before).toBe(baseBundle.systemPrompt);
    expect(systemPromptDiff?.after).toBe(updatedBundle.systemPrompt);

    const modelConfigDiff = diff.fields.find((f) => f.field === 'modelConfig');
    expect(modelConfigDiff?.type).toBe('modified');
  });

  it('detects added responseFormat schema and tools', () => {
    const updatedBundle: PromptBundle = {
      ...baseBundle,
      tools: [
        {
          name: 'lookupOrder',
          description: 'Lookup order details by order ID',
          parameters: {
            type: 'object',
            properties: { orderId: { type: 'string' } },
            required: ['orderId'],
          },
        },
      ],
      responseFormat: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: { status: { type: 'string' } },
        },
      },
    };

    const diff = diffBundles(baseBundle, updatedBundle);
    expect(diff.hasChanges).toBe(true);

    const toolsDiff = diff.fields.find((f) => f.field === 'tools');
    expect(toolsDiff?.type).toBe('modified');

    const responseFormatDiff = diff.fields.find((f) => f.field === 'responseFormat');
    expect(responseFormatDiff?.type).toBe('modified');
  });

  it('falls back to content text diff when comparing versions without bundle JSON', () => {
    const diff = diffVersions(
      { content: 'Original prompt text', bundle: null },
      { content: 'Modified prompt text', bundle: null }
    );

    expect(diff.hasChanges).toBe(true);
    expect(diff.fields).toHaveLength(1);
    expect(diff.fields[0].field).toBe('content');
    expect(diff.fields[0].type).toBe('modified');
  });
});
