import { PageHeader } from "@/components/page-header";
import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { prompts, versions, testResults, apiKeys } from "@/db/schema";
import { eq, desc, count, inArray } from "drizzle-orm";
import Link from "next/link";
import { PromptTable } from "@/components/prompt-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Topbar } from "@/components/topbar";
import { Layers, CheckCircle, Key, Plus, GitBranch } from "lucide-react";

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

  const avgPassRate =
    totalTests > 0 ? `${Math.round((totalPassed / totalTests) * 100)}%` : '—';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#111111]">
      <Topbar />

      <div className="p-6 lg:p-8 space-y-8 select-none font-sans max-w-7xl w-full mx-auto">
        <PageHeader
          title="Prompt Bundles"
          subtitle="Manage, version, diff, and evaluate your prompt infrastructure in production."
          badge={{ label: "Local-First VCS", variant: "sky" }}
        >
          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#f5f0eb] text-zinc-950 font-semibold text-xs hover:bg-white active:scale-[0.97] transition-all cursor-pointer shadow-sm font-sans"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-950" />
            New Prompt Bundle
          </Link>
        </PageHeader>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#161616] space-y-2 shadow-sm hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-medium">
                Total Bundles
              </span>
              <div className="p-2 rounded-xl bg-[#111111] border border-white/[0.08] text-zinc-400 group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#f5f0eb] font-mono tracking-tight">
              {promptsWithStats.length}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Immutable version control
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#161616] space-y-2 shadow-sm hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-medium">
                Total Versions
              </span>
              <div className="p-2 rounded-xl bg-[#111111] border border-white/[0.08] text-zinc-400 group-hover:text-white transition-colors">
                <GitBranch className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#f5f0eb] font-mono tracking-tight">
              {totalVersionCount}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Immutable snapshots saved
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#161616] space-y-2 shadow-sm hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-medium">
                Avg Pass Rate
              </span>
              <div className="p-2 rounded-xl bg-[#111111] border border-white/[0.08] text-zinc-400 group-hover:text-white transition-colors">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#f5f0eb] font-mono tracking-tight">
              {avgPassRate}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Automated AI test suite
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#161616] space-y-2 shadow-sm hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-medium">
                Active API Keys
              </span>
              <div className="p-2 rounded-xl bg-[#111111] border border-white/[0.08] text-zinc-400 group-hover:text-white transition-colors">
                <Key className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#f5f0eb] font-mono tracking-tight">
              {totalKeys}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {totalKeys === 0 ? (
                <Link href="/dashboard/api-keys" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors">Create an API key</Link>
              ) : 'SHA-256 credentials'}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {promptsWithStats.length === 0 && (
          <EmptyState
            icon="git init"
            heading="No prompt bundles yet"
            description="Create your first prompt bundle to start versioning, testing, and deploying."
            cta={{ href: '/dashboard/new', label: 'Create your first prompt' }}
          />
        )}

        {/* Prompt Data Table */}
        {promptsWithStats.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#f5f0eb] uppercase tracking-wider font-mono">
                Your Prompt Repository
              </h2>
              <span className="text-xs font-mono text-zinc-400">
                {promptsWithStats.length} active bundles
              </span>
            </div>
            <PromptTable prompts={promptsWithStats} />
          </div>
        )}
      </div>
    </div>
  );
}
