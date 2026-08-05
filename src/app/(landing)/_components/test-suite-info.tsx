'use client';

import { Sparkles, Check } from 'lucide-react';

export function TestSuiteInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 border-t border-zinc-900 pt-20 space-y-12 select-none font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-950 bg-emerald-950/20 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <Sparkles className="h-3 w-3" /> QA & Testing Infrastructure
          </div>
          <h3 className="text-3xl font-extrabold text-zinc-100 leading-tight">
            Deploy with absolute confidence.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Each prompt modification you perform is validated against custom assertion test sets before it goes live. You don&apos;t just update prompt text; you grade it.
          </p>

          <ul className="space-y-3 pt-2 text-sm text-zinc-300">
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Natural Language Assertions</strong>: Validate output requirements like &quot;Must mention 30-day window&quot; or &quot;Tone must be apologetic&quot;.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Dual-Provider Runner</strong>: Uses Groq (Llama-3.3-70B) for ultra-low latency test processing with OpenRouter failover routing.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Quality Confidence Grading</strong>: Get instant pass/fail ratios and confidence scores for prompt changes.</span>
            </li>
          </ul>
        </div>

        {/* Visual Mock Runner */}
        <div className="rounded-xl border border-white/[0.08] bg-[#161616] p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/30 pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 font-mono text-[10px]">
            <span className="text-zinc-500 uppercase font-semibold">Assert suite: refund_eval_matrix</span>
            <span className="text-emerald-400 font-bold font-mono">100% PASSED</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 border border-white/[0.04] bg-[#0e0e0e] rounded-lg flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 font-mono">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse font-mono" />
                <span className="text-zinc-300 font-semibold font-mono">Assert refund window check</span>
              </div>
              <span className="text-emerald-400 font-semibold font-mono">PASS (96/100)</span>
            </div>

            <div className="p-3 border border-white/[0.04] bg-[#0e0e0e] rounded-lg flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 font-mono">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse font-mono" />
                <span className="text-zinc-300 font-semibold font-mono">Assert formal salutations</span>
              </div>
              <span className="text-emerald-400 font-semibold font-mono">PASS (100/100)</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between font-mono text-[9px] text-zinc-500">
            <span>Model: llama-3.3-70b-versatile (Groq)</span>
            <span>Latency: 310ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
