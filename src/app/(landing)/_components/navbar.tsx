'use client';

import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';
import { Search, GitFork, Command } from 'lucide-react';
import { Logo } from '@/components/logo';

interface NavbarProps {
  activeTab: 'tour' | 'sandbox';
  onChangeTab: (tab: 'tour' | 'sandbox') => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

export function Navbar({ activeTab, onChangeTab, onNavClick }: NavbarProps) {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between border border-white/10 bg-[#0e0e0e]/90 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300 w-[calc(100%-2rem)] max-w-5xl px-4 py-2">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
          <GitFork className="w-4 h-4 text-[#f5f0eb]" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white leading-none font-sans">
            Git for Prompts
          </span>
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.2em] font-medium mt-0.5">
            PROMPT VCS
          </span>
        </div>
      </Link>

      {/* Desktop Segmented Pill Menu */}
      <nav className="hidden md:flex items-center gap-1 bg-[#141414] border border-white/[0.08] p-1 rounded-xl font-mono text-xs">
        <Link
          href="#home"
          onClick={(e) => onNavClick(e, 'home')}
          className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          Home
        </Link>
        <Link
          href="#docs"
          onClick={(e) => onNavClick(e, 'docs')}
          className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          API Docs
        </Link>
        <button
          onClick={() => onChangeTab(activeTab === 'tour' ? 'sandbox' : 'tour')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
            activeTab === 'sandbox'
              ? 'bg-white/10 text-white border-white/10 font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border-transparent'
          }`}
        >
          Sandbox Playground
        </button>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* ⌘K Trigger Button */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            document.dispatchEvent(event);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-zinc-400 hover:text-white hover:border-white/20 active:scale-[0.97] transition-all cursor-pointer font-mono"
          title="Open Command Palette"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-mono bg-white/10 px-1 py-0.2 rounded text-zinc-200">⌘K</span>
        </button>

        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white transition-all shadow-sm cursor-pointer"
          >
            Dashboard
          </Link>
          <div className="pl-1">
            <UserButton />
          </div>
        </Show>

        <Show when="signed-out">
          <Link
            href="/sign-in"
            className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1.5 transition-colors hidden sm:block cursor-pointer active:scale-[0.98]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center text-xs font-semibold rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] transition-all px-3.5 py-1.5 shadow-sm cursor-pointer"
          >
            Get Started
          </Link>
        </Show>
      </div>
    </header>
  );
}
