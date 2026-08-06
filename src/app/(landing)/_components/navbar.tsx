'use client';

import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import { CommandTrigger } from '@/components/command-trigger';

interface NavbarProps {
  activeTab: 'tour' | 'sandbox';
  onChangeTab: (tab: 'tour' | 'sandbox') => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

export function Navbar({ activeTab, onChangeTab, onNavClick }: NavbarProps) {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between border border-white/[0.08] bg-[#161616]/90 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300 w-[calc(100%-2rem)] max-w-5xl px-4 py-2 select-none">
      {/* Brand Logo Component */}
      <BrandLogo href="/" />

      {/* Unboxed Clean Text Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-sans font-medium">
        <Link
          href="#home"
          onClick={(e) => onNavClick(e, 'home')}
          className="text-zinc-400 hover:text-[#f5f0eb] transition-colors cursor-pointer"
        >
          Home
        </Link>
        <Link
          href="#docs"
          onClick={(e) => onNavClick(e, 'docs')}
          className="text-zinc-400 hover:text-[#f5f0eb] transition-colors cursor-pointer"
        >
          Docs
        </Link>
        <button
          onClick={() => onChangeTab(activeTab === 'tour' ? 'sandbox' : 'tour')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'sandbox'
              ? 'text-[#f5f0eb] font-semibold'
              : 'text-zinc-400 hover:text-[#f5f0eb]'
          }`}
        >
          Sandbox Playground
        </button>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        <CommandTrigger className="hidden sm:inline-flex" placeholder="Search" />

        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <>
            <Show when="signed-in">
              <Link href="/dashboard" passHref>
                <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] font-semibold cursor-pointer shadow-sm">
                  Dashboard
                </Button>
              </Link>
              <div className="pl-1">
                <UserButton />
              </div>
            </Show>

            <Show when="signed-out">
              <Link href="/sign-up" passHref>
                <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] font-semibold cursor-pointer shadow-sm">
                  Get Started
                </Button>
              </Link>
            </Show>
          </>
        ) : (
          <Link href="/sign-up" passHref>
            <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] font-semibold cursor-pointer shadow-sm">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
