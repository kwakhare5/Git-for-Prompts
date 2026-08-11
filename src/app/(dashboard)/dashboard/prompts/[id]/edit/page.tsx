import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptEditor } from '@/components/domain/prompts';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = await getAuthUserId();
  if (!userId) return { title: 'Edit Prompt · Git for Prompts' };

  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));
  return { title: prompt ? `Edit — ${prompt.name}` : 'Edit Prompt' };
}

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getAuthUserId();
  if (!userId) return null;

  // Ownership check — never serve another user's data
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // Pre-populate editor with latest version content (if any)
  const [latestVersion] = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(1);

  const initialContent = latestVersion?.content ?? '';

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-800/90 pb-5 space-y-2">
        <Link
          href={`/dashboard/prompts/${id}`}
          className="text-xs font-mono font-bold text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1 w-fit"
          aria-label="Back to Studio"
        >
          <span>←</span>
          <span>Back to Studio ({prompt.name})</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
            Edit Bundle
            {latestVersion && (
              <span className="text-xs font-mono font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                v{latestVersion.versionNumber}
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            {latestVersion
              ? `New commit snapshot · basing on v${latestVersion.versionNumber}`
              : 'Initial commit snapshot'}
          </p>
        </div>
      </div>

      {/* Monaco editor with commit message + save */}
      <PromptEditor
        promptId={id}
        initialContent={initialContent}
      />
    </div>
  );
}
