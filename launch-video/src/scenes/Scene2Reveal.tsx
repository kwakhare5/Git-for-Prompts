import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Scene2Reveal: React.FC = () => {
  const local = useCurrentFrame();

  const popP = Math.min(1, Math.max(0, local / 20));
  const popEasing = 1 - Math.pow(1 - popP, 3);
  const logoScale = 0.88 + popEasing * 0.12;
  const logoOp = Math.min(1, local / 10);

  const node1P = Math.min(1, Math.max(0, local / 8));
  const path1P = Math.min(1, Math.max(0, (local - 4) / 14));
  const path2P = Math.min(1, Math.max(0, (local - 8) / 10));
  const node2P = Math.min(1, Math.max(0, (local - 8) / 8));
  const node3P = Math.min(1, Math.max(0, (local - 14) / 8));

  const path1Dash = 40 * (1 - path1P);
  const path2Dash = 20 * (1 - path2P);

  // Exponential smooth unroll curve
  const slideP = Math.min(1, Math.max(0, (local - 20) / 20));
  const slideEasing = 1 - Math.pow(1 - slideP, 4);
  const maskW = slideEasing * 420;
  const textX = (1 - slideEasing) * -24;

  const sweepP = Math.min(1, Math.max(0, (local - 36) / 12));
  const sweepX = -100 + sweepP * 300;
  const showSweep = local >= 36 && local <= 48;

  const subP = Math.min(1, Math.max(0, (local - 40) / 28));
  const subEasing = 1 - Math.pow(1 - subP, 3);
  const subY = (1 - subEasing) * 14;

  return (
    <div className="w-full h-full select-none overflow-hidden font-sans bg-transparent p-12 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center justify-center relative min-h-[80px]">
          <div 
            className="w-20 h-20 bg-[#141417] border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden shrink-0 z-20"
            style={{ transform: `scale(${logoScale})`, opacity: logoOp }}
          >
            {showSweep && (
              <div 
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background: 'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 55%, transparent 100%)',
                  transform: `translateX(${sweepX}%)`
                }}
              />
            )}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-12 h-12 relative z-10">
              <g transform="translate(4, 4)" fill="none" stroke="#FAFAFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 9v2c0 1.7-1.3 3-3 3h-6c-1.7 0-3-1.3-3-3V9" strokeDasharray="40" strokeDashoffset={path1Dash}/>
                <path d="M12 15V9" strokeDasharray="20" strokeDashoffset={path2Dash}/>
                <circle cx="12" cy="18" r="3" fill="#FAFAFA" fillOpacity="0.25" style={{ opacity: node1P, transform: `scale(${0.6 + node1P * 0.4})`, transformOrigin: '12px 18px' }}/>
                <circle cx="6" cy="6" r="3" fill="#FAFAFA" fillOpacity="0.25" style={{ opacity: node2P, transform: `scale(${0.6 + node2P * 0.4})`, transformOrigin: '6px 6px' }}/>
                <circle cx="18" cy="6" r="3" fill="#FAFAFA" fillOpacity="0.4" style={{ opacity: node3P, transform: `scale(${0.6 + node3P * 0.4})`, transformOrigin: '18px 6px' }}/>
              </g>
            </svg>
          </div>

          <div 
            className="overflow-hidden h-20 flex items-center justify-start z-10"
            style={{ width: `${maskW}px`, opacity: slideEasing }}
          >
            <div className="pl-6 whitespace-nowrap" style={{ transform: `translateX(${textX}px)` }}>
              <h2 className="text-5xl font-extrabold text-[#FAFAFA] tracking-tight">Git for Prompts</h2>
            </div>
          </div>
        </div>

        <p className="text-xl text-zinc-300 font-medium leading-relaxed max-w-[680px] mx-auto pt-2" style={{ transform: `translateY(${subY}px)`, opacity: subP }}>
          Local-first, open-source version control and evals for AI engineers
        </p>
      </div>
    </div>
  );
};
