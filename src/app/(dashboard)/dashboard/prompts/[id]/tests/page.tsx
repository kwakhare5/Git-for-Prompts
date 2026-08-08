import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TestRunner } from '@/components/domain/testing';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = await getAuthUserId();
  if (!userId) return { title: 'Tests · Git for Prompts' };

  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));
  return { title: prompt ? `Tests — ${prompt.name}` : 'Tests' };
}

export default async function TestsPage({
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

  const allVersions = await db
    .select({
      id: versions.id,
      versionNumber: versions.versionNumber,
      commitMessage: versions.commitMessage,
    })
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  const existingCases = await db
    .select()
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const hasVersions = allVersions.length > 0;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0 font-mono">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold text-zinc-100">Test Suite & Evals</h1>
        </div>
        {existingCases.length > 0 && (
          <span className="shrink-0 font-mono text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg font-bold">
            {existingCases.length} assertion{existingCases.length !== 1 ? 's' : ''} configured
          </span>
        )}
      </div>

      {!hasVersions ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 py-16 text-center text-zinc-400 font-mono bg-[#161619]">
          <h2 className="text-sm font-bold text-zinc-200 mb-1">No version snapshots to test</h2>
          <p className="text-xs text-zinc-500 mb-5 font-sans">Create a version snapshot of your prompt bundle before adding test assertions.</p>
          <Link href={`/dashboard/prompts/${id}/edit`} className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer">
            + Create First Version
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/90 bg-[#161619] shadow-xl overflow-hidden p-6">
          <TestRunner
            promptId={id}
            versions={allVersions}
            initialTestCases={existingCases}
          />
        </div>
      )}
    </div>
  );
}
