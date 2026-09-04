/**
 * Webhook delivery — fires a signed POST to all registered webhook URLs
 * for a given (ownerId, promptId) pair.
 *
 * Signing: HMAC-SHA256 of the raw JSON body, keyed off SHA-256(secret).
 * The raw secret is returned once on registration to the user; the server stores
 * SHA-256(secret) (`secretHash`) to sign payloads without retaining plaintext secrets.
 *
 * Header: X-GFP-Signature: sha256=<hex-digest>
 * (same convention as GitHub and Stripe — widely understood by CI systems)
 *
 * Fire-and-forget: this function never throws or awaits delivery confirmation.
 * Webhook delivery failures are logged but never surface to the user who
 * triggered the version save.
 */

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

/**
 * Fire all matching webhooks for a version save.
 * Matches hooks where promptId = this prompt OR promptId IS NULL (global).
 * Non-blocking — call with `void fireWebhooks(...)`.
 */
export async function fireWebhooks(
  ownerId: string,
  payload: WebhookPayload
): Promise<void> {
  // Find all hooks for this user that match this prompt or are global
  let hooks: { id: string; url: string; secretHash: string }[];
  try {
    hooks = await db
      .select({ id: webhooks.id, url: webhooks.url, secretHash: webhooks.secretHash })
      .from(webhooks)
      .where(
        and(
          eq(webhooks.ownerId, ownerId),
          or(eq(webhooks.promptId, payload.promptId), isNull(webhooks.promptId))
        )
      );
  } catch (err) {
    console.error('[webhooks] Failed to query webhooks:', err);
    return;
  }

  if (hooks.length === 0) return;

  const body = JSON.stringify(payload);

  // Fire all hooks concurrently, absorb individual failures
  await Promise.allSettled(
    hooks.map(async (hook) => {
      // 1. SSRF pre-flight validation & IP resolution
      const ssrfCheck = await validateWebhookUrl(hook.url);
      if (!ssrfCheck.valid) {
        console.warn(
          `[webhooks] Blocked delivery for hook ${hook.id}: SSRF validation failed (${ssrfCheck.reason})`
        );
        return;
      }

      const sig = createHmac('sha256', hook.secretHash).update(body).digest('hex');
      const targetUrl = ssrfCheck.pinnedUrl || hook.url;
      const parsedOriginal = new URL(hook.url);

      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-GFP-Signature': `sha256=${sig}`,
            'X-GFP-Event': payload.event,
            'User-Agent': 'GitForPrompts/1.0',
            'Host': parsedOriginal.host,
          },
          body,
          redirect: 'manual', // Block HTTP 3xx redirects to prevent post-validation SSRF
          signal: AbortSignal.timeout(10_000), // 10s timeout per hook
        });
        if (!res.ok) {
          console.warn(`[webhooks] Hook ${hook.id} returned ${res.status}`);
        }
      } catch (err) {
        console.error(`[webhooks] Delivery failed for hook ${hook.id}:`, err);
      }
    })
  );
}

