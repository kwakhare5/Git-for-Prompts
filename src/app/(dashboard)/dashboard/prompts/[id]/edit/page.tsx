import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptEditor } from '@/components/domain/prompts';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(eq(prompts.id, id));
  return { title: prompt ? `Edit — ${prompt.name}` : 'Edit Prompt' };
}

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
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
    <div className="p-4 sm:p-8 font-sans bg-background">
      {/* Breadcrumb header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/prompts/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to prompt"
        >
          ← {prompt.name}
        </Link>
        <div className="h-4 w-px bg-border" aria-hidden="true" />
        <div>
          <h1 className="text-xl font-bold text-foreground truncate max-w-md">
            {prompt.name}
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {latestVersion
              ? `New version · based on v${latestVersion.versionNumber}`
              : 'First version'}
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
