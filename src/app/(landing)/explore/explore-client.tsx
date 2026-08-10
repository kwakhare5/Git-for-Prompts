'use client';

import { useState } from 'react';
import { ForkButton } from '@/components/domain/prompts/fork-button';
import { RelativeTime } from '@/components/layout/relative-time';
import { Search } from 'lucide-react';

interface PublicPrompt {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  latestVersionContent: string;
  latestVersionNumber: number;
  modelConfig: { provider?: string; model?: string };
  testsPassed: number;
  testsTotal: number;
  updatedAt: Date;
}

export function ExploreClient({ publicPrompts }: { publicPrompts: PublicPrompt[] }) {
  const [search, setSearch] = useState('');

  const filtered = publicPrompts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase() ?? '').includes(q) ||
      (p.modelConfig.provider?.toLowerCase() ?? '').includes(q) ||
      (p.modelConfig.model?.toLowerCase() ?? '').includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Search Input Bar */}
      <div className="relative max-w-md font-mono">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts, models, or keywords..."
          className="w-full rounded-xl border border-zinc-800 bg-bg-card pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 shadow-xl"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-zinc-800/90 rounded-2xl bg-bg-card space-y-3 font-mono">
          <p className="text-sm font-bold text-zinc-200">No public prompts match your search</p>
          <p className="text-xs text-zinc-500">Try searching for a different keyword or model provider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((prompt) => (
            <div
              key={prompt.id}
              className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-zinc-700/80 transition-all group"
            >
              <div className="space-y-3 font-mono">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-blue-300 transition-colors">
                      {prompt.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                      <span>Updated <RelativeTime date={prompt.updatedAt} /></span>
                      <span>·</span>
                      <span className="text-blue-300 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                        v{prompt.versionCount} snapshot{prompt.versionCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <ForkButton promptId={prompt.id} promptName={prompt.name} />
                </div>

                <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                  {prompt.description || 'No description provided.'}
                </p>

                {/* Model & Evals Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  <span className="bg-[#202024] text-zinc-300 border border-zinc-700/60 px-2.5 py-1 rounded-lg">
                    ⚡ {prompt.modelConfig.provider ?? 'groq'}/{prompt.modelConfig.model ?? 'llama-3.3-70b'}
                  </span>
                  {prompt.testsTotal > 0 && (
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
                      ✓ Evals: {prompt.testsPassed}/{prompt.testsTotal} ({Math.round((prompt.testsPassed / prompt.testsTotal) * 100)}%)
                    </span>
                  )}
                </div>

                {/* Content snippet preview */}
                <div className="rounded-xl border border-zinc-800 bg-bg-page p-3 text-[11px] font-mono text-zinc-300 max-h-28 overflow-hidden relative">
                  <pre className="whitespace-pre-wrap break-words leading-relaxed text-zinc-400">
                    {prompt.latestVersionContent || '// No prompt content'}
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
