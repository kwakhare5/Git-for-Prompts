'use client';

import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';
import { Search, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  activeTab: 'tour' | 'sandbox';
  onChangeTab: (tab: 'tour' | 'sandbox') => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

export function Navbar({ activeTab, onChangeTab, onNavClick }: NavbarProps) {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between border border-white/10 bg-[#161616]/90 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300 w-[calc(100%-2rem)] max-w-5xl px-4 py-2">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-2.5 group shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
          <GitFork className="w-4 h-4 text-[#f5f0eb]" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white tracking-tight leading-none font-sans">
            Git for Prompts
          </span>
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.2em] font-medium mt-0.5">
            PROMPT VCS
          </span>
        </div>
      </Link>

      {/* Desktop Segmented Pill Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-[#111111] border border-white/[0.08] p-1 rounded-xl font-mono text-xs">
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
          className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-zinc-400 hover:text-white hover:border-white/20 active:scale-[0.97] transition-all cursor-pointer font-mono"
          title="Search or press ⌘K"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] text-zinc-300">Search</span>
          <kbd className="text-[10px] font-mono tracking-wider bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-zinc-200">
            ⌘ K
          </kbd>
        </button>

        <Show when="signed-in">
          <Link href="/dashboard" passHref>
            <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] font-semibold cursor-pointer">
              Dashboard
            </Button>
          </Link>
          <div className="pl-1">
            <UserButton />
          </div>
        </Show>

        <Show when="signed-out">
          <Link
            href="/sign-in"
            className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1.5 transition-colors hidden sm:block cursor-pointer active:scale-[0.98]"
          >
            Sign In
          </Link>
          <Link href="/sign-up" passHref>
            <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] font-semibold cursor-pointer">
              Get Started
            </Button>
          </Link>
        </Show>
      </div>
    </header>
  );
}
