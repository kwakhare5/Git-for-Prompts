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
      <div className={`flex items-center gap-1.5 font-sans ${className}`}>
        <span className="text-xs text-gray-500">Delete?</span>
        <button
          onClick={() => {
            setConfirming(false);
            onDelete();
          }}
          disabled={isPending}
          className="px-2 py-0.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-medium"
        >
          {isPending ? 'Deleting…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="px-2 py-0.5 text-xs text-gray-500 hover:text-black font-medium"
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
      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
    </button>
  );
}
