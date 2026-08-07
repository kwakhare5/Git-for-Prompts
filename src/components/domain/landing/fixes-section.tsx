'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles, FileText, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FixesSection() {
  const [card1State, setCard1State] = useState<number>(0);
  const [card2DecayIdx, setCard2DecayIdx] = useState<number>(0);
  const [card3Step, setCard3Step] = useState<number>(0);
  const [card3Timer, setCard3Timer] = useState<string>('0m');

  useEffect(() => {
    const c1Interval = setInterval(() => {
      setCard1State((prev) => (prev + 1) % 3);
    }, 3500);

    const c2Interval = setInterval(() => {
      setCard2DecayIdx((prev) => (prev + 1) % 4);
    }, 2000);

    const c3Interval = setInterval(() => {
      setCard3Step((prev) => {
        const next = (prev + 1) % 4;
        if (next === 0) setCard3Timer('0m');
        else if (next === 1) setCard3Timer('14m');
        else if (next === 2) setCard3Timer('1h 45m');
        else if (next === 3) setCard3Timer('3h 12m');
        return next;
      });
    }, 3000);

    return () => {
      clearInterval(c1Interval);
      clearInterval(c2Interval);
      clearInterval(c3Interval);
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 rounded-md">
          Core Solutions & Architecture
        </Badge>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-sans">
          Engineered to eliminate prompt chaos
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-sans">
          Say goodbye to untracked text files, silent regressions, and unversioned production prompt changes.
        </p>
      </div>

      {/* 4 Feature Architecture Cards using shadcn Card Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Regression Prevention */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md p-6 space-y-4 hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              Immutable History
            </Badge>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground font-sans">
              Zero Silent Overwrites
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
              Every save creates an immutable version row protected by postgres transaction advisory locks.
            </CardDescription>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>insertNextVersion()</span>
              <span className="text-emerald-400">pg_advisory_xact_lock</span>
            </div>
            <div className="text-foreground font-semibold">
              {card1State === 0 && '✓ Step 1: Read current max version (N)'}
              {card1State === 1 && '✓ Step 2: Insert new row (N+1)'}
              {card1State === 2 && '✓ Step 3: Update prompt parent pointer'}
            </div>
          </div>
        </Card>

        {/* Card 2: Knowledge Decay */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md p-6 space-y-4 hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <Badge variant="outline" className="font-mono text-xs text-sky-400 border-sky-500/20 bg-sky-500/10">
              Full Bundle Schemas
            </Badge>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground font-sans">
              Full Prompt Bundle Schemas
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
              Version system prompt, user template, model parameters, tools, and response JSON format as one atomic unit.
            </CardDescription>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border font-mono text-xs space-y-1">
            <div className="text-sky-400 font-bold">PromptBundle Schema</div>
            <p className="text-muted-foreground text-[11px]">
              {card2DecayIdx === 0 && '• systemPrompt: "You are an assistant..."'}
              {card2DecayIdx === 1 && '• userTemplate: "Help user {{name}}..."'}
              {card2DecayIdx === 2 && '• modelConfig: { provider: "groq", temp: 0.7 }'}
              {card2DecayIdx === 3 && '• responseFormat: { type: "json_object" }'}
            </p>
          </div>
        </Card>

        {/* Card 3: Audit Traceability */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md p-6 space-y-4 hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <Badge variant="outline" className="font-mono text-xs text-amber-400 border-amber-500/20 bg-amber-500/10">
              Full Auditability
            </Badge>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground font-sans">
              Instant Diff & Rollback
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
              Compare any two prompt versions side-by-side with Monaco diff syntax highlighting and restore in 1 click.
            </CardDescription>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border font-mono text-xs flex items-center justify-between">
            <span className="text-muted-foreground">Restore v1 as v{card3Step + 4}</span>
            <span className="text-amber-400 font-bold">{card3Timer} elapsed</span>
          </div>
        </Card>

        {/* Card 4: Automated Evals */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md p-6 space-y-4 hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              Automated Evals
            </Badge>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground font-sans">
              Regression Test Suites
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
              Run batch evaluation test cases against prompt versions and schedule cron regression runs automatically.
            </CardDescription>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border font-mono text-xs flex items-center justify-between">
            <span className="text-muted-foreground">Evaluation Suite</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Pass
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}
