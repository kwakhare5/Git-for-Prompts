'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandTrigger } from './command-trigger';

export function Topbar() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label =
      segment === 'dashboard'
        ? 'Dashboard'
        : segment === 'explore'
        ? 'Explore'
        : segment === 'api-keys'
        ? 'API Keys'
        : segment === 'webhooks'
        ? 'Webhooks'
        : segment === 'new'
        ? 'New Bundle'
        : segment === 'prompts'
        ? 'Prompts'
        : segment.length > 12
        ? `${segment.slice(0, 8)}...`
        : segment;

    return { href, label };
  });

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#111111]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none font-sans">
      <nav className="flex items-center gap-2 text-sm text-zinc-400 font-sans">
        <Link href="/dashboard" className="hover:text-[#f5f0eb] transition-colors font-medium">
          Workspace
        </Link>
        {breadcrumbs.map((item, idx) => (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <Link
              href={item.href}
              className={`transition-colors font-medium ${
                idx === breadcrumbs.length - 1 ? 'text-[#f5f0eb] font-semibold' : 'hover:text-zinc-200'
              }`}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <CommandTrigger placeholder="Search commands..." />

        <Link href="/dashboard/new">
          <Button size="sm" className="bg-[#f5f0eb] text-zinc-950 hover:bg-white font-semibold text-xs h-8 px-3 rounded-xl shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1 text-zinc-950" />
            <span className="hidden sm:inline">New Prompt</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
