'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
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
    <div className="flex items-center justify-center min-h-[70vh] p-6 font-sans">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800/90 bg-[#161619] shadow-2xl flex flex-col items-center text-center space-y-6">
        <BrandLogo />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-mono font-bold">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Error Exception</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-mono text-zinc-100">
            Unexpected Exception Encountered
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            An internal runtime error interrupted this view.
          </p>
        </div>

        {error.digest && (
          <div className="w-full p-3 rounded-xl bg-[#121214] border border-zinc-800 font-mono text-xs text-rose-300 truncate">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex items-center gap-3 w-full pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold active:scale-97 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="p-2.5 border border-zinc-800 bg-[#121214] hover:bg-[#1D1D22] text-zinc-300 hover:text-white rounded-xl transition-all"
            title="Return to Workspace"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
