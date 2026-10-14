'use client';

import React from 'react';
import Link from 'next/link';
import type { PromptWithStats } from './prompt-repositories-list';

interface PromptTableViewProps {
  prompts: PromptWithStats[];
}

export function PromptTableView({ prompts }: PromptTableViewProps) {
  return (
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
          {prompts.map((prompt) => (
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
                  Open studio
                </Link>
                <Link
                  href={`/dashboard/prompts/${prompt.id}/edit`}
                  className="text-zinc-400 hover:text-zinc-200 tab-interactive"
                >
                  Edit bundle
                </Link>
                <Link
                  href={`/dashboard/prompts/${prompt.id}/diff`}
                  className="text-zinc-400 hover:text-zinc-200 tab-interactive"
                >
                  View diff
                </Link>
                <Link
                  href={`/dashboard/prompts/${prompt.id}/tests`}
                  className="text-emerald-300 hover:text-emerald-200 tab-interactive font-bold"
                >
                  Run evals
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
