'use client';

import type { PromptBundle } from '@gfp/core';
import { Input } from '@/components/ui/input';

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'groq', label: 'Groq' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'ollama', label: 'Ollama (local)' },
] as const;

const DEFAULT_MODELS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  openrouter: ['meta-llama/llama-3.3-70b-instruct', 'google/gemini-flash-1.5', 'anthropic/claude-3.5-sonnet'],
  anthropic: ['claude-sonnet-4-5', 'claude-3-5-haiku-20241022', 'claude-opus-4-5'],
  ollama: ['llama3', 'mistral', 'phi3'],
};

interface BundleModelTabProps {
  bundle: PromptBundle;
  onUpdateModelConfig: <K extends keyof PromptBundle['modelConfig']>(
    key: K,
    value: PromptBundle['modelConfig'][K]
  ) => void;
  minHeight?: string;
}

export function BundleModelTab({ bundle, onUpdateModelConfig, minHeight = '680px' }: BundleModelTabProps) {
  const currentModels = DEFAULT_MODELS[bundle.modelConfig.provider] ?? [];

  return (
    <div className="p-6 flex flex-col gap-5 font-sans" style={{ minHeight }}>
      <div className="grid grid-cols-2 gap-4 max-w-lg font-sans">
        {/* Provider */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-provider" className="text-xs font-medium text-muted-foreground font-sans">
            Provider
          </label>
          <select
            id="bundle-provider"
            value={bundle.modelConfig.provider}
            onChange={(e) => {
              const provider = e.target.value;
              onUpdateModelConfig('provider', provider);
              const models = DEFAULT_MODELS[provider] ?? [];
              if (models.length > 0) onUpdateModelConfig('model', models[0]);
            }}
            className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring transition-colors font-mono cursor-pointer"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-model" className="text-xs font-medium text-muted-foreground font-sans">
            Model
          </label>
          <Input
            id="bundle-model"
            type="text"
            value={bundle.modelConfig.model}
            onChange={(e) => onUpdateModelConfig('model', e.target.value)}
            list="bundle-model-suggestions"
            placeholder="e.g. gpt-4o"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
          />
          <datalist id="bundle-model-suggestions">
            {currentModels.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>

        {/* Temperature */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-temperature" className="text-xs font-medium text-muted-foreground flex items-center justify-between font-sans">
            Temperature
            <span className="font-mono text-foreground font-semibold">{bundle.modelConfig.temperature ?? 0.7}</span>
          </label>
          <input
            id="bundle-temperature"
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={bundle.modelConfig.temperature ?? 0.7}
            onChange={(e) => onUpdateModelConfig('temperature', parseFloat(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono font-semibold">
            <span>0 · precise</span>
            <span>2 · creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-max-tokens" className="text-xs font-medium text-muted-foreground font-sans">
            Max Tokens
          </label>
          <Input
            id="bundle-max-tokens"
            type="number"
            min="1"
            max="128000"
            step="256"
            value={bundle.modelConfig.maxTokens ?? 1024}
            onChange={(e) => onUpdateModelConfig('maxTokens', parseInt(e.target.value, 10))}
            className="bg-background border-border text-foreground font-mono text-sm"
          />
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-muted/40 border border-border max-w-lg font-mono text-xs text-muted-foreground">
        <span className="text-muted-foreground font-semibold">{bundle.modelConfig.provider}/</span>
        <span className="text-foreground font-bold">{bundle.modelConfig.model}</span>
        <span className="ml-3 text-muted-foreground">temp={bundle.modelConfig.temperature ?? 0.7}</span>
        <span className="ml-2 text-muted-foreground">max_tokens={bundle.modelConfig.maxTokens ?? 1024}</span>
      </div>
    </div>
  );
}
