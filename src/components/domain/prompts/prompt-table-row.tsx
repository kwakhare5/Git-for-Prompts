'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { deletePrompt } from '@/lib/actions/prompts';
import { StatusBadge } from "@/components/layout/status-badge";
import { RelativeTime } from '@/components/layout/relative-time';
import { DeleteConfirmButton } from '@/components/domain/shared/delete-confirm-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe, Lock, Copy, Check, ExternalLink, GitCommit, Eye } from 'lucide-react';
import { toast } from 'sonner';

export type PromptRow = {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  testsPassed: number;
  testsTotal: number;
  updatedAt: Date;
  isPublic: boolean;
};

export function PromptTableRow({ prompt, onInspect }: { prompt: PromptRow; onInspect: (prompt: PromptRow) => void }) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deletePrompt({ promptId: prompt.id });
      toast.success(`Deleted bundle "${prompt.name}"`);
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(prompt.id);
    setCopied(true);
    toast.success(`Copied ID: ${prompt.id}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const passRate =
    prompt.testsTotal > 0
      ? `${prompt.testsPassed}/${prompt.testsTotal}`
      : 'Untested';

  const passRateColor =
    prompt.testsTotal === 0
      ? 'bg-muted text-muted-foreground border-border'
      : prompt.testsPassed === prompt.testsTotal
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : prompt.testsPassed === 0
      ? 'bg-destructive/10 text-destructive border-destructive/20'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <tr
      className={cn(
        'group border-b border-border transition-colors duration-150 hover:bg-accent/40 font-sans',
        isPending && 'opacity-40 pointer-events-none'
      )}
    >
      <td className="py-3.5 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onInspect(prompt)}
            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 text-xs sm:text-sm font-sans text-left cursor-pointer h-auto p-0 justify-start"
          >
            {prompt.name}
          </Button>
          <StatusBadge variant="violet" icon={GitCommit}>
            v{prompt.versionCount}
          </StatusBadge>
          {prompt.isPublic ? (
            <StatusBadge variant="sky" icon={Globe}>
              Public
            </StatusBadge>
          ) : (
            <StatusBadge variant="neutral" icon={Lock}>
              Private
            </StatusBadge>
          )}
        </div>
        {prompt.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-md font-sans">
            {prompt.description}
          </p>
        )}
      </td>

      <td className="py-3.5 px-3 hidden sm:table-cell">
        <span className={cn('font-mono text-xs px-2.5 py-0.5 rounded-md border font-semibold inline-flex items-center gap-1.5', passRateColor)}>
          {passRate}
        </span>
      </td>

      <td className="py-3.5 px-3 text-xs text-muted-foreground hidden md:table-cell whitespace-nowrap font-mono">
        <RelativeTime date={prompt.updatedAt} />
      </td>

      <td className="py-3.5 pr-4 pl-3 sm:pr-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            type="button"
            onClick={() => onInspect(prompt)}
            title="Quick Inspect"
            aria-label="Quick inspect prompt"
            variant="outline"
            size="icon-xs"
            className="cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>

          <Button
            type="button"
            onClick={handleCopyId}
            title="Copy Prompt ID"
            aria-label="Copy prompt ID"
            variant="outline"
            size="icon-xs"
            className="cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-foreground" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>

          <Link href={`/dashboard/prompts/${prompt.id}`} passHref>
            <Button
              variant="outline"
              size="xs"
              className="gap-1 font-mono text-xs font-medium cursor-pointer"
            >
              Open <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Button>
          </Link>

          <DeleteConfirmButton
            onDelete={handleDelete}
            ariaLabel={`Delete ${prompt.name}`}
            isPending={isPending}
          />
        </div>
      </td>
    </tr>
  );
}
