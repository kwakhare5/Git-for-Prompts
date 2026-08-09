'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, GitBranch, ShieldCheck } from 'lucide-react';

export function TopHeaderBar() {
  const pathname = usePathname();

  // Split pathname into breadcrumb segments
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      // Format human-readable segment title
      let label = seg;
      if (seg === 'dashboard') label = 'Dashboard';
      else if (seg === 'prompts') label = 'Prompts';
      else if (seg === 'api-keys') label = 'API Keys';
      else if (seg === 'webhooks') label = 'Webhooks';
      else if (seg === 'explore') label = 'Explore';
      else if (seg === 'new') label = 'New Repository';
      else if (seg === 'edit') label = 'Edit Bundle';
      else if (seg === 'diff') label = 'Diff Viewer';
      else if (seg === 'compare') label = 'A/B Compare';
      else if (seg === 'tests') label = 'Eval Suite';
      else if (seg.length > 12) label = `${seg.slice(0, 8)}…`;

      return { label, href };
    }),
  ];

  return (
    <header className="h-12 border-b border-zinc-800/90 bg-[#161619]/80 backdrop-blur-md px-6 flex items-center justify-between text-xs font-mono text-zinc-400 select-none z-30 sticky top-0">
      {/* Breadcrumb Path Trail */}
      <nav className="flex items-center gap-1.5 min-w-0 overflow-x-auto font-mono">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <div key={crumb.href + idx} className="flex items-center gap-1.5 shrink-0">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
              <Link
                href={crumb.href}
                className={`transition-colors font-semibold truncate max-w-[140px] ${
                  isLast
                    ? 'text-zinc-100 font-bold pointer-events-none'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {crumb.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Environment & VCS Branch Pills */}
      <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
        <span className="flex items-center gap-1 bg-[#121214] border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-300">
          <GitBranch className="w-3 h-3 text-zinc-100" />
          <span className="font-bold text-zinc-200">main</span>
        </span>

        <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-300 font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>Local-First VCS</span>
        </span>
      </div>
    </header>
  );
}
