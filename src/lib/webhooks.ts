import { request } from 'node:https';
import { createHmac } from 'crypto';
import { db } from '@/db';
import { webhooks } from '@/db/schema';
import { eq, or, isNull, and } from 'drizzle-orm';
import { validateWebhookUrl } from './security/ssrf';

export interface WebhookPayload {
  event: 'version.created';
  promptId: string;
  promptName: string;
  versionId: string;
  versionNumber: number;
  commitMessage: string | null;
  variables: string[];
  createdAt: Date;
}

const WEBHOOK_TIMEOUT_MS = 10_000;
const USER_AGENT = 'GitForPrompts/1.0';

async function deliverWebhook(
  url: string,
  body: string,
  signature: string,
  resolvedIp: string,
): Promise<void> {
  const parsed = new URL(url);

  await new Promise<void>((resolve, reject) => {
    const req = request(
      {
        protocol: 'https:',
        hostname: parsed.hostname,
        port: 443,
        path: `${parsed.pathname}${parsed.search}`,
        method: 'POST',
        servername: parsed.hostname,
        lookup: (_hostname, _options, callback) => {
          const family = resolvedIp.includes(':') ? 6 : 4;
          callback(null, resolvedIp, family);
        },
        headers: {
          Host: parsed.host,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'X-GFP-Signature': `sha256=${signature}`,
          'X-GFP-Event': 'version.created',
          'User-Agent': USER_AGENT,
        },
      },
      (res) => {
        res.resume();
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`Webhook returned HTTP ${res.statusCode ?? 'unknown'}`));
        }
      },
    );

    req.setTimeout(WEBHOOK_TIMEOUT_MS, () => {
      req.destroy(new Error('Webhook request timed out'));
    });
    req.once('error', reject);
    req.end(body);
  });
}

/**
 * Fire all matching webhooks for a version save.
 * Delivery is non-blocking for the caller and each hook is isolated from the others.
 */
export async function fireWebhooks(
  ownerId: string,
  payload: WebhookPayload,
): Promise<void> {
  let hooks: { id: string; url: string; secretHash: string }[];
  try {
    hooks = await db
      .select({ id: webhooks.id, url: webhooks.url, secretHash: webhooks.secretHash })
      .from(webhooks)
      .where(
        and(
          eq(webhooks.ownerId, ownerId),
          or(eq(webhooks.promptId, payload.promptId), isNull(webhooks.promptId)),
        ),
      );
  } catch (err) {
    console.error('[webhooks] Failed to query webhooks:', err);
    return;
  }

  if (hooks.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.allSettled(
    hooks.map(async (hook) => {
      const ssrfCheck = await validateWebhookUrl(hook.url);
      if (!ssrfCheck.valid || !ssrfCheck.resolvedIps?.[0]) {
        console.warn(
          `[webhooks] Blocked delivery for hook ${hook.id}: SSRF validation failed (${ssrfCheck.reason ?? 'unknown reason'})`,
        );
        return;
      }

      const sig = createHmac('sha256', hook.secretHash).update(body).digest('hex');

      try {
        // Use the already-validated address as the socket lookup result. This avoids
        // resolving the hostname a second time and closes the DNS-rebinding window
        // between validation and the actual connection.
        await deliverWebhook(hook.url, body, sig, ssrfCheck.resolvedIps[0]);
      } catch (err) {
        console.error(`[webhooks] Delivery failed for hook ${hook.id}:`, err);
      }
    }),
  );
}
