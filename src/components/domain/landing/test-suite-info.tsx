'use client';

import { Sparkles, CheckCircle2, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function TestSuiteInfo() {
  return (
    <section id="testing" className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-10 font-sans">
      {/* Centered Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 rounded-md">
          QA & Automated Evals
        </Badge>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-sans">
          Deploy prompt updates with absolute confidence
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-sans">
          Each prompt modification is validated against custom assertion test sets before it goes live. You don&apos;t just edit prompt text — you grade it.
        </p>
      </div>

      {/* 2-Column Staggered Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-sans">
        {/* Left Side: Test Feature Highlights */}
        <div className="space-y-4">
          <Card className="bg-card/70 border-white/10 backdrop-blur-md p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">Natural Language Rules</Badge>
              <h3 className="text-sm font-bold text-foreground font-sans">Continuous Assertion Suites</h3>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Define natural language assertions (e.g. &quot;Must mention 30-day return policy&quot;) that execute automatically on save.
            </p>
          </Card>

          <Card className="bg-card/70 border-white/10 backdrop-blur-md p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                Scheduled Daily Crons
              </Badge>
              <h3 className="text-sm font-bold text-foreground font-sans">Automated Regression Monitoring</h3>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Background cron jobs continuously re-eval prompt versions to catch LLM provider behavior drifts instantly.
            </p>
          </Card>
        </div>

        {/* Right Side: Interactive Test Suite Widget */}
        <Card className="bg-card border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-foreground">suite: refund_eval_matrix</span>
              <p className="text-[11px] text-muted-foreground">Evaluating v3 against test cases</p>
            </div>
            <Badge variant="outline" className="font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              100% Passed
            </Badge>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span>Overall Score</span>
              <span className="text-emerald-400 font-bold">2/2 Passed</span>
            </div>
            <Progress value={100} className="h-2 bg-muted" />
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
              <span className="text-foreground">1. Policy refund window check</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </span>
            </div>

            <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
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
