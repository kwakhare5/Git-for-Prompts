'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Eye, Edit3, GitCompare, Split, CheckSquare } from 'lucide-react';

interface PromptSubnavProps {
  promptId: string;
  testCount?: number;
  versionCount?: number;
}

export function PromptSubnav({ promptId, testCount, versionCount }: PromptSubnavProps) {
  const pathname = usePathname();
  const baseUrl = `/dashboard/prompts/${promptId}`;

  const tabs = [
    { label: 'Overview', href: baseUrl, icon: Eye, exact: true },
    { label: 'Editor', href: `${baseUrl}/edit`, icon: Edit3 },
    { label: 'Diff', href: `${baseUrl}/diff`, icon: Split, requiresMultipleVersions: true },
    { label: 'Compare', href: `${baseUrl}/compare`, icon: GitCompare, requiresMultipleVersions: true },
    { label: 'Test Suite', href: `${baseUrl}/tests`, icon: CheckSquare, count: testCount },
  ];

  return (
    <nav className="flex items-center gap-1 bg-[#161616] border border-white/[0.08] p-1.5 rounded-2xl font-mono text-xs select-none shadow-sm overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

        if (tab.requiresMultipleVersions && versionCount !== undefined && versionCount < 2) {
          return (
            <span
              key={tab.href}
              title="Requires at least 2 saved versions"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-zinc-600 cursor-not-allowed text-xs font-sans opacity-50 whitespace-nowrap"
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </span>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-sm font-sans font-medium cursor-pointer whitespace-nowrap',
              isActive
                ? 'bg-[#111111] text-[#f5f0eb] border border-white/[0.08] font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-[#f5f0eb] hover:bg-white/[0.04]'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive ? 'text-[#f5f0eb]' : 'text-zinc-500')} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-[#f5f0eb] border border-white/10">
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
