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
    <div className="flex items-center gap-3 flex-wrap font-sans">
      {/* FROM selector */}
      <div className="flex items-center gap-2 font-sans">
        <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase font-semibold">
          From
        </span>
        <select
          value={fromId}
          onChange={(e) => navigate(e.target.value, toId)}
          aria-label="Base version (from)"
          className="cursor-pointer rounded-xl border border-border bg-card px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
        >
          {versions.map((v) => (
            <option key={v.id} value={v.id} disabled={v.id === toId}>
              {formatVersionLabel(v, '·')}
            </option>
          ))}
        </select>
      </div>

      <span className="text-muted-foreground font-mono text-sm" aria-hidden="true">→</span>

      {/* TO selector */}
      <div className="flex items-center gap-2 font-sans">
        <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase font-semibold">
          To
        </span>
        <select
          value={toId}
          onChange={(e) => navigate(fromId, e.target.value)}
          aria-label="Target version (to)"
          className="cursor-pointer rounded-xl border border-border bg-card px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
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
