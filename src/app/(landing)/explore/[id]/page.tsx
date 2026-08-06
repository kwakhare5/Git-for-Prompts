import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/prompts/fork-button';
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

export const revalidate = 60;

export default async function ExplorePromptDetailPage({ params }: Props) {
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
    <div className="min-h-screen bg-[#111111] text-[#f5f0eb] font-sans">
      {/* Header Navigation */}
      <header className="border-b border-white/[0.08] bg-[#111111]/90 backdrop-blur-md sticky top-0 z-10 select-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/explore" className="text-sm font-mono text-zinc-400 hover:text-[#f5f0eb] transition-colors flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to Explore
          </Link>
          <ForkButton promptId={prompt.id} promptName={prompt.name} variant="primary" />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-4xl mx-auto flex flex-col gap-6 select-none">
        {/* Title + Metadata */}
        <div className="flex flex-col gap-2 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#f5f0eb] tracking-tight font-sans">{prompt.name}</h1>
            {latest && (
              <span className="font-mono text-xs bg-[#161616] text-zinc-300 border border-white/[0.08] px-2.5 py-0.5 rounded-full font-semibold">
                v{latest.versionNumber}
              </span>
            )}
          </div>

          {prompt.description ? (
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-sans mt-1">{prompt.description}</p>
          ) : (
            <p className="text-sm text-zinc-500 italic mt-1 font-sans">No description provided.</p>
          )}

          {latest?.commitMessage && (
            <p className="text-xs text-zinc-400 font-mono mt-2">
              Latest commit: <span className="text-[#f5f0eb] font-sans font-medium">{latest.commitMessage}</span>
            </p>
          )}
        </div>

        {/* Variables Section */}
        {latest && latest.variables.length > 0 && (
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#161616] border border-white/[0.08] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              <Code className="h-4 w-4 text-emerald-400" /> Extracted Variables
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {latest.variables.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#111111] border border-white/[0.08] text-xs font-mono text-emerald-400 font-semibold"
                >
                  {'{{'}{v}{'}}'}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Pass values dynamically as query parameters: <code className="text-zinc-200 font-mono bg-[#111111] px-1.5 py-0.5 rounded border border-white/[0.08]">?variables[{latest.variables[0]}]=value</code>
            </p>
          </div>
        )}

        {/* Prompt Content Preview */}
        {latest ? (
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">Prompt Content</span>
            <pre className="bg-[#161616] border border-white/[0.08] rounded-2xl p-6 text-sm text-[#f5f0eb] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-sm">
              {latest.content}
            </pre>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400 text-sm font-mono border border-dashed border-white/[0.08] rounded-2xl bg-[#161616]">
            This prompt has no versions yet.
          </div>
        )}

        {/* Fork CTA Footer Card */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-[#161616] border border-white/[0.08] flex-wrap gap-4 shadow-sm">
          <div>
            <p className="text-base font-bold text-[#f5f0eb] font-sans">Want to customize this prompt?</p>
            <p className="text-xs text-zinc-400 mt-1 font-sans">Fork it into your account to version, test, and fetch via API.</p>
          </div>
          <ForkButton promptId={prompt.id} promptName={prompt.name} variant="primary" />
        </div>
      </main>
    </div>
  );
}
