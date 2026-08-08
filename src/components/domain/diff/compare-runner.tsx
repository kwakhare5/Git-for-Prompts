'use client';

import Link from 'next/link';
import { formatVersionLabel } from '@/lib/format-version-label';
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
        <div className="space-y-1">
          <label className="text-xs text-gray-500 block font-sans">Version A</label>
          <select
            value={versionIdA}
            onChange={(e) => setVersionIdA(e.target.value)}
            className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-black font-mono"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === versionIdB}>
                {formatVersionLabel(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-gray-500 pb-1.5 font-mono text-sm select-none">vs</div>

        {/* Version B */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500 block font-sans">Version B</label>
          <select
            value={versionIdB}
            onChange={(e) => setVersionIdB(e.target.value)}
            className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-black font-mono"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === versionIdA}>
                {formatVersionLabel(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href={`/dashboard/prompts/${promptId}/tests`}
            className="text-xs text-gray-500 hover:text-black font-sans"
          >
            Manage test cases →
          </Link>
          <button
            onClick={handleRunComparison}
            disabled={!canRun}
            className="px-4 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {isRunning ? 'Running…' : 'Run Comparison'}
          </button>
        </div>
      </div>

      {/* Inline warnings */}
      {sameVersion && (
        <p className="text-xs text-amber-600 font-mono">⚠ Select two different versions to compare.</p>
      )}
      {testCaseCount === 0 && (
        <p className="text-xs text-amber-600 font-mono">⚠ Add test cases first before running a comparison.</p>
      )}
      {error && <p className="text-xs text-red-600 font-mono">✕ {error}</p>}

      {/* Running state */}
      {isRunning && (
        <div className="rounded border bg-white p-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-gray-500 font-mono">
            Running all test cases against both versions simultaneously…
          </p>
        </div>
      )}

      {/* Winner banner */}
      {hasRun && winnerLabel && (
        <div className="rounded border bg-green-50 p-4 flex items-center justify-between gap-4 font-sans">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-bold font-mono text-green-800">
              {winnerSide === 'tie' ? '🤝 Tie' : `🏆 ${winnerLabel}`}
            </span>
            <span className="text-sm text-gray-600 font-mono">{scoreA}/{total} vs {scoreB}/{total}</span>
          </div>
        </div>
      )}

      {/* Progress bars */}
      {hasRun && total > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {(['A', 'B'] as const).map((side) => {
            const score = side === 'A' ? scoreA : scoreB;
            const ver = side === 'A' ? versionA : versionB;
            const pct = total > 0 ? (score / total) * 100 : 0;
            return (
              <div key={side} className="rounded border bg-white p-3 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-semibold text-black">v{ver?.versionNumber}</span>
                  <span className="text-gray-500">{score}/{total} passed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-black h-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results table */}
      {hasRun && testCases.length > 0 && (
        <div className="rounded border overflow-hidden bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] border-b bg-gray-50 font-mono text-xs font-semibold text-gray-600">
            <div className="px-4 py-2.5">Test Case</div>
            <div className="px-4 py-2.5 text-center">v{versionA?.versionNumber}</div>
            <div className="px-4 py-2.5 text-center">v{versionB?.versionNumber}</div>
          </div>

          <div className="divide-y">
            {testCases.map((tc) => (
              <div key={tc.id} className="grid grid-cols-[1fr_auto_auto] items-center">
                <div className="px-4 py-3">
                  <div className="text-sm font-semibold text-black">{tc.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5 truncate">{tc.inputText}</div>
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
    return <span className="text-gray-400 text-xs font-mono">—</span>;
  }
  if (status === 'running') {
    return <span className="text-xs font-mono">Running…</span>;
  }
  if (status === 'ai-error') {
    return <span className="text-xs font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">⚠️ ERR</span>;
  }
  return (
    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {status === 'pass' ? 'PASS' : 'FAIL'}
    </span>
  );
}
