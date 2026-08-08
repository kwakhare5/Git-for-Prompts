'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { GFP_THEME_NAME, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';
import type { PromptBundle } from '@gfp/core';

// Monaco DiffEditor must be dynamically imported — relies on browser APIs not available during SSR.
// Extracting the named export via .then() is required because next/dynamic expects a default export.
const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => ({ default: mod.DiffEditor })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center bg-zinc-950 text-sm text-zinc-600 font-mono"
        style={{ height: '500px' }}
      >
        Loading diff…
      </div>
    ),
  }
);

// Minimal interface for the diff editor instance — avoids importing heavy monaco-editor types.
interface StandaloneDiffEditor {
  getLineChanges(): Array<{
    originalStartLineNumber: number;
    originalEndLineNumber: number;
    modifiedStartLineNumber: number;
    modifiedEndLineNumber: number;
  }> | null;
  onDidUpdateDiff(listener: () => void): { dispose(): void };
}

interface DiffStats {
  added: number;
  removed: number;
}

export interface DiffViewerProps {
  originalContent: string;  // left panel — "from" version
  modifiedContent: string;  // right panel — "to" version
  originalLabel: string;    // e.g. "v1 · Initial draft"
  modifiedLabel: string;    // e.g. "v3 · Made tone friendlier"
  /** V2: when both versions have bundles, show structural comparison header */
  originalBundle?: PromptBundle | null;
  modifiedBundle?: PromptBundle | null;
  height?: string;
}

export function DiffViewer({
  originalContent,
  modifiedContent,
  originalLabel,
  modifiedLabel,
  originalBundle = null,
  modifiedBundle = null,
  height = '600px',
}: DiffViewerProps) {
  const [stats, setStats] = useState<DiffStats | null>(null);

  // Show bundle comparison when both versions have bundles
  const showBundleHeader = originalBundle && modifiedBundle;
  const modelChanged =
    showBundleHeader &&
    (originalBundle.modelConfig.provider !== modifiedBundle.modelConfig.provider ||
      originalBundle.modelConfig.model !== modifiedBundle.modelConfig.model);
  const tempChanged =
    showBundleHeader &&
    originalBundle.modelConfig.temperature !== modifiedBundle.modelConfig.temperature;

  // Called once Monaco DiffEditor is mounted.
  // Registers an onDidUpdateDiff listener that uses Monaco's own diff engine
  // to compute the accurate line-level stats — no external diff library needed.
  const handleMount = useCallback((editor: StandaloneDiffEditor) => {
    function computeStats() {
      const changes = editor.getLineChanges();
      if (!changes) return;

      let added = 0;
      let removed = 0;

      for (const change of changes) {
        // modifiedEndLineNumber < modifiedStartLineNumber means a pure deletion (no additions in that hunk)
        if (change.modifiedEndLineNumber >= change.modifiedStartLineNumber) {
          added += change.modifiedEndLineNumber - change.modifiedStartLineNumber + 1;
        }
        // originalEndLineNumber < originalStartLineNumber means a pure insertion (no removals in that hunk)
        if (change.originalEndLineNumber >= change.originalStartLineNumber) {
          removed += change.originalEndLineNumber - change.originalStartLineNumber + 1;
        }
      }

      setStats({ added, removed });
    }

    editor.onDidUpdateDiff(computeStats);
    // Monaco fires onDidUpdateDiff asynchronously after initial render — call once immediately
    // in case the diff is already computed by the time we mount.
    computeStats();
  }, []);

  const noChanges = stats !== null && stats.added === 0 && stats.removed === 0;

  return (
    <div className="flex flex-col font-sans">
      {/* Bundle structural diff header — only when both versions are V2 */}
      {showBundleHeader && (
        <div className="flex items-start gap-4 rounded-t-lg border border-b-0 border-border bg-muted/40 px-4 py-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold shrink-0 mt-0.5">Bundle</span>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            {modelChanged ? (
              <span>
                <span className="text-destructive">{originalBundle.modelConfig.provider}/{originalBundle.modelConfig.model}</span>
                <span className="text-muted-foreground mx-1.5">→</span>
                <span className="text-emerald-400">{modifiedBundle.modelConfig.provider}/{modifiedBundle.modelConfig.model}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{originalBundle.modelConfig.provider}/{originalBundle.modelConfig.model}</span>
            )}
            {tempChanged && (
              <span className="text-muted-foreground">
                temp <span className="text-destructive">{originalBundle.modelConfig.temperature}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="text-emerald-400">{modifiedBundle.modelConfig.temperature}</span>
              </span>
            )}
            {!modelChanged && !tempChanged && (
              <span className="text-muted-foreground">Model config unchanged</span>
            )}
          </div>
        </div>
      )}
      {/* Stats bar — only shown once Monaco has computed the diff */}
      <div className={`flex items-center gap-4 border border-b-0 border-border bg-muted/30 px-4 py-2 min-h-[36px] ${showBundleHeader ? '' : 'rounded-t-lg'}`}>
        {stats === null ? (
          <span className="text-xs font-mono text-muted-foreground animate-pulse">Computing diff…</span>
        ) : noChanges ? (
          <span className="text-xs font-mono text-muted-foreground">Identical — no changes between these versions</span>
        ) : (
          <>
            <span className="text-xs font-mono text-emerald-400 tabular-nums">
              +{stats.added} {stats.added === 1 ? 'line' : 'lines'} added
            </span>
            <span className="text-xs text-muted-foreground" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-destructive tabular-nums">
              −{stats.removed} {stats.removed === 1 ? 'line' : 'lines'} removed
            </span>
          </>
        )}
      </div>

      {/* Column labels — version number + commit message above each panel */}
      <div className="grid grid-cols-2 divide-x divide-border border border-b-0 border-border">
        <div className="px-4 py-2 bg-muted/50">
          <span className="text-xs font-mono text-muted-foreground truncate block" title={originalLabel}>
            {originalLabel}
          </span>
        </div>
        <div className="px-4 py-2 bg-muted/50">
          <span className="text-xs font-mono text-muted-foreground truncate block" title={modifiedLabel}>
            {modifiedLabel}
          </span>
        </div>
      </div>

      {/* Monaco DiffEditor */}
      <div className="rounded-b-lg overflow-hidden border border-border">
        <MonacoDiffEditor
          height={height}
          language="plaintext"
          theme={GFP_THEME_NAME}
          original={originalContent}
          modified={modifiedContent}
          onMount={(editor) => handleMount(editor as unknown as StandaloneDiffEditor)}
          options={{
            readOnly: true,
            renderSideBySide: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 13,
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
            glyphMargin: false,
            folding: false,
            ...GFP_LINE_NUMBER_OPTIONS,
            enableSplitViewResizing: true,
            renderIndicators: true,
            ignoreTrimWhitespace: false,
          }}
        />
      </div>
    </div>
  );
}
