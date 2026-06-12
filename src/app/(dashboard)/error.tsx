'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('[dashboard error boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="font-mono text-5xl text-red-500 mb-4">!</div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-500 max-w-md mb-6 font-mono">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors border border-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
