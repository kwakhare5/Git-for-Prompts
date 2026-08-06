'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Eye, Edit3, GitCompare, Split, CheckSquare } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

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
    <nav className="flex items-center gap-1 bg-card border border-border p-1.5 rounded-xl font-mono text-xs select-none shadow-sm overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

        if (tab.requiresMultipleVersions && versionCount !== undefined && versionCount < 2) {
          return (
            <span
              key={tab.href}
              title="Requires at least 2 saved versions"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-muted-foreground cursor-not-allowed text-xs font-sans opacity-50 whitespace-nowrap"
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
              'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-150 ease-out text-sm font-sans font-medium cursor-pointer whitespace-nowrap active:scale-[0.98]',
              isActive
                ? 'bg-background text-foreground border border-border font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive ? 'text-foreground' : 'text-muted-foreground')} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <Badge variant="outline" className="ml-1 font-mono font-semibold">
                {tab.count}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
