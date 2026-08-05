'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles, ArrowRight, FileText, MessageSquare, Code2 } from 'lucide-react';

interface FixesSectionProps {
  onOpenSandbox: () => void;
}

export function FixesSection({ onOpenSandbox }: FixesSectionProps) {
  const [card1State, setCard1State] = useState<number>(0);
  const [card2DecayIdx, setCard2DecayIdx] = useState<number>(0);
  const [card3Step, setCard3Step] = useState<number>(0);
  const [card3Timer, setCard3Timer] = useState<string>('0m');
  const [card4State, setCard4State] = useState<number>(0);

  useEffect(() => {
    // Card 1: Regression check loop
    const c1Interval = setInterval(() => {
      setCard1State((prev) => (prev + 1) % 3);
    }, 3500);

    // Card 2: Knowledge decay fade loop
    const c2Interval = setInterval(() => {
      setCard2DecayIdx((prev) => (prev + 1) % 4);
    }, 2000);

    // Card 3: Slack query stopwatch loop
    const c3Interval = setInterval(() => {
      setCard3Step((prev) => {
        const next = (prev + 1) % 4;
        if (next === 0) setCard3Timer('0m');
        else if (next === 1) setCard3Timer('14m');
        else if (next === 2) setCard3Timer('1h 45m');
        else if (next === 3) setCard3Timer('3h 12m');
        return next;
      });
    }, 3000);

    // Card 4: Buried crash logs loop
    const c4Interval = setInterval(() => {
      setCard4State((prev) => (prev + 1) % 3);
    }, 3200);

    return () => {
      clearInterval(c1Interval);
      clearInterval(c2Interval);
      clearInterval(c3Interval);
      clearInterval(c4Interval);
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 space-y-12 select-none font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 font-sans">
          What we help teams fix.
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed font-light font-sans">
          Eliminate prompt regressions, untracked changes, author chasing, and model pipeline drifts.
        </p>
      </div>

      {/* 5-Card Grid - Dashboard Consistent Theme */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-stretch">
        
        {/* Card 1: Regression Test Pipeline */}
        <div className="md:col-span-3 rounded-xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-white/20 hover:bg-[#1a1a1a] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/30 pointer-events-none" />
          
          <div className="space-y-1 z-10">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">01 / Testing & Integrity</span>
            <h3 className="text-sm font-semibold text-white font-sans">Untested Prompt Regressions</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
              You edit a prompt instructions to solve an edge-case, and it silently breaks three others in production.
            </p>
          </div>

          <div className="mt-5 border border-white/[0.06] bg-[#0a0a0a] rounded-lg p-3 space-y-2 relative font-mono text-[10px] z-10 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 font-mono">
              <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">Assertion Tests Pipeline</span>
              {card1State === 0 ? (
                <span className="text-[9px] text-zinc-500 font-mono">Evaluating...</span>
              ) : card1State === 1 ? (
                <span className="text-[9px] text-red-400 font-bold font-mono">GAPS FOUND (33%)</span>
              ) : (
                <span className="text-[9px] text-emerald-400 font-bold font-mono">ALL PASSED (100%)</span>
              )}
            </div>

            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between font-mono">
                <span className="text-zinc-400 font-mono">Assert: Refund offer is included</span>
                {card1State === 0 ? (
                  <span className="text-zinc-600 font-mono">Checking...</span>
                ) : card1State === 1 ? (
                  <span className="text-red-400 font-semibold font-mono">❌ Failed</span>
                ) : (
                  <span className="text-emerald-400 font-semibold font-mono">✓ Passed</span>
                )}
              </div>

              <div className="flex items-center justify-between font-mono">
                <span className="text-zinc-400 font-mono">Assert: Politeness formatting</span>
                {card1State === 0 ? (
                  <span className="text-zinc-600 font-mono">Checking...</span>
                ) : card1State === 1 ? (
                  <span className="text-red-400 font-semibold font-mono">❌ Failed</span>
                ) : (
                  <span className="text-emerald-400 font-semibold font-mono">✓ Passed</span>
                )}
              </div>
            </div>

            {card1State === 1 && (
              <div className="absolute inset-0 bg-red-950/10 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
                <div className="bg-[#0a0a0a] border border-red-900/40 p-2.5 rounded-lg text-center space-y-1.5 shadow-xl w-[90%]">
                  <span className="text-[9px] text-red-400 font-bold block">⚠️ Regression detected</span>
                  <button className="px-2.5 py-1 text-[8.5px] rounded-md bg-red-950/40 text-red-300 border border-red-900/50 hover:bg-red-900/40 transition-colors font-mono cursor-pointer w-full font-semibold">
                    Click to restore v2
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Fragmented Prompt Silos */}
        <div className="md:col-span-3 rounded-xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-white/20 hover:bg-[#1a1a1a] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/30 pointer-events-none" />
          
          <div className="space-y-1 z-10">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">02 / Versioning & Storage</span>
            <h3 className="text-sm font-semibold text-white font-sans">Document Decay & Fragmentation</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
              Prompts live scattered in Google Docs, Slack notes, and hardcoded in app code. Nobody knows which is active.
            </p>
          </div>

          <div className="mt-5 space-y-2 font-mono text-[10px] z-10">
            {[
              { icon: FileText, name: 'Google Doc: Refund Template v2', status: 'Drifted' },
              { icon: MessageSquare, name: 'Slack: Alice draft snippet', status: 'Forgotten' },
              { icon: Code2, name: 'src/lib/openai.ts (hardcoded string)', status: 'Untracked' },
              { icon: FileText, name: 'Notion: production-system-prompts', status: 'Out-of-Sync' }
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-[#0a0a0a] transition-all duration-700 font-mono"
                  style={{ opacity: card2DecayIdx === idx ? 0.3 : 0.95 }}
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <ItemIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-zinc-300 font-mono truncate">{item.name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-red-400 bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded font-mono uppercase font-semibold shrink-0">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Chasing Prompt Authors */}
        <div className="md:col-span-3 rounded-xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-white/20 hover:bg-[#1a1a1a] shadow-sm">
          <div className="space-y-1 z-10">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">03 / Attribution audit</span>
            <h3 className="text-sm font-semibold text-white font-sans">Chasing Prompt Changes</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
              Who modified the system parameters on production? Finding out takes hours of Slack threads.
            </p>
          </div>

          <div className="mt-5 border border-white/[0.06] bg-[#0a0a0a] rounded-lg p-3 space-y-2.5 font-mono text-[9px] flex-1 flex flex-col justify-center z-10 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1 text-zinc-500 font-semibold font-mono">
              <span>Slack Search Query</span>
              <span className="flex items-center gap-1 font-mono text-zinc-600">
                <Clock className="h-2.5 w-2.5 font-mono" /> {card3Timer} elapsed
              </span>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between font-mono">
                <span className={`font-mono transition-colors ${card3Step >= 0 ? 'text-zinc-300' : 'text-zinc-600'}`}>1. Sarah M. (searching Slack)</span>
                <span className="font-mono">
                  {card3Step === 0 ? (
                    <span className="text-zinc-400 animate-pulse">checking...</span>
                  ) : card3Step > 0 ? (
                    <span className="text-zinc-500">not found</span>
                  ) : (
                    <span className="text-zinc-600">pending</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className={`font-mono transition-colors ${card3Step >= 1 ? 'text-zinc-300' : 'text-zinc-600'}`}>2. Dave L. (checking git blame)</span>
                <span className="font-mono">
                  {card3Step === 1 ? (
                    <span className="text-zinc-400 animate-pulse">checking...</span>
                  ) : card3Step > 1 ? (
                    <span className="text-zinc-500">no local copy</span>
                  ) : (
                    <span className="text-zinc-600">pending</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className={`font-mono transition-colors ${card3Step >= 2 ? 'text-zinc-300 font-semibold' : 'text-zinc-600'}`}>3. Alex K. (checking local draft)</span>
                <span className="font-mono">
                  {card3Step === 2 ? (
                    <span className="text-zinc-400 animate-pulse">checking...</span>
                  ) : card3Step === 3 ? (
                    <span className="text-emerald-400 font-bold">✓ Found file</span>
                  ) : (
                    <span className="text-zinc-600">pending</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Buried Failures */}
        <div className="md:col-span-3 rounded-xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-white/20 hover:bg-[#1a1a1a] shadow-sm">
          <div className="space-y-1 z-10">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">04 / Incident alerts</span>
            <h3 className="text-sm font-semibold text-white font-sans">Silenced Error Regressions</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
              LLM format breakages and parser crashes happen, but slip past because they are buried in cloud logs.
            </p>
          </div>

          <div className="mt-5 border border-white/[0.06] bg-[#0a0a0a] rounded-lg p-3 space-y-2 font-mono text-[9px] flex-1 flex flex-col justify-center z-10 shadow-inner">
            <div className="flex justify-between border-b border-white/[0.06] pb-1 text-zinc-500 font-semibold font-mono">
              <span>Server stdout stream</span>
              <span className="text-zinc-600 font-mono">stdout.log</span>
            </div>

            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between transition-all font-mono sub-item-wrap">
                <span className={`font-mono ${card4State === 2 ? 'line-through text-zinc-600 opacity-40' : 'text-red-400 font-semibold font-mono'}`}>
                  JSON parser crash (Invalid char)
                </span>
                <span className="font-mono">{card4State === 2 ? '[Muted]' : '[ALERT]'}</span>
              </div>
              <div className="flex items-center justify-between transition-all font-mono sub-item-wrap">
                <span className={`font-mono ${card4State >= 1 ? 'line-through text-zinc-600 opacity-40' : 'text-red-400 font-semibold font-mono'}`}>
                  Empty response (400 Bad Req)
                </span>
                <span className="font-mono">{card4State >= 1 ? '[Muted]' : '[ALERT]'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Visual Call to Action */}
        <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-zinc-700 hover:bg-zinc-900/80 dots-bg shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent pointer-events-none" />
          
          <div className="space-y-2 z-10">
            <div className="h-7 w-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow">
              <Sparkles className="h-4 w-4 text-zinc-300" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-50 font-sans">Close the gaps. Before they break your AI.</h3>
            <p className="text-xs text-zinc-500 font-light leading-relaxed font-sans">
              Professional workflows for prompt engineering. Save commits, run pipeline assertions, and fetch active templates.
            </p>
          </div>

          <div className="pt-4 z-10">
            <button
              onClick={onOpenSandbox}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg hover:shadow-zinc-50/10"
            >
              Open Simulator Sandbox <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
