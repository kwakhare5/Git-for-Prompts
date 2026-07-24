'use client';

import { useState, useTransition } from 'react';
import { PromptEditor } from '@/components/prompt-editor';
import { VersionHistory } from '@/components/version-history';
import { togglePromptVisibility } from '@/lib/actions/prompts';
import { Globe, Lock } from 'lucide-react';
import type { InferSelectModel } from 'drizzle-orm';
import type { versions } from '@/db/schema';

type Version = InferSelectModel<typeof versions>;

interface PromptDetailClientProps {
  promptId: string;
  versions: Version[];
  totalVersionCount: number;
  initialActiveVersionId?: string;
  isPublic: boolean;
}

/**
 * Client wrapper for the prompt detail view.
 * Manages active version state locally so preview switching is instant
 * (no server roundtrip when clicking a version in the sidebar).
 */
export function PromptDetailClient({
  promptId,
  versions,
  totalVersionCount,
  initialActiveVersionId,
  isPublic: initialIsPublic,
}: PromptDetailClientProps) {
  const [selectedId, setSelectedId] = useState(initialActiveVersionId);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [toggling, startToggle] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  // Resolve active version — fall back to latest if selectedId not found
  const activeVersion = versions.find((v) => v.id === selectedId) ?? versions[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Read-only Monaco preview — key forces remount on version switch for instant content update */}
      <div>
        {activeVersion && (
          <PromptEditor
            key={activeVersion.id}
            promptId={promptId}
            initialContent={activeVersion.content}
            readOnly
            height="calc(100vh - 260px)"
          />
        )}
      </div>

      {/* Version history sidebar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-400">
            Version History
          </h2>
          <span className="text-xs text-zinc-500 font-mono tabular-nums">
            {totalVersionCount} version{totalVersionCount !== 1 ? 's' : ''}
          </span>
        </div>
        {/* Show truncation notice when history is capped */}
        {totalVersionCount > versions.length && (
          <p className="text-[10px] text-zinc-600 font-mono">
            Showing {versions.length} of {totalVersionCount} — oldest versions not shown
          </p>
        )}
        <VersionHistory
          promptId={promptId}
          versions={versions}
          activeVersionId={activeVersion?.id}
          onVersionSelect={setSelectedId}
        />

        {/* Visibility toggle */}
        <div className="mt-2 pt-3 border-t border-zinc-800">
          <button
            onClick={() =>
              startToggle(async () => {
                const updated = await togglePromptVisibility(promptId);
                setIsPublic(updated.isPublic);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
              })
            }
            disabled={toggling}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              isPublic
                ? 'border-emerald-800 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60'
                : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
            } disabled:opacity-40`}
            aria-label={isPublic ? 'Make this prompt private' : 'Make this prompt public'}
          >
            <span className="flex items-center gap-1.5">
              {isPublic ? (
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
              )}
              {isPublic ? 'Public' : 'Private'}
            </span>
            <span className="text-[10px] opacity-60">
              {toggling ? '…' : showSuccess ? 'Updated!' : isPublic ? 'Click to make private' : 'Click to publish'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
