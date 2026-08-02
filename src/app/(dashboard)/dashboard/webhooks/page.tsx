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
    <div className="p-6 lg:p-8 space-y-8 select-none font-sans">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-50">Webhooks</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Git for Prompts will POST to your URL whenever a new version is saved.
          Scope to a specific prompt or leave blank to fire on all saves.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left — webhook management */}
        <WebhooksClient webhooks={existingWebhooks} />

        {/* Right — reference panel */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="rounded-xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col gap-3 shadow-xl">
            <h2 className="text-sm font-semibold text-white font-sans">Example Payload</h2>
            <pre className="text-[11px] text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-3 no-scrollbar">{`POST https://your-server.com/hook
Content-Type: application/json
X-GFP-Signature: sha256=<hmac>
X-GFP-Event: version.created

{
  "event": "version.created",
  "promptId": "...",
  "promptName": "Support Bot",
  "versionId": "...",
  "versionNumber": 3,
  "commitMessage": "More concise tone",
  "variables": ["name", "product"],
  "createdAt": "2026-07-24T04:00:00.000Z"
}`}</pre>
            <p className="text-[11px] text-zinc-500 font-mono">
              Verify with:{' '}
              <code className="text-zinc-400 font-mono">
                HMAC-SHA256(secret, body)
              </code>
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#161616] p-5 flex flex-col gap-2 shadow-xl">
            <h2 className="text-sm font-semibold text-white font-sans">How it works</h2>
            <ul className="flex flex-col gap-1.5 text-xs text-zinc-400 font-light">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">1</span>
                Register your endpoint URL below
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">2</span>
                Save your signing secret — shown once only
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">3</span>
                Each new prompt version fires a POST to your URL
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">4</span>
                Verify the <code className="text-zinc-400 font-mono">X-GFP-Signature</code> header to trust the payload
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
