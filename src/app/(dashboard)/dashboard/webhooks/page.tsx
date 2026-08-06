import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/layout/status-badge";
import { listWebhooks } from '@/lib/actions/webhooks';
import { WebhooksClient } from './webhooks-client';
import { Topbar } from '@/components/layout/topbar';
import { Webhook, Radio } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Webhooks · Git for Prompts',
  description: 'Register webhook URLs to receive notifications when new prompt versions are saved.',
};

export default async function WebhooksPage() {
  const existingWebhooks = await listWebhooks().catch(() => []);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background font-sans">
      <Topbar />

      <div className="p-6 lg:p-8 space-y-8 font-sans max-w-7xl w-full mx-auto">
        <PageHeader
          title="Webhooks"
          subtitle="Git for Prompts will fire HTTP POST payloads to your URL whenever a new prompt version is saved."
          badge={{ label: "Event Engine", variant: "violet", icon: Webhook }}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start font-sans">
          <WebhooksClient webhooks={existingWebhooks} />

          <aside className="flex flex-col gap-4 lg:sticky lg:top-20 font-sans">
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 shadow-xl font-sans">
              <div className="flex items-center justify-between font-mono">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                  <Radio className="w-4 h-4 text-muted-foreground" /> Webhook Payload
                </h2>
                <StatusBadge variant="sky">HMAC SHA-256</StatusBadge>
              </div>
              <pre className="text-xs text-foreground font-mono leading-relaxed overflow-x-auto whitespace-pre bg-background border border-border rounded-xl p-3 no-scrollbar">{`POST https://your-server.com/hook
Content-Type: application/json
X-GFP-Signature: sha256=<hmac>
X-GFP-Event: version.created

{
  "event": "version.created",
  "promptId": "...",
  "versionNumber": 3
}`}</pre>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-2 shadow-sm font-sans">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Workflow Steps</h2>
              <ul className="flex flex-col gap-2 text-xs text-muted-foreground font-sans mt-1">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground font-bold font-mono">1</span>
                  Register your HTTP/HTTPS endpoint below
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground font-bold font-mono">2</span>
                  Save your signing secret — shown once only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground font-bold font-mono">3</span>
                  Every new version fires a signed POST request
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
