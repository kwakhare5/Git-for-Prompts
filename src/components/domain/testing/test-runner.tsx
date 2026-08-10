'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TestCaseCard } from './test-case-card';
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
          <label className="text-xs text-zinc-400 shrink-0 font-mono font-bold">Target Version:</label>
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            className="cursor-pointer rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-600"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id} className="bg-bg-card text-zinc-100">
                {formatVersionLabel(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 font-mono">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-3.5 py-2 border border-zinc-700/80 rounded-xl text-xs text-zinc-200 hover:text-white bg-[#202024] hover:bg-[#28282D] font-bold transition-all cursor-pointer"
          >
            {showForm ? 'Cancel' : '+ Add Test Case'}
          </button>
          <button
            onClick={handleRunTests}
            disabled={isRunning || testCases.length === 0 || !selectedVersionId}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-xs active:scale-97 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? 'Running Evals…' : '▶ Run All Evals'}
          </button>
        </div>
      </div>

      {/* Run error banner */}
      {runError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 font-mono">
          ✕ {runError}
        </div>
      )}

      {/* Score summary */}
      {hasResults && (
        <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-zinc-100">
                {passedCount}/{testCases.length}
              </span>
              <span className="text-xs text-zinc-400 font-mono">Assertions Passed</span>
              {selectedVersion && (
                <span className="font-mono text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded ml-2 font-bold">
                  v{selectedVersion.versionNumber}
                </span>
              )}
            </div>
            <span className={`text-xs font-bold ${passedCount === testCases.length ? 'text-emerald-300' : 'text-rose-400'}`}>
              {passedCount === testCases.length ? '✓ 100% Pass Rate' : `${testCases.length - passedCount} failing assertions`}
            </span>
          </div>
          <div className="w-full bg-bg-page border border-zinc-800 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Add test case form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onAddSubmit)}
          className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-4 font-mono shadow-xl"
        >
          <h3 className="text-sm font-bold text-zinc-100">Configure New Test Assertion</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Test Title</label>
            <input
              {...register('name')}
              placeholder='e.g. "Security & Token Refund Constraint"'
              className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-600"
            />
            {errors.name && (
              <p className="text-xs text-rose-300">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">User Input Text (Variables)</label>
            <textarea
              {...register('inputText')}
              placeholder="User prompt input text..."
              rows={3}
              className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-600"
            />
            {errors.inputText && (
              <p className="text-xs text-rose-300">{errors.inputText.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Expected Evaluation Criteria</label>
            <textarea
              {...register('expectedCriteria')}
              placeholder='e.g. "Response must return valid JSON with status=200"'
              rows={3}
              className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-600"
            />
            {errors.expectedCriteria && (
              <p className="text-xs text-rose-300">{errors.expectedCriteria.message}</p>
            )}
          </div>

          {addError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300">
              ✕ {addError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold cursor-pointer transition-all"
            >
              {isAdding ? 'Adding…' : '+ Add Test Case'}
            </button>
          </div>
        </form>
      )}

      {/* Test case list */}
      {testCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 bg-bg-card/40 py-16 text-center">
          <div className="font-mono text-2xl text-zinc-600 mb-2 font-bold">assert()</div>
          <h2 className="text-sm font-bold text-zinc-200 font-mono mb-1">No Test Assertions Created</h2>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs font-sans">
            Add test cases to evaluate prompt bundles against real inputs and criteria.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all"
          >
            + Add First Test Assertion
          </button>
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
