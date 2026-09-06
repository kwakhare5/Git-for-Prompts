'use client';

import React from 'react';
import { BadgePastel, TerminalIcon } from './ui-tokens';

export function BentoFeatures() {
  return (
    <>
      {/* Problem → Promise Section */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mb-16 sm:mb-28 text-center">
        
        <BadgePastel variant="rose" className="mb-3 sm:mb-4">
          WHY VERSION CONTROL
        </BadgePastel>

        <h2 className="text-2.5xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4 sm:mb-6 font-serif leading-tight [text-wrap:balance]">
          Prompts break when you treat them like raw text
        </h2>

        <p className="text-zinc-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed font-sans">
          Hardcoded strings cause silent regressions, broken output schemas, and zero rollback history. Git for Prompts gives AI teams commit logs, visual diffs, and regression test suites.
        </p>

        {/* Problem → Promise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
          
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-bg-card rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
            <div className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              WITHOUT VERSION CONTROL
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 font-mono">Hardcoded Strings</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Prompt edits pushed straight to code without isolated evals, schema checks, or rollback points.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-bg-card rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
            <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              WITH GIT FOR PROMPTS
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 font-mono flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-emerald-300 shrink-0" /> Versioned Prompt Bundles
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Immutable snapshots bundling your prompt template, model config, and structured output schema in local SQLite.
            </p>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="border-y border-zinc-800/90 bg-bg-card py-8 sm:py-14 px-4 sm:px-6 mb-16 sm:mb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">100%</div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-400 font-sans">Offline &amp; Local First</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">0</div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-400 font-sans">Cloud Lock-in</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">&lt;10ms</div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-400 font-sans">Local Eval Speed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">MIT</div>
            <div className="text-[11px] sm:text-xs font-medium text-zinc-400 font-sans">Open Source License</div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto mb-16 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-2 sm:mb-3">THE WORKFLOW LOOP</span>
          <h2 className="text-2.5xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 font-serif mb-3 sm:mb-4 [text-wrap:balance]">
            A local-first engine for prompt engineering
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base font-sans">
            From initial draft to automated evals and team sync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          
          <div className="bg-bg-card p-5 sm:p-6 rounded-2xl border border-zinc-800/90 shadow-xl flex flex-col justify-between card-interactive hover:border-zinc-700">
            <div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono font-bold flex items-center justify-center text-xs sm:text-sm mb-3 sm:mb-4">
                01
              </div>
              <h3 className="font-bold text-zinc-100 text-base sm:text-lg mb-1.5 sm:mb-2 font-mono">gitforprompts init</h3>
              <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-sans">
                Initialize a local SQLite repository directly inside your project folder.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-300 flex items-center gap-1">
              Local DB Setup →
            </span>
          </div>

          <div className="bg-bg-card p-5 sm:p-6 rounded-2xl border border-zinc-800/90 shadow-xl flex flex-col justify-between card-interactive hover:border-zinc-700">
            <div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-bold flex items-center justify-center text-xs sm:text-sm mb-3 sm:mb-4">
                02
              </div>
              <h3 className="font-bold text-zinc-100 text-base sm:text-lg mb-1.5 sm:mb-2 font-mono">gitforprompts run &amp; eval</h3>
              <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-sans">
                Run local evaluations with your environment API keys against real test cases.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
              Run Evals →
            </span>
          </div>

          <div className="bg-bg-card p-5 sm:p-6 rounded-2xl border border-zinc-800/90 shadow-xl flex flex-col justify-between card-interactive hover:border-zinc-700">
            <div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold flex items-center justify-center text-xs sm:text-sm mb-3 sm:mb-4">
                03
              </div>
              <h3 className="font-bold text-zinc-100 text-base sm:text-lg mb-1.5 sm:mb-2 font-mono">gitforprompts push</h3>
              <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-sans">
                Sync approved versions to the team dashboard or deploy over the REST API.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
              Cloud Sync →
            </span>
          </div>

        </div>
      </section>
    </>
  );
}
