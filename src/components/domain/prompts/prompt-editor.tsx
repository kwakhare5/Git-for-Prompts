'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createVersion } from '@/lib/actions/versions';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';
import { extractVariables } from '@/lib/variables';
import { createBundleFromLegacy } from '@gfp/core';
import { BundleEditor } from './bundle-editor';
import type { PromptBundle } from '@gfp/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
      <div className="flex flex-col gap-2 font-sans">
        <div className="rounded-xl overflow-hidden border border-border flex flex-col bg-card shadow-2xl font-sans">
          <div className="flex items-center gap-3 bg-muted/40 border-b border-border px-4 py-2.5 font-sans">
            <div className="flex flex-col min-w-0 mr-auto font-sans">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">prompt.txt</span>
            </div>
            <div className="flex items-center gap-2 font-sans">
              <Button
                variant="ghost"
                size="sm"
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
                className="text-xs text-muted-foreground hover:text-foreground font-sans cursor-pointer"
                aria-label="Copy prompt to clipboard"
              >
                {copied ? (
                  <>
                    <span className="text-emerald-400">✓</span>
                    <span className="text-emerald-400 font-sans">Copied!</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">⧉</span>
                    Copy
                  </>
                )}
              </Button>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">read-only</Badge>
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
      <div className="flex flex-col gap-2 font-sans">
        {/* Mode toggle */}
        <div className="flex items-center gap-2 px-1 font-sans">
          <span className="text-xs text-muted-foreground font-sans">Editor mode:</span>
          <Button
            id="editor-mode-v1"
            variant="ghost"
            size="xs"
            onClick={() => setMode('v1')}
            className="text-xs text-muted-foreground hover:text-foreground font-sans cursor-pointer"
          >
            V1 · Text
          </Button>
          <Button
            id="editor-mode-v2"
            variant="secondary"
            size="xs"
            onClick={() => setMode('v2')}
            className="text-xs font-sans cursor-pointer font-bold"
          >
            V2 · Bundle
          </Button>
          <span className="text-xs text-muted-foreground font-sans">· V2 stores system prompt + model config + variables</span>
        </div>

        <BundleEditor
          initialBundle={initialBundle ?? defaultBundleForUpgrade}
          onSave={handleSaveV2}
          onCancel={() => router.back()}
          isPending={isPending}
          height={height}
        />

        {error && (
          <p role="alert" className="text-xs text-destructive px-1 font-mono">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 font-sans">

      {/* Editor shell */}
      <div className="rounded-xl overflow-hidden border border-border flex flex-col bg-card shadow-2xl font-sans">
        {/* Header bar */}
        <div className="flex items-center gap-3 bg-muted/40 border-b border-border px-4 py-2.5 font-sans">
          <div className="flex flex-col min-w-0 mr-auto font-sans">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">prompt.txt</span>
            {isDirty && (
              <span className="text-xs font-medium text-amber-400 animate-pulse font-sans">Unsaved Changes</span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xl font-sans">
            <Input
              id="commit-message"
              type="text"
              placeholder='What did you change? (e.g. "Improved tone")'
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              maxLength={500}
              className="flex-1 h-8 text-xs bg-background border-border text-foreground placeholder:text-muted-foreground font-sans"
            />
            <div className="flex items-center gap-2 shrink-0 font-sans">
              <Button
                id="save-version-btn"
                onClick={handleSaveV1}
                disabled={isPending || !content.trim()}
                variant="default"
                size="sm"
                className="font-sans cursor-pointer font-bold shadow-sm"
              >
                {isPending ? 'Saving…' : 'Save'}
              </Button>
              <Button
                onClick={() => router.back()}
                disabled={isPending}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground font-sans cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Monaco editor */}
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

      {/* Footer — Stats & Variables */}
      <div className="flex flex-col gap-1.5 px-1 font-sans">
        <div className="flex items-center justify-between font-sans">
          <div className="text-xs text-muted-foreground font-mono tabular-nums uppercase tracking-tight font-semibold">
            {charCount.toLocaleString()} chars · ≈{tokenEstimate.toLocaleString()} tokens
          </div>
          {error && (
            <p role="alert" className="text-xs text-destructive font-medium font-mono">{error}</p>
          )}
        </div>

        {/* Variable chips */}
        {detectedVariables.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 font-sans">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider shrink-0 font-semibold">Variables:</span>
            {detectedVariables.map((v) => (
              <Badge
                key={v}
                variant="outline"
                className="font-mono text-xs text-sky-400 border-sky-500/20 bg-sky-500/10"
              >
                {'{{'}{v}{'}}'}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
