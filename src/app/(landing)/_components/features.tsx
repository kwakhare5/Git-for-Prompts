'use client';

const FEATURES = [
  {
    icon: '📦',
    title: 'Local-first storage',
    description:
      'Everything lives in a local SQLite database inside your project. No API keys, no cloud account needed to start. Your prompts are yours.',
    tags: ['SQLite', 'Wasm', 'Offline'],
  },
  {
    icon: '📜',
    title: 'Full version history',
    description:
      'Every save is an immutable, append-only version row. Rollback to any point in history. Race conditions blocked at the DB level via advisory locks.',
    tags: ['Immutable', 'Rollback', 'Concurrent-safe'],
  },
  {
    icon: '🔍',
    title: 'Side-by-side diff',
    description:
      'Monaco Editor-powered diff view (same engine as VS Code). See exactly what changed between any two versions — line-level, character-level.',
    tags: ['Monaco', 'Diff', 'V2 Bundle'],
  },
  {
    icon: '⚡',
    title: 'Eval runner',
    description:
      'Define input + criteria once. Run your prompt against any LLM provider. Score pass rates. Compare v1 vs v2 side-by-side automatically.',
    tags: ['Evals', 'A/B testing', 'Multi-provider'],
  },
  {
    icon: '☁️',
    title: 'Cloud sync on demand',
    description:
      'Push to cloud when you\'re ready. Pull on another machine. Caches cloud IDs locally so repeated syncs are instant.',
    tags: ['gfp push', 'gfp pull', 'REST API'],
  },
  {
    icon: '🔗',
    title: 'Webhooks + API',
    description:
      'HMAC-signed `version.created` events. REST API with `gfp_live_*` bearer auth. Integrate into any CI pipeline.',
    tags: ['Webhooks', 'HMAC', 'REST'],
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">Features</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Everything prompts deserve.
        </h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-base leading-relaxed">
          Built for engineers who treat prompt engineering as a first-class discipline — not an afterthought.
        </p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 flex flex-col gap-4 hover:border-white/[0.12] hover:bg-white/[0.04] transition-colors"
          >
            {/* Icon */}
            <span className="text-2xl leading-none">{feature.icon}</span>

            {/* Title + Description */}
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-base font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-zinc-500 border border-white/[0.06] rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
