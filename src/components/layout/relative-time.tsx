'use client';

/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';

/**
 * Renders a relative timestamp (e.g. "3d ago", "just now").
 * Date.now() inside useMemo is intentional — the value is stable per render
 * cycle and the hydration delta is handled by suppressHydrationWarning.
 */
export function RelativeTime({ date, className }: { date: Date; className?: string }) {
  const label = useMemo(() => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hrs > 0)  return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  }, [date]);

  return (
    <span
      suppressHydrationWarning
      className={className ?? 'text-zinc-600 tabular-nums text-xs font-mono'}
    >
      {label}
    </span>
  );
}
