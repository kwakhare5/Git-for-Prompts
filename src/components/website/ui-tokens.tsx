'use client';

import React, { useState } from 'react';

{/* SVG Icons — Zero Emojis */}
export function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function TerminalIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

{/* Reusable Design System Primitives */}

export function CardDark({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#161619] border border-zinc-800/90 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function PanelElevated({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#1D1D22] border border-zinc-700/80 rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
}

export function BadgeVersion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${className}`}>
      {children}
    </span>
  );
}

{/* Primary Button */}
export function ButtonPrimary({ children, onClick, className = "", disabled = false }: { children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold px-4 py-2 rounded-xl text-xs shadow-xs active:scale-97 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

{/* 1-Click CLI Copy Button */}
export function CliCopyButton({ command = "npx gfp init" }: { command?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-[#18181B] hover:bg-zinc-900 text-zinc-200 border border-zinc-800 font-mono text-xs px-4 py-2.5 rounded-full flex items-center gap-3 shadow-inner transition-all duration-150 active:scale-97 cursor-pointer group"
    >
      <TerminalIcon className="w-3.5 h-3.5 text-blue-300" />
      <span className="text-zinc-300 font-medium">$ {command}</span>
      <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-white flex items-center justify-center ml-1 transition-colors">
        {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-300" /> : <CopyIcon className="w-3 h-3" />}
      </div>
    </button>
  );
}

{/* Muted Pastel Badge Kicker */}
export function BadgePastel({ children, variant = "blue", className = "" }: { children: React.ReactNode; variant?: "blue" | "green" | "yellow" | "rose"; className?: string }) {
  const variantStyles = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    yellow: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-300",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[11px] font-semibold tracking-wide uppercase ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

{/* Floating Tooltip Component */}
export function Tooltip({ text, children, position = "right" }: { text: string; children: React.ReactNode; position?: "top" | "right" | "bottom" | "left" }) {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: "-top-8 left-1/2 -translate-x-1/2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
    bottom: "-bottom-8 left-1/2 -translate-x-1/2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
  };

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-50 px-2.5 py-1 rounded-lg bg-[#202024] border border-zinc-700/80 text-zinc-100 font-mono text-[11px] font-medium shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${positionStyles[position]}`}>
          {text}
        </div>
      )}
    </div>
  );
}
