'use client';

import { useState } from 'react';
import { PromptEditor } from '@/components/prompt-editor';
import { VersionHistory } from '@/components/version-history';
import type { InferSelectModel } from 'drizzle-orm';
import type { versions } from '@/db/schema';

type Version = InferSelectModel<typeof versions>;

interface PromptDetailClientProps {
  promptId: string;
  versions: Version[];
  initialActiveVersionId?: string;
}

/**
 * Client wrapper for the prompt detail view.
 * Manages active version state locally so preview switching is instant
 * (no server roundtrip when clicking a version in the sidebar).
 */
export function PromptDetailClient({
  promptId,
  versions,
  initialActiveVersionId,
}: PromptDetailClientProps) {
  const [selectedId, setSelectedId] = useState(initialActiveVersionId);

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
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <VersionHistory
          promptId={promptId}
          versions={versions}
          activeVersionId={activeVersion?.id}
          onVersionSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
