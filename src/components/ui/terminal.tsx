'use client';

import * as React from 'react';
import { Terminal as TerminalIcon, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TerminalStep {
  cmd: string;
  desc: string;
  output: string;
}

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: TerminalStep[];
  title?: string;
  versionBadge?: string;
}

const DEFAULT_STEPS: TerminalStep[] = [
  {
    cmd: 'gfp init',
    desc: 'Initialize zero-dependency Wasm SQLite repository',
    output: '✓ Initialized .gfp/ local prompt database\n✓ Created schema tables: prompts, versions, test_cases',
  },
  {
    cmd: 'gfp add customer-support --content "..."',
    desc: 'Save local prompt version snapshot',
    output: '✓ Extracted variables: {{customer_issue}}, {{order_id}}\n✓ Saved v1 snapshot · 142 chars',
  },
  {
    cmd: 'gfp push customer-support',
    desc: 'Sync local version to cloud Postgres SaaS',
    output: '✓ Authenticated via gfp_live_...\n✓ pg_advisory_xact_lock acquired\n✓ Pushed v1 → cloud v1',
  },
  {
    cmd: 'gfp pull customer-support',
    desc: 'Pull latest team version to local SQLite',
    output: '✓ Fetched cloud v3\n✓ Updated local .gfp/ database to v3',
  },
];

export function Terminal({
  steps = DEFAULT_STEPS,
  title = 'gfp CLI Terminal',
  versionBadge = 'v0.2.0 Wasm',
  className,
  ...props
}: TerminalProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const currentStep = steps[activeStep] || steps[0];

  const handleCopy = () => {
    if (currentStep) {
      navigator.clipboard.writeText(currentStep.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-[#0c0c0e] font-mono text-xs shadow-2xl overflow-hidden text-left isolation-auto transition-all',
        className
      )}
      {...props}
    >
      {/* Terminal Window Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 pl-2 border-l border-border">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {versionBadge && (
            <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
              {versionBadge}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-sans"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-5 space-y-4 bg-zinc-950/90">
        {/* Step Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((s, idx) => (
            <Button
              key={s.cmd}
              variant={activeStep === idx ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveStep(idx)}
              className={`h-7 px-3 text-[11px] font-mono cursor-pointer transition-all ${
                activeStep === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Step {idx + 1}
            </Button>
          ))}
        </div>

        {/* Command Line & Output Box */}
        <div className="p-4 rounded-xl bg-card/90 border border-border space-y-2.5 shadow-inner">
          <div className="text-foreground flex items-center gap-2 font-bold text-xs">
            <span className="text-emerald-400 select-none">$</span>
            <span>{currentStep.cmd}</span>
          </div>
          <div className="text-muted-foreground text-[11px] pl-3 border-l-2 border-emerald-500/40 whitespace-pre-line leading-relaxed">
            {currentStep.output}
          </div>
        </div>

        {/* Command Description */}
        <p className="text-xs text-muted-foreground font-sans pt-1">
          {currentStep.desc}
        </p>
      </div>
    </div>
  );
}
