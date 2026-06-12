'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { deletePrompt } from '@/lib/actions/prompts';
import { RelativeTime } from '@/components/relative-time';
import { DeleteConfirmButton } from '@/components/ui/delete-confirm-button';
import { cn } from '@/lib/utils';

type PromptWithStats = {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  testsPassed: number;
  testsTotal: number;
  updatedAt: Date;
};

export function PromptCard({ prompt }: { prompt: PromptWithStats }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deletePrompt({ promptId: prompt.id });
    });
  }

  const passRate =
    prompt.testsTotal > 0
      ? `${prompt.testsPassed}/${prompt.testsTotal} passing`
      : 'No tests';

  // V1+V2: three-tier color scale — no-tests (muted), 0% (red), partial (amber), 100% (green)
  const passRateColor =
    prompt.testsTotal === 0
      ? 'text-zinc-500'           // visible but clearly secondary
      : prompt.testsPassed === 0
      ? 'text-red-400'            // 0% — failing
      : prompt.testsPassed === prompt.testsTotal
      ? 'text-emerald-500'        // 100% — all pass
      : 'text-amber-500';         // partial

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80',
        isPending && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Delete action — absolutely positioned top-right */}
      <div className="absolute right-3 top-3 z-20">
        <DeleteConfirmButton
          onDelete={handleDelete}
          ariaLabel={`Delete ${prompt.name}`}
          isPending={isPending}
        />
      </div>

      {/* Name + version badge */}
      <div className="flex items-center gap-2 mb-2 min-w-0 pr-8">
        <Link
          href={`/dashboard/prompts/${prompt.id}`}
          className="min-w-0 font-medium text-zinc-50 hover:text-zinc-300 transition-colors line-clamp-1 before:absolute before:inset-0 before:z-0"
        >
          {prompt.name}
        </Link>
        {/* V3: removed uppercase so badge reads v4, matching the detail page badge */}
        <span className="relative z-10 shrink-0 font-mono text-[10px] text-zinc-500 bg-zinc-800/50 border border-zinc-700/50 px-2 py-0.5 rounded">
          v{prompt.versionCount}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-500 truncate flex-1 mb-4">
        {prompt.description ?? 'No description'}
      </p>

      {/* Bottom row: test pass rate + last modified */}
      <div className="flex items-center justify-between text-xs relative z-10">
        <span className={cn('font-mono tabular-nums', passRateColor)}>{passRate}</span>
        <RelativeTime date={prompt.updatedAt} />
      </div>
    </div>
  );
}
