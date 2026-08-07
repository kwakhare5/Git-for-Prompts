'use client';

import dynamic from 'next/dynamic';
import type { PromptBundle } from '@gfp/core';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';

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

interface BundlePromptTabProps {
  bundle: PromptBundle;
  onChange: (updater: (prev: PromptBundle) => PromptBundle) => void;
  height?: string;
}

export function BundlePromptTab({ bundle, onChange, height = '340px' }: BundlePromptTabProps) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* System prompt */}
      <div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">System Prompt</span>
          <span className="text-xs text-muted-foreground font-sans">· Sets AI personality & instructions</span>
        </div>
        <div role="region" aria-label="System prompt editor">
          <MonacoEditor
            height={height}
            language="plaintext"
            theme={GFP_THEME_NAME}
            beforeMount={registerGfpTheme}
            value={bundle.systemPrompt ?? ''}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, systemPrompt: val ?? '' }))
            }
            options={{
              minimap: { enabled: false },
              ...GFP_LINE_NUMBER_OPTIONS,
              scrollBeyondLastLine: false,
              scrollbar: { vertical: 'auto', horizontal: 'auto', alwaysConsumeMouseWheel: false },
              wordWrap: 'on',
              fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
              fontSize: 13,
              lineHeight: 22,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'line',
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
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">User Template</span>
          <span className="text-xs text-muted-foreground font-sans">· Use {'{{variable}}'} placeholders</span>
        </div>
        <div role="region" aria-label="User template editor">
          <MonacoEditor
            height={height}
            language="plaintext"
            theme={GFP_THEME_NAME}
            beforeMount={registerGfpTheme}
            value={bundle.userTemplate ?? ''}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, userTemplate: val ?? '' }))
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
  );
}
