import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Scene4Showcase: React.FC = () => {
  const local = useCurrentFrame();
  const cutDuration = 80;
  const activeIdx = Math.min(2, Math.floor(local / cutDuration));
  const localCut = local % cutDuration;
  
  // 4-frame silky card morph cross-dissolve
  const cardMorphOpacity = localCut < 4 ? localCut / 4 : (localCut >= 76 ? (80 - localCut) / 4 : 1);
  const cardMorphY = localCut < 4 ? (4 - localCut) * 2 : 0;

  const clipProgress = Math.max(0, Math.min(100, 100 - ((localCut - 10) / 25) * 100));
  // Snappy ease-out surge curve for Groq speed proving
  const barGrowth = 1 - Math.pow(1 - Math.min(1, Math.max(0, (localCut - 6) / 24)), 3);

  const fullHash = "sha256:7f3a9e0481bc92e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca4";
  const typedHashChars = Math.min(fullHash.length, Math.floor(Math.max(0, localCut - 6) / 0.5));

  const features = [
    { num: "01", name: "Visual Prompt Diffs" },
    { num: "02", name: "Multi-Model Evals" },
    { num: "03", name: "Local-to-Cloud Sync" }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center font-sans bg-transparent select-none px-20">
      <div className="w-full max-w-[1200px] grid grid-cols-12 gap-12 items-center">
        
        {/* LEFT APPLE SINGLE-LINE TYPOGRAPHY MENU */}
        <div className="col-span-4 flex flex-col space-y-6 relative text-left pl-4">
          {features.map((f, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div 
                key={f.num}
                className="flex items-center gap-4 transition-all duration-300 relative" 
                style={{ opacity: isActive ? 1 : 0.35, transform: isActive ? 'translateX(6px)' : 'translateX(0)' }}
              >
                {isActive && (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                )}
                <span className={`font-mono text-xs font-bold ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>{f.num}</span>
                <span className={`text-xl font-bold tracking-tight ${isActive ? 'text-[#FAFAFA]' : 'text-zinc-400'}`}>{f.name}</span>
              </div>
            );
          })}
        </div>

        {/* RIGHT PREVIEW CARD */}
        <div className="col-span-8 relative" style={{ opacity: cardMorphOpacity, transform: `translateY(${cardMorphY}px)` }}>
          {activeIdx === 0 && (
            <div className="w-full bg-[#121214] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-left">
              <div className="bg-[#18181B] px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-200 text-xs font-semibold">system_prompt.md</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">v1 ➔ v2</span>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-zinc-800/80 p-6 text-left text-xs gap-6 bg-[#0A0A0C] min-h-[260px]">
                <div className="space-y-3">
                  <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">v1 (Old)</div>
                  <div className="text-zinc-500">1  You are a security auditor.</div>
                  <div className="bg-red-500/15 border-l-2 border-red-500 py-2 px-3 text-red-300 line-through rounded-r">- 2 Output raw text.</div>
                </div>
                <div className="space-y-3 pl-4">
                  <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">v2 (Current)</div>
                  <div className="text-zinc-500">1  You are a security auditor.</div>
                  <div className="bg-emerald-500/15 border-l-2 border-emerald-500 py-2 px-3 text-emerald-300 font-semibold flex items-center gap-2 rounded-r" style={{ clipPath: `inset(0 ${clipProgress}% 0 0)` }}>
                    <span>+ 2 Output JSON:</span>
                    <span className="bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 px-2 py-0.5 rounded text-[10px]">{"{{json_schema}}"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeIdx === 1 && (
            <div className="w-full bg-[#121214] border border-zinc-800/80 rounded-2xl p-7 shadow-2xl font-mono text-xs space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
                <span className="text-white font-bold text-sm">Model Latency Benchmark (ms)</span>
              </div>
              <div className="space-y-5 pt-1">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-2">
                    <span className="flex items-center gap-2">
                      <span>Groq / Llama 3.3 70B</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold font-mono">6.2x FASTER</span>
                    </span>
                    <span className="text-emerald-400 font-bold">140 ms</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(11, barGrowth * 11)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-300 mb-2">
                    <span>OpenAI / GPT-5.6 Sol</span>
                    <span className="text-zinc-400">650 ms</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500/60 h-full rounded-full" style={{ width: `${Math.min(52, barGrowth * 52)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-300 mb-2">
                    <span>Anthropic / Claude Opus 5</span>
                    <span className="text-zinc-400">1250 ms</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500/80 h-full rounded-full" style={{ width: `${Math.min(100, barGrowth * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeIdx === 2 && (
            <div className="w-full bg-[#121214] border border-zinc-800/80 rounded-2xl p-7 shadow-2xl font-mono text-xs space-y-6 text-left">
              <div className="flex items-center justify-between bg-[#18181B] p-4 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold">Local .gfp/</div>
                  <span className="text-emerald-400 font-bold">►</span>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">Cloud Postgres</div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">✔ Sync Locked</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-zinc-800/80 text-emerald-400 text-xs font-mono break-all flex items-center gap-1">
                <span>{fullHash.slice(0, typedHashChars)}</span>
                {typedHashChars < fullHash.length && <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse" />}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
