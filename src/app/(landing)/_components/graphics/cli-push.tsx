'use client';

import { useEffect, useState } from 'react';

const cmds = [
  { cmd: 'gfp auth',       out: '✓ Authenticated as karan',              color: 'text-emerald-400' },
  { cmd: 'gfp pull customer-support --version 4', out: '✓ prompt_template.txt (v4, 208 tokens)', color: 'text-emerald-400' },
  { cmd: 'gfp push customer-support ./prompt.txt', out: '✓ Pushed as v5 · webhook fired',        color: 'text-emerald-400' },
];

export function CliPushGraphic() {
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' }[]>([]);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      setLines([]);
      setTyped('');
      for (const item of cmds) {
        if (cancelled) return;
        // type command
        for (let i = 0; i <= item.cmd.length; i++) {
          if (cancelled) return;
          await new Promise(r => setTimeout(r, 48));
          setTyped(item.cmd.slice(0, i));
        }
        await new Promise(r => setTimeout(r, 180));
        setLines(l => [...l, { text: item.cmd, type: 'cmd' }]);
        setTyped('');
        await new Promise(r => setTimeout(r, 320));
        setLines(l => [...l, { text: item.out, type: 'out' }]);
        await new Promise(r => setTimeout(r, 900));
      }
      await new Promise(r => setTimeout(r, 2000));
      if (!cancelled) run();
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col h-full select-none">
      {/* Terminal chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-900/30 shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">gfp — cli</span>
        <div className="w-12" />
      </div>

      {/* Terminal body */}
      <div className="flex-1 p-4 font-mono text-[10px] space-y-1.5 leading-relaxed overflow-hidden">
        {/* Static install hint */}
        <div className="text-zinc-600 mb-3">npm install -g @gitforprompts/cli</div>

        {lines.map((l, i) => (
          <div key={i}>
            {l.type === 'cmd' ? (
              <span>
                <span className="text-zinc-600">$ </span>
                <span className="text-zinc-100 font-semibold">{l.text}</span>
              </span>
            ) : (
              <span className="text-emerald-400">{l.text}</span>
            )}
          </div>
        ))}

        {/* Cursor line */}
        <div className="flex items-center">
          <span className="text-zinc-600">$ </span>
          <span className="text-zinc-100 font-semibold">{typed}</span>
          <span className="inline-block w-[6px] h-[11px] bg-zinc-400 ml-0.5 align-middle animate-pulse" />
        </div>
      </div>
    </div>
  );
}
