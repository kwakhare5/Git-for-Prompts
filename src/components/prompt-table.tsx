'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { deletePrompt } from '@/lib/actions/prompts';
import { StatusBadge } from "@/components/status-badge";
import { RelativeTime } from '@/components/relative-time';
import { DeleteConfirmButton } from '@/components/ui/delete-confirm-button';
import { cn } from '@/lib/utils';
import { Globe, Lock, Search, Copy, Check, ExternalLink, GitCommit } from 'lucide-react';
import { toast } from 'sonner';

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
  const [copied, setCopied] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deletePrompt({ promptId: prompt.id });
      toast.success(`Deleted bundle "${prompt.name}"`);
    });
  }

  function handleCopyId() {
    navigator.clipboard.writeText(prompt.id);
    setCopied(true);
    toast.success(`Copied ID: ${prompt.id}`);
    setTimeout(() => setCopied(false), 2000);
  }

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

export function PromptTable({ prompts }: { prompts: PromptRow[] }) {
  const [search, setSearch] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    if (filterVisibility === 'public') return matchesSearch && p.isPublic;
    if (filterVisibility === 'private') return matchesSearch && !p.isPublic;
    return matchesSearch;
  });

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter prompts by name, description, or ID..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#161616] text-sm text-[#f5f0eb] placeholder:text-zinc-500 focus:outline-none focus:border-white/20 font-mono transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#161616] border border-white/[0.08] p-1 rounded-xl font-mono text-xs shrink-0">
          <button
            onClick={() => setFilterVisibility('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer font-medium active:scale-[0.98]',
              filterVisibility === 'all'
                ? 'bg-[#111111] text-[#f5f0eb] border border-white/[0.08] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            All ({prompts.length})
          </button>
          <button
            onClick={() => setFilterVisibility('public')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer font-medium active:scale-[0.98]',
              filterVisibility === 'public'
                ? 'bg-[#111111] text-[#f5f0eb] border border-white/[0.08] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Public ({prompts.filter((p) => p.isPublic).length})
          </button>
          <button
            onClick={() => setFilterVisibility('private')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer font-medium active:scale-[0.98]',
              filterVisibility === 'private'
                ? 'bg-[#111111] text-zinc-200 border border-white/[0.08] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Private ({prompts.filter((p) => !p.isPublic).length})
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#161616] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#111111]">
              <th className="py-3.5 pl-4 pr-3 sm:pl-6 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Prompt Bundle
              </th>
              <th className="py-3.5 px-3 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold hidden sm:table-cell">
                Evaluation Pass
              </th>
              <th className="py-3.5 px-3 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold hidden md:table-cell">
                Last Commit
              </th>
              <th className="py-3.5 pr-4 pl-3 sm:pr-6 text-right text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.08] bg-transparent">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <PromptTableRow key={prompt.id} prompt={prompt} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs font-mono text-zinc-500">
                  No matching prompt bundles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
