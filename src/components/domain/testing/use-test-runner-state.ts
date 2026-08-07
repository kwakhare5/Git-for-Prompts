'use client';

import { useState } from 'react';
import { runTestsForVersion } from '@/lib/actions/tests';

export type TestCase = {
  id: string;
  promptId: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
};

export type Version = {
  id: string;
  versionNumber: number;
  commitMessage: string | null;
};

export type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'ai-error';

export type TestResult = {
  passed: boolean;
  actualOutput: string;
  reason?: string;
};

export function useTestRunnerState(initialTestCases: TestCase[], versions: Version[]) {
  const [testCases, setTestCases] = useState(initialTestCases);
  const [selectedVersionId, setSelectedVersionId] = useState(versions[0]?.id ?? '');
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const [statuses, setStatuses] = useState<Record<string, TestStatus>>({});
  const [results, setResults] = useState<Record<string, TestResult>>({});

  async function handleRunTests() {
    if (!selectedVersionId || testCases.length === 0) return;

    setIsRunning(true);
    setRunError(null);

    const runningStatuses: Record<string, TestStatus> = {};
    for (const tc of testCases) {
      runningStatuses[tc.id] = 'running';
    }
    setStatuses(runningStatuses);
    setResults({});

    try {
      const testResults = await runTestsForVersion({ versionId: selectedVersionId });

      const newStatuses: Record<string, TestStatus> = {};
      const newResults: Record<string, TestResult> = {};

      for (const r of testResults) {
        const testCaseId = r.testCaseId;
        const isPersisted = (r as Record<string, unknown>).persisted !== false;
        newStatuses[testCaseId] = r.passed ? 'pass' : !isPersisted ? 'ai-error' : 'fail';
        newResults[testCaseId] = {
          passed: r.passed,
          actualOutput: r.actualOutput,
          reason: (r as Record<string, unknown>).reason as string | undefined,
        };
      }

      setStatuses(newStatuses);
      setResults(newResults);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Test run failed. Please try again.';
      setRunError(msg);
      setStatuses({});
    } finally {
      setIsRunning(false);
    }
  }

  const completedCount = Object.values(statuses).filter(
    (s) => s === 'pass' || s === 'fail' || s === 'ai-error'
  ).length;
  const passedCount = Object.values(statuses).filter((s) => s === 'pass').length;
  const hasResults = completedCount > 0;
  const progressPercent = testCases.length > 0 ? (passedCount / testCases.length) * 100 : 0;
  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  return {
    testCases,
    setTestCases,
    selectedVersionId,
    setSelectedVersionId,
    selectedVersion,
    isRunning,
    runError,
    statuses,
    results,
    passedCount,
    hasResults,
    progressPercent,
    handleRunTests,
  };
}
