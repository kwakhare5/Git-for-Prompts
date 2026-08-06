import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptDetailClient, PromptSubnav } from '@/components/domain/prompts';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Topbar } from '@/components/layout';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import { Plus, ArrowLeft } from 'lucide-react';
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
    <div className="flex-1 flex flex-col min-w-0 bg-background font-sans">
      <Topbar />

      <div className="p-4 sm:p-8 space-y-6 font-sans max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors shrink-0"
              title="Back to Prompts"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground truncate tracking-tight font-sans">{prompt.name}</h1>
                {hasVersions && (
                  <span className="shrink-0 font-mono text-xs bg-muted text-foreground border border-border px-2.5 py-0.5 rounded-md font-semibold">
                    v{allVersions[0].versionNumber}
                  </span>
                )}
              </div>
              {prompt.description && (
                <p className="text-sm text-muted-foreground mt-1 truncate font-sans leading-relaxed">{prompt.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-sans">
            <Link href={`/dashboard/prompts/${id}/edit`} passHref id="new-version-btn">
              <Button size="sm" variant="default" className="gap-1.5 font-sans font-bold shadow-sm cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                New Version
              </Button>
            </Link>
          </div>
        </div>

        {/* Terminal Title Bar Subpage Navigation */}
        <PromptSubnav
          promptId={id}
          testCount={testCaseCount.count}
          versionCount={totalVersionCount}
        />

        {hasVersions ? (
          <PromptDetailClient
            promptId={id}
            versions={allVersions}
            totalVersionCount={totalVersionCount}
            initialActiveVersionId={activeVersion?.id}
            isPublic={prompt.isPublic}
          />
        ) : (
          <EmptyState
            icon="git init"
            heading="No versions yet"
            description="Write your first version of this prompt and save it to begin version control."
            cta={{ href: `/dashboard/prompts/${id}/edit`, label: 'Write first version' }}
          />
        )}
      </div>
    </div>
  );
}
