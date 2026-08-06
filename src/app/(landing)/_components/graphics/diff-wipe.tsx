'use client';

import { useState, useRef, useEffect } from 'react';

export function DiffWipeGraphic() {
  const [wipePos, setWipePos] = useState<number>(50);
  const [isWiping, setIsWiping] = useState<boolean>(false);
  const diffContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const isWipingRef = useRef(isWiping);
  const wipePosRef = useRef(wipePos);

  // Keep refs in sync to avoid stale closures in the animation loop
  useEffect(() => {
    isWipingRef.current = isWiping;
  }, [isWiping]);

  useEffect(() => {
    wipePosRef.current = wipePos;
  }, [wipePos]);

  // Synchronize internal text widths to the exact parent width to prevent line wrapping shifts
  useEffect(() => {
    if (!diffContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(diffContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Ultra-smooth back-and-forth scan animation using requestAnimationFrame
  useEffect(() => {
    let animFrameId: number;
    let lastTime = 0;
    let phase = 0;

    const update = (timestamp: number) => {
      if (!lastTime) {
        lastTime = timestamp;
      }
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!isWipingRef.current) {
        const currentPos = wipePosRef.current;
        if (currentPos < 30) {
          // Guide back to the 30% scanning limit
          const nextPos = currentPos + delta * 0.015;
          if (nextPos >= 30) {
            phase = -Math.PI / 2; // sin(-PI/2) = -1 (corresponds to 50% - 20% = 30%)
            setWipePos(30);
          } else {
            setWipePos(nextPos);
          }
        } else if (currentPos > 70) {
          // Guide back to the 70% scanning limit
          const nextPos = currentPos - delta * 0.015;
          if (nextPos <= 70) {
            phase = Math.PI / 2; // sin(PI/2) = 1 (corresponds to 50% + 20% = 70%)
            setWipePos(70);
          } else {
            setWipePos(nextPos);
          }
        } else {
          // Standard smooth sine-wave scan (7-second cycle duration)
          const speed = (2 * Math.PI) / 7000;
          phase += delta * speed;
          const newPos = 50 + 20 * Math.sin(phase);
          setWipePos(newPos);
        }
      } else {
        // Dragging: adjust phase to align with current position so resume is seamless
        const currentPos = wipePosRef.current;
        const ratio = (currentPos - 50) / 20;
        const clampedRatio = Math.max(-1, Math.min(1, ratio));
        phase = Math.asin(clampedRatio);
      }

      animFrameId = requestAnimationFrame(update);
    };

    animFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // Handle global dragging events to make interaction perfect across the entire document
  useEffect(() => {
    if (!isWiping) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!diffContainerRef.current) return;
      const rect = diffContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setWipePos(pct);
    };

    const handleMouseUp = () => {
      setIsWiping(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isWiping]);

  return (
    <div className="flex-1 flex flex-col p-5 justify-between h-full select-none animate-in fade-in duration-400 relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 0)',
        backgroundSize: '16px 16px'
      }} />

      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3 z-10">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">Side-by-Side Prompt Diff</span>
        <span className="text-xs text-zinc-400 bg-zinc-900/70 border border-zinc-800 px-2 py-0.5 rounded font-mono font-semibold">
          ↔ Drag handle to compare
        </span>
      </div>

      {/* Diff Container */}
      <div
        ref={diffContainerRef}
        className="flex-1 border border-zinc-900 rounded-lg overflow-hidden relative bg-[#09090b] cursor-ew-resize z-10 shadow-inner"
      >
        {/* 1. Base Layer (Right Panel - Refined v2) */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Exactly matching width container ensures perfect overlap alignment */}
          <div className="p-4 h-full absolute left-0 top-0" style={{ width: `${containerWidth}px` }}>
            <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-emerald-950/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">v2  Refined</span>
            </div>

            {/* Mock IDE Lines */}
            <div className="font-mono text-xs leading-[1.8] space-y-1">
              <div className="flex font-mono">
                <span className="text-zinc-500 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900 mr-2 font-mono">01</span>
                <span className="text-zinc-300 font-mono"><span className="text-violet-400 font-mono">System</span>: You answer customer queries.</span>
              </div>
              <div className="flex bg-emerald-950/25 border-l border-emerald-500/70 font-mono">
                <span className="text-emerald-700 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900/30 mr-2 font-mono bg-emerald-950/10">02</span>
                <span className="text-emerald-300 font-mono pr-2 truncate"><span className="text-emerald-500 mr-1 font-mono">+</span>You are a polite returns agent. Offer a full refund if broken.</span>
              </div>
              <div className="flex font-mono">
                <span className="text-zinc-500 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900 mr-2 font-mono">03</span>
                <span className="text-zinc-300 font-mono">User: {"{customer_query}"}</span>
              </div>
              <div className="flex bg-emerald-950/25 border-l border-emerald-500/70 font-mono">
                <span className="text-emerald-700 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900/30 mr-2 font-mono bg-emerald-950/10">04</span>
                <span className="text-emerald-300 font-mono pr-2 truncate"><span className="text-emerald-500 mr-1 font-mono">+</span>Sign off: &quot;Customer Support Team&quot;.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top Layer (Left Panel - Original v1) — Width changes as mask */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r border-zinc-800 bg-[#09090b]"
          style={{ width: `${wipePos}%` }}
        >
          {/* Identical width content aligned to left-0 ensures perfect overlap alignment */}
          <div className="p-4 h-full absolute left-0 top-0" style={{ width: `${containerWidth}px` }}>
            <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-red-950/40">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">v1  Original</span>
            </div>

            {/* Mock IDE Lines */}
            <div className="font-mono text-xs leading-[1.8] space-y-1">
              <div className="flex font-mono">
                <span className="text-zinc-500 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900 mr-2 font-mono">01</span>
                <span className="text-zinc-400 font-mono"><span className="text-violet-400 font-mono">System</span>: You answer customer queries.</span>
              </div>
              <div className="flex bg-red-950/25 border-l border-red-500/70 font-mono">
                <span className="text-red-700 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900/30 mr-2 font-mono bg-red-950/10">02</span>
                <span className="text-red-200 font-mono pr-2 truncate"><span className="text-red-500 mr-1 font-mono">-</span>You answer questions about customer returns.</span>
              </div>
              <div className="flex font-mono">
                <span className="text-zinc-500 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900 mr-2 font-mono">03</span>
                <span className="text-zinc-400 font-mono">User: {"{customer_query}"}</span>
              </div>
              <div className="flex bg-red-950/25 border-l border-red-500/70 font-mono">
                <span className="text-red-700 w-6 shrink-0 text-right pr-2 select-none border-r border-zinc-900/30 mr-2 font-mono bg-red-950/10">04</span>
                <span className="text-red-200 font-mono pr-2 truncate"><span className="text-red-500 mr-1 font-mono">-</span>Thank you for your message.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Divider Drag Handle (Aligned with Left Panel edge) */}
        <div
          className="absolute inset-y-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${wipePos}%` }}
        >
          {/* Vertical divider line */}
          <div className="h-full w-[1px] bg-zinc-800" />
          {/* Center handle pill */}
          <div
            className="absolute w-6 h-9 rounded-lg bg-zinc-900 border border-zinc-750 shadow-2xl flex items-center justify-center cursor-ew-resize pointer-events-auto hover:border-zinc-500 transition-colors"
            onMouseDown={(e) => { e.preventDefault(); setIsWiping(true); }}
          >
            <span className="text-xs text-zinc-300 leading-none select-none font-bold">⟷</span>
          </div>
        </div>
      </div>

      {/* Diff stats footer */}
      <div className="flex items-center gap-3 pt-2.5 font-mono text-xs text-zinc-400 z-10 font-semibold">
        <span className="text-red-400/90 font-medium font-mono">−2 lines removed</span>
        <span className="text-zinc-700 font-mono">·</span>
        <span className="text-emerald-400/90 font-medium font-mono">+2 lines added</span>
        <span className="text-zinc-700 font-mono">·</span>
        <span className="font-mono">v1 → v2 · 3 lines modified</span>
      </div>
    </div>
  );
}
