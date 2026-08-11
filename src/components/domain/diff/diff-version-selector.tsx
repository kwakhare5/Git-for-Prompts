'use client';

import { useRouter } from 'next/navigation';
import { formatVersionLabel } from '@/lib/format-version-label';
import { ChevronDown } from 'lucide-react';
import type { InferSelectModel } from 'drizzle-orm';
import type { versions } from '@/db/schema';

type Version = InferSelectModel<typeof versions>;

interface DiffVersionSelectorProps {
  promptId: string;
  versions: Version[];
  fromId: string;
  toId: string;
}

export function DiffVersionSelector({
  promptId,
  versions,
  fromId,
  toId,
}: DiffVersionSelectorProps) {
  const router = useRouter();

  function navigate(nextFrom: string, nextTo: string) {
    router.push(`/dashboard/prompts/${promptId}/diff?from=${nextFrom}&to=${nextTo}`);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap font-sans">
      {/* FROM selector */}
      <div className="flex items-center gap-2 font-sans">
        <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase font-semibold">
          From
        </span>
        <div className="relative">
          <select
            value={fromId}
            onChange={(e) => navigate(e.target.value, toId)}
            aria-label="Base version (from)"
            className="cursor-pointer appearance-none rounded-xl border border-zinc-800 bg-bg-page pl-3.5 pr-8 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-600 transition-colors [color-scheme:dark]"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === toId} className="bg-bg-page text-zinc-100 font-mono">
                {formatVersionLabel(v, '·')}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      <span className="text-zinc-500 font-mono text-sm" aria-hidden="true">→</span>

      {/* TO selector */}
      <div className="flex items-center gap-2 font-sans">
        <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase font-semibold">
          To
        </span>
        <div className="relative">
          <select
            value={toId}
            onChange={(e) => navigate(fromId, e.target.value)}
            aria-label="Target version (to)"
            className="cursor-pointer appearance-none rounded-xl border border-zinc-800 bg-bg-page pl-3.5 pr-8 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-600 transition-colors [color-scheme:dark]"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === fromId} className="bg-bg-page text-zinc-100 font-mono">
                {formatVersionLabel(v, '·')}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
