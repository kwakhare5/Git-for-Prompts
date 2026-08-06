'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { formatVersionLabel } from '@/lib/format-version-label';
import { runComparisonForVersions } from '@/lib/actions/tests';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type TestCase = {
  id: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
};

type Version = {
  id: string;
  versionNumber: number;
  commitMessage: string | null;
};

type CompareRunnerProps = {
  promptId: string;
  versions: Version[];
  testCaseCount: number;
};

type CellStatus = 'idle' | 'running' | 'pass' | 'fail' | 'ai-error';

type VersionResults = {
  [testCaseId: string]: {
    passed: boolean;
    actualOutput: string;
    reason?: string;
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CompareRunner({ promptId, versions, testCaseCount }: CompareRunnerProps) {
  const [versionIdA, setVersionIdA] = useState(versions[0]?.id ?? '');
  const [versionIdB, setVersionIdB] = useState(versions[1]?.id ?? '');
  const [isRunning, setIsRunning] = useState(false);

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [resultsA, setResultsA] = useState<VersionResults>({});
  const [resultsB, setResultsB] = useState<VersionResults>({});
  const [cellStatusA, setCellStatusA] = useState<Record<string, CellStatus>>({});
  const [cellStatusB, setCellStatusB] = useState<Record<string, CellStatus>>({});
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const versionA = versions.find((v) => v.id === versionIdA);
  const versionB = versions.find((v) => v.id === versionIdB);

  const sameVersion = versionIdA === versionIdB;
  const canRun = !sameVersion && testCaseCount > 0 && !isRunning;

  // ─── Run comparison ─────────────────────────────────────────────────────────

  async function handleRunComparison() {
    if (!canRun) return;
    setIsRunning(true);
    setHasRun(false);
    setError(null);
    setResultsA({});
    setResultsB({});
    setCellStatusA({});
    setCellStatusB({});

    try {
      const comparison = await runComparisonForVersions({ versionIdA, versionIdB });

      const newResultsA: VersionResults = {};
      const newResultsB: VersionResults = {};
      const newStatusA: Record<string, CellStatus> = {};
      const newStatusB: Record<string, CellStatus> = {};

      for (const r of comparison.resultsA) {
        newResultsA[r.testCaseId] = { passed: r.passed, actualOutput: r.actualOutput, reason: r.reason };
        const isPersisted = (r as Record<string, unknown>).persisted !== false;
        newStatusA[r.testCaseId] = r.passed ? 'pass' : !isPersisted ? 'ai-error' : 'fail';
      }
      for (const r of comparison.resultsB) {
        newResultsB[r.testCaseId] = { passed: r.passed, actualOutput: r.actualOutput, reason: r.reason };
        const isPersisted = (r as Record<string, unknown>).persisted !== false;
        newStatusB[r.testCaseId] = r.passed ? 'pass' : !isPersisted ? 'ai-error' : 'fail';
      }

      setTestCases(comparison.testCases);
      setResultsA(newResultsA);
      setResultsB(newResultsB);
      setCellStatusA(newStatusA);
      setCellStatusB(newStatusB);
      setHasRun(true);
    } catch (err) {
      // #32: removed console.error from client component — error surfaced via setError UI state
      const msg = err instanceof Error ? err.message : 'Comparison failed. Please try again.';
      setError(msg);
    } finally {
      setIsRunning(false);
    }
  }

  // ─── Scores ─────────────────────────────────────────────────────────────────

  const scoreA = Object.values(cellStatusA).filter((s) => s === 'pass').length;
  const scoreB = Object.values(cellStatusB).filter((s) => s === 'pass').length;
  const total = testCases.length;

  const winnerSide: 'A' | 'B' | 'tie' | null =
    !hasRun || total === 0 ? null : scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'tie';

  const winnerLabel =
    winnerSide === 'A'
      ? `v${versionA?.versionNumber} wins`
      : winnerSide === 'B'
      ? `v${versionB?.versionNumber} wins`
      : winnerSide === 'tie'
      ? 'Tie'
      : null;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 font-sans">
      {/* ─── Selector bar ──────────────────────────────────────────────────── */}
      <div className="flex items-end gap-4 flex-wrap font-sans">
        {/* Version A */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block font-sans">Version A</label>
          <select
            value={versionIdA}
            onChange={(e) => setVersionIdA(e.target.value)}
            className="cursor-pointer rounded-xl border border-border bg-card px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === versionIdB}>
                {formatVersionLabel(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-muted-foreground pb-1.5 font-mono text-sm select-none">vs</div>

        {/* Version B */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block font-sans">Version B</label>
          <select
            value={versionIdB}
            onChange={(e) => setVersionIdB(e.target.value)}
            className="cursor-pointer rounded-xl border border-border bg-card px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
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
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
          >
            Manage test cases →
          </Link>
          <Button
            onClick={handleRunComparison}
            disabled={!canRun}
            variant="default"
            size="sm"
            className="font-sans cursor-pointer shadow-sm font-bold"
          >
            {isRunning ? (
              <span className="flex items-center gap-2 font-sans">
                <Spinner size="sm" className="border-t-primary-foreground" />
                Running…
              </span>
            ) : (
              'Run Comparison'
            )}
          </Button>
        </div>
      </div>

      {/* ─── Inline warnings ────────────────────────────────────────────────── */}
      {sameVersion && (
        <p className="text-xs text-amber-400 font-mono">⚠ Select two different versions to compare.</p>
      )}
      {testCaseCount === 0 && (
        <p className="text-xs text-amber-400 font-mono">⚠ Add test cases first before running a comparison.</p>
      )}
      {error && <p className="text-xs text-red-400 font-mono">✕ {error}</p>}

      {/* ─── Running state ───────────────────────────────────────────────────── */}
      {isRunning && (
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground font-mono">
            Running all test cases against both versions simultaneously…
          </p>
        </div>
      )}

      {/* ─── Winner banner ───────────────────────────────────────────────────── */}
      {hasRun && winnerLabel && (
        <div
          className={cn(
            'rounded-lg border p-4 flex items-center justify-between gap-4 font-sans',
            winnerSide === 'tie'
              ? 'border-border bg-card'
              : 'border-emerald-500/20 bg-emerald-500/10'
          )}
        >
          <div className="flex items-baseline gap-3">
            <span className={cn('text-lg font-bold font-mono', winnerSide === 'tie' ? 'text-foreground' : 'text-emerald-400')}>
              {winnerSide === 'tie' ? '🤝 Tie' : `🏆 ${winnerLabel}`}
            </span>
            {winnerSide !== 'tie' && (
              <span className="text-sm text-muted-foreground font-mono">{scoreA}/{total} vs {scoreB}/{total}</span>
            )}
            {winnerSide === 'tie' && (
              <span className="text-sm text-muted-foreground font-mono">Both versions scored {scoreA}/{total}</span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* A side — version label above score */}
            <div className="text-center min-w-[3rem]">
              <div className="text-xs font-mono text-muted-foreground mb-0.5 font-semibold">
                v{versionA?.versionNumber}
              </div>
              <div className={cn('text-xl font-bold tabular-nums font-mono', winnerSide === 'A' ? 'text-emerald-400' : 'text-muted-foreground')}>
                {scoreA}/{total}
              </div>
            </div>

            {/* vs separator */}
            <div className="text-muted-foreground text-xs font-mono select-none font-bold">vs</div>

            {/* B side — version label above score */}
            <div className="text-center min-w-[3rem]">
              <div className="text-xs font-mono text-muted-foreground mb-0.5 font-semibold">
                v{versionB?.versionNumber}
              </div>
              <div className={cn('text-xl font-bold tabular-nums font-mono', winnerSide === 'B' ? 'text-emerald-400' : 'text-muted-foreground')}>
                {scoreB}/{total}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Progress bars ───────────────────────────────────────────────────── */}
      {hasRun && total > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {(['A', 'B'] as const).map((side) => {
            const score = side === 'A' ? scoreA : scoreB;
            const ver = side === 'A' ? versionA : versionB;
            return (
              <div
                key={side}
                className={cn(
                  'rounded-lg border p-3 space-y-2',
                  winnerSide === side
                    ? 'border-emerald-500/20 bg-emerald-500/10'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs text-muted-foreground font-semibold">v{ver?.versionNumber}</span>
                  <span className="text-xs text-muted-foreground">{score}/{total} passed</span>
                </div>
                <Progress value={total > 0 ? (score / total) * 100 : 0} className="h-1.5 bg-muted" />
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Results table ───────────────────────────────────────────────────── */}
      {hasRun && testCases.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] border-b border-border bg-muted/40">
            <div className="px-4 py-2.5 text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">Test Case</div>
            {(['A', 'B'] as const).map((side) => {
              const ver = side === 'A' ? versionA : versionB;
              return (
                <div
                  key={side}
                  className={cn(
                    'px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-center font-mono',
                    winnerSide === side ? 'text-emerald-400 font-bold' : 'text-muted-foreground'
                  )}
                >
                  v{ver?.versionNumber}{winnerSide === side && ' 🏆'}
                </div>
              );
            })}
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {testCases.map((tc) => {
              const rA = resultsA[tc.id];
              const rB = resultsB[tc.id];
              const diffRow = rA && rB && rA.passed !== rB.passed;
              return (
                <div
                  key={tc.id}
                  className={cn('grid grid-cols-[1fr_auto_auto] items-center', diffRow && 'bg-amber-500/10')}
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-foreground font-sans">{tc.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{tc.inputText}</div>
                  </div>
                  <div className="px-4 py-3 flex justify-center">
                    <ResultBadge status={cellStatusA[tc.id]} />
                  </div>
                  <div className="px-4 py-3 flex justify-center">
                    <ResultBadge status={cellStatusB[tc.id]} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals row */}
          <div className="grid grid-cols-[1fr_auto_auto] border-t border-border bg-muted/40">
            <div className="px-4 py-2.5 text-xs text-muted-foreground font-mono uppercase font-semibold">Total</div>
            {([scoreA, scoreB] as const).map((score, i) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-2.5 text-center text-sm font-bold tabular-nums font-mono',
                  winnerSide === (i === 0 ? 'A' : 'B') ? 'text-emerald-400' : 'text-foreground'
                )}
              >
                {score}/{total}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Idle empty state ─────────────────────────────────────────────────── */}
      {!hasRun && !isRunning && testCaseCount > 0 && !sameVersion && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
          <div className="text-3xl mb-3 select-none">⚖</div>
          <h2 className="text-sm font-semibold text-foreground font-sans mb-1">Ready to compare</h2>
          <p className="text-xs text-muted-foreground max-w-xs font-sans">
            Select two versions above and click{' '}
            <span className="font-mono text-foreground">Run Comparison</span> to evaluate outputs.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Badge helper ─────────────────────────────────────────────────────────────

function ResultBadge({ status }: { status: CellStatus | undefined }) {
  if (!status || status === 'idle') {
    return <span className="text-muted-foreground text-xs font-mono">—</span>;
  }
  if (status === 'running') {
    return <Spinner size="sm" />;
  }
  if (status === 'ai-error') {
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-mono border bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold" title="AI Error / Not Persisted">
        ⚠️ ERR
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-mono border font-semibold',
        status === 'pass'
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-destructive/10 text-destructive border-destructive/20'
      )}
    >
      {status === 'pass' ? 'PASS' : 'FAIL'}
    </span>
  );
}
