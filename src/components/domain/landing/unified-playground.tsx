'use client';

import { useState } from 'react';
import { GitCompare, Play, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InteractiveDiffPlayground } from './interactive-diff-playground';
import { SandboxWorkspace } from './sandbox-workspace';
import { SdkSection } from './sdk-section';

export function UnifiedPlayground() {
  const [activeTab, setActiveTab] = useState<'diff' | 'sandbox' | 'cli'>('diff');

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-8 select-none font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1 text-xs font-sans text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Interactive Master Workbench
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight font-sans">
          Test the Complete VCS Workflow Live
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal font-sans">
          Compare prompt versions side-by-side, evaluate natural language test assertions, or trigger REST API commands.
        </p>
      </div>

      {/* Unified Tab Switcher Bar */}
      <div className="flex items-center justify-center gap-2 font-sans text-xs max-w-md mx-auto p-1.5 rounded-xl border border-border bg-card shadow-sm">
        <Button
          type="button"
          variant={activeTab === 'diff' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('diff')}
          className="flex-1 gap-1.5 font-semibold cursor-pointer font-sans"
        >
          <GitCompare className="w-3.5 h-3.5" /> Monaco Diff
        </Button>
        <Button
          type="button"
          variant={activeTab === 'sandbox' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('sandbox')}
          className="flex-1 gap-1.5 font-semibold cursor-pointer font-sans"
        >
          <Play className="w-3.5 h-3.5" /> Sandbox Test
        </Button>
        <Button
          type="button"
          variant={activeTab === 'cli' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('cli')}
          className="flex-1 gap-1.5 font-semibold cursor-pointer font-sans"
        >
          <Terminal className="w-3.5 h-3.5" /> CLI &amp; REST
        </Button>
      </div>

      {/* Tab Panels */}
      <div className="mt-6 font-sans">
        {activeTab === 'diff' && <InteractiveDiffPlayground />}
        {activeTab === 'sandbox' && <SandboxWorkspace />}
        {activeTab === 'cli' && <SdkSection />}
      </div>
    </section>
  );
}
