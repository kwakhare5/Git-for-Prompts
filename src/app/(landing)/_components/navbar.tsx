'use client';

import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';
import { Search, GitFork, Command as CommandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  activeTab: 'tour' | 'sandbox';
  onChangeTab: (tab: 'tour' | 'sandbox') => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

export function Navbar({ activeTab, onChangeTab, onNavClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/[0.08] bg-[#111111]/90 backdrop-blur-md transition-all duration-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.06] border border-white/10 group-hover:border-white/20 transition-colors">
            <GitFork className="w-3.5 h-3.5 text-[#f5f0eb]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">
              Git for Prompts
            </span>
            <Badge variant="outline" className="font-mono text-[9px] text-zinc-500 border-white/10 px-1.5 py-0">
              VCS
            </Badge>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          <Link
            href="#home"
            onClick={(e) => onNavClick(e, 'home')}
            className="px-3 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            href="#docs"
            onClick={(e) => onNavClick(e, 'docs')}
            className="px-3 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            API Docs
          </Link>
          <button
            onClick={() => onChangeTab(activeTab === 'tour' ? 'sandbox' : 'tour')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer border ${
              activeTab === 'sandbox'
                ? 'bg-white/10 text-white border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border-transparent'
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
            className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer font-mono"
            title="Search or press ⌘K"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] text-zinc-400">Search</span>
            <kbd className="text-[10px] font-mono bg-white/[0.08] border border-white/10 rounded px-1 text-zinc-300">
              ⌘K
            </kbd>
          </button>

          <Show when="signed-in">
            <Link href="/dashboard" passHref>
              <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white font-semibold cursor-pointer">
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
              className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1.5 transition-colors hidden sm:block cursor-pointer"
            >
              Sign In
            </Link>
            <Link href="/sign-up" passHref>
              <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white font-semibold cursor-pointer">
                Get Started
              </Button>
            </Link>
          </Show>
        </div>
      </div>
    </header>
  );
}
