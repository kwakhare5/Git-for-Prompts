'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ChevronRight } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  codePreview: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'diffing',
    title: 'Monaco Side-by-Side Diffing',
    badge: 'v1 → v2',
    description: 'Visual red/green diff highlighting lets you inspect exact line additions, prompt rewrites, and system instruction modifications.',
    codePreview: `- You are a generic assistant.\n+ You are an empathetic customer support agent for Acme.\n+ Enforce 30-day money-back guarantee.`,
  },
  {
    id: 'lineage',
    title: 'Immutable Lineage History',
    badge: 'Append-Only',
    description: 'Every prompt save writes a new version snapshot. Versions are immutable and protected by Postgres advisory locks.',
    codePreview: `v1 | Initial draft | 2026-08-01\nv2 | Added refund policy | 2026-08-03\nv3 | Tuned temperature & maxTokens | 2026-08-07`,
  },
  {
    id: 'rollback',
    title: '1-Click Version Restore',
    badge: 'Instant Safety',
    description: 'If an LLM behavior drift occurs in production, instantly revert to any past version without losing history.',
    codePreview: `insertNextVersion(promptId, restoreVersionId)\n✓ Restored v1 as v4 snapshot in 14ms`,
  },
];

export function VersionFeatures() {
  const [activeTab, setActiveTab] = useState<string>('diffing');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <GitBranch className="w-3.5 h-3.5" /> Tailark Expandable Features 3
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Git-grade version control for prompts
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Never lose a working prompt again. Track, diff, and rollback prompt versions with zero friction.
        </p>
      </div>

      {/* 3-Card Expandable Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {FEATURES.map((feature) => {
          const isActive = activeTab === feature.id;
          return (
            <Card
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`p-6 space-y-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-card to-background border-emerald-500/40 shadow-2xl ring-1 ring-emerald-500/20'
                  : 'bg-card/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] ${
                      isActive
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                        : 'text-muted-foreground border-border'
                    }`}
                  >
                    {feature.badge}
                  </Badge>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'rotate-90 text-emerald-400' : 'text-muted-foreground'
                    }`}
                  />
                </div>

                <CardTitle className="text-lg font-bold text-foreground font-sans">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {feature.description}
                </CardDescription>
              </div>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-border font-mono text-[11px] text-emerald-300 overflow-x-auto pt-3 border-t border-emerald-500/20"
                  >
                    <pre className="leading-relaxed font-mono whitespace-pre-wrap">{feature.codePreview}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
