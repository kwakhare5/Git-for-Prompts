'use client';

import { useState, useEffect } from 'react';
import { Check, RefreshCw } from 'lucide-react';

const PROMPTS = [
  'You answer questions about customer returns.',
  'You are a polite returns agent. Offer a full refund if broken.',
  'You are a polite returns agent. Offer a full refund if broken. Sign off: "Customer Support Team".'
];

export default function DemoRecordingPage() {
  const [heroStep, setHeroStep] = useState<number>(0);
  const [displayedPrompt, setDisplayedPrompt] = useState<string>('');

  // Step advancement interval (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Character-by-character typewriter loop on step change
  useEffect(() => {
    const fullText = PROMPTS[heroStep];
    
    const clearTimer = setTimeout(() => {
      setDisplayedPrompt('');
    }, 0);

    let i = 0;
    const typer = setInterval(() => {
      i++;
      setDisplayedPrompt(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typer);
      }
    }, 25); // Fast, smooth typing speed

    return () => {
      clearTimeout(clearTimer);
      clearInterval(typer);
    };
  }, [heroStep]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 selection:bg-zinc-800 overflow-hidden">
      
      {/* Hide Clerk Dev Badge & Next.js Indicator for pristine recording */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cl-internal-b3alhm, 
        .cl-devMode, 
        [class*="cl-internal-"], 
        #clerk-components,
        nextjs-portal { 
          display: none !important; 
        }
      ` }} />

      {/* Title & Description */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-50 via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Git for Prompts
        </h1>
        <p className="text-xl text-zinc-400 font-light tracking-wide">
          Version control, automated testing, and deployment for AI prompts.
        </p>
      </div>

      {/* High-Fidelity Hero Dashboard Mockup */}
      <div className="w-full max-w-5xl select-none">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm shadow-2xl relative flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/20 via-transparent to-zinc-950/20 pointer-events-none" />
          
          {/* macOS Mock Window Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/45 px-4 py-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB2F] block" />
              <span className="text-[11px] font-mono text-zinc-500 ml-3">returns_agent_v3.git</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Live in Production</span>
            </div>
          </div>

          {/* Mock Workspace Content */}
          <div className="flex flex-col md:grid md:grid-cols-12 text-left md:h-[400px] w-full">
            
            {/* Left Pane - Commit List */}
            <div className="md:col-span-4 border-r border-zinc-850 p-4 space-y-3 bg-zinc-900/10 overflow-hidden flex flex-col justify-start">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Commit Log</span>
              <div className="space-y-2 flex-1 overflow-y-auto">
                
                <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                  heroStep === 2 ? 'bg-zinc-950 border-zinc-800 shadow-sm opacity-100' : 'bg-transparent border-transparent opacity-40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-semibold text-emerald-400">v3 (active)</span>
                    <span className="text-[8px] font-mono text-zinc-500">2m ago</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-1 truncate">feat: added strict refund instruction</p>
                </div>

                <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                  heroStep === 1 ? 'bg-zinc-950 border-zinc-800 shadow-sm opacity-100' : 'bg-transparent border-transparent opacity-40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-semibold text-zinc-400">v2</span>
                    <span className="text-[8px] font-mono text-zinc-500">10m ago</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-1 truncate">fix: clarify response tone</p>
                </div>

                <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                  heroStep === 0 ? 'bg-zinc-950 border-zinc-800 shadow-sm opacity-100' : 'bg-transparent border-transparent opacity-40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-semibold text-zinc-400">v1</span>
                    <span className="text-[8px] font-mono text-zinc-500">1h ago</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-1 truncate">Initial commit draft</p>
                </div>

              </div>
            </div>

            {/* Right Pane - Active Editor / Runner */}
            <div className="md:col-span-8 p-4 flex flex-col justify-between bg-zinc-950/20 gap-4">
              
              {/* Interactive Console Screen */}
              <div className="flex-1 flex flex-col justify-between gap-4 h-full">
                <div className="flex-1 border border-zinc-800 bg-zinc-950 rounded-lg p-3.5 relative overflow-hidden font-mono min-h-[140px] md:h-44">
                  
                  {/* Code Editor Mockup layout */}
                  <div className="flex gap-3 font-mono text-[11px] h-full">
                    <div className="text-zinc-600 select-none text-right pr-2.5 border-r border-zinc-900 leading-relaxed font-mono">
                      <div>01</div>
                      <div>02</div>
                      <div>03</div>
                    </div>
                    <div className="leading-relaxed font-mono text-zinc-300 flex-1 whitespace-pre-wrap">
                      <span className="text-zinc-500">System: </span>
                      {displayedPrompt}
                      <span className="w-1.5 h-3.5 bg-zinc-400 ml-0.5 inline-block animate-pulse align-middle" />
                    </div>
                  </div>

                  {/* Float Highlight Overlay */}
                  <div className="absolute right-3.5 top-3.5 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-[8px] text-zinc-400 font-mono tracking-wider font-semibold uppercase">
                    Prompt Editor
                  </div>
                </div>

                {/* Assertion Testing Progress Block */}
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-3 space-y-2 shrink-0">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-1.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Automated Checks</span>
                    {heroStep === 2 ? (
                      <span className="text-[9px] text-emerald-400 font-bold font-mono tracking-wider bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5 rounded">100% PASSED</span>
                    ) : heroStep === 1 ? (
                      <span className="text-[9px] text-zinc-400 animate-pulse font-mono tracking-wider bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">RUNNING TESTS...</span>
                    ) : (
                      <span className="text-[9px] text-zinc-500 font-mono">IDLE</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      {heroStep >= 2 ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 border border-emerald-950 bg-emerald-950/20 rounded-full p-0.5" />
                      ) : heroStep === 1 ? (
                        <RefreshCw className="h-3 w-3 text-zinc-500 animate-spin" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-zinc-800 bg-zinc-900" />
                      )}
                      <span className="text-[10px] text-zinc-400 font-mono leading-none">Assert Refund Offer</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {heroStep >= 2 ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 border border-emerald-950 bg-emerald-950/20 rounded-full p-0.5" />
                      ) : heroStep === 1 ? (
                        <RefreshCw className="h-3 w-3 text-zinc-500 animate-spin" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-zinc-800 bg-zinc-900" />
                      )}
                      <span className="text-[10px] text-zinc-400 font-mono leading-none">Assert Politeness</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
