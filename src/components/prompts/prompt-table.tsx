'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { PromptTableRow, type PromptRow } from './prompt-table-row';

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
