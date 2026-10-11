'use client';

import React from 'react';
import Link from 'next/link';
import { PromptRepositoriesList } from '@/components/domain/dashboard/prompt-repositories-list';
import { DEMO_PROMPTS } from './types';

export function HeroOverviewView() {
  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans bg-bg-page min-h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2.5">
            <span>Prompt Repositories</span>
            <span className="text-xs font-sans font-normal bg-bg-panel text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-800/60">
              Local &amp; Cloud Synced
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Manage, version, diff, and evaluate atomic prompt bundles.</p>
        </div>
        <Link
          href="/sign-in"
          className="h-9 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs btn-interactive flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>+ Create New Prompt</span>
        </Link>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl space-y-1">
          <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Active Prompts</div>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-100">3</div>
          <div className="text-[10px] text-zinc-400 font-mono">Tracked in local SQLite</div>
        </div>

        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl space-y-1">
          <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Total Commits</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-300">12</div>
          <div className="text-[10px] text-zinc-400 font-mono">Immutable snapshots</div>
        </div>

        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl space-y-1">
          <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Evals Passed</div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-300">53/54</div>
          <div className="text-[10px] text-emerald-400 font-mono font-bold">98.1% pass rate</div>
        </div>

        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl space-y-1">
          <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">API Credentials</div>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-100">2</div>
          <div className="text-[10px] text-zinc-400 font-mono">SHA-256 hashed</div>
        </div>
      </div>

      {/* Embedded Real PromptRepositoriesList Table & Grid UI */}
      <PromptRepositoriesList prompts={DEMO_PROMPTS} />
    </div>
  );
}
