'use client';

import { useState } from 'react';

const STEPS = [
  {
    label: 'Install',
    command: 'npm install -g @gitforprompts/cli',
    comment: '# or: pnpm add -g @gitforprompts/cli',
  },
  {
    label: 'Init',
    command: 'gfp init',
    comment: '# Creates .gfp/ SQLite database in your project',
  },
  {
    label: 'Add prompt',
    command: 'gfp add "my-prompt" --message "Initial draft"',
    comment: '# Saves v1 locally — no network required',
  },
  {
    label: 'Inspect',
    command: 'gfp history my-prompt',
    comment: '# Lists all versions with timestamps and commit messages',
  },
  {
    label: 'Sync',
    command: 'gfp push my-prompt',
    comment: '# Push to cloud when ready',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={copy}
      aria-label="Copy command"
      className="shrink-0 text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-2 py-1 rounded border border-white/[0.06] hover:border-white/[0.12]"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

export function QuickStart() {
  const [activeStep, setActiveStep] = useState(0);

  const step = STEPS[activeStep];

  return (
    <section id="docs" className="px-6 py-10 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">Quick Start</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Up in 60 seconds.
        </h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-base leading-relaxed">
          No cloud setup needed to start. Install the CLI, init your project, and your first prompt is versioned.
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Step tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {STEPS.map((s, idx) => (
            <button
              key={s.label}
              onClick={() => setActiveStep(idx)}
              className={`text-xs px-3 py-1.5 rounded-md font-mono transition-colors ${
                activeStep === idx
                  ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              <span className="text-zinc-600 mr-1">{String(idx + 1).padStart(2, '0')}.</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e0e0e] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <span className="text-[11px] font-mono text-zinc-500">bash</span>
            <CopyButton text={step.command} />
          </div>
          <div className="px-5 py-5 font-mono text-sm flex flex-col gap-2">
            <div className="text-[#f5f0eb]">
              <span className="text-zinc-600 select-none mr-2">$</span>
              {step.command}
            </div>
            <div className="text-zinc-600">{step.comment}</div>
          </div>
        </div>

        {/* Step description */}
        <p className="text-xs text-zinc-500 font-mono text-center">
          Step {activeStep + 1} of {STEPS.length}
          {activeStep < STEPS.length - 1 && (
            <button
              onClick={() => setActiveStep((p) => Math.min(p + 1, STEPS.length - 1))}
              className="ml-3 text-zinc-400 hover:text-white transition-colors"
            >
              next →
            </button>
          )}
        </p>
      </div>
    </section>
  );
}
