'use client';

import React from 'react';
import { CliCopyButton, BadgePastel } from './ui-tokens';

export function HeroSection() {
  return (
    <section className="pt-16 pb-8 px-6 max-w-4xl mx-auto text-center">
      
      {/* Kicker Badge */}
      <BadgePastel variant="blue" className="mb-6">
        <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
        100% FREE & OPEN SOURCE PROMPT MANAGER
      </BadgePastel>

      {/* Hero Title */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.08] mb-6 font-serif">
        Version control for your AI prompt bundles
      </h1>

      {/* Hero Subtitle */}
      <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
        Track changes, run local evals, and collaborate on prompt bundles across email, code, and APIs — offline via CLI or synced to cloud.
      </p>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5 font-sans">
        <CliCopyButton command="npx gfp init" />
        <a 
          href="/dashboard"
          className="w-full sm:w-auto bg-[#202024] hover:bg-[#28282D] text-zinc-200 border border-zinc-700/80 font-medium px-6 py-2.5 rounded-xl shadow-xs hover:border-zinc-600 transition-all duration-150 active:scale-97 flex items-center justify-center gap-2 text-xs cursor-pointer h-10"
        >
          <span>Open Web Dashboard</span>
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* Micro Text */}
      <p className="text-xs text-zinc-500 font-mono tracking-wide">
        open-source • zero cloud lock-in • mit license
      </p>

    </section>
  );
}
