import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { prompts, versions, testResults } from "@/db/schema";
import { eq, desc, count, inArray } from "drizzle-orm";
import Link from "next/link";
import { PromptTable } from "@/components/prompt-table";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Dashboard" };

async function getPromptsWithStats(userId: string) {
  // Single query for all prompts owned by user, newest first
  const userPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.ownerId, userId))
    .orderBy(desc(prompts.updatedAt));

  if (userPrompts.length === 0) return [];

  const promptIds = userPrompts.map((p) => p.id);

  // Batched: one query for all version counts
  const versionCounts = await db
    .select({ promptId: versions.promptId, count: count() })
    .from(versions)
    .where(inArray(versions.promptId, promptIds))
    .groupBy(versions.promptId);

  const versionCountMap = new Map(versionCounts.map((r) => [r.promptId, r.count]));

  // Use currentVersionId directly from the prompts table — already maintained
  // by insertNextVersion on every save. Eliminates the old query that fetched
  // ALL versions for ALL prompts just to find the latest one per prompt.
  const latestVersionIds = userPrompts
    .map((p) => p.currentVersionId)
    .filter((id): id is string => id != null);

  // Reverse map: currentVersionId → promptId (for correlating test results back)
  const versionToPromptMap = new Map(
    userPrompts
      .filter((p): p is typeof p & { currentVersionId: string } => p.currentVersionId != null)
      .map((p) => [p.currentVersionId, p.id])
  );

  // Get test results ONLY for the latest version of each prompt
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

  // Dedup: per (versionId, testCaseId) keep only the most recent run.
  // This prevents multiple test runs from inflating the total count.
  const latestByKey = new Map<string, { passed: boolean; runAt: Date }>();
  for (const r of latestTestResults) {
    const key = `${r.versionId}:${r.testCaseId}`;
    const existing = latestByKey.get(key);
    if (!existing || r.runAt > existing.runAt) {
      latestByKey.set(key, { passed: r.passed, runAt: r.runAt });
    }
  }

  // Aggregate passed/total from the deduplicated results
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

  return userPrompts.map((prompt) => {
    const tests = testStatMap.get(prompt.id) ?? { passed: 0, total: 0 };
    return {
      ...prompt,
      versionCount: versionCountMap.get(prompt.id) ?? 0,
      // testsPassed/testsTotal now reflects the LATEST version's most recent run only.
      // testsTotal === 0 means the current version has never been tested → card shows "No tests".
      testsPassed: tests.passed,
      testsTotal: tests.total,
    };
  });
}


export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const userPrompts = await getPromptsWithStats(userId);

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">
            Prompt Bundles
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-1 font-sans">
            Manage, version, and evaluate your prompt infrastructure.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 active:scale-[0.97] transition-all cursor-pointer shadow-sm font-sans shrink-0"
        >
          + New Prompt Bundle
        </Link>
      </div>

      {/* Top Stat Metric Cards (Rendered only when user has 2+ prompts) */}
      {userPrompts.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161616] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Total Bundles</span>
            <div className="text-2xl font-bold text-white font-mono">{userPrompts.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161616] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Cloud Synced</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{userPrompts.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161616] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Avg Pass Rate</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
          </div>
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161616] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Active Keys</span>
            <div className="text-2xl font-bold text-white font-mono">1</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {userPrompts.length === 0 && (
        <EmptyState
          icon="git init"
          heading="No prompts yet"
          description="Create your first prompt to start versioning, testing, and iterating."
          cta={{ href: '/dashboard/new', label: 'Create your first prompt' }}
        />
      )}

      {/* Prompt table */}
      {userPrompts.length > 0 && (
        <PromptTable prompts={userPrompts} />
      )}
    </div>
  );
}
