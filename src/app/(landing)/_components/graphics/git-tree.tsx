'use client';

import { useState, useEffect } from 'react';

export function GitTreeGraphic() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [commitTyped, setCommitTyped] = useState('');
  const commitMsg = '"feat: adjust refund criteria for v3"';

  useEffect(() => {
    // Start typing after v3 has popped in (2.2s delay)
    const delayTimer = setTimeout(() => {
      let i = 0;
      const typer = setInterval(() => {
        i++;
        setCommitTyped(commitMsg.slice(0, i));
        if (i >= commitMsg.length) clearInterval(typer);
      }, 50);

      return () => clearInterval(typer);
    }, 2200);

    return () => clearTimeout(delayTimer);
  }, []);

  return (
    <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400 relative">
      {/* Local styles for precise SVG path drawing & node pop-ins (zero delay offset gaps) */}
      <style>{`
        @keyframes draw-trunk-local {
          from { stroke-dashoffset: 100; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes draw-branch-g1-local {
          from { stroke-dashoffset: 160; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes pop-node-local {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-local {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes svg-glow-local {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(16,185,129,0.5)); }
          50%       { filter: drop-shadow(0 0 10px rgba(16,185,129,0.9)); }
        }
        .animate-draw-trunk-local {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-trunk-local 1.0s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-draw-branch-g1-local {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: draw-branch-g1-local 1.0s 1.0s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-v2-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: pop-node-local 0.4s 1.0s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        .animate-v3-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: pop-node-local 0.4s 2.0s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        .animate-v2-text {
          opacity: 0;
          animation: fade-in-local 0.4s 1.1s ease-out forwards;
        }
        .animate-v3-text {
          opacity: 0;
          animation: fade-in-local 0.4s 2.1s ease-out forwards;
        }
        .svg-node-active-local {
          animation: svg-glow-local 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-2 z-10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Version History — Git Tree</span>
        <span className="text-[10px] font-mono text-emerald-500/80 font-semibold">● Live branch: main</span>
      </div>

      <div className="flex-1 relative min-h-0 z-10">
        <svg
          viewBox="0 0 500 230"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for patterns, gradients, and filters */}
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-mesh" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(39, 39, 42, 0.3)" strokeWidth="0.75" />
            </pattern>
            {/* Active Glow Gradient */}
            <radialGradient id="active-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#grid-mesh)" />

          {/* Glowing Radial Circle behind v3 */}
          <circle cx="405" cy="75" r="70" fill="url(#active-radial)" pointerEvents="none" />

          {/* Dashed trunk continuation */}
          <line x1="60" y1="148" x2="460" y2="148" stroke="rgba(63, 63, 70, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
          
          {/* Trunk v1→v2 — animated draw */}
          <line x1="120" y1="148" x2="220" y2="148" stroke="#52525b" strokeWidth="2.5" className="animate-draw-trunk-local" />
          
          {/* Branch arc v2→v3 — animated draw, offset exactly to avoid border intersections */}
          <path d="M 260 148 C 300 148 310 75 355 75 L 381 75" stroke="#10b981" strokeWidth="2.5" fill="none" className="animate-draw-branch-g1-local" />

          {/* v1 circle */}
          <g>
            <circle cx="100" cy="148" r="20" fill="#09090b" stroke="#27272a" strokeWidth="1.5"
              className="cursor-pointer hover:stroke-zinc-500 transition-colors"
              onMouseEnter={() => setHoveredNode('v1')}
              onMouseLeave={() => setHoveredNode(null)}
            />
            <text x="100" y="148" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v1</text>
            <text x="100" y="180" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ pointerEvents: 'none', userSelect: 'none' }}>Initial draft</text>
          </g>

          {/* v2 circle + fork dot */}
          <g className="animate-v2-node">
            <circle cx="240" cy="148" r="20" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5"
              className="cursor-pointer hover:stroke-zinc-400 transition-colors"
              onMouseEnter={() => setHoveredNode('v2')}
              onMouseLeave={() => setHoveredNode(null)}
            />
            <circle cx="240" cy="148" r="4" fill="#a1a1aa" style={{ pointerEvents: 'none' }} />
            <text x="240" y="148" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v2</text>
          </g>
          
          <g className="animate-v2-text">
            <text x="240" y="180" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ pointerEvents: 'none', userSelect: 'none' }}>+ refund fix</text>
          </g>

          {/* v3 active — glowing */}
          <g className="animate-v3-node">
            <circle cx="405" cy="75" r="24" fill="#022c22" stroke="#10b981" strokeWidth="2"
              className="svg-node-active-local cursor-pointer"
              onMouseEnter={() => setHoveredNode('v3')}
              onMouseLeave={() => setHoveredNode(null)}
            />
            <text x="405" y="75" textAnchor="middle" dominantBaseline="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v3</text>
          </g>
          
          <g className="animate-v3-text">
            <text x="405" y="40" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="600" style={{ pointerEvents: 'none', userSelect: 'none' }}>● Active</text>
          </g>

          {/* main trunk stub */}
          <circle cx="455" cy="148" r="16" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
          <text x="455" y="148" textAnchor="middle" dominantBaseline="middle" fill="#52525b" fontSize="8" fontFamily="monospace" style={{ userSelect: 'none' }}>main</text>
        </svg>

        {/* Hover metadata card — HTML corner popup */}
        {hoveredNode && (
          <div className="absolute top-2 right-2 bg-zinc-950/90 border border-zinc-850 rounded-lg p-2.5 text-[9px] font-mono space-y-0.5 shadow-xl z-20 animate-in fade-in duration-150 backdrop-blur-xs">
            <div className="text-zinc-500 uppercase font-semibold tracking-wider font-mono">Commit — {hoveredNode}</div>
            <div className="text-zinc-300 font-mono">
              {hoveredNode === 'v1' && 'Initial prompt draft'}
              {hoveredNode === 'v2' && 'feat: add refund check'}
              {hoveredNode === 'v3' && 'feat: adjust criteria (active)'}
            </div>
            <div className="text-zinc-650 font-mono">
              {hoveredNode === 'v1' && 'karan · 2h ago'}
              {hoveredNode === 'v2' && 'karan · 45m ago'}
              {hoveredNode === 'v3' && 'karan · 10m ago'}
            </div>
          </div>
        )}
      </div>

      {/* Typewriter commit log */}
      <div className="border border-zinc-900 bg-zinc-950/70 rounded-lg p-3 font-mono text-[10px] text-zinc-400 space-y-1 shrink-0 z-10">
        <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
          <span>Latest Commit</span>
          <span className="text-emerald-600">branch: main</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-200">
          <span className="text-emerald-400 font-semibold font-mono">commit 4d9863f</span>
          <span className="text-zinc-500 font-mono">—</span>
          <span className="text-zinc-300 font-mono">{commitTyped}<span className="inline-block w-[5px] h-[11px] bg-zinc-400 ml-0.5 align-middle animate-pulse" /></span>
        </div>
      </div>
    </div>
  );
}
