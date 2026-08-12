'use client';

import React from 'react';
import Link from 'next/link';
import { CliCopyButton } from './ui-tokens';

export function HeroSection() {
  return (
    <section className="pt-12 sm:pt-16 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center relative font-sans">
      {/* Top Ambient Glow Lighting */}
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-10" />

      {/* Kicker Badge */}
      <div className="inline-flex items-center gap-2 mb-6 font-mono text-[10px] sm:text-xs font-bold bg-bg-card text-zinc-300 border border-zinc-800 px-3.5 py-1.5 rounded-full shadow-xl">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span>100% OPEN SOURCE PROMPT VERSION CONTROL</span>
      </div>

      {/* Hero Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.08] mb-6 font-serif [text-wrap:balance]">
        Git for your AI prompt bundles
      </h1>

      {/* Hero Subtitle */}
      <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
        Version-control system prompts, model configs, and Zod output schemas. Track changes, run local terminal evals, and deploy anywhere — 100% offline via CLI or synced to cloud.
      </p>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6 font-sans max-w-md sm:max-w-none mx-auto">
        <div className="w-full sm:w-auto flex justify-center">
          <CliCopyButton command="npx gfp init" />
        </div>
        <Link 
          href="/sign-in"
          className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold px-6 py-3 rounded-xl shadow-xs btn-interactive flex items-center justify-center gap-2 text-xs min-h-[48px] sm:min-h-[44px]"
        >
          <span>Open Cloud Dashboard →</span>
        </Link>
      </div>

      {/* Micro Text */}
      <p className="text-xs text-zinc-500 font-mono tracking-wide">
        open-source • local offline sqlite • postgres advisory locking
      </p>

    </section>
  );
}
