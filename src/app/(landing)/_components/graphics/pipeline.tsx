'use client';

import { useState, useEffect } from 'react';

export function PipelineGraphic() {
  const [pipelineState, setPipelineState] = useState<number>(0);
  const [showPassedBadge, setShowPassedBadge] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    let timers: NodeJS.Timeout[] = [];

    const runSequence = () => {
      if (!active) return;
      setPipelineState(0);
      setShowPassedBadge(false);

      const steps = [800, 1500, 2300, 3100, 4200];
      timers = steps.map((delay, i) => setTimeout(() => {
        if (!active) return;
        if (i < 4) setPipelineState(i + 1);
        if (i === 4) setShowPassedBadge(true);
      }, delay));

      // Schedule next iteration loop at 8 seconds
      const resetT = setTimeout(() => {
        if (!active) return;
        timers.forEach(clearTimeout);
        runSequence();
      }, 8000);
      timers.push(resetT);
    };

    runSequence();

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400 relative">
      {/* Background grid dots */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 0)',
        backgroundSize: '18px 18px'
      }} />

      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 z-10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Automated Scoring Pipeline</span>
        <span className={`text-[9px] font-mono transition-colors font-semibold ${showPassedBadge ? 'text-emerald-400' : 'text-zinc-500'}`}>
          {showPassedBadge ? '● All assertions passed' : '● Simulation running…'}
        </span>
      </div>

      {/* Node row — flex so bars naturally span between nodes */}
      <div className="flex items-center py-5 px-1 z-10">

        {/* Node 1 — Input */}
        <div className={`relative flex-none w-[28%] p-3.5 rounded-xl border text-center transition-all duration-300 ${
          pipelineState >= 1 
            ? 'bg-zinc-900/90 border-zinc-700 shadow-lg shadow-zinc-950/20' 
            : 'bg-zinc-950/60 border-zinc-900'
        }`}>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold tracking-wider">1. Input</span>
          <span className="text-[9px] text-zinc-300 font-mono block mt-1 truncate font-semibold">returns_v2</span>
          {pipelineState >= 1 && (
            <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </div>

        {/* Bar 1: Node1 → Node2 */}
        <div className="flex-1 mx-2 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: pipelineState >= 2 ? '100%' : '0%' }}
          />
        </div>

        {/* Node 2 — LLM */}
        <div className={`relative flex-none w-[28%] p-3.5 rounded-xl border text-center transition-all duration-500 ${
          pipelineState >= 2
            ? 'bg-zinc-900 border-emerald-900/60 glow-green'
            : pipelineState === 1
            ? 'bg-zinc-900/40 border-zinc-850 animate-pulse'
            : 'bg-zinc-950/60 border-zinc-900'
        }`}>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold tracking-wider">2. Groq LLM</span>
          <span className={`text-[9px] font-mono block mt-1 font-bold transition-colors ${
            pipelineState >= 2 ? 'text-emerald-400' : pipelineState === 1 ? 'text-zinc-400 animate-pulse' : 'text-zinc-655'
          }`}>
            {pipelineState >= 2 ? 'Responded ✓' : pipelineState === 1 ? 'Calling…' : 'Idle'}
          </span>
          {pipelineState >= 2 && (
            <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </div>

        {/* Bar 2: Node2 → Node3 */}
        <div className="flex-1 mx-2 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: pipelineState >= 3 ? '100%' : '0%' }}
          />
        </div>

        {/* Node 3 — Grader */}
        <div className={`relative flex-none w-[28%] p-3.5 rounded-xl border text-center transition-all duration-500 ${
          showPassedBadge
            ? 'bg-emerald-950/20 border-emerald-800/80 glow-green-strong'
            : pipelineState >= 3
            ? 'bg-zinc-900/95 border-zinc-700'
            : 'bg-zinc-950/60 border-zinc-900'
        }`}>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold tracking-wider">3. Grader</span>
          <span className={`text-[9px] font-mono block mt-1 font-bold transition-colors ${
            showPassedBadge ? 'text-emerald-400' : pipelineState >= 3 ? 'text-zinc-400' : 'text-zinc-655'
          }`}>
            {showPassedBadge ? 'Scored ✓' : pipelineState >= 3 ? 'Grading…' : 'Idle'}
          </span>
          {showPassedBadge && (
            <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </div>
      </div>

      {/* Log window */}
      <div className="border border-zinc-900 bg-zinc-950/90 rounded-lg p-3.5 font-mono text-[10px] text-zinc-400 space-y-1.5 min-h-[110px] flex flex-col justify-center relative overflow-hidden z-10 shadow-inner">
        <div className="flex items-center gap-2 text-zinc-600 font-mono">
          <span className="text-zinc-700 font-mono">⏱ [0.0s]</span>
          <span className="font-mono">Dispatching test: &quot;customer_returns_query&quot;</span>
        </div>
        {pipelineState >= 1 && (
          <div className="flex items-center gap-2 text-zinc-400 animate-in slide-in-from-bottom-1 duration-200 font-mono">
            <span className="text-zinc-700 font-mono">🤖 [0.4s]</span>
            <span className="font-mono">Calling llama-3.3-70b-versatile via Groq…</span>
          </div>
        )}
        {pipelineState >= 2 && (
          <div className="flex items-center justify-between text-emerald-400/90 font-semibold animate-in slide-in-from-bottom-1 duration-200 font-mono">
            <span className="font-mono">✔ Assert &quot;Offer refund if broken&quot;</span>
            <span className="text-emerald-500/90 font-semibold font-mono">PASS 100/100</span>
          </div>
        )}
        {pipelineState >= 3 && (
          <div className="flex items-center justify-between text-emerald-400/90 font-semibold animate-in slide-in-from-bottom-1 duration-200 font-mono">
            <span className="font-mono">✔ Assert &quot;Sign off with support team&quot;</span>
            <span className="text-emerald-500/90 font-semibold font-mono">PASS 100/100</span>
          </div>
        )}
        {showPassedBadge && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-xs">
            <div className="animate-badge-pop flex flex-col items-center gap-1">
              <div className="px-5 py-2 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 glow-green-strong">
                <span className="font-mono font-bold text-emerald-300 text-xs tracking-widest">● ALL PASSED</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-600">2/2 assertions · 100/100</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
