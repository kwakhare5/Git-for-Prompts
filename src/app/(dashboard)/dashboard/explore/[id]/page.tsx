import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/domain/prompts';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [prompt] = await db
    .select({ name: prompts.name, isPublic: prompts.isPublic })
    .from(prompts)
    .where(eq(prompts.id, id));

  if (!prompt?.isPublic) return { title: 'Not Found' };

  return {
    title: `${prompt.name} — Explore · Git for Prompts`,
    description: `View and fork this community prompt on Git for Prompts.`,
  };
}

export default async function DashboardExploreDetailPage({ params }: Props) {
  const { id } = await params;

  const [[prompt], [latest]] = await Promise.all([
    db.select().from(prompts).where(eq(prompts.id, id)),
    db
      .select()
      .from(versions)
      .where(eq(versions.promptId, id))
      .orderBy(desc(versions.versionNumber))
      .limit(1),
  ]);

  if (!prompt || !prompt.isPublic) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <Link href="/dashboard/explore" className="text-sm underline text-gray-500">← Back to Explore</Link>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-2xl font-bold">{prompt.name}</h1>
            {latest && (
              <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded border">
                v{latest.versionNumber}
              </span>
            )}
          </div>
          {prompt.description && <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>}
        </div>
        <ForkButton promptId={prompt.id} promptName={prompt.name} variant="primary" />
      </div>

      {latest ? (
        <div className="space-y-4">
          <div className="font-mono text-xs text-gray-500">Prompt Content</div>
          <pre className="bg-gray-50 border p-4 rounded font-mono text-sm whitespace-pre-wrap">
            {latest.content}
          </pre>
        </div>
      ) : (
        <div className="p-8 text-center border rounded bg-gray-50 text-gray-500 font-mono">
          This prompt has no versions yet.
        </div>
      )}
    </div>
  );
}
