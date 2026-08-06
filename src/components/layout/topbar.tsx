'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandTrigger } from './command-trigger';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { SidebarTrigger } from '@/components/ui/sidebar';

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
    <header className="h-14 border-b border-border bg-background/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <nav className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <Link href="/dashboard" className="hover:text-foreground transition-colors font-medium">
            Workspace
          </Link>
        {breadcrumbs.map((item, idx) => (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
            <Link
              href={item.href}
              className={`transition-colors font-medium ${
                idx === breadcrumbs.length - 1 ? 'text-foreground font-semibold' : 'hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
      </div>

      <div className="flex items-center gap-3">
        <CommandTrigger placeholder="Search commands..." />

        <Link href="/dashboard/new">
          <Button size="sm" variant="default" className="font-semibold shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Prompt</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>

        <Tooltip>
          <TooltipTrigger>
            <Avatar className="w-8 h-8 cursor-pointer hover:border-primary transition-colors">
              <AvatarFallback>GFP</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="bottom">Developer Account</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
