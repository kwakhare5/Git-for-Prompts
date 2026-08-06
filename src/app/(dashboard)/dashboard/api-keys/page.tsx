import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getAuthUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { listApiKeys } from '@/lib/actions/api-keys';
import { ApiKeysManager } from '@/components/api-keys-manager';
import { Topbar } from '@/components/topbar';
import { ShieldCheck, Key, Code2 } from 'lucide-react';

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
    <div className="flex-1 flex flex-col min-w-0 bg-[#111111]">
      <Topbar />

      <div className="p-6 lg:p-8 space-y-8 select-none font-sans max-w-7xl w-full mx-auto">
        <PageHeader
          title="API Keys"
          subtitle="Fetch your latest prompt versions programmatically from any backend or CI/CD pipeline. Keys are hashed with SHA-256 for instant O(1) verification."
          badge={{ label: "Bearer Auth", variant: "sky", icon: Key }}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <ApiKeysManager initialKeys={keys} />

          <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#f5f0eb] uppercase tracking-wider font-mono flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-zinc-400" /> REST API Endpoint
                </h2>
                <StatusBadge variant="emerald">200 OK</StatusBadge>
              </div>

              <div>
                <p className="text-xs text-zinc-400 font-sans mb-2">Fetch latest prompt version:</p>
                <code className="block rounded-xl border border-white/[0.08] bg-[#111111] p-3 font-mono text-[11px] text-zinc-300 whitespace-pre overflow-x-auto">
                  {`GET /api/v1/prompts/:promptId/latest\nAuthorization: Bearer gfp_live_...`}
                </code>
              </div>

              <div>
                <p className="text-xs text-zinc-400 font-sans mb-2">JSON Response:</p>
                <code className="block rounded-xl border border-white/[0.08] bg-[#111111] p-3 font-mono text-[11px] text-zinc-400 whitespace-pre overflow-x-auto">
                  {`{\n  "promptId": "uuid",\n  "versionNumber": 3,\n  "content": "string"\n}`}
                </code>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col gap-3 shadow-xl">
              <h2 className="text-xs font-bold text-[#f5f0eb] uppercase tracking-wider font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-zinc-400" /> Connect CLI
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                After copying your key, run this in your terminal to connect the CLI to your account:
              </p>
              <code className="block rounded-xl border border-white/[0.08] bg-[#111111] p-3 font-mono text-[11px] text-zinc-300 whitespace-pre overflow-x-auto">
                {`gfp auth <your-api-key>`}
              </code>
              <p className="text-[11px] text-zinc-500 font-sans">
                Then use <span className="font-mono text-zinc-400">gfp push</span> and <span className="font-mono text-zinc-400">gfp pull</span> to sync prompts between your terminal and this dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col gap-2 shadow-sm">
              <h2 className="text-xs font-bold text-[#f5f0eb] uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400" /> Security Standards
              </h2>
              <ul className="flex flex-col gap-2 text-xs text-zinc-400 font-sans mt-1">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold font-mono">·</span>
                  Keys hashed using SHA-256 lookup index
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold font-mono">·</span>
                  Plaintext key is shown ONCE upon creation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold font-mono">·</span>
                  Instantly revokable from dashboard
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
