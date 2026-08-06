'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { restoreVersion } from '@/lib/actions/versions';
import { RelativeTime } from '@/components/layout/relative-time';
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

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex flex-col items-center justify-center py-16 text-center px-4 font-sans">
        <div className="font-mono text-3xl text-muted-foreground mb-3">v0</div>
        <p className="text-sm text-muted-foreground font-sans">No versions yet.</p>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          Save your first version to start tracking history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 font-sans">
      {error && (
        <p
          role="alert"
          className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2 mb-1 font-mono"
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
              'group relative rounded-xl border transition-all duration-150 font-sans',
              isActive
                ? 'border-border bg-accent/80 shadow-sm'
                : 'border-border/60 bg-card hover:border-border hover:bg-accent/40',
              isPending && 'opacity-60 pointer-events-none'
            )}
          >
            {/* Version card */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => onVersionSelect?.(v.id)}
              className="flex items-start gap-3 px-4 py-3 h-auto w-full text-left cursor-pointer font-sans justify-start rounded-xl"
              aria-label={`Preview version ${v.versionNumber}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Version badge */}
              <Badge variant="outline" className="font-mono text-xs shrink-0 mt-0.5">
                v{v.versionNumber}
              </Badge>

              {/* Commit info */}
              <div className="min-w-0 flex-1 font-sans">
                <p className="text-sm font-semibold text-foreground truncate">
                  {v.commitMessage ? (
                    v.commitMessage
                  ) : (
                    <span className="italic text-muted-foreground font-normal">No commit message</span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap font-mono text-xs">
                  <RelativeTime date={v.createdAt} />
                  {isLatest && (
                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                      HEAD
                    </Badge>
                  )}
                  {isActive && !isLatest && (
                    <Badge variant="outline" className="text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/10">
                      previewing
                    </Badge>
                  )}
                  {v.bundle && (() => {
                    const bundle = v.bundle as unknown as PromptBundle;
                    const label = `${bundle.modelConfig?.provider ?? ''}/${bundle.modelConfig?.model ?? ''}`;
                    return label !== '/' ? (
                      <span className="text-[11px] font-mono text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                        {label}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </Button>

            {/* Restore button */}
            {!isLatest && (
              <div className="px-4 pb-3 flex items-center gap-2 border-t border-border/40 pt-2.5 mt-1">
                {isConfirming ? (
                  <>
                    <span className="text-xs text-muted-foreground font-sans">
                      Restore v{v.versionNumber}?
                    </span>
                    <Button
                      onClick={() => handleRestore(v.id)}
                      disabled={isPending}
                      variant="default"
                      size="xs"
                      className="font-sans cursor-pointer"
                    >
                      {isPending ? 'Restoring…' : 'Confirm'}
                    </Button>
                    <Button
                      onClick={() => setConfirmRestoreId(null)}
                      disabled={isPending}
                      variant="ghost"
                      size="xs"
                      className="font-sans cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleRestore(v.id)}
                    variant="outline"
                    size="xs"
                    className="text-xs text-muted-foreground hover:text-foreground font-sans cursor-pointer"
                  >
                    Restore this version
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
