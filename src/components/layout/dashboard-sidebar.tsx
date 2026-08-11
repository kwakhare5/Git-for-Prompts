'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { BadgeVersion, Tooltip } from '@/components/website/ui-tokens';
import {
  Home,
  LayoutDashboard,
  PlusCircle,
  Key,
  Webhook,
  Compass,
  ChevronLeft,
  ChevronRight,
  Terminal,
  FolderGit2,
} from 'lucide-react';

interface PromptSummary {
  id: string;
  name: string;
  versionCount?: number;
}

interface DashboardSidebarProps {
  prompts?: PromptSummary[];
  isDemo?: boolean;
}

export function DashboardSidebar({ prompts = [] }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: 'Home Page', href: '/', icon: Home },
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Prompt', href: '/dashboard/new', icon: PlusCircle },
    { label: 'API Credentials', href: '/dashboard/api-keys', icon: Key },
    { label: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook },
    { label: 'Explore Community', href: '/dashboard/explore', icon: Compass },
  ];

  return (
    <aside
      className={`bg-bg-card border-r border-zinc-800/90 flex flex-col justify-between transition-all duration-300 select-none z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="space-y-6 p-4">
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 group" title="Return to Home Page">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Git for Prompts Logo"
              width={28}
              height={28}
              className="w-7 h-7 rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform"
            />
            {!isCollapsed && (
              <div className="min-w-0 font-mono">
                <span className="font-bold text-sm tracking-tight text-zinc-100 block truncate group-hover:text-white">
                  Git for Prompts
                </span>
                <span className="text-[10px] text-zinc-400 font-medium block">Workspace Studio</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-lg bg-bg-panel hover:bg-zinc-700 border border-zinc-800 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand Sidebar (⌘B)' : 'Collapse Sidebar (⌘B)'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-blue-300" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-1 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl tab-interactive font-semibold ${
                  isActive
                    ? 'bg-zinc-100/10 text-zinc-100 border border-zinc-800 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-bg-panel'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.href} text={item.label} position="right">
                {linkContent}
              </Tooltip>
            ) : (
              linkContent
            );
          })}
        </nav>

        {/* Prompt Repositories Subtree */}
        {!isCollapsed && (
          <div className="pt-4 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3 h-3 text-zinc-400" />
                Repositories ({prompts.length})
              </span>
              <Link href="/dashboard/new" className="text-zinc-300 hover:underline text-[10px] lowercase tab-interactive">
                +new
              </Link>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 font-mono text-xs">
              {prompts.length === 0 ? (
                <div className="p-3 bg-bg-page rounded-xl border border-zinc-800/90 text-zinc-500 text-[11px] text-center space-y-1.5 font-mono">
                  <div>No repositories yet</div>
                  <Link
                    href="/dashboard/new"
                    className="inline-block text-zinc-300 hover:underline text-[10px] font-bold tab-interactive"
                  >
                    + Create Repository
                  </Link>
                </div>
              ) : (
                prompts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/prompts/${p.id}`}
                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-bg-panel flex items-center justify-between tab-interactive border border-transparent hover:border-zinc-800"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 shrink-0"></span>
                      <span className="truncate text-[11px] font-medium">{p.name}</span>
                    </div>
                    <BadgeVersion>
                      {`v${p.versionCount || 1}`}
                    </BadgeVersion>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer & User Profile */}
      <div className="p-4 border-t border-zinc-800/90 space-y-3">
        {/* CLI Quickstart Box */}
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-bg-page border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center justify-between text-zinc-200 font-bold text-[10px]">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-zinc-300" /> CLI Tool
              </span>
              <span className="text-[9px] bg-zinc-800 px-1 rounded text-zinc-400">Offline</span>
            </div>
            <code className="text-zinc-200 block text-[10px] truncate">$ npx gfp init</code>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5 min-w-0 font-mono">
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
              <UserButton />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-zinc-100/10 text-zinc-100 border border-zinc-800 font-bold text-xs flex items-center justify-center shrink-0">
                DEV
              </div>
            )}
            {!isCollapsed && (
              <div className="min-w-0 text-xs">
                <span className="text-zinc-200 font-bold block truncate">Workspace</span>
                <span className="text-[10px] text-emerald-300 font-mono">Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
