'use client';

export function ApiFlowGraphic() {
  return (
    <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400 relative">
      {/* Background grid dots */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 0)',
        backgroundSize: '16px 16px'
      }} />

      {/* Local styles for packet flow and node pulses */}
      <style>{`
        @keyframes client-node-pulse-local {
          0%, 8% { border-color: rgba(56, 189, 248, 0.85); box-shadow: 0 0 16px rgba(56, 189, 248, 0.25); }
          15%, 93% { border-color: rgba(39, 39, 42, 0.8); box-shadow: 0 0 0px rgba(56, 189, 248, 0); }
          98%, 100% { border-color: rgba(56, 189, 248, 0.85); box-shadow: 0 0 16px rgba(56, 189, 248, 0.25); }
        }
        @keyframes gfp-node-pulse-local {
          0%, 40%, 60%, 100% { border-color: rgba(16, 185, 129, 0.2); box-shadow: 0 0 0px rgba(16, 185, 129, 0); }
          45%, 52% { border-color: rgba(16, 185, 129, 0.85); box-shadow: 0 0 16px rgba(16, 185, 129, 0.25); }
        }
        @keyframes packet-req-local {
          0%   { left: 0%;               opacity: 1; }
          42%  { left: calc(100% - 36px); opacity: 1; }
          50%  { left: calc(100% - 36px); opacity: 0; }
          100% { left: calc(100% - 36px); opacity: 0; }
        }
        @keyframes packet-res-local {
          0%   { left: calc(100% - 36px); opacity: 0; }
          50%  { left: calc(100% - 36px); opacity: 0; }
          58%  { left: calc(100% - 36px); opacity: 1; }
          100% { left: 4px;               opacity: 1; }
        }
        @keyframes cdn-flow-local {
          0%   { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-client-node-local {
          animation: client-node-pulse-local 4.5s ease-in-out infinite;
        }
        .animate-gfp-node-local {
          animation: gfp-node-pulse-local 4.5s ease-in-out infinite;
        }
        .animate-packet-req-local {
          animation: packet-req-local 4.5s ease-in-out infinite;
        }
        .animate-packet-res-local {
          animation: packet-res-local 4.5s ease-in-out infinite;
        }
        .animate-cdn-flow-local {
          stroke-dasharray: 6 6;
          animation: cdn-flow-local 0.8s linear infinite;
        }
      `}</style>

      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 z-10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Runtime API Delivery</span>
        <span className="text-[9px] font-mono text-zinc-500 font-semibold">● Live endpoint</span>
      </div>

      {/* Packet flow diagram */}
      <div className="flex items-center gap-3 px-2 py-5 z-10">
        {/* Client node */}
        <div className="shrink-0 p-3.5 border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col items-center w-28 shadow-lg shadow-zinc-950/20 animate-client-node-local">
          <div className="w-5 h-5 mb-1.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="text-[8px] font-mono text-zinc-500">&#123;&#125;</span>
          </div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Your App</span>
          <span className="text-[9px] text-zinc-350 font-mono mt-0.5 font-bold">Backend</span>
        </div>

        {/* Connection track */}
        <div className="flex-1 relative h-10 flex items-center">
          {/* Dashed track */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(63, 63, 70, 0.5)" strokeWidth="1.5" strokeDasharray="5 5" className="animate-cdn-flow-local" />
          </svg>

          {/* Request packet — pure CSS left→right */}
          <div className="animate-packet-req-local absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" style={{ boxShadow: '0 0 8px rgba(56,189,248,0.9)' }} />
            <span className="text-[8px] font-mono text-sky-400 font-bold whitespace-nowrap">GET</span>
          </div>

          {/* Response packet — pure CSS right→left */}
          <div className="animate-packet-res-local absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[8px] font-mono text-emerald-400 font-bold whitespace-nowrap">200</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.9)' }} />
          </div>

          {/* Track label */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-zinc-700 whitespace-nowrap">
            api.gitforprompts.com
          </div>
        </div>

        {/* GFP node */}
        <div className="shrink-0 p-3.5 border border-emerald-900/60 rounded-xl bg-zinc-950 flex flex-col items-center w-28 shadow-lg shadow-zinc-950/20 animate-gfp-node-local">
          <div className="w-5 h-5 mb-1.5 rounded bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-center">
            <span className="text-[8px] font-mono text-emerald-400 font-bold">GFP</span>
          </div>
          <span className="text-[8px] font-mono text-emerald-500 uppercase font-bold tracking-wider">Edge CDN</span>
          <span className="text-[9px] text-emerald-300 font-mono mt-0.5 font-bold">returns_v2</span>
        </div>
      </div>

      {/* Response JSON panel */}
      <div className="border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden font-mono text-[10px] z-10 shadow-inner">
        <div className="px-3 py-1.5 border-b border-zinc-900 bg-zinc-900/40 flex justify-between items-center">
          <span className="text-zinc-500 text-[9px] font-mono">GET /api/v1/prompts/<span className="text-sky-400 font-mono">p_returns</span>/latest</span>
          <span className="text-[9px] font-bold text-emerald-400 font-mono bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">200 OK · 14ms</span>
        </div>
        <pre className="p-3 overflow-x-auto select-none leading-[1.7] text-[10px]">
          <span className="text-zinc-650">{'{'}</span>{`
  `}<span className="text-sky-400">&quot;id&quot;</span><span className="text-zinc-650">:</span> <span className="text-amber-300">&quot;p_customer_returns&quot;</span><span className="text-zinc-650">,</span>{`
  `}<span className="text-sky-400">&quot;version&quot;</span><span className="text-zinc-650">:</span> <span className="text-violet-400">2</span><span className="text-zinc-650">,</span>{`
  `}<span className="text-sky-400">&quot;content&quot;</span><span className="text-zinc-650">:</span> <span className="text-emerald-300">&quot;You are a polite returns agent…&quot;</span>{`
`}<span className="text-zinc-650">{'}'}</span>
        </pre>
      </div>
    </div>
  );
}
