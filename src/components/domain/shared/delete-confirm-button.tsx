'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

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
  className = '',
}: DeleteConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={`flex items-center gap-2 font-sans ${className}`}>
        <span className="text-xs text-zinc-400 font-medium">Delete?</span>
        <button
          onClick={() => {
            setConfirming(false);
            onDelete();
          }}
          disabled={isPending}
          className="min-h-[44px] px-3 py-1.5 bg-rose-600 text-white text-xs rounded-lg hover:bg-rose-700 font-medium btn-interactive inline-flex items-center justify-center"
        >
          {isPending ? 'Deleting…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="min-h-[44px] px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-medium tab-interactive inline-flex items-center justify-center"
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
      className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-zinc-400 hover:text-rose-400 rounded tab-interactive"
    >
      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
    </button>
  );
}
