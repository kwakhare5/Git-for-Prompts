'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { restoreVersion } from '@/lib/actions/versions';
import { RelativeTime } from '@/components/relative-time';
import { cn } from '@/lib/utils';
import type { InferSelectModel } from 'drizzle-orm';
import type { versions } from '@/db/schema';
import type { PromptBundle } from '@gfp/core';

type Version = InferSelectModel<typeof versions>;

interface VersionHistoryProps {
  promptId: string;
  versions: Version[];
  activeVersionId?: string;
  /** When provided, version switching is handled client-side (instant) instead of via URL navigation */
  onVersionSelect?: (versionId: string) => void;
}

export function VersionHistory({
  promptId,
  versions,
  activeVersionId,
  onVersionSelect,
}: VersionHistoryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRestore(versionId: string) {
    if (confirmRestoreId !== versionId) {
      setConfirmRestoreId(versionId);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        // BUG FIX: capture the newly-created version so we can select it.
        // Previously we passed the old versionId, which highlighted the wrong row
        // after router.refresh() added the new version at the top of the list.
        const newVersion = await restoreVersion({ versionId, promptId });
        setConfirmRestoreId(null);
        onVersionSelect?.(newVersion.id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Restore failed');
      }
    });
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="font-mono text-3xl text-zinc-700 mb-3">v0</div>
        <p className="text-sm text-zinc-500">No versions yet.</p>
        <p className="text-xs text-zinc-600 mt-1">
          Save your first version to start tracking history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {error && (
        <p
          role="alert"
          className="text-xs text-red-400 bg-red-950/50 border border-red-900 rounded px-3 py-2 mb-1"
        >
          {error}
        </p>
      )}

      {versions.map((v, idx) => {
        const isActive = v.id === activeVersionId;
        const isLatest = idx === 0;
        const isConfirming = confirmRestoreId === v.id;

        return (
          <div
            key={v.id}
            className={cn(
              'group relative rounded-lg border transition-colors',
              isActive
                ? 'border-zinc-600 bg-zinc-800/60'
                /* I2: added hover:bg so the row feels clickable, not just border-highlighted */
                : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/30',
              isPending && 'opacity-60 pointer-events-none'
            )}
          >
            {/* Version card — instant client-side switch when callback provided */}
            <button
              type="button"
              onClick={() => onVersionSelect?.(v.id)}
              className="flex items-start gap-3 px-4 py-3 w-full text-left"
              aria-label={`Preview version ${v.versionNumber}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Version badge */}
              <span className="shrink-0 font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded mt-0.5">
                v{v.versionNumber}
              </span>

              {/* Commit info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-300 truncate">
                  {v.commitMessage ? (
                    v.commitMessage
                  ) : (
                    <span className="italic text-zinc-600">No commit message</span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <RelativeTime date={v.createdAt} />
                  {isLatest && (
                    <span className="text-xs text-emerald-400 font-mono font-semibold">HEAD</span>
                  )}
                  {isActive && !isLatest && (
                    <span className="text-xs text-sky-500 font-mono">previewing</span>
                  )}
                  {/* Model badge — shown when version has a V2 bundle */}
                  {v.bundle && (() => {
                    const bundle = v.bundle as unknown as PromptBundle;
                    const label = `${bundle.modelConfig?.provider ?? ''}/${bundle.modelConfig?.model ?? ''}`;
                    return label !== '/' ? (
                      <span className="text-xs font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded font-medium">
                        {label}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </button>

            {/* Restore button — non-latest versions only */}
            {!isLatest && (
              <div className="px-4 pb-3 flex items-center gap-2">
                {isConfirming ? (
                  <>
                    <span className="text-xs text-zinc-400">
                      Restore v{v.versionNumber}?
                    </span>
                    <button
                      onClick={() => handleRestore(v.id)}
                      disabled={isPending}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 font-medium"
                    >
                      {isPending ? 'Restoring…' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmRestoreId(null)}
                      disabled={isPending}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestore(v.id)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors opacity-50 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-zinc-500 rounded"
                  >
                    Restore this version
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
