'use client';

import { useState, useMemo, useCallback } from 'react';
import { validateBundle, extractBundleVariables } from '@gfp/core';
import type { PromptBundle } from '@gfp/core';
import { BundlePromptTab } from './bundle-editor/bundle-prompt-tab';
import { BundleModelTab } from './bundle-editor/bundle-model-tab';
import { BundleVariablesTab } from './bundle-editor/bundle-variables-tab';

type Tab = 'prompt' | 'model' | 'variables';

export interface BundleEditorProps {
  initialBundle: PromptBundle | null;
  onSave: (bundle: PromptBundle, commitMessage: string) => void;
  onCancel: () => void;
  isPending?: boolean;
  height?: string;
}

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

  const tabMinHeight = parseInt(height) * 2 + 'px';

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="rounded-2xl border border-zinc-800/90 bg-bg-card shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-bg-page border-b border-zinc-800/90 px-4 py-2.5 gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            {(['prompt', 'model', 'variables'] as Tab[]).map((tab) => (
              <button
                key={tab}
                id={`bundle-editor-tab-${tab}`}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs capitalize rounded-xl font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-bg-panel'
                }`}
              >
                {tab}
                {tab === 'variables' && detectedVariables.length > 0 && (
                  <span className="ml-1.5 font-mono text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded-md">
                    {detectedVariables.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <input
              id="bundle-editor-commit-message"
              type="text"
              placeholder='Commit message (e.g. "Lowered temperature to 0.2")'
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              maxLength={500}
              className="flex-1 sm:w-64 h-8 text-xs bg-bg-panel border border-zinc-800/60 rounded-xl px-3 text-zinc-100 placeholder:text-zinc-500 outline-none"
            />
            <button
              id="bundle-editor-save-btn"
              onClick={handleSave}
              disabled={isPending}
              className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-xs active:scale-97 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Saving…' : 'Save Version'}
            </button>
            <button
              onClick={onCancel}
              disabled={isPending}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {activeTab === 'prompt' && (
          <BundlePromptTab bundle={bundle} onChange={setBundle} height={height} />
        )}
        {activeTab === 'model' && (
          <BundleModelTab bundle={bundle} onUpdateModelConfig={updateModelConfig} minHeight={tabMinHeight} />
        )}
        {activeTab === 'variables' && (
          <BundleVariablesTab detectedVariables={detectedVariables} minHeight={tabMinHeight} />
        )}
      </div>

      {validationError && (
        <p role="alert" className="text-xs text-rose-300 font-mono px-1">{validationError}</p>
      )}
    </div>
  );
}
