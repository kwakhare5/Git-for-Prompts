'use client';

import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function TestSuiteInfo() {
  return (
    <section id="testing" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> QA & Automated Evals
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Deploy prompt updates with absolute confidence
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Each prompt modification is validated against custom assertion test sets before it goes live. You don&apos;t just edit prompt text — you grade it.
        </p>
      </div>

      {/* 2-Column Split Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch font-sans">
        {/* Left Side: Test Feature Highlights */}
        <div className="space-y-4 flex flex-col justify-between">
          <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-3 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-2.5">
              <Badge variant="secondary" className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Natural Language Rules
              </Badge>
              <CardTitle className="text-base font-bold text-foreground font-sans">
                Continuous Assertion Suites
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
              Define natural language assertions (e.g., &quot;Must mention 30-day return policy&quot;) that execute automatically on every save.
            </CardDescription>
          </Card>

          <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-3 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-2.5">
              <Badge variant="outline" className="font-mono text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/10">
                Scheduled Daily Crons
              </Badge>
              <CardTitle className="text-base font-bold text-foreground font-sans">
                Automated Regression Monitoring
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
              Background cron jobs continuously re-eval prompt versions to catch LLM provider behavior drifts instantly.
            </CardDescription>
          </Card>
        </div>

        {/* Right Side: Interactive Test Suite Runner Widget */}
        <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 md:p-8 space-y-6 rounded-2xl shadow-2xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="font-mono text-sm font-bold text-foreground block">suite: refund_eval_matrix</span>
              <p className="text-xs text-muted-foreground font-sans mt-0.5">Evaluating v3 against test cases</p>
            </div>
            <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              100% Passed
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs bg-zinc-950 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-bold text-foreground">Overall Score</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 2/2 Passed
              </span>
            </div>
            <Progress value={100} className="h-2.5 bg-muted [&>div]:bg-emerald-400" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-border flex items-center justify-between">
              <span className="text-foreground">1. Policy refund window check</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-border flex items-center justify-between">
              <span className="text-foreground">2. Customer empathetic tone</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

