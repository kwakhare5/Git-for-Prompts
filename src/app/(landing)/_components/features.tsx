import { HardDrive, History, GitCompare, Zap, Cloud, Webhook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const FEATURES = [
  {
    icon: HardDrive,
    title: 'Local-first storage',
    description:
      'Everything lives in a local SQLite database inside your project directory. 100% offline — zero cloud lock-in.',
    tags: ['SQLite Wasm', 'Offline', 'Zero Latency'],
  },
  {
    icon: History,
    title: 'Full version history',
    description:
      'Every save creates an immutable append-only version row. Rollback to any past point instantly with atomic DB advisory locks.',
    tags: ['Immutable', 'Rollback', 'Advisory Lock'],
  },
  {
    icon: GitCompare,
    title: 'Side-by-side diff',
    description:
      'VS Code Monaco engine powers visual line-level diffs. Compare system prompts, user templates, and model parameters side-by-side.',
    tags: ['Monaco Engine', 'Visual Diff', 'Bundle Schema'],
  },
  {
    icon: Zap,
    title: 'Eval runner',
    description:
      'Define input variables & scoring assertions once. Run prompt bundles against Groq, OpenAI, or Anthropic in parallel.',
    tags: ['Evals', 'A/B Testing', 'Multi-Model'],
  },
  {
    icon: Cloud,
    title: 'Cloud sync on demand',
    description:
      'Push local bundles to cloud when ready with gfp push. Pull on another machine with gfp pull. Caches IDs locally.',
    tags: ['gfp push', 'gfp pull', 'REST Sync'],
  },
  {
    icon: Webhook,
    title: 'Webhooks + API',
    description:
      'HMAC-SHA256 signed version.created events fired to your endpoint. REST API with gfp_live_* bearer authentication.',
    tags: ['HMAC Signature', 'REST API', 'CI/CD'],
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 pt-20 pb-12 select-none font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">Features</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Everything prompts deserve.
        </h2>
        <p className="mt-2 text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed font-light">
          Built for software engineers who treat prompt engineering as a first-class code discipline.
        </p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="group p-5 flex flex-col gap-3.5"
            >
              {/* Vector Icon Badge */}
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:border-white/20 transition-colors">
                <Icon className="w-4 h-4 text-[#f5f0eb]" />
              </div>

              {/* Title + Description */}
              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">{feature.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {feature.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] font-mono text-zinc-500 border-white/[0.06] bg-transparent px-2 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
