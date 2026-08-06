'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
import { StatusBadge } from '@/components/layout/status-badge';
import { Button } from '@/components/ui/button';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[dashboard error boundary]', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-6 bg-background font-sans select-none">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-2xl flex flex-col items-center text-center space-y-6">
        <BrandLogo />

        <StatusBadge variant="rose" icon={AlertOctagon}>
          Error Exception
        </StatusBadge>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Unexpected Exception Encountered
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            An internal runtime error interrupted this view. Our system state remains safe and uncorrupted.
          </p>
        </div>

        {error.digest && (
          <div className="w-full p-3 rounded-xl bg-background border border-border font-mono text-xs text-destructive truncate">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex items-center gap-3 w-full pt-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={reset}
            className="flex-1 gap-2 font-semibold cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </Button>
          <Link href="/dashboard" passHref>
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              title="Return to Dashboard"
            >
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
