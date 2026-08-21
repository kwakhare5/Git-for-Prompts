import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Scene5Outro: React.FC = () => {
  const local = useCurrentFrame();
  const logoP = Math.min(1, local / 18);
  const btnP = Math.min(1, Math.max(0, (local - 14) / 14));
  const btnHover = local >= 24 && local < 40;
  const btnPress = local >= 40;
  const btnScale = btnPress ? 0.97 : (btnHover ? 1.02 : 1.0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-center px-8 bg-transparent select-none">
      <div 
        className="w-20 h-20 bg-[#141417] border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ opacity: logoP, transform: `scale(${0.95 + logoP * 0.05}) translateY(${(1 - logoP) * 12}px)` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-12 h-12">
          <g transform="translate(4, 4)" fill="none" stroke="#FAFAFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="18" r="3" fill="#FAFAFA" fillOpacity="0.25"/>
            <circle cx="6" cy="6" r="3" fill="#FAFAFA" fillOpacity="0.25"/>
            <circle cx="18" cy="6" r="3" fill="#FAFAFA" fillOpacity="0.25"/>
            <path d="M18 9v2c0 1.7-1.3 3-3 3h-6c-1.7 0-3-1.3-3-3V9"/>
            <path d="M12 15V9"/>
          </g>
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA] tracking-tight">Git for Prompts</h2>
        <p className="text-xl text-zinc-300 font-medium">Open source, all the way down</p>
      </div>

      <div className="pt-2" style={{ opacity: btnP, transform: `translateY(${(1 - btnP) * 10}px)` }}>
        <div 
          className={`inline-flex items-center gap-4 px-7 py-3.5 rounded-xl font-mono text-sm tracking-tight transition-all duration-150 shadow-2xl border ${btnPress ? 'bg-[#141417] text-white border-emerald-500/80 ring-2 ring-emerald-500/30' : (btnHover ? 'bg-[#18181B] text-white border-zinc-700' : 'bg-[#141417] text-zinc-200 border-zinc-800')}`}
          style={{ transform: `scale(${btnScale})` }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-emerald-400 font-extrabold">$</span>
            <span className="font-bold text-[#FAFAFA]">npx gfp init</span>
          </div>
          <div className="pl-4 border-l border-zinc-800 flex items-center text-xs text-zinc-400 font-sans font-medium gap-1.5 overflow-hidden">
            {btnPress ? (
              <span className="text-emerald-400 font-bold animate-in fade-in slide-in-from-bottom-1 duration-150">✔ Copied!</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-zinc-400">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span>Copy</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
