'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('divide-y divide-border border-y border-border font-sans', className)}>{children}</div>;
}

export function AccordionItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('py-4 font-sans', className)}>{children}</div>;
}

export function AccordionTrigger({
  children,
  isOpen,
  onClick,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between font-sans text-left text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180 text-foreground')}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  isOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}) {
  if (!isOpen) return null;
  return (
    <div className={cn('pt-3 text-xs md:text-sm text-muted-foreground font-sans leading-relaxed animate-in fade-in duration-150', className)}>
      {children}
    </div>
  );
}
