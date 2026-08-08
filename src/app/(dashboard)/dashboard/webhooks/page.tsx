import { listWebhooks } from '@/lib/actions/webhooks';
import { WebhooksClient } from './webhooks-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Webhooks · Git for Prompts',
  description: 'Register webhook URLs to receive notifications when new prompt versions are saved.',
};

export default async function WebhooksPage() {
  const existingWebhooks = await listWebhooks().catch(() => []);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5">
        <h1 className="text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2.5">
          <span>Webhooks Delivery</span>
          <span className="text-xs font-sans font-normal bg-blue-500/10 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            Fire-and-Forget
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Receive HMAC-SHA256 signed HTTP POST payloads instantly whenever a new prompt version is committed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <WebhooksClient webhooks={existingWebhooks} />

        <aside className="space-y-4 text-xs bg-[#161619] p-5 border border-zinc-800/90 rounded-2xl shadow-xl font-mono">
          <div className="space-y-2">
            <h2 className="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">Payload Structure</h2>
            <pre className="bg-[#121214] p-3 border border-zinc-800 rounded-xl text-zinc-200 text-[11px] leading-relaxed overflow-x-auto">
{`POST /your-webhook-endpoint
Content-Type: application/json
X-GFP-Signature: sha256=<hmac>
X-GFP-Event: version.created

{
  "event": "version.created",
  "promptId": "...",
  "versionNumber": 3
}`}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
