'use client';

import { useState } from 'react';
import { runComparisonForVersions } from '@/lib/actions/tests';

export type TestCase = {
  id: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
};

export type Version = {
  id: string;
  versionNumber: number;
  commitMessage: string | null;
};

export type CellStatus = 'idle' | 'running' | 'pass' | 'fail' | 'ai-error';

export type VersionResults = {
  [testCaseId: string]: {
    passed: boolean;
    actualOutput: string;
    reason?: string;
  };
};

export function useCompareRunner(versions: Version[], testCaseCount: number) {
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
      const msg = err instanceof Error ? err.message : 'Comparison failed. Please try again.';
      setError(msg);
    } finally {
      setIsRunning(false);
    }
  }

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

  return {
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
    resultsA,
    resultsB,
    cellStatusA,
    cellStatusB,
    scoreA,
    scoreB,
    total,
    winnerSide,
    winnerLabel,
    handleRunComparison,
  };
}
