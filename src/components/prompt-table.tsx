'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { deletePrompt } from '@/lib/actions/prompts';
import { RelativeTime } from '@/components/relative-time';
import { DeleteConfirmButton } from '@/components/ui/delete-confirm-button';
import { cn } from '@/lib/utils';
import { Globe, Lock } from 'lucide-react';

type PromptRow = {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  testsPassed: number;
  testsTotal: number;
  updatedAt: Date;
  isPublic: boolean;
};

function PromptTableRow({ prompt }: { prompt: PromptRow }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deletePrompt({ promptId: prompt.id });
    });
  }

  const passRate =
    prompt.testsTotal > 0
      ? `${prompt.testsPassed}/${prompt.testsTotal}`
      : 'Untested';

  const passRateColor =
    prompt.testsTotal === 0
      ? 'text-zinc-400 font-mono'
      : prompt.testsPassed === 0
      ? 'text-red-400'
      : prompt.testsPassed === prompt.testsTotal
      ? 'text-emerald-400'
      : 'text-amber-400';

  return (
    <tr
      className={cn(
        'group border-b border-white/[0.06] transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.03]',
        isPending && 'opacity-40 pointer-events-none'
      )}
    >
      {/* Name + version */}
      <td className="py-3 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={`/dashboard/prompts/${prompt.id}`}
            className="font-medium text-zinc-100 hover:text-zinc-300 transition-colors line-clamp-1 text-sm"
          >
            {prompt.name}
          </Link>
          <span className="shrink-0 font-mono text-[10px] text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-0.5 rounded">
            v{prompt.versionCount}
          </span>
          {prompt.isPublic ? (
            <Globe className="h-3 w-3 shrink-0 text-zinc-500" aria-label="Public" />
          ) : (
            <Lock className="h-3 w-3 shrink-0 text-zinc-700" aria-label="Private" />
          )}
        </div>
        {prompt.description && (
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-sm">
            {prompt.description}
          </p>
        )}
      </td>

      {/* Tests */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className={cn('font-mono text-xs tabular-nums', passRateColor)}>
          {passRate}
          {prompt.testsTotal > 0 && (
            <span className="text-zinc-600 ml-0.5 text-[10px]"> passing</span>
          )}
        </span>
      </td>

      {/* Last updated */}
      <td className="py-3 px-3 text-xs text-zinc-500 hidden md:table-cell whitespace-nowrap">
        <RelativeTime date={prompt.updatedAt} />
      </td>

      {/* Actions */}
      <td className="py-3 pr-4 pl-3 sm:pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/prompts/${prompt.id}`}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono hidden sm:inline"
          >
            Open →
          </Link>
          <DeleteConfirmButton
            onDelete={handleDelete}
            ariaLabel={`Delete ${prompt.name}`}
            isPending={isPending}
          />
        </div>
      </td>
    </tr>
  );
}

export function PromptTable({ prompts }: { prompts: PromptRow[] }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#161616] overflow-hidden shadow-xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/[0.08] bg-[#121212]">
            <th className="py-3 pl-4 pr-3 sm:pl-6 text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Prompt
            </th>
            <th className="py-3 px-3 text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold hidden sm:table-cell">
              Tests
            </th>
            <th className="py-3 px-3 text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold hidden md:table-cell">
              Updated
            </th>
            <th className="py-3 pr-4 pl-3 sm:pr-6" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06] bg-[#0a0a0a]">
          {prompts.map((prompt) => (
            <PromptTableRow key={prompt.id} prompt={prompt} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
