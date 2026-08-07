'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { TestCaseCard } from './test-case-card';
import { Spinner } from '@/components/ui/spinner';
import { createTestCase } from '@/lib/actions/tests';
import { formatVersionLabel } from '@/lib/format-version-label';
import { useTestRunnerState, type TestCase, type Version } from './use-test-runner-state';

type TestRunnerProps = {
  promptId: string;
  versions: Version[];
  initialTestCases: TestCase[];
};

const addTestCaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  inputText: z.string().min(1, 'Input text is required'),
  expectedCriteria: z.string().min(1, 'Expected criteria is required'),
});

type AddTestCaseForm = z.infer<typeof addTestCaseSchema>;

export function TestRunner({ promptId, versions, initialTestCases }: TestRunnerProps) {
  const [showForm, setShowForm] = useState(false);
  const [isAdding, startAddTransition] = useTransition();
  const [addError, setAddError] = useState<string | null>(null);

  const {
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
  } = useTestRunnerState(initialTestCases, versions);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTestCaseForm>({
    resolver: zodResolver(addTestCaseSchema),
  });

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

  return (
    <div className="space-y-6 font-sans">
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground shrink-0 font-sans">Run against:</label>
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
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
            className="cursor-pointer font-sans"
          >
            {showForm ? 'Cancel' : '+ Add Test'}
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={handleRunTests}
            disabled={isRunning || testCases.length === 0 || !selectedVersionId}
            className="cursor-pointer font-sans shadow-sm"
          >
            {isRunning ? (
              <span className="flex items-center gap-2 font-sans">
                <Spinner size="sm" className="border-t-primary-foreground" />
                Running…
              </span>
            ) : 'Run All Tests'}
          </Button>
        </div>
      </div>

      {/* Run error banner */}
      {runError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive font-mono">
          ✕ {runError}
        </div>
      )}

      {/* Score summary */}
      {hasResults && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between font-sans">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tabular-nums text-foreground">
                {passedCount}/{testCases.length}
              </span>
              <span className="text-sm text-muted-foreground font-sans">passed</span>
              {selectedVersion && (
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  v{selectedVersion.versionNumber}
                </span>
              )}
            </div>
            <span
              className={[
                'text-sm font-medium font-sans',
                passedCount === testCases.length
                  ? 'text-emerald-400'
                  : passedCount > 0
                  ? 'text-amber-400'
                  : 'text-destructive',
              ].join(' ')}
            >
              {passedCount === testCases.length
                ? '✓ All passing'
                : `${testCases.length - passedCount} failing`}
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2 bg-muted"
          />
        </div>
      )}

      {/* Add test case form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onAddSubmit)}
          className="rounded-lg border border-border bg-card p-4 space-y-4 font-sans"
        >
          <h3 className="text-sm font-medium text-foreground font-sans">New Test Case</h3>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-sans">Name</label>
            <Input
              {...register('name')}
              placeholder='e.g. "Mentions refund window"'
              className="bg-background border-border text-foreground placeholder:text-muted-foreground font-sans"
            />
            {errors.name && (
              <p className="text-xs text-destructive font-sans">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-sans">Input Text</label>
            <Textarea
              {...register('inputText')}
              placeholder="The user message to send to the AI…"
              rows={3}
              className="bg-background border-border text-foreground font-mono text-sm placeholder:text-muted-foreground resize-none"
            />
            {errors.inputText && (
              <p className="text-xs text-destructive font-sans">{errors.inputText.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-sans">Expected Criteria</label>
            <Textarea
              {...register('expectedCriteria')}
              placeholder={`e.g. "Must mention 30-day window and not say I don't know"`}
              rows={3}
              className="bg-background border-border text-foreground font-mono text-sm placeholder:text-muted-foreground resize-none"
            />
            {errors.expectedCriteria && (
              <p className="text-xs text-destructive font-sans">{errors.expectedCriteria.message}</p>
            )}
          </div>

          {addError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive font-sans">
              ✕ {addError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1 font-sans">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer font-sans"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="default"
              disabled={isAdding}
              className="cursor-pointer font-sans shadow-sm font-semibold"
            >
              {isAdding ? 'Adding…' : 'Add Test Case'}
            </Button>
          </div>
        </form>
      )}

      {/* Test case list */}
      {testCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 py-24 text-center font-sans">
          <div className="font-mono text-3xl text-muted-foreground mb-3">assert()</div>
          <h2 className="text-base font-semibold text-foreground mb-2 font-sans">
            No test cases yet
          </h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs font-sans">
            Add test cases to validate your prompt against real inputs and expected criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="cursor-pointer font-sans"
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
