'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function HoverCard({ children, content, className }: { children: React.ReactElement; content: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block font-sans" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <div
          className={cn(
            'absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border bg-popover p-3 text-xs text-popover-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-150 font-sans',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
