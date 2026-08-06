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
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-10 font-sans">
        <Command label="Command Menu" className="w-full">
          {/* Paco Coursey cmdk Search Bar */}
          <div className="flex items-center border-b border-border px-4 py-3.5 bg-muted/30">
            <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search commands, documentation, or CLI actions..."
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none font-mono tracking-tight"
            />
            <kbd className="hidden sm:inline-block text-xs font-mono text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5 ml-2 select-none">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-8 text-center text-xs text-muted-foreground font-mono">
              No matching commands found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading={<span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold block">Navigation</span>}>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <span>Open Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/explore'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <span>Explore Public Prompts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/api-keys'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <span>API Keys Manager</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/webhooks'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <Webhook className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <span>Webhook Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              </Command.Item>
            </Command.Group>

            {/* CLI Snippets */}
            <Command.Group heading={<span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold block mt-2">CLI Snippets</span>}>
              <Command.Item
                onSelect={() => runCommand(() => {
                  navigator.clipboard.writeText('npm install -g @gitforprompts/cli');
                  toast.success('Copied: npm install -g @gitforprompts/cli');
                })}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-mono group"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span>npm install -g @gitforprompts/cli</span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground font-mono">copy</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => {
                  navigator.clipboard.writeText('gfp init');
                  toast.success('Copied: gfp init');
                })}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-mono group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>gfp init</span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground font-mono">copy</span>
              </Command.Item>
            </Command.Group>

            {/* External Links */}
            <Command.Group heading={<span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold block mt-2">Links</span>}>
              <Command.Item
                onSelect={() => runCommand(() => window.open('https://github.com/kwakhare5/Git-for-Prompts', '_blank'))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-foreground cursor-pointer transition-colors font-sans group"
              >
                <div className="flex items-center gap-2.5">
                  <GitFork className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <span>GitHub Repository</span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground font-mono">↗</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/40 text-xs text-muted-foreground font-mono font-semibold">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span>Git for Prompts</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
