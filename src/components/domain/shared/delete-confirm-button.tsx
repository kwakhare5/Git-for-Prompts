'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DeleteConfirmButtonProps {
  onDelete: () => void;
  ariaLabel?: string;
  isPending?: boolean;
  className?: string;
}

export function DeleteConfirmButton({
  onDelete,
  ariaLabel = 'Delete',
  isPending = false,
  className,
}: DeleteConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={cn('flex items-center gap-1.5 font-sans', className)}>
        <span className="text-xs text-muted-foreground font-sans">Delete?</span>
        <Button
          onClick={() => {
            setConfirming(false);
            onDelete();
          }}
          disabled={isPending}
          variant="destructive"
          size="xs"
          className="font-sans cursor-pointer"
        >
          {isPending ? 'Deleting…' : 'Yes'}
        </Button>
        <Button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          variant="ghost"
          size="xs"
          className="text-xs text-muted-foreground hover:text-foreground font-sans cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setConfirming(true)}
      aria-label={ariaLabel}
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
    >
      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
    </Button>
  );
}
