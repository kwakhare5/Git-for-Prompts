'use client';

import React from 'react';

export function EngineShowcase() {
  return (
    <>
      {/* 4-Grid Engine Section */}
      <section id="features" className="px-4 sm:px-6 max-w-6xl mx-auto mb-16 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 font-sans">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-2 sm:mb-3">CORE CAPABILITIES</span>
          <h2 className="text-2.5xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 font-serif mb-3 sm:mb-4 [text-wrap:balance]">
            Engineered for developers who ship AI to production
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base font-sans">
            Version control prompt templates, model parameters, and structured outputs without cloud lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 font-sans">
          
          <div className="bg-bg-card p-5 sm:p-8 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive hover:border-zinc-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center justify-center font-mono font-bold mb-3 sm:mb-4 text-xs sm:text-base">
              01
            </div>
            <h3 className="text-base sm:text-xl font-bold text-zinc-100 mb-1.5 sm:mb-2 font-mono">Immutable Snapshots</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              Every save creates a new immutable version with full audit history. Roll back instantly or diff changes side-by-side.
            </p>
          </div>

          <div className="bg-bg-card p-5 sm:p-8 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive hover:border-zinc-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center justify-center font-mono font-bold mb-3 sm:mb-4 text-xs sm:text-base">
              02
            </div>
            <h3 className="text-base sm:text-xl font-bold text-zinc-100 mb-1.5 sm:mb-2 font-mono">Offline SQLite Engine</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              The CLI runs completely offline in your terminal using local SQLite. Zero external servers required.
            </p>
          </div>

          <div className="bg-bg-card p-5 sm:p-8 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive hover:border-zinc-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center justify-center font-mono font-bold mb-3 sm:mb-4 text-xs sm:text-base">
              03
            </div>
            <h3 className="text-base sm:text-xl font-bold text-zinc-100 mb-1.5 sm:mb-2 font-mono">Prompt Bundle Specification</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              Keep system prompts, templates, model parameters, tools, and structured response schemas versioned together.
            </p>
          </div>

          <div className="bg-bg-card p-5 sm:p-8 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive hover:border-zinc-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center justify-center font-mono font-bold mb-3 sm:mb-4 text-xs sm:text-base">
              04
            </div>
            <h3 className="text-base sm:text-xl font-bold text-zinc-100 mb-1.5 sm:mb-2 font-mono">Authenticated Team Sync</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              Push prompt versions to the web dashboard and serve them to your apps using SHA-256 hashed API keys.
            </p>
          </div>

        </div>
      </section>

      {/* CLI Command Showcase */}
      <section id="cli" className="px-4 sm:px-6 max-w-5xl mx-auto mb-16 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          <div className="lg:col-span-6">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-2 sm:mb-3">COMMAND LINE INTERFACE</span>
            <h2 className="text-2.5xl sm:text-4xl font-bold text-zinc-100 font-serif mb-3 sm:mb-4 leading-tight">
              Control your prompts directly from your terminal
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base mb-5 sm:mb-6 leading-relaxed font-sans">
              Run evaluations, inspect diffs, and push approved prompt versions directly from your terminal. Pure TypeScript shared between the CLI and web dashboard.
            </p>
            <a href="https://github.com/kwakhare5/Git-for-Prompts#readme" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold px-5 py-2.5 rounded-xl shadow-xs btn-interactive">
              Explore CLI Docs →
            </a>
          </div>

          <div className="lg:col-span-6 bg-bg-card rounded-2xl border border-zinc-800/90 p-4 sm:p-6 shadow-2xl font-mono text-xs text-zinc-300 overflow-hidden">
            <div className="flex items-center gap-2 pb-3 mb-3 sm:mb-4 border-b border-zinc-800 text-zinc-500">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-auto text-[10px]">zsh — gitforprompts diff</span>
            </div>

            <p className="text-emerald-300 font-bold mb-2 text-[11px] sm:text-xs truncate">$ gitforprompts diff prompt-v1 prompt-v2</p>
            <div className="space-y-1 bg-bg-panel p-3 rounded border border-zinc-800 text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto">
              <p className="text-zinc-400 truncate">--- prompt-v1 (2026-08-06)</p>
              <p className="text-zinc-400 truncate">+++ prompt-v2 (2026-08-07)</p>
              <p className="text-rose-300 bg-rose-500/10 p-0.5 rounded whitespace-nowrap">- systemPrompt: &quot;You are a helper.&quot;</p>
              <p className="text-emerald-300 bg-emerald-500/10 p-0.5 rounded whitespace-nowrap">+ systemPrompt: &quot;You are a strict code reviewer.&quot;</p>
              <p className="text-emerald-300 bg-emerald-500/10 p-0.5 rounded whitespace-nowrap">+ tools: [&quot;run_static_analysis&quot;, &quot;lint_check&quot;]</p>
            </div>
          </div>

        </div>
      </section>

      {/* Developer Testimonial Quote */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto mb-16 sm:mb-28 text-center">
        <blockquote className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-100 leading-snug sm:leading-tight mb-6 sm:mb-8">
          &ldquo;Git for Prompts completely eliminated our team&apos;s prompt regression headaches. Having immutable snapshots in local SQLite is pure genius.&rdquo;
        </blockquote>

        <div className="flex items-center justify-center gap-3 font-mono">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-card text-emerald-300 font-bold flex items-center justify-center text-xs border border-zinc-800">
            AI
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-zinc-100">Lead AI Engineer</div>
            <div className="text-[11px] text-zinc-500">Open Source Contributor</div>
          </div>
        </div>
      </section>
    </>
  );
}
