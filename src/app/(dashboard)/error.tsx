'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { StatusBadge } from '@/components/status-badge';
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
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-6 bg-[#111111] font-sans select-none">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/[0.08] bg-[#161616] shadow-2xl flex flex-col items-center text-center space-y-6">
        <BrandLogo />

        <StatusBadge variant="rose" icon={AlertOctagon}>
          Error Exception
        </StatusBadge>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#f5f0eb] tracking-tight">
            Unexpected Exception Encountered
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            An internal runtime error interrupted this view. Our system state remains safe and uncorrupted.
          </p>
        </div>

        {error.digest && (
          <div className="w-full p-3 rounded-xl bg-[#111111] border border-white/[0.08] font-mono text-xs text-rose-300/80 truncate">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex items-center gap-3 w-full pt-2">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f5f0eb] text-zinc-950 font-semibold text-xs hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20 active:scale-[0.98] transition-all"
            title="Return to Dashboard"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
