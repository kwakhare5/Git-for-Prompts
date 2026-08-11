'use client';

import { useSyncExternalStore } from 'react';

function getRelativeTimeString(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Renders a relative timestamp (e.g. "3d ago", "just now").
 * Computes formatting on the client post-mount to guarantee zero React 19 hydration mismatches.
 */
export function RelativeTime({ date, className }: { date: Date | string; className?: string }) {
  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const label = isClient ? getRelativeTimeString(date) : '...';

  return (
    <span className={className ?? 'text-zinc-600 tabular-nums text-xs font-mono'}>
      {label}
    </span>
  );
}
