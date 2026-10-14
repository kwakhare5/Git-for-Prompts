'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-2xl bg-bg-page text-xs text-zinc-400 font-mono skeleton border border-zinc-800/90"
      style={{ minHeight: '200px' }}
    >
      Loading editor…
    </div>
  ),
});

interface PromptReadOnlyViewerProps {
  content: string;
  height?: string;
}

export function PromptReadOnlyViewer({ content, height = '500px' }: PromptReadOnlyViewerProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
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
  }

  return (
    <div className="flex flex-col gap-2 font-sans">
      <div className="rounded-2xl overflow-hidden border border-zinc-800/90 flex flex-col bg-bg-card shadow-xl">
        <div className="flex items-center gap-3 bg-bg-page border-b border-zinc-800/90 px-4 py-2.5 text-xs font-mono">
          <span className="text-zinc-300 font-bold mr-auto">prompt.bundle</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-blue-300 hover:text-blue-200 font-mono font-bold tab-interactive cursor-pointer"
              aria-label="Copy prompt to clipboard"
            >
              {copied ? '✓ Copied' : 'Copy Text'}
            </button>
            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-bg-panel border border-zinc-800/60 px-2 py-0.5 rounded">
              read-only
            </span>
          </div>
        </div>
        <div role="region" aria-label="Prompt content (read-only)">
          <MonacoEditor
            height={height}
            language="plaintext"
            theme={GFP_THEME_NAME}
            beforeMount={registerGfpTheme}
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
