'use client';

import React from 'react';
import { BadgePastel, TerminalIcon } from './ui-tokens';

export function BentoFeatures() {
  return (
    <>
      {/* Problem → Promise Section */}
      <section className="px-6 max-w-5xl mx-auto mb-28 text-center">
        
        <BadgePastel variant="rose" className="mb-4">
          PROBLEM → PROMISE
        </BadgePastel>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-6 font-serif leading-tight [text-wrap:balance]">
          Prompts break when versioning is an afterthought
        </h2>

        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-sans">
          Hardcoded prompt strings lead to silent regressions, broken output schemas, and zero audit history. Git for Prompts brings git-like immutable snapshot versioning to AI engineering.
        </p>

        {/* Problem → Promise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          <div className="space-y-4 p-6 bg-bg-card rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
            <div className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              WITHOUT GFP (FRAGILE)
            </div>
            <h3 className="text-lg font-bold text-zinc-100 font-mono">Unversioned Raw Text Strings</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Prompt changes pushed directly to code repositories without isolated tests, schema validation, or rollback points.
            </p>
          </div>

          <div className="space-y-4 p-6 bg-bg-card rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
            <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              WITH GFP (IMMUTABLE)
            </div>
            <h3 className="text-lg font-bold text-zinc-100 font-mono flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-emerald-300" /> Atomic Prompt Bundles
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Append-only snapshots storing text template + model config + tool definitions + Zod schema in SQLite.
            </p>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="border-y border-zinc-800/90 bg-bg-card py-14 px-6 mb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">100%</div>
            <div className="text-xs font-medium text-zinc-400 font-sans">Offline & Local First</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">0</div>
            <div className="text-xs font-medium text-zinc-400 font-sans">Cloud Lock-in</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">&lt;10ms</div>
            <div className="text-xs font-medium text-zinc-400 font-sans">Local Eval Speed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-zinc-100 font-mono mb-1">MIT</div>
            <div className="text-xs font-medium text-zinc-400 font-sans">Open Source License</div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="px-6 max-w-6xl mx-auto mb-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-3">THE GFP LOOP</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 font-serif mb-4 [text-wrap:balance]">
            A local-first engine for prompt engineering
          </h2>
          <p className="text-zinc-400 text-base font-sans">
            From initial draft to automated evals and team sync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-bg-card p-6 rounded-2xl border border-zinc-800/90 shadow-xl flex flex-col justify-between card-interactive hover:border-zinc-700">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-zinc-100 text-lg mb-2 font-mono">gfp init</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-sans">
                Initialize zero-dependency Wasm SQLite engine locally in your repo.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-300 flex items-center gap-1">
              Local DB Setup →
            </span>
          </div>

          <div className="bg-bg-card p-6 rounded-2xl border border-zinc-800/90 shadow-xl flex flex-col justify-between card-interactive hover:border-zinc-700">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-zinc-100 text-lg mb-2 font-mono">gfp run & eval</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-sans">
                Test prompts locally with user API keys against defined test cases.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
              Run Evals →
            </span>
          </div>

          <div className="bg-bg-card p-6 rounded-2xl border border-zinc-800/90 shadow-xl flex flex-col justify-between card-interactive hover:border-zinc-700">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-zinc-100 text-lg mb-2 font-mono">gfp push</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-sans">
                Sync immutable prompt versions to hosted cloud SaaS for team access.
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
