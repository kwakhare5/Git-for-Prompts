'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export function Navbar({ userId }: { userId?: string | null }) {
  const pathname = usePathname();

  // Hide landing floating navbar when inside the full-screen dashboard app or auth pages
  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/sign-in') ||
    pathname?.startsWith('/sign-up')
  ) {
    return null;
  }

  return (
    <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4 sm:px-6 my-3 font-sans">
      <div className="bg-bg-card/90 border border-zinc-800/90 backdrop-blur-md rounded-2xl shadow-xl px-5 h-14 flex items-center justify-between transition-all">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group font-mono">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Git for Prompts Logo"
            width={32}
            height={32}
            className="w-7 h-7 rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-base tracking-tight text-zinc-100">
              Git for Prompts
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400 font-mono">
          <Link href="/explore" className="hover:text-zinc-100 transition-transform active:scale-97 cursor-pointer text-zinc-200">
            Explore
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-100 transition-transform active:scale-97 cursor-pointer">
            Dashboard
          </Link>
          <Link href="/dashboard/api-keys" className="hover:text-zinc-100 transition-transform active:scale-97 cursor-pointer">
            API Keys
          </Link>
          <Link href="/dashboard/webhooks" className="hover:text-zinc-100 transition-transform active:scale-97 cursor-pointer">
            Webhooks
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 text-xs">
          <a
            href="https://github.com/kwakhare5/Git-for-Prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3.5 rounded-xl border border-zinc-800 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800/80 hover:text-zinc-100 shadow-xs transition-all active:scale-97 cursor-pointer flex items-center gap-2 font-mono text-[11px] font-bold group"
          >
            <span className="text-zinc-400 group-hover:text-zinc-200 font-extrabold text-xs">★</span>
            <span className="hidden sm:inline">Star on GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>

          {userId ? (
            <Link
              href="/dashboard"
              className="h-9 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs shadow-xs transition-all active:scale-97 flex items-center justify-center"
            >
              Open Workspace
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="h-9 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs shadow-xs transition-all active:scale-97 flex items-center justify-center"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
