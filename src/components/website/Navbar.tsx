'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GithubIcon } from './ui-tokens';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="bg-bg-card border border-zinc-800/90 rounded-2xl shadow-2xl px-4 sm:px-5 h-14 flex items-center justify-between transition-all">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group font-mono shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt="Git for Prompts Logo"
            width={32}
            height={32}
            className="w-7 h-7 rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-100">
              Git for Prompts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400 font-mono">
          <Link href="/dashboard" className="hover:text-zinc-100 tab-interactive">
            Dashboard
          </Link>
          <Link href="/dashboard/api-keys" className="hover:text-zinc-100 tab-interactive">
            API Keys
          </Link>
          <Link href="/dashboard/webhooks" className="hover:text-zinc-100 tab-interactive">
            Webhooks
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <a
            href="https://github.com/kwakhare5/Git-for-Prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-9 px-3.5 rounded-xl border border-zinc-800 text-zinc-300 bg-bg-card hover:bg-bg-panel hover:text-zinc-100 hover:border-zinc-700 shadow-xs btn-interactive items-center gap-2 font-mono text-[11px] font-bold group"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-100 shrink-0" />
            <span>GitHub</span>
          </a>

          <Link
            href="/dashboard"
            className="h-9 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs shadow-xs btn-interactive flex items-center justify-center shrink-0 whitespace-nowrap"
          >
            Open Dashboard
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-800 bg-bg-card text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors ml-0.5 shrink-0"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-start pt-20 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Box */}
          <div className="relative bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 font-mono text-sm z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Navigation Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-3 rounded-xl text-zinc-200 hover:bg-zinc-800/80 flex items-center justify-between"
              >
                <span>Prompt Studio</span>
                <span className="text-zinc-600 text-xs">→</span>
              </Link>
              <Link
                href="/dashboard/api-keys"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-3 rounded-xl text-zinc-200 hover:bg-zinc-800/80 flex items-center justify-between"
              >
                <span>API Keys &amp; SDK</span>
                <span className="text-zinc-600 text-xs">→</span>
              </Link>
              <Link
                href="/dashboard/webhooks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-3 rounded-xl text-zinc-200 hover:bg-zinc-800/80 flex items-center justify-between"
              >
                <span>Webhooks &amp; Sync</span>
                <span className="text-zinc-600 text-xs">→</span>
              </Link>
            </nav>

            <div className="border-t border-zinc-800/80 pt-4 flex flex-col gap-2.5">
              <a
                href="https://github.com/kwakhare5/Git-for-Prompts"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 flex items-center justify-center gap-2 text-xs font-semibold hover:border-zinc-700"
              >
                <GithubIcon className="w-4 h-4 text-zinc-400" />
                <span>View Source on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
