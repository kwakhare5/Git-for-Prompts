'use client';

import React from 'react';

export function EngineShowcase() {
  return (
    <>
      {/* 4-Grid Engine Section */}
      <section id="features" className="px-6 max-w-6xl mx-auto mb-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-3">THE GFP ENGINE</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 font-serif mb-4">
            Everything you need for prompt versioning — without lock-in
          </h2>
          <p className="text-zinc-400 text-base font-sans">
            Built for software engineering workflows, not fragile prompt pasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          
          <div className="bg-[#161619] p-8 rounded-2xl border border-zinc-800/80 shadow-2xs hover:border-zinc-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D22] border border-zinc-800 text-blue-300 flex items-center justify-center font-mono font-bold mb-4 text-base">
              01
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2 font-mono">Immutable Append-Only Snapshots</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              Every save creates a new Version row guarded by Postgres & SQLite transaction locks (`insertNextVersion`). Never overwrite history.
            </p>
          </div>

          <div className="bg-[#161619] p-8 rounded-2xl border border-zinc-800/80 shadow-2xs hover:border-zinc-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D22] border border-zinc-800 text-emerald-300 flex items-center justify-center font-mono font-bold mb-4 text-base">
              02
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2 font-mono">Local-First Wasm Engine</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              `packages/cli` runs completely offline with Wasm SQLite (`sql.js`). Zero native dependencies, works cross-platform instantly.
            </p>
          </div>

          <div className="bg-[#161619] p-8 rounded-2xl border border-zinc-800/80 shadow-2xs hover:border-zinc-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D22] border border-zinc-800 text-amber-300 flex items-center justify-center font-mono font-bold mb-4 text-base">
              03
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2 font-mono">Atomic Prompt Bundle Spec</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              Store system prompt, user template, model parameters (provider, model, temp, topP, maxTokens), tools, and Zod output schemas together.
            </p>
          </div>

          <div className="bg-[#161619] p-8 rounded-2xl border border-zinc-800/80 shadow-2xs hover:border-zinc-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D22] border border-zinc-800 text-rose-300 flex items-center justify-center font-mono font-bold mb-4 text-base">
              04
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2 font-mono">Secure Cloud Sync</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              Authenticate via SHA-256 hashed API keys (`gfp_live_*`). Fire-and-forget webhooks notify your team on every `version.created`.
            </p>
          </div>

        </div>
      </section>

      {/* CLI Command Showcase */}
      <section id="cli" className="px-6 max-w-5xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-3">COMMAND LINE INTERFACE</span>
            <h2 className="text-4xl font-bold text-zinc-100 font-serif mb-4 leading-tight">
              Control your prompts directly from your terminal
            </h2>
            <p className="text-zinc-400 text-base mb-6 leading-relaxed font-sans">
              `gfp init`, `gfp run`, `gfp diff`, `gfp push`, `gfp pull`. Pure TypeScript engine shared between CLI and Next.js SaaS app.
            </p>
            <a href="#docs" className="inline-block bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold px-5 py-2.5 rounded-xl shadow-xs active:scale-97 transition-all cursor-pointer">
              Explore CLI Docs →
            </a>
          </div>

          <div className="lg:col-span-6 bg-[#161619] rounded-2xl border border-zinc-800 p-6 shadow-xl font-mono text-xs text-zinc-300">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-800 text-zinc-500">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-auto text-[10px]">zsh — gfp diff</span>
            </div>

            <p className="text-emerald-300 font-bold mb-2">$ gfp diff prompt-v1 prompt-v2</p>
            <div className="space-y-1 bg-[#1D1D22] p-3 rounded border border-zinc-800 text-[11px] leading-relaxed">
              <p className="text-zinc-400">--- prompt-v1 (2026-08-06)</p>
              <p className="text-zinc-400">+++ prompt-v2 (2026-08-07)</p>
              <p className="text-rose-300 bg-rose-500/10 p-0.5 rounded">- systemPrompt: &quot;You are a helper.&quot;</p>
              <p className="text-emerald-300 bg-emerald-500/10 p-0.5 rounded">+ systemPrompt: &quot;You are a strict code reviewer.&quot;</p>
              <p className="text-emerald-300 bg-emerald-500/10 p-0.5 rounded">+ tools: [&quot;run_static_analysis&quot;, &quot;lint_check&quot;]</p>
            </div>
          </div>

        </div>
      </section>

      {/* Developer Testimonial Quote */}
      <section className="px-6 max-w-4xl mx-auto mb-28 text-center">
        <blockquote className="text-3xl md:text-4xl font-serif font-bold text-zinc-100 leading-tight mb-8">
          &ldquo;Git for Prompts completely eliminated our team&apos;s prompt regression headaches. Having immutable snapshots in local SQLite is pure genius.&rdquo;
        </blockquote>

        <div className="flex items-center justify-center gap-3 font-mono">
          <div className="w-10 h-10 rounded-full bg-[#161619] text-emerald-300 font-bold flex items-center justify-center text-xs border border-zinc-800">
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
