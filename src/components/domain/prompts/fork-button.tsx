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

  return (
    <div className="flex flex-col items-start gap-1 font-mono">
      <button
        onClick={handleFork}
        disabled={isPending}
        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all active:scale-97 cursor-pointer ${
          variant === 'primary'
            ? 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-xs'
            : 'border border-zinc-700/80 bg-[#202024] hover:bg-[#28282D] text-zinc-200'
        } disabled:opacity-50`}
        aria-label={`Fork ${promptName} into your account`}
      >
        <GitFork className="h-3.5 w-3.5 text-blue-400" />
        {isPending ? 'Forking Repository…' : 'Fork Repository'}
      </button>
      {error && (
        <p className="text-xs text-rose-300 font-mono">{error}</p>
      )}
    </div>
  );
}
