import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Scene4Showcase: React.FC = () => {
  const local = useCurrentFrame();

  // =========================================================================
  // 1. CONTINUOUS EMIL KOWALSKI MENU INTERPOLATION (NO DISCRETE SNAPS)
  // =========================================================================
  // Transition 1: Cut 0 -> 1 (frames 74 to 86, 12-frame smooth ease)
  const t1P = Math.min(1, Math.max(0, (local - 74) / 12));
  const t1Ease = 1 - Math.pow(1 - t1P, 3);

  // Transition 2: Cut 1 -> 2 (frames 154 to 166, 12-frame smooth ease)
  const t2P = Math.min(1, Math.max(0, (local - 154) / 12));
  const t2Ease = 1 - Math.pow(1 - t2P, 3);

  // Continuous floating index from 0.0 -> 1.0 -> 2.0
  const continuousIdx = t1Ease + t2Ease;
  const indicatorY = continuousIdx * 56; // 56px between menu items

  // Continuous opacity & translate for menu labels
  const weight0 = Math.max(0, 1 - t1Ease);
  const weight1 = Math.max(0, t1Ease - t2Ease);
  const weight2 = t2Ease;
  const weights = [weight0, weight1, weight2];

  // =========================================================================
  // 2. OVERLAPPING SEAMLESS CARD CROSS-MORPH (ZERO BLACKOUT FLASH)
  // =========================================================================
  // Card 0: Diff View (frames 0 to 86)
  const card0EnterP = Math.min(1, local / 10);
  const card0EnterEase = 1 - Math.pow(1 - card0EnterP, 3);
  const card0ExitP = Math.min(1, Math.max(0, (local - 74) / 12));
  const card0ExitEase = 1 - Math.pow(1 - card0ExitP, 3);
  const card0Opacity = card0EnterEase * (1 - card0ExitEase);
  const card0Y = (1 - card0EnterEase) * 10 - card0ExitEase * 8;
  const card0Scale = (0.98 + card0EnterEase * 0.02) - card0ExitEase * 0.02;

  // Feature 1: Smooth Cubic Diff Wipe
  const clipP = Math.min(1, Math.max(0, (local - 10) / 22));
  const clipEase = 1 - Math.pow(1 - clipP, 3);
  const clipRightInset = (1 - clipEase) * 100;

  // Card 1: Multi-Model Benchmark (frames 74 to 166)
  const card1EnterP = Math.min(1, Math.max(0, (local - 74) / 12));
  const card1EnterEase = 1 - Math.pow(1 - card1EnterP, 3);
  const card1ExitP = Math.min(1, Math.max(0, (local - 154) / 12));
  const card1ExitEase = 1 - Math.pow(1 - card1ExitP, 3);
  const card1Opacity = card1EnterEase * (1 - card1ExitEase);
  const card1Y = (1 - card1EnterEase) * 10 - card1ExitEase * 8;
  const card1Scale = (0.98 + card1EnterEase * 0.02) - card1ExitEase * 0.02;

  // Feature 2: Snappy Groq Speed Surge Curve (starts seamlessly as Card 1 enters)
  const barP = Math.min(1, Math.max(0, (local - 76) / 24));
  const barGrowth = 1 - Math.pow(1 - barP, 3.5);

  // Card 2: Local-to-Cloud Sync (frames 154 to 240)
  const card2EnterP = Math.min(1, Math.max(0, (local - 154) / 12));
  const card2EnterEase = 1 - Math.pow(1 - card2EnterP, 3);
  const card2Opacity = card2EnterEase;
  const card2Y = (1 - card2EnterEase) * 10;
  const card2Scale = 0.98 + card2EnterEase * 0.02;

  // Feature 3: Cryptographic Hash Typing & Frame-Synced Cursor
  const fullHash = "sha256:7f3a9e0481bc92e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca4";
  const hashP = Math.min(1, Math.max(0, (local - 166) / 48));
  const typedHashChars = Math.min(fullHash.length, Math.floor(hashP * fullHash.length));
  const cursorBlink = Math.floor(local / 8) % 2 === 0;

  const features = [
    { num: "01", name: "Visual Prompt Diffs" },
    { num: "02", name: "Multi-Model Evals" },
    { num: "03", name: "Local-to-Cloud Sync" }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center font-sans bg-transparent select-none px-20">
      <div className="w-full max-w-[1200px] grid grid-cols-12 gap-12 items-center">
        
        {/* LEFT APPLE SINGLE-LINE TYPOGRAPHY MENU WITH ANCHORED RAIL & OPTICALLY CENTERED INDICATOR */}
        <div className="col-span-4 flex flex-col relative text-left pl-6">
          {/* Subtle Background Track Rail */}
          <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-zinc-800/80 rounded-full" />

          {/* Gliding Emerald Indicator Bar - Exact Optical Center (56px - 24px) / 2 = 16px */}
          <div 
            className="absolute left-[-1px] w-1 h-6 bg-emerald-400 rounded-full shadow-[0_0_14px_rgba(52,211,153,0.9)] will-change-transform z-10"
            style={{ transform: `translateY(${indicatorY + 16}px)` }}
          />

          {features.map((f, idx) => {
            const w = weights[idx];
            const op = 0.35 + w * 0.65;
            const x = w * 6;
            return (
              <div 
                key={f.num}
                className="flex items-center gap-4 relative h-14" 
                style={{ opacity: op, transform: `translateX(${x}px)` }}
              >
                <span className={`font-mono text-xs font-bold transition-colors duration-200 ${w > 0.5 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {f.num}
                </span>
                <span className={`text-xl font-bold tracking-tight transition-colors duration-200 ${w > 0.5 ? 'text-[#FAFAFA]' : 'text-zinc-400'}`}>
                  {f.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* RIGHT PREVIEW CARDS (OVERLAPPING CROSS-MORPH) */}
        <div className="col-span-8 relative min-h-[300px] flex items-center">
          
          {/* CARD 1: VISUAL PROMPT DIFFS */}
          {local < 86 && (
            <div 
              className="w-full bg-[#121214] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-left absolute inset-x-0"
              style={{
                opacity: card0Opacity,
                transform: `translateY(${card0Y}px) scale(${card0Scale})`,
                zIndex: local < 80 ? 20 : 10
              }}
            >
              <div className="bg-[#18181B] px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-200 text-xs font-semibold">system_prompt.md</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">v1 ➔ v2</span>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-zinc-800/80 p-6 text-left text-xs gap-6 bg-[#0A0A0C] min-h-[220px]">
                <div className="space-y-3">
                  <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">v1 (Old)</div>
                  <div className="text-zinc-500">1  You are a security auditor.</div>
                  <div className="bg-red-500/15 border-l-2 border-red-500 py-2 px-3 text-red-300 line-through rounded-r">- 2 Output raw text.</div>
                </div>
                <div className="space-y-3 pl-4">
                  <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">v2 (Current)</div>
                  <div className="text-zinc-500">1  You are a security auditor.</div>
                  <div className="bg-emerald-500/15 border-l-2 border-emerald-500 py-2 px-3 text-emerald-300 font-semibold flex items-center gap-2 rounded-r overflow-hidden">
                    <div 
                      className="flex items-center gap-2"
                      style={{ clipPath: `inset(0 ${clipRightInset}% 0 0)` }}
                    >
                      <span>+ 2 Output JSON:</span>
                      <span className="bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 px-2 py-0.5 rounded text-[10px]">{"{{json_schema}}"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CARD 2: MULTI-MODEL LATENCY BENCHMARK */}
          {local >= 74 && local < 166 && (
            <div 
              className="w-full bg-[#121214] border border-zinc-800/80 rounded-2xl p-7 shadow-2xl font-mono text-xs space-y-6 text-left absolute inset-x-0"
              style={{
                opacity: card1Opacity,
                transform: `translateY(${card1Y}px) scale(${card1Scale})`,
                zIndex: local >= 80 && local < 160 ? 20 : 10
              }}
            >
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
                <span className="text-white font-bold text-sm">Model Latency Benchmark (ms)</span>
              </div>
              <div className="space-y-5 pt-1">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-2">
                    <span className="flex items-center gap-2">
                      <span>Groq / Llama 3.3 70B</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold font-mono">6.2x FASTER</span>
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

          {/* CARD 3: LOCAL-TO-CLOUD SYNC */}
          {local >= 154 && (
            <div 
              className="w-full bg-[#121214] border border-zinc-800/80 rounded-2xl p-7 shadow-2xl font-mono text-xs space-y-6 text-left absolute inset-x-0"
              style={{
                opacity: card2Opacity,
                transform: `translateY(${card2Y}px) scale(${card2Scale})`,
                zIndex: 20
              }}
            >
              <div className="flex items-center justify-between bg-[#18181B] p-4 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold">Local .gfp/</div>
                  <span className="text-emerald-400 font-bold">►</span>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">Cloud Postgres</div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">✔ Sync Locked</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-zinc-800/80 text-emerald-400 text-xs font-mono break-all flex items-center gap-1 min-h-[56px]">
                <span>{fullHash.slice(0, typedHashChars)}</span>
                {typedHashChars < fullHash.length && (
                  <span 
                    className="w-2 h-4 bg-emerald-400 inline-block shrink-0" 
                    style={{ opacity: cursorBlink ? 1 : 0 }} 
                  />
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
