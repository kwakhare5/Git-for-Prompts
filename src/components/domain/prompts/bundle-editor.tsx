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
import { validateBundle, extractBundleVariables } from '@gfp/core';
import type { PromptBundle } from '@gfp/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BundlePromptTab } from './bundle-editor/bundle-prompt-tab';
import { BundleModelTab } from './bundle-editor/bundle-model-tab';
import { BundleVariablesTab } from './bundle-editor/bundle-variables-tab';

type Tab = 'prompt' | 'model' | 'variables';

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
    <div className="flex flex-col gap-2 font-sans">
      {/* Shell */}
      <div className="rounded-xl overflow-hidden border border-border bg-card shadow-2xl font-sans">
        {/* Tab bar + controls */}
        <div className="flex items-center gap-0 bg-muted/40 border-b border-border px-4 font-sans">
          {/* Tabs */}
          <div className="flex items-center gap-1 flex-1 font-sans py-1.5">
            {(['prompt', 'model', 'variables'] as Tab[]).map((tab) => (
              <Button
                key={tab}
                id={`bundle-editor-tab-${tab}`}
                type="button"
                variant={activeTab === tab ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="h-8 px-3 text-xs font-semibold capitalize font-sans cursor-pointer"
              >
                {tab}
                {tab === 'variables' && detectedVariables.length > 0 && (
                  <Badge variant="outline" className="ml-1.5 font-mono text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/10">
                    {detectedVariables.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Commit + save */}
          <div className="flex items-center gap-2 py-2 font-sans">
            <Input
              id="bundle-editor-commit-message"
              type="text"
              placeholder='What changed? (e.g. "Fixed tone")'
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              maxLength={500}
              className="w-56 h-8 text-xs bg-background border-border text-foreground placeholder:text-muted-foreground font-sans"
            />
            <Button
              id="bundle-editor-save-btn"
              onClick={handleSave}
              disabled={isPending}
              variant="default"
              size="sm"
              className="font-sans cursor-pointer font-bold shadow-sm"
            >
              {isPending ? 'Saving…' : 'Save'}
            </Button>
            <Button
              onClick={onCancel}
              disabled={isPending}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground font-sans cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Tab content rendering */}
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

      {/* Validation error */}
      {validationError && (
        <p role="alert" className="text-xs text-red-400 px-1">
          {validationError}
        </p>
      )}
    </div>
  );
}
