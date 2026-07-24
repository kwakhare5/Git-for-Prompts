import { listWebhooks } from '@/lib/actions/webhooks';
import { WebhooksClient } from './webhooks-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webhooks — Git for Prompts',
  description: 'Register webhook URLs to receive notifications when new prompt versions are saved.',
};

export default async function WebhooksPage() {
  const existingWebhooks = await listWebhooks();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-50">Webhooks</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Git for Prompts will POST to your URL whenever a new version is saved.
          Scope to a specific prompt or leave blank to fire on all saves.
        </p>
      </div>

      <WebhooksClient webhooks={existingWebhooks} />

      {/* Payload reference */}
      <div className="mt-10 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-3">Example Payload</p>
        <pre className="text-xs text-zinc-400 font-mono leading-relaxed overflow-x-auto whitespace-pre">{`POST https://your-server.com/hook
Content-Type: application/json
X-GFP-Signature: sha256=<hmac-sha256-hex>
X-GFP-Event: version.created

{
  "event": "version.created",
  "promptId": "...",
  "promptName": "Customer Support Bot",
  "versionId": "...",
  "versionNumber": 3,
  "commitMessage": "More concise tone",
  "variables": ["name", "product"],
  "createdAt": "2026-07-24T04:00:00.000Z"
}`}</pre>
        <p className="text-[11px] text-zinc-600 mt-3">
          Verify with: <code className="text-zinc-500">HMAC-SHA256(secret, body) === X-GFP-Signature.slice(7)</code>
        </p>
      </div>
    </div>
  );
}
