'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface PromptWithStats {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  testsPassed: number;
  testsTotal: number;
  isPublic: boolean;
  updatedAt?: Date | string;
}

interface PromptRepositoriesListProps {
  prompts: PromptWithStats[];
}

export function PromptRepositoriesList({ prompts }: PromptRepositoriesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (visibilityFilter === 'public') return p.isPublic;
      if (visibilityFilter === 'private') return !p.isPublic;
      return true;
    });
  }, [prompts, searchQuery, visibilityFilter]);

  const publicCount = useMemo(() => prompts.filter((p) => p.isPublic).length, [prompts]);
  const privateCount = useMemo(() => prompts.filter((p) => !p.isPublic).length, [prompts]);

  return (
    <div className="space-y-4 font-sans">
      {/* Search, Filter, and View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-bg-card border border-zinc-800/90 rounded-2xl shadow-xl">
        {/* Search input */}
        <div className="relative flex-1 font-mono">
          <input
            type="text"
            placeholder="Search prompt repositories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-page border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Visibility filters & View toggle */}
        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <div className="flex items-center bg-bg-page p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setVisibilityFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold tab-interactive ${
                visibilityFilter === 'all'
                  ? 'bg-bg-panel text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({prompts.length})
            </button>
            <button
              onClick={() => setVisibilityFilter('public')}
              className={`px-3 py-1 rounded-lg font-bold tab-interactive ${
                visibilityFilter === 'public'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Public ({publicCount})
            </button>
            <button
              onClick={() => setVisibilityFilter('private')}
              className={`px-3 py-1 rounded-lg font-bold tab-interactive ${
                visibilityFilter === 'private'
                  ? 'bg-bg-panel text-zinc-200 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Private ({privateCount})
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-bg-page p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`px-2.5 py-1 rounded-lg font-bold tab-interactive ${
                viewMode === 'table' ? 'bg-bg-panel text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`px-2.5 py-1 rounded-lg font-bold tab-interactive ${
                viewMode === 'grid' ? 'bg-bg-panel text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Filtered list content */}
      {filteredPrompts.length === 0 ? (
        <div className="p-10 text-center border border-zinc-800/90 rounded-2xl bg-bg-card text-zinc-400 font-mono text-xs shadow-xl space-y-6">
          {prompts.length === 0 ? (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                git
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-100 font-mono">Welcome to Git for Prompts</h3>
                <p className="text-xs text-zinc-400 font-sans">
                  Version control, evaluate, and A/B test your AI prompt templates with immutable commit history.
                </p>
              </div>

              {/* 1-2-3 Workflow steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono">
                <div className="p-3 rounded-xl border border-zinc-800 bg-bg-page space-y-1 card-interactive">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 1</span>
                  <div className="text-xs font-bold text-zinc-200">Create Prompt</div>
                  <p className="text-[11px] text-zinc-500 font-sans">Draft prompt templates & placeholders.</p>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-bg-page space-y-1 card-interactive">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Step 2</span>
                  <div className="text-xs font-bold text-zinc-200">Save Version</div>
                  <p className="text-[11px] text-zinc-500 font-sans">Commit immutable v1, v2 snapshots.</p>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-bg-page space-y-1 card-interactive">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Step 3</span>
                  <div className="text-xs font-bold text-zinc-200">Test & Compare</div>
                  <p className="text-[11px] text-zinc-500 font-sans">Evaluate versions side-by-side with AI.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs btn-interactive"
                >
                  <span>+ Create Your First Prompt</span>
                </Link>
              </div>
            </div>
          ) : (
            <p>No prompt repositories found matching your filter criteria.</p>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <div className="border border-zinc-800/90 rounded-2xl bg-bg-card overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-panel border-b border-zinc-800/90 text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-5">Prompt Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Version</th>
                <th className="p-4">Test Suite</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredPrompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-bg-panel/60 transition-colors">
                  <td className="p-4 pl-5 font-semibold text-zinc-100 font-mono">
                    <Link href={`/dashboard/prompts/${prompt.id}`} className="hover:text-blue-300 tab-interactive">
                      {prompt.name}
                    </Link>
                  </td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate text-xs">
                    {prompt.description || '—'}
                  </td>
                  <td className="p-4 font-mono">
                    <span className="bg-zinc-100/10 text-zinc-100 border border-zinc-800 px-2 py-0.5 rounded text-[11px] font-bold tabular-nums">
                      v{prompt.versionCount}
                    </span>
                  </td>
                  <td className="p-4 font-mono">
                    {prompt.testsTotal > 0 ? (
                      <span className="text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] tabular-nums">
                        {prompt.testsPassed}/{prompt.testsTotal} ({Math.round((prompt.testsPassed / prompt.testsTotal) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">No evals</span>
                    )}
                  </td>
                  <td className="p-4">
                    {prompt.isPublic ? (
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                        Public
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-bg-panel text-zinc-400 border border-zinc-800/60 px-2 py-0.5 rounded">
                        Private
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-5 text-right space-x-3 font-mono text-[11px]">
                    <Link
                      href={`/dashboard/prompts/${prompt.id}`}
                      className="text-zinc-100 hover:text-white font-bold tab-interactive"
                    >
                      Open Studio
                    </Link>
                    <Link
                      href={`/dashboard/prompts/${prompt.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-200 tab-interactive"
                    >
                      Edit Bundle
                    </Link>
                    <Link
                      href={`/dashboard/prompts/${prompt.id}/diff`}
                      className="text-zinc-400 hover:text-zinc-200 tab-interactive"
                    >
                      View Diff
                    </Link>
                    <Link
                      href={`/dashboard/prompts/${prompt.id}/tests`}
                      className="text-emerald-300 hover:text-emerald-200 tab-interactive font-bold"
                    >
                      Run Evals
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-bg-card border border-zinc-800/90 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 card-interactive hover:border-zinc-700"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 font-mono">
                  <Link
                    href={`/dashboard/prompts/${prompt.id}`}
                    className="text-sm font-bold text-zinc-100 hover:text-blue-300 tab-interactive truncate"
                  >
                    {prompt.name}
                  </Link>
                  <span className="bg-zinc-100/10 text-zinc-100 border border-zinc-800 px-2 py-0.5 rounded text-[11px] font-bold shrink-0">
                    v{prompt.versionCount}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                  {prompt.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  {prompt.isPublic ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      Public
                    </span>
                  ) : (
                    <span className="text-[10px] bg-bg-panel text-zinc-400 border border-zinc-800/60 px-2 py-0.5 rounded">
                      Private
                    </span>
                  )}
                  {prompt.testsTotal > 0 ? (
                    <span className="text-[10px] text-emerald-300 font-bold">
                      {Math.round((prompt.testsPassed / prompt.testsTotal) * 100)}% Pass
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">No evals</span>
                  )}
                </div>

                <Link
                  href={`/dashboard/prompts/${prompt.id}`}
                  className="px-3 py-1 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-bold btn-interactive"
                >
                  Open Studio →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
