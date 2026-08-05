'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  Home,
  LayoutDashboard,
  Compass,
  Key,
  Webhook,
  X,
  Terminal,
  ShieldCheck,
  Plus,
} from 'lucide-react';

const mainNavItems = [
  { label: 'Home', href: '/', icon: Home, enabled: true },
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Explore Prompts', href: '/dashboard/explore', icon: Compass, enabled: true },
];

const developerNavItems = [
  { label: 'API Keys', href: '/dashboard/api-keys', icon: Key, enabled: true },
  { label: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook, enabled: true },
];

const hasClerkKeys = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed top-3.5 left-4 z-50 flex md:hidden items-center justify-center w-8 h-8 rounded-xl bg-[#161616] border border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/20 transition-colors shadow-md"
      >
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
          <rect y="0" width="14" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="5" width="14" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="10" width="14" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'flex h-screen w-60 flex-col border-r border-white/[0.08] bg-[#111111]',
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-emil shadow-2xl',
          'md:relative md:z-auto md:translate-x-0 md:shadow-none select-none font-sans',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-4 bg-[#121212]">
          <BrandLogo onClick={close} />

          <button
            onClick={close}
            aria-label="Close navigation menu"
            className="ml-auto flex md:hidden items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#161616] transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-3">
          <Link
            href="/dashboard/new"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-[#f5f0eb] text-zinc-950 hover:bg-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] group font-sans"
          >
            <Plus className="w-4 h-4 text-zinc-950 transition-transform group-hover:rotate-90 duration-200" />
            New Prompt Bundle
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div>
            <span className="px-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-medium">
              Main
            </span>
            <nav className="space-y-1" aria-label="Main navigation">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : item.href === '/dashboard'
                    ? pathname === '/dashboard' || (pathname.startsWith('/dashboard/prompts') && !pathname.includes('/explore'))
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#161616] text-[#f5f0eb] border border-white/[0.08] shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#f5f0eb]' : 'text-zinc-500 group-hover:text-zinc-300',
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-medium">
              Developer
            </span>
            <nav className="space-y-1" aria-label="Developer navigation">
              {developerNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#161616] text-[#f5f0eb] border border-white/[0.08] shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#f5f0eb]' : 'text-zinc-500 group-hover:text-zinc-300',
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3 rounded-2xl bg-[#161616] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 font-medium">
                <Terminal className="w-3 h-3 text-zinc-400" /> CLI Ready
              </span>
              <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                gfp CLI
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug font-sans">
              Run <code className="text-zinc-300 font-mono text-[10px]">gfp push</code> or <code className="text-zinc-300 font-mono text-[10px]">gfp run</code> directly from terminal.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] p-3 bg-[#0e0e0e]">
          <div className="flex items-center gap-3 p-1.5 rounded-xl bg-[#161616] border border-white/[0.08]">
            {hasClerkKeys ? (
              <>
                <UserButton appearance={clerkAppearance} />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-zinc-200 truncate font-sans">Account</span>
                  <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-zinc-400" /> Signed in
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5 w-full">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 text-[#f5f0eb] font-mono text-xs font-bold shrink-0">
                  DEV
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-zinc-200 truncate font-mono">Local Dev User</span>
                  <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                    Offline Mode
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
