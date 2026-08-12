'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardWorkspaceView } from '@/components/domain/dashboard/dashboard-workspace-view';

export function DashboardHeroScreen() {
  const [activeMobileTab, setActiveMobileTab] = useState<'sidebar' | 'workspace'>('workspace');

  return (
    <section className="px-3 sm:px-6 md:px-8 max-w-7xl mx-auto mt-4 sm:mt-6 mb-16 sm:mb-24 font-sans">
      <div className="bg-bg-card rounded-2xl border border-zinc-800/90 shadow-2xl overflow-hidden">
        
        {/* Browser Top Window Bar */}
        <div className="bg-bg-page text-zinc-300 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-xs font-mono border-b border-zinc-800/90">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-bg-panel border border-zinc-800/60 text-zinc-300 text-[10px] sm:text-[11px] truncate">
              gitforprompts.com/dashboard (Demo Workspace)
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-emerald-300 font-mono text-[11px] font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            100% Interactive Demo
          </div>
        </div>

        {/* Mobile Segmented Control Bar (< 768px) */}
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800/80 p-2 flex items-center justify-center gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveMobileTab('sidebar')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeMobileTab === 'sidebar'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>📁 Prompts Tree</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('workspace')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeMobileTab === 'workspace'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>⚡ Studio Editor</span>
          </button>
        </div>

        {/* Replica App Layout Shell (Sidebar + Main Studio Workspace) */}
        <div className="flex flex-col md:flex-row min-h-[520px] md:min-h-[640px]">
          {/* Sidebar Pane */}
          <div className={`${activeMobileTab === 'sidebar' ? 'block' : 'hidden'} md:block`}>
            <DashboardSidebar isDemo={true} />
          </div>

          {/* Main Workspace Pane */}
          <div className={`flex-1 p-2.5 sm:p-4 bg-bg-page min-w-0 ${activeMobileTab === 'workspace' ? 'block' : 'hidden'} md:block`}>
            <DashboardWorkspaceView isDemo={true} isFullScreen={true} />
          </div>
        </div>

      </div>
    </section>
  );
}
