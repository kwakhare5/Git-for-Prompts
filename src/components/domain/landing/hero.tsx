'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, GitBranch } from 'lucide-react';
import { Show } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

// ─── Terminal interactive steps ───────────────────────────────────────────────

const TERMINAL_STEPS = [
  {
    cmd: 'gfp init',
    description: 'Create local .gfp/ SQLite repo',
    output: '✓ Initialized gfp project',
  },
  {
    cmd: 'gfp add support-bot --content "You are a helpful support agent."',
    description: 'Version prompt bundle locally',
    output: '✓ Saved as v1 · text-only · 37 chars',
  },
  {
    cmd: 'gfp push support-bot',
    description: 'Sync local bundle to cloud',
    output: '✓ Created cloud prompt: support-bot\n✓ Pushed v1 → cloud v1',
  },
  {
    cmd: 'gfp pull support-bot',
    description: 'Pull latest cloud prompt',
    output: '✓ Pulled cloud v2 → local v2',
  },
];

function InteractiveTerminal() {
  const [activeStep, setActiveStep] = useState(0);
  const step = TERMINAL_STEPS[activeStep];

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-xs">
      <div className="rounded-2xl border border-white/[0.08] bg-[#161616] shadow-2xl overflow-hidden text-left isolation-auto flex flex-col">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs text-muted-foreground select-none flex items-center gap-1.5 font-mono">
              <TerminalIcon className="w-3.5 h-3.5 text-muted-foreground" />
              gfp CLI — terminal
            </span>
          </div>

          <div className="flex items-center gap-1">
            {TERMINAL_STEPS.map((s, idx) => (
              <Button
                key={s.cmd}
                type="button"
                variant={activeStep === idx ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveStep(idx)}
                className="h-6 px-2 text-xs font-mono cursor-pointer"
              >
                Step {idx + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 min-h-[150px] flex flex-col justify-between gap-4 bg-background rounded-b-2xl">
          <div className="flex flex-col gap-2">
            <div className="text-foreground flex items-center gap-2 text-sm font-mono">
              <span className="text-emerald-400 select-none">$</span>
              <span>{step.cmd}</span>
            </div>
            <div className="text-muted-foreground text-xs pl-4 border-l border-border font-mono">
              {step.output}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground font-mono">
            <span>{step.description}</span>
            <span className="text-muted-foreground">Click steps 1-4 to switch</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Component ───────────────────────────────────────────────────────────

interface HeroProps {
  onTrySandbox: () => void;
}

export function Hero({ onTrySandbox }: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center text-center pt-10 pb-8 px-6 max-w-6xl mx-auto gap-6 font-sans"
    >
      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Badge variant="outline" className="text-xs font-sans text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md flex items-center gap-1.5 font-semibold">
          <GitBranch className="w-3.5 h-3.5" /> Local-First Prompt Version Control System
        </Badge>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.15] text-balance z-10 font-sans"
      >
        {siteConfig.headline}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed font-sans z-10 text-balance"
      >
        Version, diff, and evaluate your AI prompts —
        <br className="hidden sm:block" />
        offline first, cloud when you need it.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 z-10 font-sans"
      >
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <>
            <Show when="signed-in">
              <Link href="/dashboard" passHref>
                <Button size="lg" variant="default" className="font-semibold cursor-pointer shadow-sm font-sans">
                  Open Dashboard
                </Button>
              </Link>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-up" passHref>
                <Button size="lg" variant="default" className="font-semibold cursor-pointer shadow-sm font-sans">
                  Get Started
                </Button>
              </Link>
            </Show>
          </>
        ) : (
          <Link href="/sign-up" passHref>
            <Button size="lg" variant="default" className="font-semibold cursor-pointer shadow-sm font-sans">
              Get Started
            </Button>
          </Link>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={onTrySandbox}
          className="cursor-pointer font-sans"
        >
          Try Interactive Sandbox →
        </Button>
      </motion.div>

      {/* Interactive Terminal Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full mt-2 z-10 font-mono"
      >
        <InteractiveTerminal />
      </motion.div>
    </section>
  );
}
