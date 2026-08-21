import { describe, it, expect } from 'vitest';
import {
  extractVariables,
  extractBundleVariables,
  interpolateVariables,
  interpolateBundle,
} from '../variables';
import type { PromptBundle } from '../bundle';

describe('@gfp/core Variables Engine', () => {
  it('extracts unique variable placeholders from strings', () => {
    const text = 'Hello {{name}}, your account tier is {{tier}}. Welcome {{name}}!';
    const vars = extractVariables(text);
    expect(vars).toEqual(['name', 'tier']);
  });

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

  it('interpolates variables and safely leaves missing variables untouched', () => {
    const text = 'Analyze {{target_repo}} with branch {{branch}} and rule {{rule_name}}';
    const result = interpolateVariables(text, {
      target_repo: 'kwakhare5/Git-for-Prompts',
      branch: 'main',
    });

    expect(result).toBe('Analyze kwakhare5/Git-for-Prompts with branch main and rule {{rule_name}}');
  });

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
