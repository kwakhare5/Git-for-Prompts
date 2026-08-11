'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { restoreVersion } from '@/lib/actions/versions';
import { RelativeTime } from '@/components/layout/relative-time';
import type { InferSelectModel } from 'drizzle-orm';
import type { versions } from '@/db/schema';
import type { PromptBundle } from '@gfp/core';

type Version = InferSelectModel<typeof versions>;

interface VersionHistoryProps {
  promptId: string;
  versions: Version[];
  activeVersionId?: string;
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
      <div className="py-8 text-center text-gray-500 font-sans">
        <p className="text-sm">No versions yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 font-sans">
      {error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
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
            className={`rounded-xl border p-3.5 font-sans card-interactive ${
              isActive 
                ? 'bg-bg-panel border-zinc-600 shadow-sm' 
                : 'bg-bg-page border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div
              onClick={() => onVersionSelect?.(v.id)}
              className="cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-zinc-100/10 text-zinc-100 border border-zinc-800 px-2 py-0.5 rounded-md tabular-nums">
                  v{v.versionNumber}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                  <RelativeTime date={v.createdAt} />
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-100 truncate">
                {v.commitMessage || <span className="text-zinc-500 italic font-normal">No commit message</span>}
              </p>
              {v.bundle && (() => {
                const bundle = v.bundle as unknown as PromptBundle;
                const label = `${bundle.modelConfig?.provider ?? ''}/${bundle.modelConfig?.model ?? ''}`;
                return label !== '/' ? (
                  <span className="text-[10px] font-mono text-zinc-400 bg-bg-panel border border-zinc-800/60 px-2 py-0.5 rounded inline-block">
                    {label}
                  </span>
                ) : null;
              })()}
            </div>

            {!isLatest && (
              <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                {isConfirming ? (
                  <>
                    <span className="text-zinc-400 text-[11px]">Restore v{v.versionNumber}?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(v.id)}
                        disabled={isPending}
                        className="px-2.5 py-1 bg-zinc-100 hover:bg-white text-zinc-950 rounded-md text-[11px] font-bold btn-interactive"
                      >
                        {isPending ? 'Restoring…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmRestoreId(null)}
                        disabled={isPending}
                        className="px-2 py-1 text-zinc-400 hover:text-zinc-200 text-[11px] tab-interactive"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestore(v.id)}
                    className="text-[11px] text-zinc-400 hover:text-blue-300 tab-interactive"
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
