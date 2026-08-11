'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, Edit3, GitCompare, Split, CheckSquare } from 'lucide-react';

interface PromptSubnavProps {
  promptId: string;
  testCount?: number;
  versionCount?: number;
}

export function PromptSubnav({ promptId, testCount }: PromptSubnavProps) {
  const pathname = usePathname();
  const baseUrl = `/dashboard/prompts/${promptId}`;

  const tabs = [
    { label: '1. Overview', href: baseUrl, icon: Eye, exact: true },
    { label: '2. Editor', href: `${baseUrl}/edit`, icon: Edit3 },
    { label: '3. Diff', href: `${baseUrl}/diff`, icon: Split },
    { label: '4. Compare', href: `${baseUrl}/compare`, icon: GitCompare },
    { label: '5. Test Suite', href: `${baseUrl}/tests`, icon: CheckSquare, count: testCount },
  ];

  return (
    <nav className="flex items-center gap-2 border-b border-zinc-800/90 pb-3 text-xs font-mono">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold tab-interactive ${
              isActive
                ? 'bg-zinc-100/10 text-zinc-100 border border-zinc-800 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-bg-panel'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded text-[10px]">
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
