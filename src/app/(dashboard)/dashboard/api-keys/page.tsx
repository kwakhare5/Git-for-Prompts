import { getAuthUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { listApiKeys } from '@/lib/actions/api-keys';
import { ApiKeysManager } from '@/components/domain/api-keys/api-keys-manager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'API Keys · Git for Prompts',
  description: 'Generate and manage API keys to fetch your prompts programmatically.',
};

export default async function ApiKeysPage() {
  const userId = await getAuthUserId();
  if (!userId) redirect('/sign-in');

  const rawKeys = await listApiKeys();

  const keys = rawKeys.map((k) => ({
    ...k,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5">
        <h1 className="text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2.5">
          <span>API Credentials</span>
          <span className="text-xs font-sans font-normal bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            SHA-256 Auth
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Generate and manage API keys for Bearer token access to fetch prompts programmatically or sync via CLI (`gfp push` / `gfp pull`).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <ApiKeysManager initialKeys={keys} />

        <aside className="space-y-4 text-xs bg-[#161619] p-5 border border-zinc-800/90 rounded-2xl shadow-xl font-mono">
          <div className="space-y-2">
            <h2 className="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">REST API Usage</h2>
            <p className="text-[11px] text-zinc-400 font-sans">Fetch latest version at runtime:</p>
            <pre className="bg-[#121214] p-3 border border-zinc-800 rounded-xl text-zinc-200 text-[11px] leading-relaxed overflow-x-auto">
{`GET /api/v1/prompts/:id/latest
Authorization: Bearer gfp_live_...`}
            </pre>
          </div>

          <hr className="border-zinc-800/80" />

          <div className="space-y-2">
            <h2 className="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">CLI Terminal Auth</h2>
            <p className="text-[11px] text-zinc-400 font-sans">Connect offline local CLI:</p>
            <pre className="bg-[#121214] p-3 border border-zinc-800 rounded-xl text-zinc-200 text-[11px] leading-relaxed overflow-x-auto">
{`$ gfp auth gfp_live_...`}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
