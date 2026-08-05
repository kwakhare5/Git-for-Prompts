'use client';

/**
 * BundleEditor — tabbed editor for V2 PromptBundle format.
 *
 * Tabs:
 *   Prompt      — system prompt + user template in Monaco
 *   Model       — provider, model, temperature, max_tokens
 *   Variables   — read-only list of detected {{var}} placeholders
 *
 * Validates the bundle against @gfp/core's Zod schema on every save attempt.
 * Falls back gracefully if a field is empty.
 */

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { validateBundle, extractBundleVariables } from '@gfp/core';
import type { PromptBundle } from '@gfp/core';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-zinc-950 text-sm text-zinc-600 font-mono"
      style={{ minHeight: '300px' }}
    >
      Loading editor…
    </div>
  ),
});

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'prompt' | 'model' | 'variables';

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

export interface BundleEditorProps {
  /** Initial bundle — null means "start fresh" */
  initialBundle: PromptBundle | null;
  /** Called when the user clicks Save with a valid bundle */
  onSave: (bundle: PromptBundle, commitMessage: string) => void;
  /** Called when the user clicks Cancel */
  onCancel: () => void;
  /** Pending state from parent */
  isPending?: boolean;
  height?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDefault(): PromptBundle {
  return {
    systemPrompt: '',
    userTemplate: '',
    modelConfig: {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 1024,
    },
    tools: [],
    responseFormat: { type: 'text' },
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BundleEditor({
  initialBundle,
  onSave,
  onCancel,
  isPending = false,
  height = '340px',
}: BundleEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('prompt');
  const [bundle, setBundle] = useState<PromptBundle>(() => initialBundle ?? makeDefault());
  const [commitMessage, setCommitMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const detectedVariables = useMemo(() => extractBundleVariables(bundle), [bundle]);

  const updateModelConfig = useCallback(
    <K extends keyof PromptBundle['modelConfig']>(
      key: K,
      value: PromptBundle['modelConfig'][K]
    ) => {
      setBundle((prev) => ({
        ...prev,
        modelConfig: { ...prev.modelConfig, [key]: value },
      }));
    },
    []
  );

  function handleSave() {
    setValidationError(null);
    try {
      const validated = validateBundle(bundle);
      onSave(validated, commitMessage.trim());
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Invalid bundle');
    }
  }

  const currentModels = DEFAULT_MODELS[bundle.modelConfig.provider] ?? [];

  return (
    <div className="flex flex-col gap-2">
      {/* Shell */}
      <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">

        {/* Tab bar + controls */}
        <div className="flex items-center gap-0 bg-zinc-900 border-b border-zinc-800 px-4">
          {/* Tabs */}
          <div className="flex items-center gap-0 flex-1">
            {(['prompt', 'model', 'variables'] as Tab[]).map((tab) => (
              <button
                key={tab}
                id={`bundle-editor-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative px-3 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-zinc-200 text-zinc-100'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                )}
              >
                {tab}
                {tab === 'variables' && detectedVariables.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-900 text-violet-300 text-[9px] font-mono">
                    {detectedVariables.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Commit + save */}
          <div className="flex items-center gap-2 py-1.5">
            <input
              id="bundle-editor-commit-message"
              type="text"
              placeholder='What changed? (e.g. "Fixed tone")'
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              maxLength={500}
              className="w-56 bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
            />
            <button
              id="bundle-editor-save-btn"
              onClick={handleSave}
              disabled={isPending}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-3 py-1 rounded transition-all disabled:opacity-30 flex items-center gap-1.5"
            >
              {isPending && (
                <span className="w-3 h-3 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
              )}
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={onCancel}
              disabled={isPending}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-1"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── Tab: Prompt ── */}
        {activeTab === 'prompt' && (
          <div className="flex flex-col divide-y divide-zinc-800/60">
            {/* System prompt */}
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">System Prompt</span>
                <span className="text-[10px] text-zinc-700">· Sets AI personality & instructions</span>
              </div>
              <div role="region" aria-label="System prompt editor">
                <MonacoEditor
                  height={height}
                  language="plaintext"
                  theme={GFP_THEME_NAME}
                  beforeMount={registerGfpTheme}
                  value={bundle.systemPrompt ?? ''}
                  onChange={(val) =>
                    setBundle((prev) => ({ ...prev, systemPrompt: val ?? '' }))
                  }
                  options={{
                    minimap: { enabled: false },
                    ...GFP_LINE_NUMBER_OPTIONS,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
                    fontSize: 13,
                    lineHeight: 22,
                    padding: { top: 12, bottom: 12 },
                    renderLineHighlight: 'line',
                    scrollbar: { vertical: 'auto', horizontal: 'auto' },
                    overviewRulerLanes: 0,
                    glyphMargin: false,
                    folding: false,
                    cursorBlinking: 'smooth',
                  }}
                />
              </div>
            </div>

            {/* User template */}
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">User Template</span>
                <span className="text-[10px] text-zinc-700">· Use {'{{variable}}'} placeholders</span>
              </div>
              <div role="region" aria-label="User template editor">
                <MonacoEditor
                  height={height}
                  language="plaintext"
                  theme={GFP_THEME_NAME}
                  beforeMount={registerGfpTheme}
                  value={bundle.userTemplate ?? ''}
                  onChange={(val) =>
                    setBundle((prev) => ({ ...prev, userTemplate: val ?? '' }))
                  }
                  options={{
                    minimap: { enabled: false },
                    ...GFP_LINE_NUMBER_OPTIONS,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
                    fontSize: 13,
                    lineHeight: 22,
                    padding: { top: 12, bottom: 12 },
                    renderLineHighlight: 'line',
                    scrollbar: { vertical: 'auto', horizontal: 'auto' },
                    overviewRulerLanes: 0,
                    glyphMargin: false,
                    folding: false,
                    cursorBlinking: 'smooth',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Model Config ── */}
        {activeTab === 'model' && (
          <div className="p-6 flex flex-col gap-5" style={{ minHeight: parseInt(height) * 2 + 'px' }}>
            <div className="grid grid-cols-2 gap-4 max-w-lg">

              {/* Provider */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bundle-provider" className="text-xs font-medium text-zinc-400">
                  Provider
                </label>
                <select
                  id="bundle-provider"
                  value={bundle.modelConfig.provider}
                  onChange={(e) => {
                    const provider = e.target.value;
                    updateModelConfig('provider', provider);
                    // reset model to first in list
                    const models = DEFAULT_MODELS[provider] ?? [];
                    if (models.length > 0) updateModelConfig('model', models[0]);
                  }}
                  className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bundle-model" className="text-xs font-medium text-zinc-400">
                  Model
                </label>
                <input
                  id="bundle-model"
                  type="text"
                  value={bundle.modelConfig.model}
                  onChange={(e) => updateModelConfig('model', e.target.value)}
                  list="bundle-model-suggestions"
                  placeholder="e.g. gpt-4o"
                  className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
                <datalist id="bundle-model-suggestions">
                  {currentModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              {/* Temperature */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bundle-temperature" className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                  Temperature
                  <span className="font-mono text-zinc-500">{bundle.modelConfig.temperature ?? 0.7}</span>
                </label>
                <input
                  id="bundle-temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={bundle.modelConfig.temperature ?? 0.7}
                  onChange={(e) => updateModelConfig('temperature', parseFloat(e.target.value))}
                  className="w-full accent-zinc-300"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                  <span>0 · precise</span>
                  <span>2 · creative</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bundle-max-tokens" className="text-xs font-medium text-zinc-400">
                  Max Tokens
                </label>
                <input
                  id="bundle-max-tokens"
                  type="number"
                  min="1"
                  max="128000"
                  step="256"
                  value={bundle.modelConfig.maxTokens ?? 1024}
                  onChange={(e) => updateModelConfig('maxTokens', parseInt(e.target.value, 10))}
                  className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 max-w-lg font-mono text-xs text-zinc-500">
              <span className="text-zinc-400">{bundle.modelConfig.provider}/</span>
              <span className="text-zinc-200">{bundle.modelConfig.model}</span>
              <span className="ml-3 text-zinc-600">temp={bundle.modelConfig.temperature ?? 0.7}</span>
              <span className="ml-2 text-zinc-600">max_tokens={bundle.modelConfig.maxTokens ?? 1024}</span>
            </div>
          </div>
        )}

        {/* ── Tab: Variables ── */}
        {activeTab === 'variables' && (
          <div className="p-6" style={{ minHeight: parseInt(height) * 2 + 'px' }}>
            {detectedVariables.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-3xl font-mono text-zinc-700 mb-3">{'{{}}'}</span>
                <p className="text-sm text-zinc-500">No variables detected.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Use <code className="font-mono bg-zinc-800 px-1 rounded">{'{{variable_name}}'}</code> in your prompt templates.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-w-md">
                <p className="text-xs text-zinc-500">
                  {detectedVariables.length} variable{detectedVariables.length !== 1 ? 's' : ''} detected across system prompt + user template.
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedVariables.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-950 border border-violet-800 text-xs font-mono text-violet-300"
                    >
                      <span className="opacity-40">{'{{'}
                      </span>
                      {v}
                      <span className="opacity-40">{'}}'}</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  Pass values via API: <code className="font-mono bg-zinc-800 px-1 rounded text-[11px]">?variables[name]=value</code>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation error */}
      {validationError && (
        <p role="alert" className="text-xs text-red-400 px-1">
          {validationError}
        </p>
      )}
    </div>
  );
}
