'use client';

import React, { useState } from 'react';
import { TerminalIcon, CardDark } from '@/components/website/ui-tokens';
import { HeroOverviewView } from './hero-preview/hero-overview-view';
import { HeroDetailView } from './hero-preview/hero-detail-view';

interface DashboardHeroReplicaProps {
  isDemo?: boolean;
  isFullScreen?: boolean;
}

export function DashboardHeroReplica({
  isFullScreen = false,
}: DashboardHeroReplicaProps) {
  const [activeView, setActiveView] = useState<'list' | 'detail'>('list');

  const content =
    activeView === 'list' ? (
      <HeroOverviewView />
    ) : (
      <HeroDetailView onBackToList={() => setActiveView('list')} />
    );

  if (isFullScreen) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-bg-card shadow-2xl overflow-hidden font-sans">
        <div className="bg-bg-page text-zinc-300 px-5 py-3 flex items-center justify-between text-xs font-mono border-b border-zinc-800/90">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-bg-panel border border-zinc-800/60 text-zinc-200">
              <TerminalIcon className="w-3.5 h-3.5 text-blue-300" />
              <span>Workspace Studio · Git for Prompts</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-zinc-400 font-mono">
            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              Live Workspace Connected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-bg-panel text-zinc-400 px-2.5 py-0.5 rounded-lg border border-zinc-800/60 font-mono">
              gitforprompts
            </span>
          </div>
        </div>

        {content}
      </div>
    );
  }

  return (
    <CardDark className="shadow-2xl font-sans text-xs">
      <div className="bg-bg-page text-zinc-300 px-4 py-3 flex items-center justify-between text-xs font-mono border-b border-zinc-800/90">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-bg-panel border border-zinc-800/60 text-zinc-200">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-300" />
            <span>kwakhare5 / Git-for-Prompts</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-zinc-400 font-mono">
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            Local SQLite Wasm Engine Online (Demo Mode)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-bg-panel text-zinc-400 px-2.5 py-0.5 rounded-lg border border-zinc-800/60 font-mono">
            gitforprompts
          </span>
        </div>
      </div>

      {content}
    </CardDark>
  );
}
