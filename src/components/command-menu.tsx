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
  ArrowRight,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e] shadow-2xl z-10 font-sans">
        <Command label="Command Menu" className="w-full">
          {/* Paco Coursey cmdk Search Bar */}
          <div className="flex items-center border-b border-white/[0.08] px-4 py-3.5 bg-[#141414]">
            <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search commands, documentation, or CLI actions..."
              className="w-full bg-transparent text-xs text-[#f5f0eb] placeholder:text-zinc-500 focus:outline-none font-mono tracking-tight"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-zinc-400 bg-white/10 border border-white/10 rounded px-1.5 py-0.5 ml-2 select-none">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-8 text-center text-xs text-zinc-500 font-mono">
              No matching commands found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading={<span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 block">Navigation</span>}>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>Open Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/explore'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>Explore Public Prompts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/api-keys'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>API Keys Manager</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/webhooks'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <Webhook className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>Webhook Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
              </Command.Item>
            </Command.Group>

            {/* CLI Snippets */}
            <Command.Group heading={<span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 block mt-2">CLI Snippets</span>}>
              <Command.Item
                onSelect={() => runCommand(() => {
                  navigator.clipboard.writeText('npm install -g @gitforprompts/cli');
                  toast.success('Copied: npm install -g @gitforprompts/cli');
                })}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-mono group"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>npm install -g @gitforprompts/cli</span>
                </div>
                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">copy</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => {
                  navigator.clipboard.writeText('gfp init');
                  toast.success('Copied: gfp init');
                })}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-mono group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>gfp init</span>
                </div>
                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">copy</span>
              </Command.Item>
            </Command.Group>

            {/* External Links */}
            <Command.Group heading={<span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 block mt-2">Links</span>}>
              <Command.Item
                onSelect={() => runCommand(() => window.open('https://github.com/kwakhare5/Git-for-Prompts', '_blank'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <GitFork className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>GitHub Repository</span>
                </div>
                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">↗</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-[#121212] text-[10px] text-zinc-500 font-mono">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span>Git for Prompts v2</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
