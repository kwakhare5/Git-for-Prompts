'use client';

import { Sparkles, Check } from 'lucide-react';

export function TestSuiteInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 space-y-12 select-none font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-950/80 bg-emerald-950/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> QA & Testing Infrastructure
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#f5f0eb] leading-tight tracking-tight font-sans">
            Deploy with absolute confidence.
          </h3>
          <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-normal font-sans">
            Each prompt modification you perform is validated against custom assertion test sets before it goes live. You don&apos;t just update prompt text; you grade it.
          </p>

          <ul className="space-y-3.5 pt-2 text-base text-zinc-300 font-sans">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#f5f0eb] font-semibold">Natural Language Assertions</strong>: Validate output requirements like &quot;Must mention 30-day window&quot; or &quot;Tone must be apologetic&quot;.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#f5f0eb] font-semibold">Dual-Provider Runner</strong>: Uses Groq (Llama-3.3-70B) for ultra-low latency test processing with OpenRouter failover routing.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#f5f0eb] font-semibold">Quality Confidence Grading</strong>: Get instant pass/fail ratios and confidence scores for prompt changes.</span>
            </li>
          </ul>
        </div>

        {/* Visual Mock Runner Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] shadow-xl relative overflow-hidden flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#121212] rounded-t-2xl font-mono text-xs">
            <span className="text-zinc-300 uppercase font-semibold tracking-wider font-mono">Assert suite: refund_eval_matrix</span>
            <span className="text-emerald-400 font-bold font-mono">100% PASSED</span>
          </div>

          <div className="p-4 space-y-3 bg-[#0a0a0a] flex-1 font-mono">
            <div className="p-3.5 border border-white/[0.08] bg-[#121212] rounded-xl flex items-center justify-between font-mono text-sm">
              <div className="flex items-center gap-2.5 font-mono">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse font-mono" />
                <span className="text-zinc-100 font-semibold font-mono">Assert refund window check</span>
              </div>
              <span className="text-emerald-400 font-bold font-mono">PASS ✓</span>
            </div>

            <div className="p-3.5 border border-white/[0.08] bg-[#121212] rounded-xl flex items-center justify-between font-mono text-sm">
              <div className="flex items-center gap-2.5 font-mono">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse font-mono" />
                <span className="text-zinc-100 font-semibold font-mono">Assert formal salutations</span>
              </div>
              <span className="text-emerald-400 font-bold font-mono">PASS ✓</span>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-white/[0.06] bg-[#121212] rounded-b-2xl flex items-center justify-between font-mono text-xs text-zinc-400">
            <span>Model: llama-3.3-70b-versatile (Groq)</span>
            <span>Latency: 310ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
