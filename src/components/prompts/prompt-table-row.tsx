'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { deletePrompt } from '@/lib/actions/prompts';
import { StatusBadge } from "@/components/layout/status-badge";
import { RelativeTime } from '@/components/layout/relative-time';
import { DeleteConfirmButton } from '@/components/ui/delete-confirm-button';
import { cn } from '@/lib/utils';
import { Globe, Lock, Copy, Check, ExternalLink, GitCommit } from 'lucide-react';
import { toast } from 'sonner';

export type PromptRow = {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  testsPassed: number;
  testsTotal: number;
  updatedAt: Date;
  isPublic: boolean;
};

export function PromptTableRow({ prompt }: { prompt: PromptRow }) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deletePrompt({ promptId: prompt.id });
      toast.success(`Deleted bundle "${prompt.name}"`);
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(prompt.id);
    setCopied(true);
    toast.success(`Copied ID: ${prompt.id}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const passRate =
    prompt.testsTotal > 0
      ? `${prompt.testsPassed}/${prompt.testsTotal}`
      : 'Untested';

  const passRateColor =
    prompt.testsTotal === 0
      ? 'bg-[#111111] text-zinc-400 border-white/[0.08]'
      : prompt.testsPassed === prompt.testsTotal
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : prompt.testsPassed === 0
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <tr
      className={cn(
        'group border-b border-white/[0.08] transition-colors duration-150 hover:bg-white/[0.03] font-sans',
        isPending && 'opacity-40 pointer-events-none'
      )}
    >
      <td className="py-3.5 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={`/dashboard/prompts/${prompt.id}`}
            className="font-semibold text-[#f5f0eb] hover:text-white transition-colors line-clamp-1 text-xs sm:text-sm font-sans"
          >
            {prompt.name}
          </Link>
          <StatusBadge variant="violet" icon={GitCommit}>
            v{prompt.versionCount}
          </StatusBadge>
          {prompt.isPublic ? (
            <StatusBadge variant="sky" icon={Globe}>
              Public
            </StatusBadge>
          ) : (
            <StatusBadge variant="neutral" icon={Lock}>
              Private
            </StatusBadge>
          )}
        </div>
        {prompt.description && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1 max-w-md font-sans">
            {prompt.description}
          </p>
        )}
      </td>

      <td className="py-3.5 px-3 hidden sm:table-cell">
        <span className={cn('font-mono text-xs px-2.5 py-1 rounded-full border font-semibold inline-flex items-center gap-1.5', passRateColor)}>
          {passRate}
        </span>
      </td>

      <td className="py-3.5 px-3 text-xs text-zinc-400 hidden md:table-cell whitespace-nowrap font-mono">
        <RelativeTime date={prompt.updatedAt} />
      </td>

      <td className="py-3.5 pr-4 pl-3 sm:pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            title="Copy Prompt ID"
            className="p-1.5 rounded-lg border border-white/[0.08] bg-[#111111] text-zinc-400 hover:text-[#f5f0eb] hover:border-white/20 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <Link
            href={`/dashboard/prompts/${prompt.id}`}
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#111111] hover:bg-white/10 transition-all font-medium"
          >
            Open <ExternalLink className="w-3 h-3 text-zinc-400" />
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
