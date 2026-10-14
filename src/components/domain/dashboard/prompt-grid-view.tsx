'use client';

import React from 'react';
import Link from 'next/link';
import type { PromptWithStats } from './prompt-repositories-list';

interface PromptGridViewProps {
  prompts: PromptWithStats[];
}

export function PromptGridView({ prompts }: PromptGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
      {prompts.map((prompt) => (
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
              Open studio →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
