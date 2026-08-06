'use client';

import { useState, useTransition } from 'react';
import { PromptEditor } from './prompt-editor';
import { VersionHistory } from './version-history';
import { togglePromptVisibility } from '@/lib/actions/prompts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start font-sans">
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
      <div className="flex flex-col gap-3 font-sans">
        <div className="flex items-center justify-between font-sans">
          <h2 className="text-sm font-semibold text-foreground font-sans">
            Version History
          </h2>
          <Badge variant="outline" className="text-xs font-mono">
            {totalVersionCount} version{totalVersionCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        {/* Show truncation notice when history is capped */}
        {totalVersionCount > versions.length && (
          <p className="text-xs text-muted-foreground font-mono">
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
        <div className="mt-2 pt-3 border-t border-border font-sans">
          <Button
            onClick={() =>
              startToggle(async () => {
                const updated = await togglePromptVisibility(promptId);
                setIsPublic(updated.isPublic);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
              })
            }
            disabled={toggling}
            variant="outline"
            size="sm"
            className="w-full justify-between font-sans cursor-pointer h-9 text-xs"
            aria-label={isPublic ? 'Make this prompt private' : 'Make this prompt public'}
          >
            <span className="flex items-center gap-1.5 font-sans">
              {isPublic ? (
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {isPublic ? 'Public' : 'Private'}
            </span>
            <span className="text-xs opacity-70 font-mono">
              {toggling ? '…' : showSuccess ? 'Updated!' : isPublic ? 'Click to make private' : 'Click to publish'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
