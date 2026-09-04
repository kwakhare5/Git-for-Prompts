import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { prompts, versions, testResults, apiKeys } from "@/db/schema";
import { eq, desc, count, inArray } from "drizzle-orm";
import Link from "next/link";
import { PromptRepositoriesList } from "@/components/domain/dashboard/prompt-repositories-list";
import { CreateSamplePromptButton } from "@/components/domain/prompts/create-sample-prompt-button";

export const dynamic = 'force-dynamic';
export const metadata = { title: "Dashboard · Git for Prompts" };

async function getPromptsWithStats(userId: string) {
  const userPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.ownerId, userId))
    .orderBy(desc(prompts.updatedAt));

  if (userPrompts.length === 0) return { promptsWithStats: [], totalKeys: 0, totalVersionCount: 0 };

  const promptIds = userPrompts.map((p) => p.id);

  const [versionCounts, userApiKeys] = await Promise.all([
    db
      .select({ promptId: versions.promptId, count: count() })
      .from(versions)
      .where(inArray(versions.promptId, promptIds))
      .groupBy(versions.promptId),
    db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.ownerId, userId)),
  ]);

  const versionCountMap = new Map(versionCounts.map((r) => [r.promptId, r.count]));
  const totalVersionCount = versionCounts.reduce((acc, r) => acc + r.count, 0);

  const latestVersionIds = userPrompts
    .map((p) => p.currentVersionId)
    .filter((id): id is string => id != null);

  const versionToPromptMap = new Map(
    userPrompts
      .filter((p): p is typeof p & { currentVersionId: string } => p.currentVersionId != null)
      .map((p) => [p.currentVersionId, p.id])
  );

  const latestTestResults =
    latestVersionIds.length > 0
      ? await db
          .select({
            versionId: testResults.versionId,
            testCaseId: testResults.testCaseId,
            passed: testResults.passed,
            runAt: testResults.runAt,
          })
          .from(testResults)
          .where(inArray(testResults.versionId, latestVersionIds))
      : [];

  const latestByKey = new Map<string, { passed: boolean; runAt: Date }>();
  for (const r of latestTestResults) {
    const key = `${r.versionId}:${r.testCaseId}`;
    const existing = latestByKey.get(key);
    if (!existing || r.runAt > existing.runAt) {
      latestByKey.set(key, { passed: r.passed, runAt: r.runAt });
    }
  }

  const testStatMap = new Map<string, { passed: number; total: number }>();
  for (const [key, result] of latestByKey) {
    const versionId = key.split(':')[0];
    const promptId = versionToPromptMap.get(versionId);
    if (!promptId) continue;
    const entry = testStatMap.get(promptId) ?? { passed: 0, total: 0 };
    entry.total += 1;
    if (result.passed) entry.passed += 1;
    testStatMap.set(promptId, entry);
  }

  const promptsWithStats = userPrompts.map((prompt) => {
    const tests = testStatMap.get(prompt.id) ?? { passed: 0, total: 0 };
    return {
      ...prompt,
      versionCount: versionCountMap.get(prompt.id) ?? 0,
      testsPassed: tests.passed,
      testsTotal: tests.total,
    };
  });

  return { promptsWithStats, totalKeys: userApiKeys.length, totalVersionCount };
}

export default async function DashboardPage() {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const { promptsWithStats, totalKeys, totalVersionCount } = await getPromptsWithStats(userId);

  const testedPrompts = promptsWithStats.filter((p) => p.testsTotal > 0);
  const totalPassed = testedPrompts.reduce((acc, p) => acc + p.testsPassed, 0);
  const totalTests = testedPrompts.reduce((acc, p) => acc + p.testsTotal, 0);
  const avgPassRate = totalTests > 0 ? `${Math.round((totalPassed / totalTests) * 100)}%` : '100%';

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2.5">
            <span>Prompt Repositories</span>
            <span className="text-xs font-sans font-normal bg-bg-panel text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-800/60">
              Local & Cloud Synced
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Manage, version, diff, and evaluate atomic prompt bundles.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="h-9 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs btn-interactive flex items-center justify-center gap-1.5"
        >
          <span>+ Create New Prompt</span>
        </Link>
      </div>

      {/* Metric summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
          <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Prompts</div>
          <div className="text-2xl font-black text-zinc-100 font-mono">{promptsWithStats.length}</div>
        </div>
        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
          <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Versions</div>
          <div className="text-2xl font-black text-blue-300 font-mono">{totalVersionCount}</div>
        </div>
        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
          <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1">Avg Pass Rate</div>
          <div className="text-2xl font-black text-emerald-300 font-mono">{avgPassRate}</div>
        </div>
        <div className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive">
          <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1">API Credentials</div>
          <div className="text-2xl font-black text-amber-300 font-mono">{totalKeys}</div>
        </div>
      </div>

      {/* Prompts table or empty onboarding state */}
      {promptsWithStats.length === 0 ? (
        <div className="p-8 sm:p-10 border border-zinc-800/90 rounded-2xl bg-bg-card space-y-6 shadow-xl font-sans">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-lg font-bold text-zinc-100 font-mono">No Prompt Repositories Found</h3>
              <p className="text-xs text-zinc-400 max-w-md">
                Create a prompt repository online or initialize locally with the 100% offline Wasm CLI tool.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <CreateSamplePromptButton />
              <Link
                href="/dashboard/new"
                className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs btn-interactive shrink-0"
              >
                + Create Blank Bundle
              </Link>
            </div>
          </div>

          {/* CLI Terminal Onboarding Box */}
          <div className="rounded-xl border border-zinc-800 bg-bg-page p-5 font-mono space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
                <span>CLI Quickstart (Local-First VCS)</span>
              </span>
              <span className="text-[10px] text-zinc-500 bg-bg-panel border border-zinc-800 px-2 py-0.5 rounded">
                100% Offline SQLite Wasm
              </span>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 select-none">$</span>
                <code className="text-zinc-100 font-bold">npx gitforprompts init my-prompt-repo</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 select-none">$</span>
                <code className="text-zinc-100 font-bold">npx gitforprompts add system &quot;You are a code assistant&quot;</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 select-none">$</span>
                <code className="text-zinc-100 font-bold">npx gitforprompts run system</code>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PromptRepositoriesList prompts={promptsWithStats} />
      )}
    </div>
  );
}
