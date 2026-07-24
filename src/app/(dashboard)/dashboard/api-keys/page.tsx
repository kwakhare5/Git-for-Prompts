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

  // Serialize Date objects to ISO strings — client components receive JSON-serialized props
  const keys = rawKeys.map((k) => ({
    ...k,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
  }));

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-50">API Keys</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Use API keys to fetch your latest prompt versions from any application or CI pipeline.
          Keys are hashed with SHA-256 — only you ever see the full key upon creation.
        </p>
      </div>

      <ApiKeysManager initialKeys={keys} />
    </div>
  );
}

