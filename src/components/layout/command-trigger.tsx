'use client';

import { Search } from 'lucide-react';

interface CommandTriggerProps {
  className?: string;
  placeholder?: string;
  showKbd?: boolean;
}

export function CommandTrigger({
  className = '',
  placeholder = 'Search commands...',
  showKbd = true,
}: CommandTriggerProps) {
  const triggerCommandMenu = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
    document.dispatchEvent(event);
  };

  return (
    <button
      type="button"
      onClick={triggerCommandMenu}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-[#111111] text-sm text-zinc-400 hover:text-[#f5f0eb] hover:border-white/20 transition-all cursor-pointer font-mono group select-none ${className}`}
      title="Search commands (CTRL+K)"
    >
      <Search className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
      <span className="text-zinc-400 font-sans text-sm">{placeholder}</span>
      {showKbd && (
        <kbd className="text-xs font-mono bg-[#161616] border border-white/[0.08] rounded px-2 py-0.5 text-zinc-400 group-hover:text-[#f5f0eb] transition-colors ml-auto font-semibold">
          CTRL+K
        </kbd>
      )}
    </button>
  );
}
