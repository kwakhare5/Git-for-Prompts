'use client';

import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { GitBranch, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PromptInspectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: {
    id: string;
    name: string;
    description?: string | null;
    versionCount: number;
    isPublic: boolean;
  } | null;
}

export function PromptInspectorSheet({ open, onOpenChange, prompt }: PromptInspectorSheetProps) {
  if (!prompt) return null;

  function handleCopyId() {
    navigator.clipboard.writeText(prompt?.id ?? '');
    toast.success('Prompt ID copied to clipboard', {
      description: prompt?.id,
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-sky-400 border-sky-500/20 bg-sky-500/10">
            <GitBranch className="w-3 h-3 mr-1" /> v{prompt.versionCount}
          </Badge>
          {prompt.isPublic && (
            <Badge variant="outline" className="text-xs font-mono text-amber-300 border-amber-500/20 bg-amber-500/10">
              public
            </Badge>
          )}
        </div>
        <SheetTitle>{prompt.name}</SheetTitle>
        <SheetDescription>{prompt.description ?? 'No description provided for this prompt bundle.'}</SheetDescription>
      </SheetHeader>

      <div className="my-6 space-y-6 flex-1 font-sans">
        {/* Quick Specs */}
        <div className="p-4 rounded-xl border border-border bg-background space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Prompt ID</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleCopyId}
              className="h-6 px-1.5 text-xs text-foreground hover:text-primary transition-colors font-mono font-bold cursor-pointer"
            >
              {prompt.id}
            </Button>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Version Count</span>
            <span className="text-foreground font-bold">{prompt.versionCount} Immutable Commits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Evaluation Assertions</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed
            </span>
          </div>
        </div>

        {/* Live VCS Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recent Snapshot Commits
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground">v{prompt.versionCount} · HEAD</span>
                <p className="text-muted-foreground text-[11px] mt-0.5">Updated system prompt tone & assertions</p>
              </div>
              <span className="text-[10px] text-muted-foreground">2 hours ago</span>
            </div>
            {prompt.versionCount > 1 && (
              <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between opacity-70">
                <div>
                  <span className="font-bold text-foreground">v{prompt.versionCount - 1}</span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Initial prompt package init</p>
                </div>
                <span className="text-[10px] text-muted-foreground">Yesterday</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <SheetFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="cursor-pointer font-sans">
          Close
        </Button>
        <Link
          href={`/dashboard/prompts/${prompt.id}`}
          className={buttonVariants({ size: 'sm', variant: 'default', className: 'shadow-sm font-sans cursor-pointer font-semibold' })}
        >
          Open Full Workspace <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </SheetFooter>
    </Sheet>
  );
}
