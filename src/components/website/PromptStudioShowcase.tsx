'use client';

import React from 'react';
import { TerminalIcon, CheckIcon } from './ui-tokens';

export function PromptStudioShowcase() {
  return (
    <section className="px-6 max-w-6xl mx-auto mb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-block mb-4">
            PROMPT EVALUATION SUITE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 font-serif mb-4 leading-tight [text-wrap:balance]">
            Test & Evaluate prompt bundles before pushing
          </h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-sans">
            Run test cases against dual AI models (Groq & OpenRouter). Validate variable interpolations and strict Zod JSON output schemas.
          </p>

          <ul className="space-y-3 mb-8 text-xs font-medium text-zinc-300 font-mono">
            <li className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-300" />
              <span>Dual-Model Benchmark (Groq Llama 3.3 + Claude 3.5)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-300" />
              <span>Strict Zod Schema Output Validation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-300" />
              <span>Variable Interpolation (`{"{{name}}"}`) Testing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-300" />
              <span>Zero Key Storage — Direct User Provider Keys</span>
            </li>
          </ul>

          <button className="bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold font-mono px-5 py-2.5 rounded-xl shadow-xs btn-interactive">
            Run Local Evals →
          </button>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="lg:col-span-7 bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-2xl card-interactive">
          <div className="bg-bg-page rounded-xl border border-zinc-800 overflow-hidden text-xs font-mono">
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between font-bold text-zinc-200">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-300" />
                <span>gfp run test-suite --all</span>
              </div>
              <span className="text-emerald-300 text-[10px] bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                88/88 PASSED
              </span>
            </div>

            {/* Test Cases Table */}
            <div className="p-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-bg-panel border border-zinc-800 flex items-center justify-between tab-interactive">
                <div>
                  <div className="font-bold text-zinc-100 flex items-center gap-2">
                    <span className="text-emerald-300">✓</span>
                    <span>test-case-security-audit</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">Input: SQL Injection payload • Score: 100%</p>
                </div>
                <span className="text-[10px] text-zinc-500">12ms</span>
              </div>

              <div className="p-3.5 rounded-xl bg-bg-panel border border-zinc-800 flex items-center justify-between tab-interactive">
                <div>
                  <div className="font-bold text-zinc-100 flex items-center gap-2">
                    <span className="text-emerald-300">✓</span>
                    <span>test-case-json-schema-match</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">Zod validation: Object schema verified</p>
                </div>
                <span className="text-[10px] text-zinc-500">18ms</span>
              </div>

              <div className="p-3.5 rounded-xl bg-bg-panel border border-zinc-800 flex items-center justify-between tab-interactive">
                <div>
                  <div className="font-bold text-zinc-100 flex items-center gap-2">
                    <span className="text-emerald-300">✓</span>
                    <span>test-case-variable-interpolation</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">Interpolated {"{{codeSnippet}}"} successfully</p>
                </div>
                <span className="text-[10px] text-zinc-500">9ms</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
