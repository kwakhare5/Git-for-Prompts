'use client';

import { useState } from 'react';
import { Code2, Sparkles, Sliders, Cpu, Zap, FileCode, LucideIcon } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { extractVariables } from '@gfp/core';

interface GridFeature {
  icon: LucideIcon;
  title: string;
  badge: string;
  description: string;
}

const GRID_FEATURES: GridFeature[] = [
  {
    icon: Code2,
    title: 'Automatic Variable Extraction',
    badge: 'Regex + AST',
    description: 'Instantly extracts {{variable_name}} tokens from prompt text without manual config.',
  },
  {
    icon: Sliders,
    title: 'Model Parameters Schema',
    badge: 'Groq + OpenRouter',
    description: 'Versions temperature, top_p, max_tokens, and stop sequences alongside text.',
  },
  {
    icon: FileCode,
    title: 'JSON Response Format',
    badge: 'Strict Schemas',
    description: 'Lock your prompt output to structured JSON object formats with Zod validation.',
  },
  {
    icon: Cpu,
    title: 'Dual-Model Engine',
    badge: 'Speed + Accuracy',
    description: 'Runs Groq primary for ultra-fast response and OpenRouter fallback for model variety.',
  },
  {
    icon: Zap,
    title: 'Runtime Variable Injection',
    badge: 'O(1) Interpolation',
    description: 'Safely inject dynamic runtime parameters into templates at execution time.',
  },
  {
    icon: Sparkles,
    title: 'Full Prompt Bundles',
    badge: 'Atomic Snapshots',
    description: 'System prompt + user template + model config + tools versioned as one unit.',
  },
];

export function VariableFeatures() {
  const [templateInput, setTemplateInput] = useState(
    'Welcome {{user_name}}, your order {{order_id}} is being processed for {{delivery_date}}.'
  );
  const detectedVars = extractVariables(templateInput);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-sky-400 border-sky-500/20 bg-sky-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <Code2 className="w-3.5 h-3.5" /> Tailark Expandable Features 6
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Variable engine & prompt schemas
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Manage dynamic variables, model parameters, and response JSON schemas in unified prompt bundles.
        </p>
      </div>

      {/* Live Variable Testing Bar */}
      <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-foreground font-sans">Live Template Interactive Tester</span>
            <p className="text-[11px] text-muted-foreground">Type placeholders to see instant variable extraction</p>
          </div>
          <Badge variant="outline" className="font-mono text-sky-400 border-sky-500/20 bg-sky-500/10 text-xs px-3 py-1">
            {detectedVars.length} Variables Found
          </Badge>
        </div>

        <Input
          value={templateInput}
          onChange={(e) => setTemplateInput(e.target.value)}
          className="font-mono text-xs bg-zinc-950 border-border h-10"
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {detectedVars.map((v) => (
            <Badge key={v} variant="outline" className="font-mono text-xs text-sky-400 border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5">
              &#123;&#123;{v}&#125;&#125;
            </Badge>
          ))}
        </div>
      </Card>

      {/* Asymmetric 6-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {GRID_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className="bg-card/60 border-white/10 p-6 space-y-4 rounded-2xl hover:border-sky-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/10">
                    {item.badge}
                  </Badge>
                </div>

                <CardTitle className="text-base font-bold text-foreground font-sans">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {item.description}
                </CardDescription>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
