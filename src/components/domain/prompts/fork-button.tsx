'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { forkPrompt } from '@/lib/actions/prompts';
import { GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col items-start gap-1">
      <Button
        onClick={handleFork}
        disabled={isPending}
        variant={variant === 'primary' ? 'default' : 'outline'}
        size="sm"
        aria-label={`Fork ${promptName} into your account`}
      >
        {isPending ? (
          <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
        ) : (
          <GitFork className="h-3.5 w-3.5" />
        )}
        {isPending ? 'Forking…' : 'Fork'}
      </Button>
      {error && (
        <p className="text-xs text-destructive font-mono leading-tight max-w-[180px]">{error}</p>
      )}
    </div>
  );
}
