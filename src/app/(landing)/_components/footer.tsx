'use client';

import { GitBranch } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/40 py-12 px-6 mt-20 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-zinc-300">Git for Prompts</span>
            <span className="text-[11px] text-zinc-400 font-bold mt-0.5">Built by Karan Wakhare</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-zinc-600">
          © {new Date().getFullYear()} Git for Prompts
        </span>
      </div>
    </footer>
  );
}
