'use client';

import type { PromptBundle } from '@gfp/core';

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
    <div className="p-6 flex flex-col gap-6 font-sans bg-bg-card" style={{ minHeight }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl font-mono text-xs">
        {/* Provider */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-provider" className="text-xs font-mono font-bold text-zinc-300">
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
            className="border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 bg-bg-page font-mono outline-none focus:border-zinc-600 cursor-pointer"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value} className="bg-bg-card text-zinc-100">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-model" className="text-xs font-mono font-bold text-zinc-300">
            Model Name
          </label>
          <input
            id="bundle-model"
            type="text"
            value={bundle.modelConfig.model}
            onChange={(e) => onUpdateModelConfig('model', e.target.value)}
            list="bundle-model-suggestions"
            placeholder="e.g. llama-3.3-70b-versatile"
            className="border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-100 bg-bg-page outline-none focus:border-zinc-600"
          />
          <datalist id="bundle-model-suggestions">
            {currentModels.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>

        {/* Temperature */}
        <div className="flex flex-col gap-2 font-sans">
          <label htmlFor="bundle-temperature" className="text-xs font-mono font-bold text-zinc-300 flex items-center justify-between">
            <span>Temperature</span>
            <span className="font-mono text-blue-300 font-bold">{bundle.modelConfig.temperature ?? 0.7}</span>
          </label>
          <input
            id="bundle-temperature"
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={bundle.modelConfig.temperature ?? 0.7}
            onChange={(e) => onUpdateModelConfig('temperature', parseFloat(e.target.value))}
            className="w-full accent-blue-500 bg-bg-page cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
            <span>0 · Deterministic</span>
            <span>2 · Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label htmlFor="bundle-max-tokens" className="text-xs font-mono font-bold text-zinc-300">
            Max Output Tokens
          </label>
          <input
            id="bundle-max-tokens"
            type="number"
            min="1"
            max="128000"
            step="256"
            value={bundle.modelConfig.maxTokens ?? 1024}
            onChange={(e) => onUpdateModelConfig('maxTokens', parseInt(e.target.value, 10))}
            className="border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-100 bg-bg-page outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-bg-page border border-zinc-800 font-mono text-xs text-zinc-300 max-w-xl flex items-center gap-3">
        <span className="text-zinc-500">Config Header:</span>
        <span className="font-bold text-blue-300">{bundle.modelConfig.provider}/{bundle.modelConfig.model}</span>
        <span className="text-zinc-400">· temp={bundle.modelConfig.temperature ?? 0.7}</span>
        <span className="text-zinc-400">· max_tokens={bundle.modelConfig.maxTokens ?? 1024}</span>
      </div>
    </div>
  );
}
