'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createVersion } from '@/lib/actions/versions';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';
import { extractVariables, createBundleFromLegacy } from '@gfp/core';
import { BundleEditor } from './bundle-editor';
import type { PromptBundle } from '@gfp/core';
import { toast } from 'sonner';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-b bg-gray-50 text-sm text-gray-500 font-mono"
      style={{ minHeight: '200px' }}
    >
      Loading editor…
    </div>
  ),
});

interface PromptEditorProps {
  promptId: string;
  initialContent: string;
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

  const isDirty = !readOnly && content !== initialContent;

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

  const defaultBundleForUpgrade = useMemo<PromptBundle>(
    () => createBundleFromLegacy(content),
    [content]
  );

  const handleEditorWillMount = registerGfpTheme;

  if (readOnly) {
    return (
      <div className="flex flex-col gap-2 font-sans">
        <div className="rounded-2xl overflow-hidden border border-zinc-800/90 flex flex-col bg-bg-card shadow-xl">
          <div className="flex items-center gap-3 bg-bg-page border-b border-zinc-800/90 px-4 py-2.5 text-xs font-mono">
            <span className="text-zinc-300 font-bold mr-auto">prompt.bundle</span>
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
                className="text-xs text-blue-300 hover:text-blue-200 font-mono font-bold cursor-pointer"
                aria-label="Copy prompt to clipboard"
              >
                {copied ? '✓ Copied' : 'Copy Text'}
              </button>
              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-bg-panel border border-zinc-800/60 px-2 py-0.5 rounded">read-only</span>
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

  if (mode === 'v2') {
    return (
      <div className="flex flex-col gap-2 font-sans">
        <div className="flex items-center gap-2 text-xs font-mono mb-1">
          <span className="text-zinc-400">Editor mode:</span>
          <button
            id="editor-mode-v1"
            onClick={() => setMode('v1')}
            className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Raw Text
          </button>
          <button
            id="editor-mode-v2"
            onClick={() => setMode('v2')}
            className="px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold rounded-lg cursor-pointer"
          >
            Bundle Editor
          </button>
        </div>

        <BundleEditor
          initialBundle={initialBundle ?? defaultBundleForUpgrade}
          onSave={handleSaveV2}
          onCancel={() => router.back()}
          isPending={isPending}
          height={height}
        />

        {error && (
          <p role="alert" className="text-xs text-rose-300 px-1 font-mono">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="rounded-2xl overflow-hidden border border-zinc-800/90 flex flex-col bg-bg-card shadow-xl">
        <div className="flex items-center gap-3 bg-bg-page border-b border-zinc-800/90 px-4 py-2.5">
          <div className="flex flex-col min-w-0 mr-auto font-mono">
            <span className="text-xs text-zinc-200 font-bold">prompt.bundle</span>
            {isDirty && (
              <span className="text-[10px] text-amber-300">Unsaved Changes</span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xl font-mono">
            <input
              id="commit-message"
              type="text"
              placeholder='Commit message (e.g. "Lowered temperature to 0.2")'
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              maxLength={500}
              className="flex-1 h-8 text-xs bg-bg-panel border border-zinc-800/60 rounded-lg px-3 text-zinc-100 placeholder:text-zinc-500 outline-none"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="save-version-btn"
                onClick={handleSaveV1}
                disabled={isPending || !content.trim()}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs active:scale-97 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? 'Saving…' : 'Save Version'}
              </button>
              <button
                onClick={() => router.back()}
                disabled={isPending}
                className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

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
      </div>

      <div className="flex flex-col gap-1.5 px-1 font-mono">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>{charCount.toLocaleString()} chars · ≈{tokenEstimate.toLocaleString()} tokens</span>
          {error && <p role="alert" className="text-xs text-rose-300 font-mono">{error}</p>}
        </div>

        {detectedVariables.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400 font-mono">Extracted Variables:</span>
            {detectedVariables.map((v) => (
              <span key={v} className="font-mono text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-lg font-bold">
                {'{{'}{v}{'}}'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
