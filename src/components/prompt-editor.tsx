'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createVersion } from '@/lib/actions/versions';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';
import { extractVariables } from '@/lib/variables';
import { createBundleFromLegacy } from '@gfp/core';
import { BundleEditor } from '@/components/bundle-editor';
import type { PromptBundle } from '@gfp/core';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Monaco must be dynamically imported — it relies on browser APIs not available during SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    // #18: use height prop via CSS var rather than hardcoded 500px
    <div
      className="flex items-center justify-center rounded-b-lg bg-zinc-950 text-sm text-zinc-600 font-mono"
      style={{ minHeight: '200px' }}
    >
      Loading editor…
    </div>
  ),
});

interface PromptEditorProps {
  promptId: string;
  initialContent: string;
  /** V2: initial bundle (null = this is a V1 prompt) */
  initialBundle?: PromptBundle | null;
  readOnly?: boolean;
  height?: string;
}

type EditorMode = 'v1' | 'v2';

export function PromptEditor({
  promptId,
  initialContent,
  initialBundle = null,
  readOnly = false,
  height = '500px',
}: PromptEditorProps) {
  const router = useRouter();
  const [mode, setMode] = useState<EditorMode>(initialBundle ? 'v2' : 'v1');
  const [content, setContent] = useState(initialContent);
  const [commitMessage, setCommitMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Track whether the editor has unsaved changes
  const isDirty = !readOnly && content !== initialContent;

  // Warn the user before closing/refreshing the tab with unsaved changes
  useEffect(() => {
    if (readOnly) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, readOnly]);

  const charCount = content.length;
  const tokenEstimate = Math.ceil(charCount / 4);
  const detectedVariables = useMemo(() => extractVariables(content), [content]);

  // ── V1 Save ─────────────────────────────────────────────────────────────────
  function handleSaveV1() {
    setError(null);
    startTransition(async () => {
      try {
        await createVersion({
          promptId,
          content,
          commitMessage: commitMessage.trim() || undefined,
        });
        router.push(`/dashboard/prompts/${promptId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save version');
      }
    });
  }

  // ── V2 Save ─────────────────────────────────────────────────────────────────
  function handleSaveV2(bundle: PromptBundle, msg: string) {
    setError(null);
    startTransition(async () => {
      try {
        await createVersion({
          promptId,
          bundle,
          commitMessage: msg || undefined,
        });
        router.push(`/dashboard/prompts/${promptId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save version');
      }
    });
  }

  // ── Mode switch: V1 → V2: pre-fill bundle from current content ─────────────
  const defaultBundleForUpgrade = useMemo<PromptBundle>(
    () => createBundleFromLegacy(content),
    [content]
  );

  // Theme registration is centralized in src/lib/monaco-theme.ts
  const handleEditorWillMount = registerGfpTheme;

  // ── Read-only mode ───────────────────────────────────────────────────────────
  if (readOnly) {
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-lg overflow-hidden border border-zinc-800 flex flex-col bg-zinc-950 shadow-2xl">
          <div className="flex items-center gap-3 bg-zinc-900 border-b border-zinc-800 px-4 py-2.5">
            <div className="flex flex-col min-w-0 mr-auto">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">prompt.txt</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(content);
                    setCopied(true);
                    toast.success('Prompt copied to clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    const textarea = document.createElement('textarea');
                    textarea.value = content;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    setCopied(true);
                    toast.success('Prompt copied to clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
                aria-label="Copy prompt to clipboard"
              >
                {copied ? (
                  <>
                    <span className="text-emerald-400">✓</span>
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">⧉</span>
                    Copy
                  </>
                )}
              </button>
              <span className="text-xs text-zinc-600 font-mono">read-only</span>
            </div>
          </div>
          <div role="region" aria-label="Prompt content (read-only)">
            <MonacoEditor
              height={height}
              language="plaintext"
              theme={GFP_THEME_NAME}
              beforeMount={handleEditorWillMount}
              value={content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                ...GFP_LINE_NUMBER_OPTIONS,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
                fontSize: 13,
                lineHeight: 22,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: 'none',
                scrollbar: { vertical: 'auto', horizontal: 'auto', alwaysConsumeMouseWheel: false },
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                glyphMargin: false,
                folding: false,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── V2 mode — delegate entirely to BundleEditor ───────────────────────────
  if (mode === 'v2') {
    return (
      <div className="flex flex-col gap-2">
        {/* Mode toggle */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-zinc-500">Editor mode:</span>
          <button
            id="editor-mode-v1"
            onClick={() => setMode('v1')}
            className={cn(
              'text-xs px-2 py-0.5 rounded transition-colors',
              /* in V2 block, V1 is inactive */ 'text-zinc-600 hover:text-zinc-400'
            )}
          >
            V1 · Text
          </button>
          <button
            id="editor-mode-v2"
            onClick={() => setMode('v2')}
            className="text-xs px-2 py-0.5 rounded transition-colors bg-zinc-700 text-zinc-200"
          >
            V2 · Bundle
          </button>
          <span className="text-[10px] text-zinc-700">· V2 stores system prompt + model config + variables</span>
        </div>

        <BundleEditor
          initialBundle={initialBundle ?? defaultBundleForUpgrade}
          onSave={handleSaveV2}
          onCancel={() => router.back()}
          isPending={isPending}
          height={height}
        />

        {error && (
          <p role="alert" className="text-xs text-red-400 px-1">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">

      {/* Editor shell */}
      <div className="rounded-lg overflow-hidden border border-zinc-800 flex flex-col bg-zinc-950 shadow-2xl">
        {/* Header bar — now contains controls for easy access */}
        <div className="flex items-center gap-3 bg-zinc-900 border-b border-zinc-800 px-4 py-2.5">
          <div className="flex flex-col min-w-0 mr-auto">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">prompt.txt</span>
            {isDirty && (
              <span className="text-[10px] font-medium text-amber-500 animate-pulse">Unsaved Changes</span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <input
              id="commit-message"
              type="text"
              placeholder='What did you change? (e.g. "Improved tone")'
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              maxLength={500}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="save-version-btn"
                onClick={handleSaveV1}
                disabled={isPending || !content.trim()}
                className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-3 py-1.5 rounded transition-all disabled:opacity-30 flex items-center gap-1.5"
              >
                {isPending ? (
                  <span className="w-3 h-3 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
                ) : null}
                {isPending ? 'Saving' : 'Save'}
              </button>
              <button
                onClick={() => router.back()}
                disabled={isPending}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* A3: labelled region so screen readers identify the Monaco editor */}
        <div role="region" aria-label="Prompt content editor">
          <MonacoEditor
            height={height}
            language="plaintext"
            theme={GFP_THEME_NAME}
            beforeMount={handleEditorWillMount}
            value={content}
            onChange={(val) => setContent(val ?? '')}
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
              scrollbar: { vertical: 'auto', horizontal: 'auto', alwaysConsumeMouseWheel: false },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              glyphMargin: false,
              folding: false,
              cursorBlinking: 'smooth',
            }}
          />
        </div>
        {/* closes editor shell */}
      </div>

      {/* Footer — Stats, Variables & Errors */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-zinc-500 font-mono tabular-nums uppercase tracking-tight">
            {charCount.toLocaleString()} chars · ≈{tokenEstimate.toLocaleString()} tokens
          </div>
          {error && (
            <p role="alert" className="text-[10px] text-red-400 font-medium">{error}</p>
          )}
        </div>

        {/* Variable chips — shown whenever {{var}} placeholders are detected */}
        {detectedVariables.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider shrink-0">Variables:</span>
            {detectedVariables.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-950 border border-violet-800 text-[10px] font-mono text-violet-300"
              >
                <span className="opacity-50">&#123;&#123;</span>{v}<span className="opacity-50">&#125;&#125;</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
