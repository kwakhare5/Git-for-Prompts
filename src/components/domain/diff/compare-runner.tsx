'use client';

import Link from 'next/link';
import { formatVersionLabel } from '@/lib/format-version-label';
import { ChevronDown } from 'lucide-react';
import { useCompareRunner, type Version, type CellStatus } from './use-compare-runner';

type CompareRunnerProps = {
  promptId: string;
  versions: Version[];
  testCaseCount: number;
};

export function CompareRunner({ promptId, versions, testCaseCount }: CompareRunnerProps) {
  const {
    versionIdA,
    setVersionIdA,
    versionIdB,
    setVersionIdB,
    versionA,
    versionB,
    sameVersion,
    canRun,
    isRunning,
    hasRun,
    error,
    testCases,
    cellStatusA,
    cellStatusB,
    scoreA,
    scoreB,
    total,
    winnerSide,
    winnerLabel,
    handleRunComparison,
  } = useCompareRunner(versions, testCaseCount);

  return (
    <div className="space-y-6 font-sans">
      {/* Selector bar */}
      <div className="flex items-end gap-4 flex-wrap font-sans">
        {/* Version A */}
        <div className="space-y-1 font-mono">
          <label className="text-xs font-bold text-zinc-400 block font-mono">Version A</label>
          <div className="relative">
            <select
              value={versionIdA}
              onChange={(e) => setVersionIdA(e.target.value)}
              className="cursor-pointer appearance-none rounded-xl border border-zinc-800 bg-bg-page pl-3.5 pr-8 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-600 transition-colors [color-scheme:dark]"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id} disabled={v.id === versionIdB} className="bg-bg-page text-zinc-100 font-mono">
                  {formatVersionLabel(v)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="text-zinc-500 pb-2.5 font-mono text-xs font-bold select-none">vs</div>

        {/* Version B */}
        <div className="space-y-1 font-mono">
          <label className="text-xs font-bold text-zinc-400 block font-mono">Version B</label>
          <div className="relative">
            <select
              value={versionIdB}
              onChange={(e) => setVersionIdB(e.target.value)}
              className="cursor-pointer appearance-none rounded-xl border border-zinc-800 bg-bg-page pl-3.5 pr-8 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-600 transition-colors [color-scheme:dark]"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id} disabled={v.id === versionIdA} className="bg-bg-page text-zinc-100 font-mono">
                  {formatVersionLabel(v)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 font-mono">
          <Link
            href={`/dashboard/prompts/${promptId}/tests`}
            className="text-xs text-zinc-400 hover:text-zinc-100 font-mono transition-colors"
          >
            Manage test cases →
          </Link>
          <button
            onClick={handleRunComparison}
            disabled={!canRun}
            className="h-9 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs shadow-xs btn-interactive disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRunning ? 'Running…' : 'Run Comparison'}
          </button>
        </div>
      </div>

      {/* Inline warnings */}
      {sameVersion && (
        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
          <span className="font-bold">WARN:</span> Select two different versions to compare.
        </div>
      )}
      {testCaseCount === 0 && (
        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
          <span className="font-bold">WARN:</span> Add test cases first before running a comparison.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl">
          <span className="font-bold">ERR:</span> {error}
        </div>
      )}

      {/* Running state */}
      {isRunning && (
        <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-6 flex flex-col items-center gap-3 text-center shadow-xl">
          <p className="text-xs text-zinc-400 font-mono">
            Running all test cases against both versions simultaneously…
          </p>
        </div>
      )}

      {/* Winner banner */}
      {hasRun && winnerLabel && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between gap-4 font-mono shadow-xl flex-wrap">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              {winnerSide === 'tie' ? 'Tie Outcome' : `Winner: ${winnerLabel}`}
            </span>
            <span className="text-xs text-zinc-400 font-mono">{scoreA}/{total} vs {scoreB}/{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/prompts/${promptId}/edit`}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Continue Iterating in Editor →
            </Link>
          </div>
        </div>
      )}

      {/* Progress bars */}
      {hasRun && total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['A', 'B'] as const).map((side) => {
            const score = side === 'A' ? scoreA : scoreB;
            const ver = side === 'A' ? versionA : versionB;
            const pct = total > 0 ? (score / total) * 100 : 0;
            return (
              <div key={side} className="rounded-2xl border border-zinc-800/90 bg-bg-card p-4 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-zinc-200">v{ver?.versionNumber}</span>
                  <span className="text-zinc-400">{score}/{total} passed</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results table */}
      {hasRun && testCases.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/90 overflow-hidden bg-bg-card shadow-xl">
          <div className="grid grid-cols-[1fr_auto_auto] border-b border-zinc-800/90 bg-bg-page font-mono text-xs font-bold text-zinc-400">
            <div className="px-4 py-2.5">Test Case</div>
            <div className="px-4 py-2.5 text-center">v{versionA?.versionNumber}</div>
            <div className="px-4 py-2.5 text-center">v{versionB?.versionNumber}</div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {testCases.map((tc) => (
              <div key={tc.id} className="grid grid-cols-[1fr_auto_auto] items-center">
                <div className="px-4 py-3">
                  <div className="text-xs font-bold text-zinc-100 font-mono">{tc.name}</div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate max-w-md">{tc.inputText}</div>
                </div>
                <div className="px-4 py-3 flex justify-center">
                  <ResultBadge status={cellStatusA[tc.id]} />
                </div>
                <div className="px-4 py-3 flex justify-center">
                  <ResultBadge status={cellStatusB[tc.id]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultBadge({ status }: { status: CellStatus | undefined }) {
  if (!status || status === 'idle') {
    return <span className="text-zinc-500 text-xs font-mono">—</span>;
  }
  if (status === 'running') {
    return <span className="text-xs font-mono text-blue-400 animate-pulse">Running…</span>;
  }
  if (status === 'ai-error') {
    return <span className="text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg font-bold">ERR</span>;
  }
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-lg border font-bold ${status === 'pass' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'}`}>
      {status === 'pass' ? 'PASS' : 'FAIL'}
    </span>
  );
}
