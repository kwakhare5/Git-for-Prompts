'use client';

import { useState, useEffect } from 'react';

export function GitTreeGraphic() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [commitTyped, setCommitTyped] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const commitMsg = '"feat: adjust refund criteria for v3"';

  useEffect(() => {
    // Start typing after v3 has popped in (2.4s delay)
    const delayTimer = setTimeout(() => {
      let i = 0;
      const typer = setInterval(() => {
        i++;
        setCommitTyped(commitMsg.slice(0, i));
        if (i >= commitMsg.length) clearInterval(typer);
      }, 50);

      return () => clearInterval(typer);
    }, 2400);

    return () => clearTimeout(delayTimer);
  }, [animationKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
      setCommitTyped('');
      setHoveredNode(null);
    }, 8000);
    return () => clearInterval(interval);
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
          animation: draw-trunk-local 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-draw-branch-g1-local {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: draw-branch-g1-local 1.2s 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-v2-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: pop-node-local 0.4s 1.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-v3-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: pop-node-local 0.4s 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-v2-text {
          opacity: 0;
          animation: fade-in-local 0.4s 1.1s ease-out forwards;
        }
        .animate-v3-text {
          opacity: 0;
          animation: fade-in-local 0.4s 2.3s ease-out forwards;
        }
        .svg-node-active-local {
          animation: svg-glow-local 2s ease-in-out infinite;
        }

        .tooltip-container {
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Coordinated premium hover effects & transitions */
        .node-v1, .node-v2, .node-v3 {
          cursor: pointer;
        }
        .node-v1 circle, .node-v2 circle {
          transition: stroke 0.25s cubic-bezier(.4,0,.2,1), fill 0.25s cubic-bezier(.4,0,.2,1);
        }
        .node-v1:hover circle, .node-v2:hover circle {
          stroke: #e4e4e7; /* zinc-200 */
          fill: #18181b; /* zinc-900 */
        }
        .node-v3 circle {
          transition: stroke 0.25s cubic-bezier(.4,0,.2,1), fill 0.25s cubic-bezier(.4,0,.2,1), filter 0.25s cubic-bezier(.4,0,.2,1);
        }
        .node-v3:hover circle {
          stroke: #34d399; /* emerald-400 */
          fill: #042f1a; /* emerald-950 */
          filter: drop-shadow(0 0 12px rgba(16,185,129,0.95)) !important;
        }
      `}</style>

      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-2 z-10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Version History — Git Tree</span>
        <span className="text-[10px] font-mono text-emerald-500/80 font-semibold">● Live branch: main</span>
      </div>

      <div className="flex-1 relative min-h-0 z-10">
        <svg
          key={animationKey}
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
          <g
            className="node-v1"
            onMouseEnter={() => setHoveredNode('v1')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx="100" cy="148" r="20" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <text x="100" y="148" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v1</text>
            <text x="100" y="180" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ pointerEvents: 'none', userSelect: 'none' }}>Initial draft</text>
          </g>

          {/* v2 circle */}
          <g
            className="node-v2 animate-v2-node"
            onMouseEnter={() => setHoveredNode('v2')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx="240" cy="148" r="20" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
            <text x="240" y="148" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v2</text>
          </g>
          
          <g className="animate-v2-text">
            <text x="240" y="180" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ pointerEvents: 'none', userSelect: 'none' }}>+ refund fix</text>
          </g>

          {/* v3 active — glowing */}
          <g
            className="node-v3 animate-v3-node"
            onMouseEnter={() => setHoveredNode('v3')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx="405" cy="75" r="24" fill="#022c22" stroke="#10b981" strokeWidth="2"
              className="svg-node-active-local"
            />
            <text x="405" y="75" textAnchor="middle" dominantBaseline="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v3</text>
          </g>
          
          <g className="animate-v3-text">
            <text x="405" y="40" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="600" style={{ pointerEvents: 'none', userSelect: 'none' }}>● Active</text>
          </g>

          {/* main trunk stub */}
          <circle cx="455" cy="148" r="16" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
          <text x="455" y="148" textAnchor="middle" dominantBaseline="middle" fill="#52525b" fontSize="8" fontFamily="monospace" style={{ userSelect: 'none' }}>main</text>

          {/* Localized Floating Tooltips inside SVG viewBox */}
          {/* Tooltip v1 */}
          <foreignObject
            x="20"
            y="68"
            width="160"
            height="70"
            className="tooltip-container"
            style={{
              opacity: hoveredNode === 'v1' ? 1 : 0,
              transform: hoveredNode === 'v1' 
                ? 'translateY(0px) scale(1)' 
                : 'translateY(6px) scale(0.95)',
              transformOrigin: 'bottom center',
            }}
          >
            <div className="bg-zinc-950/95 border border-zinc-800 rounded-lg p-2.5 shadow-xl shadow-black/40 backdrop-blur-xs pointer-events-none">
              <div className="text-zinc-500 uppercase font-bold tracking-wider font-mono text-[8px]">Commit — v1</div>
              <div className="text-zinc-200 font-mono text-[9px] mt-0.5 font-medium leading-normal">Initial prompt draft</div>
              <div className="text-zinc-500/80 font-mono text-[8px] mt-1">karan · 2h ago</div>
            </div>
          </foreignObject>

          {/* Tooltip v2 */}
          <foreignObject
            x="160"
            y="68"
            width="160"
            height="70"
            className="tooltip-container"
            style={{
              opacity: hoveredNode === 'v2' ? 1 : 0,
              transform: hoveredNode === 'v2' 
                ? 'translateY(0px) scale(1)' 
                : 'translateY(6px) scale(0.95)',
              transformOrigin: 'bottom center',
            }}
          >
            <div className="bg-zinc-950/95 border border-zinc-800 rounded-lg p-2.5 shadow-xl shadow-black/40 backdrop-blur-xs pointer-events-none">
              <div className="text-zinc-500 uppercase font-bold tracking-wider font-mono text-[8px]">Commit — v2</div>
              <div className="text-zinc-200 font-mono text-[9px] mt-0.5 font-medium leading-normal">feat: add refund check</div>
              <div className="text-zinc-500/80 font-mono text-[8px] mt-1">karan · 45m ago</div>
            </div>
          </foreignObject>

          {/* Tooltip v3 */}
          <foreignObject
            x="325"
            y="110"
            width="160"
            height="70"
            className="tooltip-container"
            style={{
              opacity: hoveredNode === 'v3' ? 1 : 0,
              transform: hoveredNode === 'v3' 
                ? 'translateY(0px) scale(1)' 
                : 'translateY(-6px) scale(0.95)',
              transformOrigin: 'top center',
            }}
          >
            <div className="bg-zinc-950/95 border border-emerald-500/20 rounded-lg p-2.5 shadow-xl shadow-emerald-500/5 backdrop-blur-xs pointer-events-none">
              <div className="text-emerald-500 uppercase font-bold tracking-wider font-mono text-[8px]">Commit — v3</div>
              <div className="text-zinc-200 font-mono text-[9px] mt-0.5 font-medium leading-normal">feat: adjust criteria (active)</div>
              <div className="text-emerald-500/60 font-mono text-[8px] mt-1">karan · 10m ago</div>
            </div>
          </foreignObject>
        </svg>
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
