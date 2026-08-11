import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptDetailClient, PromptSubnav } from '@/components/domain/prompts';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = await getAuthUserId();
  if (!userId) return { title: 'Prompt · Git for Prompts' };

  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));
  return { title: `${prompt?.name ?? 'Prompt'} · Git for Prompts` };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getAuthUserId();
  if (!userId) return null;

  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  const [allVersions, [versionCountRow], [testCaseCount]] = await Promise.all([
    db
      .select()
      .from(versions)
      .where(eq(versions.promptId, id))
      .orderBy(desc(versions.versionNumber))
      .limit(RECENT_VERSIONS_LIMIT),
    db
      .select({ count: count() })
      .from(versions)
      .where(eq(versions.promptId, id)),
    db
      .select({ count: count() })
      .from(testCases)
      .where(eq(testCases.promptId, id)),
  ]);

  const totalVersionCount = versionCountRow?.count ?? 0;
  const activeVersion = allVersions[0];
  const hasVersions = allVersions.length > 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-5 gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100 font-mono truncate">{prompt.name}</h1>
            {hasVersions && (
              <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-lg shrink-0">
                v{allVersions[0].versionNumber}
              </span>
            )}
          </div>
          {prompt.description && (
            <p className="text-xs text-zinc-400 mt-1 font-sans">{prompt.description}</p>
          )}
        </div>
        <Link
          href={`/dashboard/prompts/${id}/edit`}
          id="new-version-btn"
          className="h-9 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs btn-interactive flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>+ Save New Version</span>
        </Link>
      </div>

      {/* Navigation tabs */}
      <PromptSubnav
        promptId={id}
        testCount={testCaseCount.count}
        versionCount={totalVersionCount}
      />

      {/* Main content */}
      {hasVersions ? (
        <PromptDetailClient
          promptId={id}
          versions={allVersions}
          totalVersionCount={totalVersionCount}
          initialActiveVersionId={activeVersion?.id}
          isPublic={prompt.isPublic}
        />
      ) : (
        <div className="p-12 text-center border border-zinc-800/90 rounded-2xl bg-bg-card space-y-4">
          <p className="text-xs text-zinc-400 font-mono">No versions created yet for this prompt bundle.</p>
          <Link
            href={`/dashboard/prompts/${id}/edit`}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs btn-interactive"
          >
            + Create First Version
          </Link>
        </div>
      )}
    </div>
  );
}
