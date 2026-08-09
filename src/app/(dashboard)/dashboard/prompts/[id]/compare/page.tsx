import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CompareRunner } from '@/components/domain/diff';
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
  if (!userId) return { title: 'Compare · Git for Prompts' };

  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));
  return { title: prompt ? `Compare — ${prompt.name}` : 'Compare' };
}

export default async function ComparePage({
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

  const [versionCountRow] = await db
    .select({ count: count() })
    .from(versions)
    .where(eq(versions.promptId, id));
  const totalVersionCount = versionCountRow?.count ?? allVersions.length;

  const [tcCount] = await db
    .select({ count: count() })
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const testCaseCount = tcCount?.count ?? 0;
  const hasEnoughVersions = allVersions.length >= 2;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-xs font-mono font-bold text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Studio ({prompt.name})</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold font-mono text-zinc-100">A/B Compare Runner</h1>
        </div>
        {hasEnoughVersions && (
          <span className="shrink-0 font-mono text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-lg font-bold">
            {totalVersionCount > allVersions.length
              ? `latest ${allVersions.length} of ${totalVersionCount} snapshots`
              : `${totalVersionCount} snapshots`}
          </span>
        )}
      </div>

      {!hasEnoughVersions ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 py-16 text-center text-zinc-400 font-mono bg-[#161619]">
          <h2 className="text-sm font-bold text-zinc-200 mb-1">Need at least 2 commit snapshots</h2>
          <p className="text-xs text-zinc-500 mb-5 font-sans">Create another version of this prompt bundle to compare outputs in parallel.</p>
          <Link href={`/dashboard/prompts/${id}/edit`} className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer">
            + Create New Version
          </Link>
        </div>
      ) : testCaseCount === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 py-16 text-center text-zinc-400 font-mono bg-[#161619]">
          <h2 className="text-sm font-bold text-zinc-200 mb-1">No test cases created yet</h2>
          <p className="text-xs text-zinc-500 mb-5 font-sans">Add test cases with input variables to run side-by-side output comparisons.</p>
          <Link href={`/dashboard/prompts/${id}/tests`} className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer">
            + Add Test Cases
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/90 bg-[#161619] shadow-xl overflow-hidden p-6">
          <CompareRunner
            promptId={id}
            versions={allVersions}
            testCaseCount={testCaseCount}
          />
        </div>
      )}
    </div>
  );
}
