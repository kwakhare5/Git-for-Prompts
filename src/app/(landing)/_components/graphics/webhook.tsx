'use client';

import { useEffect, useState } from 'react';

const events = [
  { event: 'version.created', prompt: 'customer-support', version: 'v4', status: 200, ms: 42 },
  { event: 'version.created', prompt: 'onboarding-flow', version: 'v2', status: 200, ms: 38 },
  { event: 'version.created', prompt: 'error-handler',   version: 'v7', status: 200, ms: 55 },
];

export function WebhookGraphic() {
  const [visible, setVisible] = useState<number[]>([]);
  const [pulsing, setPulsing] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setVisible([]);
      for (let i = 0; i < events.length; i++) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, 900 + i * 200));
        setVisible(v => [...v, i]);
        setPulsing(i);
        await new Promise(r => setTimeout(r, 600));
        setPulsing(null);
      }
      await new Promise(r => setTimeout(r, 2200));
      if (!cancelled) run();
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col h-full p-5 gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">webhook delivery</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-600">HMAC-SHA256 signed</span>
      </div>

      {/* Flow diagram: GFP → Your endpoint */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex flex-col items-center">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[10px] font-mono text-zinc-300">
            Git for Prompts
          </div>
          <span className="text-[9px] text-zinc-600 mt-1">version.created</span>
        </div>
        <div className="flex-1 border-t border-dashed border-zinc-700 relative mx-1">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-500">POST</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[10px] font-mono text-zinc-300">
            your-api.com/hook
          </div>
          <span className="text-[9px] text-zinc-600 mt-1">your endpoint</span>
        </div>
      </div>

      {/* Live delivery log */}
      <div className="flex-1 bg-zinc-950/60 rounded-lg border border-zinc-800/60 p-3 font-mono text-[10px] space-y-1.5 overflow-hidden">
        <div className="text-zinc-600 mb-2 uppercase tracking-widest text-[9px]">Delivery log</div>
        {events.map((ev, i) => (
          visible.includes(i) ? (
            <div
              key={i}
              className={`flex items-center justify-between gap-2 transition-all duration-300 rounded px-1 py-0.5 ${pulsing === i ? 'bg-emerald-950/40' : ''}`}
            >
              <span className="text-zinc-500">{ev.event}</span>
              <span className="text-zinc-400 truncate">{ev.prompt}</span>
              <span className="text-zinc-600">{ev.version}</span>
              <span className="text-emerald-400 font-semibold">{ev.status}</span>
              <span className="text-zinc-600">{ev.ms}ms</span>
            </div>
          ) : (
            <div key={i} className="h-4 bg-zinc-900/40 rounded animate-pulse" />
          )
        ))}
      </div>
    </div>
  );
}
