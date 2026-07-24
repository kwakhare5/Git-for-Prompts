import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '../fork-button';

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

export const revalidate = 60;

export default async function ExplorePromptPage({ params }: Props) {
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

  // Only show if public
  if (!prompt || !prompt.isPublic) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/explore" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
            ← Explore
          </Link>
          <ForkButton promptId={prompt.id} promptName={prompt.name} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Title + meta */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-zinc-100">{prompt.name}</h1>
          {prompt.description && (
            <p className="text-sm text-zinc-500">{prompt.description}</p>
          )}
          {latest && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                v{latest.versionNumber}
              </span>
              {latest.commitMessage && (
                <span className="text-xs text-zinc-600 italic">{latest.commitMessage}</span>
              )}
            </div>
          )}
        </div>

        {/* Variables */}
        {latest && latest.variables.length > 0 && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-violet-950/30 border border-violet-900/50">
            <p className="text-[11px] font-mono text-violet-400 uppercase tracking-wider">Variables</p>
            <div className="flex flex-wrap gap-2">
              {latest.variables.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-950 border border-violet-800 text-xs font-mono text-violet-300"
                >
                  {'{{'}  {v}  {'}}'}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-zinc-600 mt-1">
              Pass these as <code className="text-zinc-500">?variables[name]=value</code> when fetching via API.
            </p>
          </div>
        )}

        {/* Prompt content */}
        {latest ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">Prompt Content</p>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {latest.content}
            </pre>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-600 text-sm font-mono">
            This prompt has no versions yet.
          </div>
        )}

        {/* Fork CTA */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div>
            <p className="text-sm font-medium text-zinc-300">Want to use this prompt?</p>
            <p className="text-xs text-zinc-600">Fork it into your account and customise it.</p>
          </div>
          <ForkButton promptId={prompt.id} promptName={prompt.name} />
        </div>
      </div>
    </main>
  );
}
