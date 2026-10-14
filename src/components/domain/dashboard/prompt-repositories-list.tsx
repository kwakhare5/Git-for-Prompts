'use client';

import React, { useState, useMemo } from 'react';
import { PromptTableView } from './prompt-table-view';
import { PromptGridView } from './prompt-grid-view';

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
            placeholder="Search prompts by name or description..."
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
        <div className="p-10 text-center border border-zinc-800/90 rounded-2xl bg-bg-card text-zinc-400 font-mono text-xs shadow-xl space-y-3 py-12">
          <p className="text-zinc-400">No prompts match &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <PromptTableView prompts={filteredPrompts} />
      ) : (
        <PromptGridView prompts={filteredPrompts} />
      )}
    </div>
  );
}
