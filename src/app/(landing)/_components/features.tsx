'use client';

import { useState } from 'react';
import { GitTreeGraphic } from './graphics/git-tree';
import { DiffWipeGraphic } from './graphics/diff-wipe';
import { PipelineGraphic } from './graphics/pipeline';
import { ApiFlowGraphic } from './graphics/api-flow';

export function Features() {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features = [
    {
      num: '01',
      title: 'Branching Commits',
      desc: 'Save prompt updates as Git-like commits. Track authors, timelines, and messages in an immutable tree.'
    },
    {
      num: '02',
      title: 'Visual Diff Comparisons',
      desc: 'Wipe across prompt versions with a draggable divider. Identify deletions and additions instantly.'
    },
    {
      num: '03',
      title: 'Automated Test Runner',
      desc: 'Simulate concurrent model checks. Assert output parameters against natural language guidelines.'
    },
    {
      num: '04',
      title: 'Runtime API Delivery',
      desc: 'Fetch active versions dynamically via API key. Decouple prompt updates from app redeployments.'
    }
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column - Feature Cards */}
      <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
        {features.map((feature, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFeature(idx)}
            className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${
              activeFeature === idx
                ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100 shadow-lg shadow-zinc-950/40 relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:bg-zinc-50 before:rounded-r'
                : 'bg-zinc-900/10 border-zinc-950 hover:bg-zinc-900/20 hover:border-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className={`font-mono text-xs font-bold leading-5 ${activeFeature === idx ? 'text-zinc-50' : 'text-zinc-600'}`}>
              {feature.num}
            </span>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">{feature.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Right Column - Custom Graphic Canvas */}
      <div className="lg:col-span-7 h-[420px] rounded-xl border border-zinc-900 bg-zinc-900/15 backdrop-blur-sm overflow-hidden flex flex-col relative select-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/60 via-transparent to-zinc-950/60 pointer-events-none" />
        
        <div className="relative z-10 flex-1 flex flex-col h-full">
          {activeFeature === 0 && <GitTreeGraphic />}
          {activeFeature === 1 && <DiffWipeGraphic />}
          {activeFeature === 2 && <PipelineGraphic />}
          {activeFeature === 3 && <ApiFlowGraphic />}
        </div>
      </div>
    </section>
  );
}
