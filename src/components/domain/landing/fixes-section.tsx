'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Database,
  Code2,
  GitCompare,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { extractVariables } from '@gfp/core';

export function FixesSection() {
  // Card 2 state: Interactive variable pill highlighter
  const [templateInput, setTemplateInput] = useState(
    'Help customer {{customer_name}} with order {{order_id}} on {{policy_tier}} tier'
  );
  const detectedVars = extractVariables(templateInput);

  // Card 4 state: SQLite DB Table selection
  const [selectedTable, setSelectedTable] = useState<'prompts' | 'versions' | 'api_keys'>('versions');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Architectural Pillars
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Built like Git for prompt engineers
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Stop managing prompts in untracked text files or raw code strings. Git for Prompts brings version control, assertions, and local-first SQLite offline sync.
        </p>
      </div>

      {/* Asymmetric 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: Large 2-Column Span — Visual Monaco Diff Engine */}
        <Card className="md:col-span-2 bg-gradient-to-b from-card to-background border-white/10 p-6 md:p-8 space-y-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground font-sans">
                  Immutable Versioning & Monaco Diffs
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                  Every prompt save creates an append-only version snapshot. Compare any two versions side-by-side.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              v1 → v2 Diff
            </Badge>
          </div>

          {/* Mini Visual Diff App */}
          <div className="rounded-xl border border-border bg-zinc-950/90 font-mono text-xs overflow-hidden shadow-inner space-y-0">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold text-foreground">customer-returns.prompt</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">+3 additions · -1 deletion</span>
            </div>

            <div className="p-4 space-y-1 text-[11px]">
              <div className="flex items-start gap-3 text-muted-foreground opacity-60">
                <span className="w-6 text-right select-none font-mono">1</span>
                <span className="text-zinc-500"> You are a customer support agent.</span>
              </div>
              <div className="flex items-start gap-3 bg-red-500/10 text-red-400 -mx-4 px-4 py-0.5 border-l-2 border-red-500 font-mono">
                <span className="w-6 text-right select-none text-red-500/70">- 2</span>
                <span>- Help the customer with refund requests.</span>
              </div>
              <div className="flex items-start gap-3 bg-emerald-500/10 text-emerald-400 -mx-4 px-4 py-0.5 border-l-2 border-emerald-500 font-mono">
                <span className="w-6 text-right select-none text-emerald-500/70">+ 2</span>
                <span>+ You are an empathetic customer support assistant for Acme.</span>
              </div>
              <div className="flex items-start gap-3 bg-emerald-500/10 text-emerald-400 -mx-4 px-4 py-0.5 border-l-2 border-emerald-500 font-mono">
                <span className="w-6 text-right select-none text-emerald-500/70">+ 3</span>
                <span>+ Enforce our 30-day money-back guarantee policy.</span>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <span className="w-6 text-right select-none font-mono">4</span>
                <span> Order ID: &#123;&#123;order_id&#125;&#125;</span>
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 2: 1-Column Span — Live Variable Extraction */}
        <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground font-sans">
                Variable Extraction
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans mt-1">
                Type template placeholders and watch <code className="font-mono text-sky-400">&#123;&#123;var&#125;&#125;</code> extract in real time.
              </CardDescription>
            </div>
          </div>

          <div className="space-y-3 bg-zinc-950/80 p-4 rounded-xl border border-border">
            <Input
              value={templateInput}
              onChange={(e) => setTemplateInput(e.target.value)}
              className="text-xs font-mono bg-background border-border h-9"
              placeholder="Type template text..."
            />

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                Detected Variables ({detectedVars.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detectedVars.length > 0 ? (
                  detectedVars.map((v) => (
                    <motion.div key={v} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Badge variant="outline" className="font-mono text-[10px] text-sky-400 border-sky-500/30 bg-sky-500/10 px-2 py-0.5">
                        &#123;&#123;{v}&#125;&#125;
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground font-mono">No variables detected</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 3: 1-Column Span — Real-Time Eval Score Dial */}
        <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground font-sans">
                Automated Regression Suite
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-sans mt-1">
                Run assertion criteria against prompt versions before pushing to production.
              </CardDescription>
            </div>
          </div>

          <div className="space-y-3 bg-zinc-950/80 p-4 rounded-xl border border-border font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground">Pass Rate</span>
              <span className="text-sm font-mono font-extrabold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100%
              </span>
            </div>
            <Progress value={100} className="h-2 bg-muted [&>div]:bg-emerald-400" />

            <div className="space-y-1 pt-1 text-[11px] font-mono text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>1. Refund Policy Mention</span>
                <span className="text-emerald-400">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2. JSON Format Schema</span>
                <span className="text-emerald-400">PASSED</span>
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 4: Large 2-Column Span — SQLite DB Inspector */}
        <Card className="md:col-span-2 bg-gradient-to-b from-card to-background border-white/10 p-6 md:p-8 space-y-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground font-sans">
                  Local-First SQLite Engine (.gfp)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                  Runs 100% offline via Wasm SQLite. Zero native builds, zero cloud lock-in.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-border">
              {(['versions', 'prompts', 'api_keys'] as const).map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setSelectedTable(tbl)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                    selectedTable === tbl
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-[11px] pb-2 border-b border-border">
              <span className="flex items-center gap-1.5 text-foreground font-bold">
                <Terminal className="w-3.5 h-3.5 text-purple-400" /> .gfp/sqlite.db — TABLE {selectedTable}
              </span>
              <span className="text-purple-400 text-[10px]">sqlite3 Wasm Engine</span>
            </div>

            {selectedTable === 'versions' && (
              <div className="space-y-1.5 text-[11px]">
                <div className="text-foreground font-semibold">
                  SELECT id, version_number, commit_message FROM versions WHERE prompt_id = &apos;p1&apos;;
                </div>
                <div className="text-muted-foreground text-[10px] whitespace-pre-line pl-2 border-l border-purple-500/30">
                  {`v1 | initial prompt draft | 2026-08-01\nv2 | added refund policy constraint | 2026-08-03\nv3 | tuned temperature & maxTokens | 2026-08-07`}
                </div>
              </div>
            )}

            {selectedTable === 'prompts' && (
              <div className="space-y-1.5 text-[11px]">
                <div className="text-foreground font-semibold">SELECT id, name, is_public FROM prompts;</div>
                <div className="text-muted-foreground text-[10px] whitespace-pre-line pl-2 border-l border-purple-500/30">
                  {`p1 | customer-support-returns | isPublic: true\np2 | code-refactoring-agent | isPublic: false`}
                </div>
              </div>
            )}

            {selectedTable === 'api_keys' && (
              <div className="space-y-1.5 text-[11px]">
                <div className="text-foreground font-semibold">SELECT name, key_lookup_hash FROM api_keys;</div>
                <div className="text-muted-foreground text-[10px] whitespace-pre-line pl-2 border-l border-purple-500/30">
                  {`prod-backend | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\ncli-local | 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92`}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

