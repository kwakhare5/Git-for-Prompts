'use client';

import { useRouter } from 'next/navigation';
import { formatVersionLabel } from '@/lib/format-version-label';
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
    <div className="flex items-center gap-3 flex-wrap">
      {/* FROM selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase font-semibold">
          From
        </span>
        <select
          value={fromId}
          onChange={(e) => navigate(e.target.value, toId)}
          aria-label="Base version (from)"
          className="cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
        >
          {versions.map((v) => (
            <option key={v.id} value={v.id} disabled={v.id === toId}>
              {formatVersionLabel(v, '·')}
            </option>
          ))}
        </select>
      </div>

      <span className="text-zinc-500 font-mono text-sm" aria-hidden="true">→</span>

      {/* TO selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase font-semibold">
          To
        </span>
        <select
          value={toId}
          onChange={(e) => navigate(fromId, e.target.value)}
          aria-label="Target version (to)"
          className="cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
        >
          {versions.map((v) => (
            <option key={v.id} value={v.id} disabled={v.id === fromId}>
              {formatVersionLabel(v, '·')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
