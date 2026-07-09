'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { TestCaseCard } from '@/components/test-case-card';
import { Spinner } from '@/components/ui/spinner';
import { createTestCase, runTestsForVersion } from '@/lib/actions/tests';
import { formatVersionLabel } from '@/lib/format-version-label';

// ─── Types ───────────────────────────────────────────────────────────────────

type TestCase = {
  id: string;
  promptId: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
  // createdAt removed — #30: field fetched from DB but never rendered in this component
};

type Version = {
  id: string;
  versionNumber: number;
  commitMessage: string | null;
};

type TestRunnerProps = {
  promptId: string;
  versions: Version[];
  initialTestCases: TestCase[];
};

type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'ai-error';

type TestResult = {
  passed: boolean;
  actualOutput: string;
  reason?: string;
};

// ─── Form schema (client-side mirror of server Zod schema) ───────────────────

const addTestCaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  inputText: z.string().min(1, 'Input text is required'),
  expectedCriteria: z.string().min(1, 'Expected criteria is required'),
});

type AddTestCaseForm = z.infer<typeof addTestCaseSchema>;

// ─── Component ───────────────────────────────────────────────────────────────

export function TestRunner({ promptId, versions, initialTestCases }: TestRunnerProps) {
  const [testCases, setTestCases] = useState(initialTestCases);
  const [showForm, setShowForm] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState(versions[0]?.id ?? '');
  const [isAdding, startAddTransition] = useTransition();
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  // Per-test-case status and results
  const [statuses, setStatuses] = useState<Record<string, TestStatus>>({});
  const [results, setResults] = useState<Record<string, TestResult>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTestCaseForm>({
    resolver: zodResolver(addTestCaseSchema),
  });

  // ─── Add test case ──────────────────────────────────────────────────────────

  function onAddSubmit(data: AddTestCaseForm) {
    startAddTransition(async () => {
      try {
        setAddError(null);
        const newCase = await createTestCase({
          promptId,
          ...data,
        });
        setTestCases((prev) => [...prev, newCase]);
        reset();
        setShowForm(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add test case';
        setAddError(message);
      }
    });
  }

  // ─── Run all tests ─────────────────────────────────────────────────────────

  async function handleRunTests() {
    if (!selectedVersionId || testCases.length === 0) return;

    setIsRunning(true);
    setRunError(null);

    // Set all to running
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
      // Surface the real error — don't silently mark all tests as fail.
      // The user needs to know if it's an AI API error vs a real test failure.
      const msg = err instanceof Error ? err.message : 'Test run failed. Please try again.';
      setRunError(msg);
      // Reset all running statuses back to idle so the UI isn't stuck
      setStatuses({});
    } finally {
      setIsRunning(false);
    }
  }

  // ─── Score calculation ──────────────────────────────────────────────────────

  const completedCount = Object.values(statuses).filter(
    (s) => s === 'pass' || s === 'fail' || s === 'ai-error'
  ).length;
  const passedCount = Object.values(statuses).filter((s) => s === 'pass').length;
  const hasResults = completedCount > 0;
  const progressPercent = testCases.length > 0 ? (passedCount / testCases.length) * 100 : 0;

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  return (
    <div className="space-y-6">
      {/* ─── Controls bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Version selector */}
          <label className="text-xs text-zinc-500 shrink-0">Run against:</label>
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
          className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 transition-colors"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {formatVersionLabel(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((prev) => !prev)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            {showForm ? 'Cancel' : '+ Add Test'}
          </Button>
          <Button
            size="sm"
            onClick={handleRunTests}
            disabled={isRunning || testCases.length === 0 || !selectedVersionId}
            className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 disabled:opacity-40"
          >
            {/* #13: added Spinner for visual loading feedback, matching compare-runner */}
            {isRunning ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" className="border-t-zinc-950" />
                Running…
              </span>
            ) : 'Run All Tests'}
          </Button>
        </div>
      </div>

      {/* ── Run error banner ─────────────────────────────────────────── */}
      {runError && (
        <div className="rounded-lg border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-400 font-mono">
          ✕ {runError}
        </div>
      )}

      {/* ─── Score summary ────────────────────────────────────────────────── */}
      {hasResults && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {/* #08: was text-2xl — larger than the page h1 (text-xl); corrected to text-xl */}
              <span className="text-xl font-bold tabular-nums text-zinc-50">
                {passedCount}/{testCases.length}
              </span>
              <span className="text-sm text-zinc-500">passed</span>
              {selectedVersion && (
                <span className="font-mono text-xs text-zinc-600 ml-2">
                  v{selectedVersion.versionNumber}
                </span>
              )}
            </div>
            <span
              className={[
                'text-sm font-medium',
                passedCount === testCases.length
                  ? 'text-emerald-400'
                  : passedCount > 0
                  ? 'text-amber-400'
                  : 'text-red-400',
              ].join(' ')}
            >
              {passedCount === testCases.length
                ? '✓ All passing'
                : `${testCases.length - passedCount} failing`}
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2 bg-zinc-800"
          />
        </div>
      )}

      {/* ─── Add test case form ───────────────────────────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onAddSubmit)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4"
        >
          <h3 className="text-sm font-medium text-zinc-300">New Test Case</h3>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Name</label>
            <Input
              {...register('name')}
              placeholder='e.g. "Mentions refund window"'
              className="bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-700"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Input Text</label>
            <Textarea
              {...register('inputText')}
              placeholder="The user message to send to the AI…"
              rows={3}
              className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono text-sm placeholder:text-zinc-700 resize-none"
            />
            {errors.inputText && (
              <p className="text-xs text-red-400">{errors.inputText.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Expected Criteria</label>
            <Textarea
              {...register('expectedCriteria')}
              placeholder={`e.g. "Must mention 30-day window and not say I don't know"`}
              rows={3}
              className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono text-sm placeholder:text-zinc-700 resize-none"
            />
            {errors.expectedCriteria && (
              <p className="text-xs text-red-400">{errors.expectedCriteria.message}</p>
            )}
          </div>

          {addError && (
            <div className="rounded-md border border-red-700/50 bg-red-950/30 px-3 py-2 text-sm text-red-400">
              ✕ {addError}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="text-zinc-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isAdding}
              className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
            >
              {isAdding ? 'Adding…' : 'Add Test Case'}
            </Button>
          </div>
        </form>
      )}

      {/* ─── Test case list ───────────────────────────────────────────────── */}
      {testCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-24 text-center">
          <div className="font-mono text-3xl text-zinc-700 mb-3">assert()</div>
          <h2 className="text-base font-semibold text-zinc-300 mb-2">
            No test cases yet
          </h2>
          <p className="text-sm text-zinc-500 mb-5 max-w-xs">
            Add test cases to validate your prompt against real inputs and expected criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            + Add your first test
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {testCases.map((tc) => (
            <TestCaseCard
              key={tc.id}
              id={tc.id}
              name={tc.name}
              inputText={tc.inputText}
              expectedCriteria={tc.expectedCriteria}
              status={statuses[tc.id] ?? 'idle'}
              result={results[tc.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
