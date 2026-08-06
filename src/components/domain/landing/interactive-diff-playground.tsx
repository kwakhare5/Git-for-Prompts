'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import '@/lib/monaco';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';

const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => ({ default: mod.DiffEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[340px] bg-card text-xs text-muted-foreground font-mono">
        Loading interactive diff editor…
      </div>
    ),
  }
);

const SAMPLE_V1 = `System: You are an AI support assistant for Acme SaaS.
User query: {{issue}}

Rules:
- Be polite and brief.
- Provide direct answers.`;

const SAMPLE_V2 = `System: You are a senior technical support specialist for Acme SaaS.
User query: {{issue}}

Rules:
- Be polite, empathetic, and ultra-precise.
- Offer immediate step-by-step resolution paths.
- Sign off with: "Acme Engineering Support Team".`;

export function InteractiveDiffPlayground() {
  const [temperature, setTemperature] = useState(0.7);
  const [provider, setProvider] = useState('groq');

  const PROVIDER_MODELS: Record<string, string> = {
    groq: 'llama-3.3-70b-versatile',
    openai: 'gpt-4o',
    anthropic: 'claude-3-5-sonnet',
  };
  const model = PROVIDER_MODELS[provider] ?? 'llama-3.3-70b-versatile';

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-10 font-sans">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3.5 py-1 text-xs font-mono text-muted-foreground mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live Playground
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight font-sans">
          Try the Diff Playground.
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal font-sans">
          Compare prompt templates side-by-side. Inspect line-level changes and model configuration diffs in real time.
        </p>
      </div>

      {/* Playground Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden font-sans"
      >
        {/* Model Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border-b border-border bg-muted/40 font-mono text-xs">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Model Config</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">provider:</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-card border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:border-ring"
              >
                <option value="groq">Groq</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">model:</span>
              <span className="text-foreground bg-card border border-border px-2 py-1 rounded">
                {model}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">temperature:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-24 accent-primary cursor-pointer"
            />
            <span className="text-foreground w-8">{temperature}</span>
          </div>
        </div>

        {/* Column Labels */}
        <div className="grid grid-cols-2 divide-x divide-border border-b border-border text-xs font-mono bg-muted/20">
          <div className="px-4 py-2 text-muted-foreground flex items-center justify-between">
            <span>v1 · Initial Draft</span>
            <span className="text-xs text-muted-foreground font-mono">HEAD~1</span>
          </div>
          <div className="px-4 py-2 text-foreground flex items-center justify-between">
            <span>v2 · Improved tone & team sign-off</span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">HEAD</span>
          </div>
        </div>

        {/* Monaco Diff Editor */}
        <div className="h-[340px] pointer-events-none">
          <MonacoDiffEditor
            height="340px"
            language="plaintext"
            theme={GFP_THEME_NAME}
            original={SAMPLE_V1}
            modified={SAMPLE_V2}
            beforeMount={registerGfpTheme}
            options={{
              readOnly: true,
              renderSideBySide: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 12,
              lineHeight: 20,
              padding: { top: 12, bottom: 12 },
              renderOverviewRuler: false,
              overviewRulerLanes: 0,
              overviewRulerBorder: false,
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
                handleMouseWheel: false,
                alwaysConsumeMouseWheel: false,
              },
              glyphMargin: false,
              folding: false,
              ...GFP_LINE_NUMBER_OPTIONS,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
