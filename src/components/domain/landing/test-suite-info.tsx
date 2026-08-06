'use client';

import { Sparkles, Check } from 'lucide-react';

export function TestSuiteInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-10 md:space-y-12 select-none font-sans">
      {/* Centered Master Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> QA &amp; Testing Infrastructure
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight font-sans">
          Deploy with absolute confidence.
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal font-sans">
          Each prompt modification you perform is validated against custom assertion test sets before it goes live. You don&apos;t just update prompt text; you grade it.
        </p>
      </div>

      {/* Balanced 2-Column Equal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-sans">
        {/* Left Card - Feature Matrix */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold block">Automated Assertions</span>
            <h3 className="text-base md:text-lg font-bold text-foreground font-sans">Continuous Evaluation Suite</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed">
              Define natural language assertions that execute instantly whenever prompts are edited, preventing silent regressions.
            </p>
          </div>

          <ul className="space-y-3 pt-1 text-xs md:text-sm text-muted-foreground font-sans">
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-foreground font-semibold">Natural Language Assertions</strong>: Validate output rules like &quot;30-day refund window&quot;.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-foreground font-semibold">Dual-Provider Runner</strong>: Fast processing via Groq with OpenRouter failover routing.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-foreground font-semibold">Confidence Grading</strong>: Get instant pass/fail ratios and regression metrics.</span>
            </li>
          </ul>
        </div>

        {/* Right Card - Visual Mock Runner Widget */}
        <div className="rounded-2xl border border-border bg-card shadow-xl relative overflow-hidden flex flex-col font-mono text-xs min-h-[380px] h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 rounded-t-2xl font-mono text-xs">
            <span className="text-foreground uppercase font-semibold tracking-wider font-mono">Assert suite: refund_eval_matrix</span>
            <span className="text-emerald-400 font-bold font-mono">100% PASSED</span>
          </div>

          <div className="p-4 space-y-3 bg-background flex-1 font-mono">
            <div className="p-3.5 border border-border bg-card rounded-xl flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5 font-mono">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse font-mono" />
                <span className="text-foreground font-semibold font-mono">Assert refund window check</span>
              </div>
              <span className="text-emerald-400 font-bold font-mono">PASS ✓</span>
            </div>

            <div className="p-3.5 border border-border bg-card rounded-xl flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5 font-mono">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse font-mono" />
                <span className="text-foreground font-semibold font-mono">Assert formal salutations</span>
              </div>
              <span className="text-emerald-400 font-bold font-mono">PASS ✓</span>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/40 rounded-b-2xl flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Model: llama-3.3-70b-versatile (Groq)</span>
            <span>Latency: 310ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
