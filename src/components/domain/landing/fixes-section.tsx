'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Check } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExpandableItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string;
  bullets: string[];
}

const ITEMS: ExpandableItem[] = [
  {
    id: 'versioning',
    title: 'Zero Silent Overwrites',
    subtitle: 'Immutable append-only history with pg_advisory_xact_lock protection.',
    badge: 'Version Safety',
    content: 'Every prompt update creates a new immutable version row. Advisory transaction locks guarantee zero version number collisions during concurrent team updates.',
    bullets: ['Append-only version DB table', 'Advisory transaction lock guarantee', 'Full audit trail with author attribution'],
  },
  {
    id: 'bundles',
    title: 'Atomic Prompt Bundle Schemas',
    subtitle: 'System prompt + user template + model params + JSON schema in one unit.',
    badge: 'Full Bundle',
    content: 'Never version prompt text in isolation. Store system prompt, user template placeholders, provider parameters (temperature, top_p), and JSON response formats together.',
    bullets: ['System prompt & user template pairing', 'Provider model parameter presets', 'Strict Zod JSON output validation'],
  },
  {
    id: 'offline',
    title: 'Local-First SQLite Engine (.gfp)',
    subtitle: '100% offline-first execution via Wasm SQLite with cloud sync.',
    badge: 'Offline-First',
    content: 'Run prompt operations locally via sql.js Wasm SQLite. Work offline on flights or remote environments, and push versions to cloud SaaS when connected.',
    bullets: ['Zero native build dependencies (Wasm)', 'Full local .gfp/ database', 'Bi-directional cloud push & pull'],
  },
];

export function FixesSection() {
  const [expandedId, setExpandedId] = useState<string>('versioning');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" /> Tailark Expandable Features 1
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Engineered to eliminate prompt chaos
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Say goodbye to untracked text files, silent regressions, and unversioned production prompt changes.
        </p>
      </div>

      {/* Tailark Expandable Features 1 Accordion Layout */}
      <div className="space-y-4 max-w-4xl mx-auto font-sans">
        {ITEMS.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <Card
              key={item.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-gradient-to-b from-card to-background border-emerald-500/40 shadow-2xl ring-1 ring-emerald-500/20'
                  : 'bg-card/50 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                    {item.badge}
                  </Badge>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground font-sans">{item.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">{item.subtitle}</CardDescription>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 pt-2 border-t border-border/50 font-sans space-y-4"
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">{item.content}</p>

                    <div className="space-y-2 pt-1 font-mono text-xs">
                      {item.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-center gap-2 text-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
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


