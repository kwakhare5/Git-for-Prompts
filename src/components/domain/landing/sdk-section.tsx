'use client';

import { useState, useEffect } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'success' | 'info';
}

const SCRIPT_STEPS = [
  {
    cmd: 'gfp init',
    desc: 'Initialize zero-dependency SQLite repository',
    output: '✓ Initialized .gfp/ local prompt database',
  },
  {
    cmd: 'gfp add customer-support --content "..."',
    desc: 'Save local prompt version snapshot',
    output: '✓ Saved v1 · 142 chars',
  },
  {
    cmd: 'gfp push customer-support',
    desc: 'Sync local version to cloud Postgres',
    output: '✓ Created cloud prompt: customer-support\n✓ Pushed v1 → cloud v1',
  },
  {
    cmd: 'gfp pull customer-support',
    desc: 'Pull latest cloud version to local SQLite',
    output: '✓ Pulled cloud v3 → local v3',
  },
];

export function SdkSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  return (
    <section id="cli" className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-10 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 rounded-md">
          CLI & Local Engine
        </Badge>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-sans">
          Local-First CLI + Wasm SQLite Engine
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-sans">
          Run <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded">gfp</code> in your terminal. Zero native build requirements, 100% offline-first.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Staggered Features */}
        <div className="space-y-4 font-sans">
          <Card className="bg-card/70 border-white/10 backdrop-blur-md p-5 space-y-2 font-sans">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">sql.js Wasm</Badge>
              <h3 className="text-sm font-bold text-foreground font-sans">Zero Native Build Dependencies</h3>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Powered by SQLite compiled to WebAssembly. Runs identically across macOS, Linux, and Windows without native C bindings.
            </p>
          </Card>

          <Card className="bg-card/70 border-white/10 backdrop-blur-md p-5 space-y-2 font-sans">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                Bidirectional Sync
              </Badge>
              <h3 className="text-sm font-bold text-foreground font-sans">Cloud Push & Pull</h3>
            </div>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Synchronize local prompt versions with hosted team accounts via O(1) indexed API keys with advisory lock concurrency safety.
            </p>
          </Card>
        </div>

        {/* Right Side: Interactive CLI Terminal Widget */}
        <Card className="bg-[#141414] border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-left">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                gfp CLI
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-sans"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>

          <div className="p-5 space-y-4 bg-background">
            <div className="flex items-center gap-1">
              {SCRIPT_STEPS.map((s, idx) => (
                <Button
                  key={s.cmd}
                  variant={activeStep === idx ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveStep(idx)}
                  className="h-6 px-2 text-[10px] font-mono cursor-pointer"
                >
                  Step {idx + 1}
                </Button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
              <div className="text-foreground flex items-center gap-2 font-bold text-xs">
                <span className="text-emerald-400 select-none">$</span>
                <span>{SCRIPT_STEPS[activeStep].cmd}</span>
              </div>
              <div className="text-muted-foreground text-xs pl-3 border-l border-border whitespace-pre-line">
                {SCRIPT_STEPS[activeStep].output}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground font-sans">
              {SCRIPT_STEPS[activeStep].desc}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
