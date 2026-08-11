'use client';

import { useState, useTransition } from 'react';
import { DeleteConfirmButton } from '@/components/domain/shared/delete-confirm-button';
import { deleteTestCase } from '@/lib/actions/tests';

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
    <div className={`relative rounded-2xl border border-zinc-800/90 bg-bg-card p-5 font-sans shadow-xl card-interactive ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header row: name + status badge + delete */}
      <div className="flex items-center justify-between gap-3 mb-3.5 font-sans">
        <div className="flex items-center gap-2.5 min-w-0 font-mono">
          <h3 className="text-sm font-bold text-zinc-100 truncate">{name}</h3>
          {status === 'running' && (
            <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              RUNNING
            </span>
          )}
          {status === 'pass' && (
            <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              ✓ PASS
            </span>
          )}
          {status === 'fail' && (
            <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              ✕ FAIL
            </span>
          )}
          {status === 'ai-error' && (
            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold" title="AI Error / Not Persisted">
              ⚠️ AI ERROR
            </span>
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
      <div className="space-y-2.5 mb-3 font-mono text-xs">
        <div className="bg-bg-page p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Input Variables</span>
          <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">{inputText}</p>
        </div>
        <div className="bg-bg-page p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Assertion Criteria</span>
          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{expectedCriteria}</p>
        </div>
      </div>

      {/* Expandable output */}
      {result && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-xs font-mono">
          <button
            onClick={() => setIsOutputOpen(!isOutputOpen)}
            className="w-full flex items-center justify-between py-1 text-zinc-400 hover:text-zinc-100 tab-interactive"
          >
            <span>{isOutputOpen ? 'Hide actual AI output' : 'Show actual AI output'}</span>
            <span>{isOutputOpen ? '▲' : '▼'}</span>
          </button>
          {isOutputOpen && (
            <div className="mt-2 space-y-2">
              {result.reason && (
                <div className="rounded-xl bg-bg-page border border-zinc-800 p-3">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Evaluation Reason</span>
                  <p className="text-xs mt-1 text-zinc-300 leading-relaxed">{result.reason}</p>
                </div>
              )}
              <div className="rounded-xl bg-bg-page border border-zinc-800 p-3 max-h-64 overflow-y-auto">
                <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider">Generated AI Response</span>
                <pre className="text-xs font-mono mt-1 whitespace-pre-wrap break-words text-zinc-200 leading-relaxed">
                  {result.actualOutput}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
