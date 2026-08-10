import { db } from '@/db';
import { prompts, versions, testResults } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { ExploreClient } from './explore-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore Public Prompts · Git for Prompts',
  description: 'Discover and fork open-source public prompt bundles created by developers.',
};

async function getPublicPrompts() {
  const publicPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.isPublic, true))
    .orderBy(desc(prompts.updatedAt));

  if (publicPrompts.length === 0) return [];

  const promptIds = publicPrompts.map((p) => p.id);

  const allVersions = await db
    .select()
    .from(versions)
    .where(inArray(versions.promptId, promptIds))
    .orderBy(desc(versions.versionNumber));

  const latestVersionIds = publicPrompts
    .map((p) => p.currentVersionId)
    .filter((id): id is string => id != null);

  const testStats =
    latestVersionIds.length > 0
      ? await db
          .select({
            versionId: testResults.versionId,
            passed: testResults.passed,
          })
          .from(testResults)
          .where(inArray(testResults.versionId, latestVersionIds))
      : [];

  const versionToPromptMap = new Map(
    publicPrompts
      .filter((p): p is typeof p & { currentVersionId: string } => p.currentVersionId != null)
      .map((p) => [p.currentVersionId, p.id])
  );

  const passMap = new Map<string, { passed: number; total: number }>();
  for (const r of testStats) {
    const promptId = versionToPromptMap.get(r.versionId);
    if (!promptId) continue;
    const entry = passMap.get(promptId) ?? { passed: 0, total: 0 };
    entry.total += 1;
    if (r.passed) entry.passed += 1;
    passMap.set(promptId, entry);
  }

  const versionCountMap = new Map<string, number>();
  for (const v of allVersions) {
    versionCountMap.set(v.promptId, (versionCountMap.get(v.promptId) ?? 0) + 1);
  }

  return publicPrompts.map((prompt) => {
    const latest = allVersions.find((v) => v.id === prompt.currentVersionId) ?? allVersions.find((v) => v.promptId === prompt.id);
    const stats = passMap.get(prompt.id) ?? { passed: 0, total: 0 };
    return {
      id: prompt.id,
      name: prompt.name,
      description: prompt.description,
      versionCount: versionCountMap.get(prompt.id) ?? 1,
      latestVersionContent: latest?.content ?? '',
      latestVersionNumber: latest?.versionNumber ?? 1,
      modelConfig: (latest?.bundle as { modelConfig?: { provider?: string; model?: string } })?.modelConfig ?? { provider: 'groq', model: 'llama-3.3-70b-versatile' },
      testsPassed: stats.passed,
      testsTotal: stats.total,
      updatedAt: prompt.updatedAt,
    };
  });
}

export default async function ExplorePage() {
  const publicPrompts = await getPublicPrompts();

  return (
    <div className="min-h-screen bg-bg-page text-zinc-100 font-sans selection:bg-blue-500/20 selection:text-blue-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800/90 pb-6 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black font-mono tracking-tight text-zinc-100">
              Explore Community Prompts
            </h1>
            <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              {publicPrompts.length} Public Repositories
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl font-sans leading-relaxed">
            Discover open-source, version-controlled prompt bundles built by the community. Inspect templates, model configs, test score evals, and fork directly into your workspace.
          </p>
        </div>

        {/* Client Showcase */}
        <ExploreClient publicPrompts={publicPrompts} />
      </div>
    </div>
  );
}
