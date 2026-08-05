'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal as TerminalIcon, Search } from 'lucide-react';
import { Show } from '@clerk/nextjs';
import { siteConfig } from '@/config/site';

// ─── Terminal interactive steps ───────────────────────────────────────────────

const TERMINAL_STEPS = [
  {
    cmd: 'gfp init',
    description: 'Create local .gfp/ SQLite repo',
    output: '✓ Initialized .gfp/ SQLite database in current directory',
  },
  {
    cmd: 'gfp add "support-bot" -m "Initial prompt"',
    description: 'Version prompt bundle locally',
    output: '✓ Saved version 1 (id: ver_8f92a1) · 247 chars · 2 variables detected',
  },
  {
    cmd: 'gfp push support-bot',
    description: 'Sync local bundle to cloud',
    output: '✓ Synced support-bot (v1) → Cloud SaaS (prompt_id: prm_4g7h2k)',
  },
  {
    cmd: 'gfp pull support-bot --version 2',
    description: 'Pull latest cloud prompt',
    output: '✓ Pulled support-bot v2 from cloud · SQLite local state updated',
  },
];

function InteractiveTerminal() {
  const [activeStep, setActiveStep] = useState(0);

  const step = TERMINAL_STEPS[activeStep];

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-xs">
      {/* Terminal window */}
      <div className="rounded-xl border border-white/10 bg-[#0e0e0e] shadow-2xl overflow-hidden text-left">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#161616]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] text-zinc-400 select-none flex items-center gap-1.5">
              <TerminalIcon className="w-3 h-3 text-zinc-500" />
              gfp CLI — interactive terminal
            </span>
          </div>

          {/* Interactive step selector buttons */}
          <div className="flex items-center gap-1">
            {TERMINAL_STEPS.map((s, idx) => (
              <button
                key={s.cmd}
                onClick={() => setActiveStep(idx)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  activeStep === idx
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 min-h-[160px] flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-[#f5f0eb] flex items-center gap-2 text-sm">
              <span className="text-emerald-400 select-none">$</span>
              <span>{step.cmd}</span>
            </div>
            <div className="text-zinc-500 text-xs pl-4 border-l border-white/10">
              {step.output}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] text-zinc-500">
            <span>{step.description}</span>
            <span className="text-zinc-600">Click steps 1-4 to test</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

interface HeroProps {
  onTrySandbox: () => void;
}

export function Hero({ onTrySandbox }: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center text-center pt-28 pb-16 px-6 max-w-6xl mx-auto gap-8"
    >
      {/* Background linear grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top badges */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Open source · SQLite Wasm + Cloud Sync
        </div>
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            document.dispatchEvent(event);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <Search className="w-3 h-3 text-zinc-400" />
          <span>Press</span>
          <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">⌘K</kbd>
        </button>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] text-balance"
      >
        {siteConfig.headline}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed font-light"
      >
        {siteConfig.tagline}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 z-10"
      >
        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold bg-[#f5f0eb] text-zinc-950 hover:bg-white transition-colors shadow-sm cursor-pointer"
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </Show>
        <Show when="signed-out">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold bg-[#f5f0eb] text-zinc-950 hover:bg-white transition-colors shadow-sm cursor-pointer"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            Sign In
          </Link>
        </Show>
        <button
          onClick={onTrySandbox}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
        >
          Try Sandbox Playground →
        </button>
      </motion.div>

      {/* Terminal Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full mt-2"
      >
        <InteractiveTerminal />
      </motion.div>
    </section>
  );
}
