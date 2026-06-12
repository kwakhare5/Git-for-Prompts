'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home & Guide', href: '/', icon: '⌂', enabled: true },
  { label: 'Dashboard', href: '/dashboard', icon: '▦', enabled: true },
  { label: 'API Keys', href: '/dashboard/api-keys', icon: '⌘', enabled: true },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙', enabled: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Hamburger trigger — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed top-3.5 left-4 z-50 flex md:hidden items-center justify-center w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
      >
        {/* Three-line hamburger icon */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
          <rect y="0" width="14" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="5" width="14" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="10" width="14" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>

      {/* Backdrop overlay — mobile only, dismisses on click */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar shell
          Mobile:  fixed drawer, slides in from left, z-50
          Desktop: participates in flex flow as a static column */}
      <aside
        className={cn(
          'flex h-screen w-56 flex-col border-r border-zinc-800 bg-zinc-950',
          // Mobile: fixed drawer, slides in from left
          // #16: transition-transform instead of transition-all (only transform changes during slide)
          // #25: shadow-2xl on mobile to show elevation over page content; none on desktop
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out shadow-2xl',
          'md:relative md:z-auto md:translate-x-0 md:shadow-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        {/* Brand row */}
        <div className="flex h-14 items-center border-b border-zinc-800 px-4">
          <Link
            href="/dashboard"
            onClick={close}
            className="font-mono text-sm font-semibold text-zinc-50 tracking-tight hover:text-zinc-300 transition-colors"
          >
            git-for-prompts
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={close}
            aria-label="Close navigation menu"
            className="ml-auto flex md:hidden items-center justify-center w-7 h-7 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <span aria-hidden="true" className="text-sm leading-none">✕</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-2 pt-3" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : item.href === '/dashboard'
                ? pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/api-keys')
                : pathname.startsWith(item.href);

            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  role="link"
                  aria-disabled="true"
                  title="Coming soon"
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 cursor-not-allowed select-none"
                >
                  <span aria-hidden="true" className="text-xs opacity-50">{item.icon}</span>
                  {item.label}
                  {/* V5 fix: was text-zinc-800 (near-invisible) → text-zinc-600 */}
                  <span className="ml-auto text-[10px] font-mono text-zinc-600">soon</span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-zinc-800 text-zinc-50'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200',
                )}
              >
                <span aria-hidden="true" className="text-xs opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="flex items-center gap-3 border-t border-zinc-800 p-4">
          <UserButton appearance={clerkAppearance} />
          <span className="text-xs text-zinc-500 truncate">My Account</span>
        </div>
      </aside>
    </>
  );
}
