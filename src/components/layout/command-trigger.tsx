'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={triggerCommandMenu}
      className={`h-9 px-3 justify-start gap-2 bg-card border-border text-muted-foreground hover:text-foreground font-mono group cursor-pointer ${className}`}
      title="Search commands (CTRL+K)"
      aria-label="Search commands"
    >
      <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      <span className="text-muted-foreground font-sans text-sm">{placeholder}</span>
      {showKbd && (
        <kbd className="text-[10px] font-mono bg-muted border border-border rounded px-1.5 py-0.5 text-muted-foreground group-hover:text-foreground transition-colors ml-auto font-semibold">
          CTRL+K
        </kbd>
      )}
    </Button>
  );
}
