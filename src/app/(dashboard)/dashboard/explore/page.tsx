import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/domain/prompts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore Prompts · Git for Prompts',
  description: 'Discover and fork community prompts inside your workspace.',
};

export default async function DashboardExplorePage() {
  const publicPrompts = await db
    .select({
      id: prompts.id,
      name: prompts.name,
      description: prompts.description,
      updatedAt: prompts.updatedAt,
      currentVersionId: prompts.currentVersionId,
    })
    .from(prompts)
    .where(eq(prompts.isPublic, true))
    .orderBy(desc(prompts.updatedAt));

  const versionMap = new Map<string, number>();
  const currentVersionIds = publicPrompts
    .map((p) => p.currentVersionId)
    .filter((id): id is string => id != null);

  if (currentVersionIds.length > 0) {
    const vRows = await db
      .select({ id: versions.id, versionNumber: versions.versionNumber })
      .from(versions)
      .where(inArray(versions.id, currentVersionIds));

    for (const row of vRows) {
      versionMap.set(row.id, row.versionNumber);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5">
        <h1 className="text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2.5">
          <span>Community Explore</span>
          <span className="text-xs font-sans font-normal bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Open Source Prompts
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Discover, inspect, and fork open-source prompt repositories directly into your workspace.
        </p>
      </div>

      {publicPrompts.length === 0 ? (
        <div className="p-8 text-center border border-zinc-800/90 rounded-2xl bg-[#161619] text-zinc-400 font-mono text-xs shadow-xl">
          No public prompt repositories published yet.
        </div>
      ) : (
        <div className="border border-zinc-800/90 rounded-2xl bg-[#161619] overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1D1D22] border-b border-zinc-800/90 text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-5">Prompt Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Version</th>
                <th className="p-4 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {publicPrompts.map((prompt) => {
                const versionNum = prompt.currentVersionId ? versionMap.get(prompt.currentVersionId) : 1;
                return (
                  <tr key={prompt.id} className="hover:bg-[#1D1D22]/60 transition-colors">
                    <td className="p-4 pl-5 font-semibold text-zinc-100 font-mono">
                      <Link href={`/dashboard/prompts/${prompt.id}`} className="hover:text-blue-300 transition-colors">
                        {prompt.name}
                      </Link>
                    </td>
                    <td className="p-4 text-zinc-400 max-w-xs truncate text-xs">{prompt.description || "—"}</td>
                    <td className="p-4 font-mono">
                      <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
                        v{versionNum}
                      </span>
                    </td>
                    <td className="p-4 pr-5 text-right">
                      <ForkButton promptId={prompt.id} promptName={prompt.name} variant="secondary" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
