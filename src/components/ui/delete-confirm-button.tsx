'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmButtonProps {
  /**
   * Called when the user confirms deletion.
   * The parent is responsible for wrapping this in useTransition / async call.
   */
  onDelete: () => void;
  /** Shown as aria-label on the initial ✕ button. */
  ariaLabel?: string;
  /**
   * When true (parent's isPending), disables both confirm buttons.
   * The parent keeps useTransition so it can also dim the parent card.
   */
  isPending?: boolean;
  /** Extra classes on the root element when confirming. */
  className?: string;
}

/**
 * Reusable three-state delete widget used by PromptCard and TestCaseCard.
 * Idle → (click ✕) → confirming → (click Yes) → calls onDelete.
 * The confirming state is internal; the parent owns the async transition.
 */
export function DeleteConfirmButton({
  onDelete,
  ariaLabel = 'Delete',
  isPending = false,
  className,
}: DeleteConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-xs text-zinc-400">Delete?</span>
        <button
          onClick={() => {
            setConfirming(false);
            onDelete();
          }}
          disabled={isPending}
          className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Deleting…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-6 h-6 rounded-md text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-all opacity-40 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-red-500"
    >
      <X className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}
