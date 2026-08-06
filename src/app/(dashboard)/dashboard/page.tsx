import { PageHeader, Topbar } from "@/components/layout";
import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { prompts, versions, testResults, apiKeys } from "@/db/schema";
import { eq, desc, count, inArray } from "drizzle-orm";
import Link from "next/link";
import { PromptTable, QuickCreateModal, ActivityStream, type ActivityEvent, PromptAnalyticsChart } from '@/components/domain/prompts';
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers, CheckCircle, Key, GitBranch, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const dynamic = 'force-dynamic';
export const metadata = { title: "Dashboard · Git for Prompts" };

async function getPromptsWithStats(userId: string) {
  const userPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.ownerId, userId))
    .orderBy(desc(prompts.updatedAt));

  if (userPrompts.length === 0) return { promptsWithStats: [], totalKeys: 0, totalVersionCount: 0, activityEvents: [] };

  const promptIds = userPrompts.map((p) => p.id);

  const [versionCounts, userApiKeys, recentVersions] = await Promise.all([
    db
      .select({ promptId: versions.promptId, count: count() })
      .from(versions)
      .where(inArray(versions.promptId, promptIds))
      .groupBy(versions.promptId),
    db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.ownerId, userId)),
    db
      .select({
        id: versions.id,
        promptId: versions.promptId,
        versionNumber: versions.versionNumber,
        commitMessage: versions.commitMessage,
        createdAt: versions.createdAt,
      })
      .from(versions)
      .where(inArray(versions.promptId, promptIds))
      .orderBy(desc(versions.createdAt))
      .limit(8),
  ]);

  const promptNameMap = new Map(userPrompts.map((p) => [p.id, p.name]));

  const activityEvents: ActivityEvent[] = recentVersions.map((v) => ({
    id: v.id,
    type: 'version' as const,
    title: `${promptNameMap.get(v.promptId) ?? 'Prompt'} v${v.versionNumber}`,
    subtitle: v.commitMessage ?? 'Created version snapshot',
    timestamp: new Date(v.createdAt),
  }));

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

  return { promptsWithStats, totalKeys: userApiKeys.length, totalVersionCount, activityEvents };
}

export default async function DashboardPage() {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const { promptsWithStats, totalKeys, totalVersionCount, activityEvents } = await getPromptsWithStats(userId);

  const testedPrompts = promptsWithStats.filter((p) => p.testsTotal > 0);
  const totalPassed = testedPrompts.reduce((acc, p) => acc + p.testsPassed, 0);
  const totalTests = testedPrompts.reduce((acc, p) => acc + p.testsTotal, 0);

  const passRateNumber = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 100;
  const avgPassRate = totalTests > 0 ? `${passRateNumber}%` : '100%';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background font-sans">
      <Topbar />

      <div className="p-5 lg:p-6 space-y-6 font-sans max-w-7xl w-full mx-auto">
        <PageHeader
          title="Prompt Bundles"
          subtitle="Manage, version, diff, and evaluate your prompt infrastructure in production."
          badge={{ label: "Local-First VCS", variant: "sky" }}
        >
          <QuickCreateModal />
        </PageHeader>

        {/* Top Metric Cards Grid - High Density Analytical CRM Style */}
        {/* Top Metric Cards Grid - High Density Analytical CRM Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="shadow-sm group cursor-default">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans">
                Total Bundles
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-muted border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                <Layers className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-foreground font-sans">
                  {promptsWithStats.length}
                </div>
                <Badge variant="outline" className="text-xs font-sans text-emerald-400 border-emerald-500/20 bg-emerald-500/10 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +100%
                </Badge>
              </div>
              <CardDescription className="text-xs font-sans">
                Active VCS prompt packages
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-sm group cursor-default">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans">
                Total Versions
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-muted border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                <GitBranch className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-foreground font-sans">
                  {totalVersionCount}
                </div>
                <Badge variant="outline" className="text-xs font-sans text-sky-400 border-sky-500/20 bg-sky-500/10">
                  Snapshots
                </Badge>
              </div>
              <CardDescription className="text-xs font-sans">
                Immutable history commits
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-sm group cursor-default">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans">
                Avg Pass Rate
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-muted border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                <CheckCircle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-foreground font-sans">
                  {avgPassRate}
                </div>
                <Badge variant="outline" className="text-xs font-sans text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                  Passing
                </Badge>
              </div>
              <Progress value={passRateNumber} className="h-1.5 bg-muted" />
            </CardContent>
          </Card>

          <Card className="shadow-sm group cursor-default">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans">
                Active API Keys
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-muted border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                <Key className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-foreground font-sans">
                  {totalKeys}
                </div>
                <Badge variant="outline" className="text-xs font-sans text-muted-foreground border-border bg-muted">
                  SHA-256
                </Badge>
              </div>
              <CardDescription className="text-xs font-sans">
                {totalKeys === 0 ? (
                  <Link href="/dashboard/api-keys" className="text-foreground hover:underline underline-offset-2 transition-colors">Create an API key</Link>
                ) : 'REST credentials'}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Analytical Recharts Pass Rate Visualizer */}
        {promptsWithStats.length > 0 && <PromptAnalyticsChart />}

        {/* Empty state */}
        {promptsWithStats.length === 0 && (
          <EmptyState
            icon="git init"
            heading="No prompt bundles yet"
            description="Create your first prompt bundle to start versioning, testing, and deploying."
            cta={{ href: '/dashboard/new', label: 'Create your first prompt' }}
          />
        )}

        {/* Split View: Prompt Table (2/3 width) + Activity Stream (1/3 width) */}
        {promptsWithStats.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground tracking-tight font-sans">
                  Your Prompt Repository
                </h2>
                <span className="text-xs font-sans text-muted-foreground">
                  {promptsWithStats.length} active bundles
                </span>
              </div>
              <PromptTable prompts={promptsWithStats} />
            </div>

            <div className="lg:col-span-1 h-full">
              <ActivityStream events={activityEvents} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
