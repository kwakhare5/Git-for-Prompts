'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Search,
  LayoutDashboard,
  Compass,
  Key,
  Webhook,
  FileCode,
  GitFork,
  Terminal,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle on ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  function runCommand(action: () => void) {
    setOpen(false);
    action();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#0e0e0e] shadow-2xl z-10 font-sans">
        <Command label="Command Menu" className="w-full">
          {/* Search bar */}
          <div className="flex items-center border-b border-white/[0.08] px-3.5 py-3">
            <Search className="w-4 h-4 text-zinc-500 mr-2.5 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search..."
              className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-mono"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-zinc-500 bg-white/[0.06] border border-white/[0.1] rounded px-1.5 py-0.5 ml-2">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-xs text-zinc-500 font-mono">
              No results found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading={<span className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-600">Navigation</span>}>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                Dashboard
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/explore'))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
                Explore Prompts
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/api-keys'))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-zinc-400" />
                API Keys Manager
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/webhooks'))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <Webhook className="w-3.5 h-3.5 text-zinc-400" />
                Webhook Settings
              </Command.Item>
            </Command.Group>

            {/* CLI Snippets */}
            <Command.Group heading={<span className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-600 mt-2 block">Copy CLI Command</span>}>
              <Command.Item
                onSelect={() => runCommand(() => {
                  navigator.clipboard.writeText('npm install -g @gitforprompts/cli');
                  toast.success('Copied: npm install -g @gitforprompts/cli');
                })}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors font-mono"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                gfp install
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => {
                  navigator.clipboard.writeText('gfp init');
                  toast.success('Copied: gfp init');
                })}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors font-mono"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                gfp init
              </Command.Item>
            </Command.Group>

            {/* External Links */}
            <Command.Group heading={<span className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-600 mt-2 block">Links</span>}>
              <Command.Item
                onSelect={() => runCommand(() => window.open('https://github.com/kwakhare5/Git-for-Prompts', '_blank'))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                GitHub Repository ↗
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => window.open('https://gitforprompts.vercel.app', '_blank'))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                Documentation
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
