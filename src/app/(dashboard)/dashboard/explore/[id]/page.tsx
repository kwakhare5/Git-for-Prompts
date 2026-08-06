import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/domain/prompts';
import { ArrowLeft, Code } from 'lucide-react';

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
    <div className="p-4 sm:p-8">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <Link
          href="/dashboard/explore"
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
        </Link>
        <ForkButton promptId={prompt.id} promptName={prompt.name} variant="primary" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Title + Metadata */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-50">{prompt.name}</h1>
            {latest && (
              <span className="font-mono text-xs bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded">
                v{latest.versionNumber}
              </span>
            )}
          </div>

          {prompt.description ? (
            <p className="text-sm text-zinc-400">{prompt.description}</p>
          ) : (
            <p className="text-sm text-zinc-600 italic">No description provided.</p>
          )}

          {latest?.commitMessage && (
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Latest commit: <span className="text-zinc-400 font-sans">{latest.commitMessage}</span>
            </p>
          )}
        </div>

        {/* Variables Section */}
        {latest && latest.variables.length > 0 && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Code className="h-3.5 w-3.5 text-emerald-400" /> Extracted Variables
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {latest.variables.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400"
                >
                  {'{{'}{v}{'}}'}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Pass values dynamically as query parameters: <code className="text-zinc-300 font-mono text-xs">?variables[{latest.variables[0]}]=value</code>
            </p>
          </div>
        )}

        {/* Prompt Content Preview */}
        {latest ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Prompt Content</span>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {latest.content}
            </pre>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-sm font-mono border border-zinc-800 rounded-xl bg-zinc-900/50">
            This prompt has no versions yet.
          </div>
        )}

        {/* Fork CTA Footer Card */}
        <div className="flex items-center justify-between p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-50">Want to customize this prompt?</p>
            <p className="text-xs text-zinc-400 mt-0.5">Fork it into your account to version, test, and fetch via API.</p>
          </div>
          <ForkButton promptId={prompt.id} promptName={prompt.name} variant="primary" />
        </div>
      </div>
    </div>
  );
}
