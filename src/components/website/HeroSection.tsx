'use client';

import React from 'react';
import Link from 'next/link';
import { CliCopyButton } from './ui-tokens';

export function HeroSection() {
  return (
    <section className="pt-16 pb-8 px-6 max-w-4xl mx-auto text-center">
      
      {/* Kicker Badge */}
      <div className="inline-flex items-center gap-2 mb-6 font-mono text-xs font-bold bg-zinc-800/40 text-zinc-300 border border-zinc-700/50 px-3.5 py-1 rounded-full shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span>
        100% OPEN SOURCE PROMPT VERSION CONTROL
      </div>

      {/* Hero Title */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.08] mb-6 font-serif">
        Git for your AI prompt bundles
      </h1>

      {/* Hero Subtitle */}
      <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
        Version-control system prompts, model configs, and Zod output schemas. Track changes, run local terminal evals, and deploy anywhere — 100% offline via CLI or synced to cloud.
      </p>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5 font-sans">
        <CliCopyButton command="npx gfp init" />
        <Link 
          href="/sign-in"
          className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all duration-150 active:scale-97 flex items-center justify-center gap-2 text-xs cursor-pointer h-10"
        >
          <span>Open Cloud Dashboard →</span>
        </Link>
      </div>

      {/* Micro Text */}
      <p className="text-xs text-zinc-400 font-mono tracking-wide">
        open-source • local offline sqlite • postgres advisory locking
      </p>

    </section>
  );
}
