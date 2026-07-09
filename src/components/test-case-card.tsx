'use client';

import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DeleteConfirmButton } from '@/components/ui/delete-confirm-button';
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
        'relative rounded-lg border bg-zinc-900 p-4 transition-all',
        /* #03: blue-500 replaced with sky-500 — sky is the designated in-progress accent;
           it was the only place blue was used, creating an undeclared 5th palette colour */
        status === 'running'
          ? 'border-sky-500/40 animate-pulse'
          : status === 'pass'
          ? 'border-emerald-500/30'
          : status === 'fail'
          ? 'border-red-500/30'
          : status === 'ai-error'
          ? 'border-amber-500/40 border-dashed'
          : 'border-zinc-800',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Header row: name + status badge + delete */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-medium text-zinc-200 truncate">{name}</h3>
          {status === 'running' && (
            <Badge variant="outline" className="border-sky-500/40 text-sky-400 text-[10px] shrink-0">
              RUNNING
            </Badge>
          )}
          {status === 'pass' && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] shrink-0">
              PASS
            </Badge>
          )}
          {status === 'fail' && (
            <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px] shrink-0">
              FAIL
            </Badge>
          )}
          {status === 'ai-error' && (
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] shrink-0" title="AI Error / Not Persisted">
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
          <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Input</span>
          <p className="text-xs text-zinc-400 font-mono mt-0.5 line-clamp-2">{inputText}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Criteria</span>
          <p className="text-xs text-zinc-400 font-mono mt-0.5 line-clamp-2">{expectedCriteria}</p>
        </div>
      </div>

      {/* Expandable output — shown only after a test run */}
      {result && (
        <Collapsible open={isOutputOpen} onOpenChange={setIsOutputOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 h-7 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            <span>{isOutputOpen ? 'Hide output' : 'Show output'}</span>
            <span className="font-mono text-[10px]">{isOutputOpen ? '▲' : '▼'}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {result.reason && (
              <div className="rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">Reason</span>
                <p className="text-xs text-zinc-300 mt-0.5">{result.reason}</p>
              </div>
            )}
            <div className="rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 max-h-64 overflow-y-auto">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">AI Output</span>
              <pre className="text-xs text-zinc-400 font-mono mt-1 whitespace-pre-wrap break-words">
                {result.actualOutput}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
