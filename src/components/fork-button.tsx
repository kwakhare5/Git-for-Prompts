'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { forkPrompt } from '@/lib/actions/prompts';
import { GitFork } from 'lucide-react';

interface ForkButtonProps {
  promptId: string;
  promptName: string;
  variant?: 'primary' | 'secondary';
}

export function ForkButton({ promptId, promptName, variant = 'primary' }: ForkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFork(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      try {
        const forked = await forkPrompt(promptId);
        router.push(`/dashboard/prompts/${forked.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fork failed');
      }
    });
  }

  const baseStyles =
    'inline-flex items-center gap-2 rounded-md text-xs font-medium transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-zinc-50 px-3.5 py-1.5 text-zinc-950 hover:bg-zinc-200',
    secondary:
      'border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700',
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleFork}
        disabled={isPending}
        className={`${baseStyles} ${variants[variant]}`}
        aria-label={`Fork ${promptName} into your account`}
      >
        {isPending ? (
          <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
        ) : (
          <GitFork className="h-3.5 w-3.5" />
        )}
        {isPending ? 'Forking…' : 'Fork'}
      </button>
      {error && (
        <p className="text-[11px] text-red-400 leading-tight max-w-[180px]">{error}</p>
      )}
    </div>
  );
}
