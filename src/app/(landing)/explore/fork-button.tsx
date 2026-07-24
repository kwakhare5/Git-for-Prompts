'use client';

import { useTransition } from 'react';
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

  function handleFork(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        const forked = await forkPrompt(promptId);
        router.push(`/dashboard/prompts/${forked.id}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Fork failed';
        alert(msg);
      }
    });
  }

  const baseStyles = "inline-flex items-center gap-2 rounded-md text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-zinc-50 px-3.5 py-1.5 text-zinc-950 hover:bg-zinc-200",
    secondary: "border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700",
  };

  return (
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
  );
}
