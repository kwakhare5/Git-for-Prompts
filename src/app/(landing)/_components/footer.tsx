'use client';

import { GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/40 py-12 px-6 mt-20 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <GitBranch className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <span className="font-semibold text-sm text-zinc-300">Git for Prompts</span>
        </div>

        <span className="font-mono text-[10px] text-zinc-600">
          © {new Date().getFullYear()} Git for Prompts · Open Source Prompts VCS
        </span>
      </div>
    </footer>
  );
}
