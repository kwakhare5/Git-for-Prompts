'use client';

import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DeleteConfirmButton } from '@/components/domain/shared/delete-confirm-button';
import { deleteTestCase } from '@/lib/actions/tests';
import { cn } from '@/lib/utils';

type TestResult = {
  passed: boolean;
  actualOutput: string;
  reason?: string;
};

type TestCaseCardProps = {
  id: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
  status: 'idle' | 'running' | 'pass' | 'fail' | 'ai-error';
  result?: TestResult;
};

export function TestCaseCard({
  id,
  name,
  inputText,
  expectedCriteria,
  status,
  result,
}: TestCaseCardProps) {
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteTestCase({ testCaseId: id });
    });
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border bg-card p-4 transition-all duration-200 ease-out-emil font-sans',
        status === 'running'
          ? 'border-sky-500/40 animate-pulse'
          : status === 'pass'
          ? 'border-emerald-500/30'
          : status === 'fail'
          ? 'border-destructive/30'
          : status === 'ai-error'
          ? 'border-amber-500/40 border-dashed'
          : 'border-border',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Header row: name + status badge + delete */}
      <div className="flex items-center justify-between gap-3 mb-3 font-sans">
        <div className="flex items-center gap-2 min-w-0 font-sans">
          <h3 className="text-base font-bold text-foreground truncate font-sans">{name}</h3>
          {status === 'running' && (
            <Badge variant="outline" className="border-sky-500/40 text-sky-400 text-xs shrink-0 font-mono">
              RUNNING
            </Badge>
          )}
          {status === 'pass' && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs shrink-0 font-mono">
              PASS
            </Badge>
          )}
          {status === 'fail' && (
            <Badge className="bg-destructive/15 text-destructive border border-destructive/30 text-xs shrink-0 font-mono">
              FAIL
            </Badge>
          )}
          {status === 'ai-error' && (
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs shrink-0 font-mono" title="AI Error / Not Persisted">
              ⚠️ AI ERROR
            </Badge>
          )}
        </div>

        <div className="shrink-0">
          <DeleteConfirmButton
            onDelete={handleDelete}
            ariaLabel={`Delete test case ${name}`}
            isPending={isDeleting}
          />
        </div>
      </div>

      {/* Input + criteria preview */}
      <div className="space-y-2 mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-semibold">Input</span>
          <p className="text-sm text-foreground font-mono mt-1 line-clamp-2">{inputText}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-semibold">Criteria</span>
          <p className="text-sm text-foreground font-mono mt-1 line-clamp-2">{expectedCriteria}</p>
        </div>
      </div>

      {/* Expandable output — shown only after a test run */}
      {result && (
        <Collapsible open={isOutputOpen} onOpenChange={setIsOutputOpen}>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs text-muted-foreground hover:text-foreground cursor-pointer font-sans"
              />
            }
          >
            <span>{isOutputOpen ? 'Hide output' : 'Show output'}</span>
            <span className="font-mono text-xs">{isOutputOpen ? '▲' : '▼'}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 font-sans">
            {result.reason && (
              <div className="rounded-xl bg-background border border-border px-3 py-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-semibold">Reason</span>
                <p className="text-sm text-foreground mt-1 font-sans">{result.reason}</p>
              </div>
            )}
            <div className="rounded-xl bg-background border border-border px-3 py-2 max-h-64 overflow-y-auto">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-semibold">AI Output</span>
              <pre className="text-sm text-foreground font-mono mt-1 whitespace-pre-wrap break-words">
                {result.actualOutput}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
