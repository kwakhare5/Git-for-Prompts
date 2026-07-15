'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { forkPrompt } from '@/lib/actions/prompts';

interface ForkButtonProps {
  promptId: string;
  promptName: string;
}

export function ForkButton({ promptId, promptName }: ForkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleFork() {
    startTransition(async () => {
      try {
        const forked = await forkPrompt(promptId);
        router.push(`/dashboard/prompts/${forked.id}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Fork failed';
        // Surface error — in a bigger app this would be a toast
        alert(msg);
      }
    });
  }

  return (
    <button
      onClick={handleFork}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label={`Fork ${promptName} into your account`}
    >
      {isPending ? (
        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <span aria-hidden="true">⑂</span>
      )}
      {isPending ? 'Forking…' : 'Fork'}
    </button>
  );
}
