import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { listApiKeys } from '@/lib/actions/api-keys';
import { ApiKeysManager } from '@/components/api-keys-manager';

export const metadata = {
  title: 'API Keys — Git for Prompts',
  description: 'Generate and manage API keys to fetch your prompts programmatically.',
};

export default async function ApiKeysPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const rawKeys = await listApiKeys();

  const keys = rawKeys.map((k) => ({
    ...k,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
  }));

  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-50">API Keys</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fetch your latest prompt versions from any application or CI pipeline.
          Keys are hashed with SHA-256 — only you ever see the full key upon creation.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left — key management */}
        <ApiKeysManager initialKeys={keys} />

        {/* Right — API reference panel */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-zinc-300">API reference</h2>

            <div>
              <p className="text-xs text-zinc-500 mb-2">Fetch the latest version of any prompt you own:</p>
              <code className="block rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 font-mono text-[11px] text-zinc-300 whitespace-pre">
                {`GET /api/v1/prompts/:promptId/latest\nAuthorization: Bearer gfp_live_...`}
              </code>
            </div>

            <div>
              <p className="text-xs text-zinc-500 mb-2">Response shape:</p>
              <code className="block rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 font-mono text-[11px] text-zinc-400 whitespace-pre">
                {`{\n  "promptId": "uuid",\n  "promptName": "string",\n  "versionNumber": 3,\n  "commitMessage": "string | null",\n  "content": "string",\n  "createdAt": "ISO 8601"\n}`}
              </code>
            </div>

            <div className="flex flex-wrap gap-3 text-xs pt-1 border-t border-zinc-800">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-emerald-500">200</span>
                Success
              </span>
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-amber-500">401</span>
                Invalid / missing key
              </span>
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-red-500">404</span>
                Prompt not found
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-zinc-300">Security</h2>
            <ul className="flex flex-col gap-1.5 text-xs text-zinc-500">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">·</span>
                Keys are hashed with SHA-256 before storage
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">·</span>
                Only the <code className="text-zinc-400 font-mono">gfp_live_</code> prefix is stored
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">·</span>
                Revoke immediately if compromised
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">·</span>
                Use one key per environment (dev, staging, prod)
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
