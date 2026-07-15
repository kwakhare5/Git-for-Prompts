'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { webhooks } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';

const createWebhookSchema = z.object({
  url: z.string().url('Must be a valid URL').max(2048),
  promptId: z.string().uuid().optional(), // undefined = global hook
  label: z.string().max(255).optional(),
});

const deleteWebhookSchema = z.object({
  webhookId: z.string().uuid('Invalid webhook ID'),
});

export async function createWebhook(input: unknown): Promise<{ id: string; secret: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createWebhookSchema.parse(input);

  // Generate a random 32-byte secret — shown once, never stored.
  // Store only SHA-256(secret) for HMAC signing at delivery time.
  const secret = `gfp_whsec_${randomBytes(24).toString('hex')}`;
  const secretHash = createHash('sha256').update(secret).digest('hex');

  const [webhook] = await db
    .insert(webhooks)
    .values({
      ownerId: userId,
      promptId: validated.promptId ?? null,
      url: validated.url,
      secretHash,
      label: validated.label,
    })
    .returning({ id: webhooks.id });

  revalidatePath('/dashboard/webhooks');
  return { id: webhook.id, secret };
}

export async function deleteWebhook(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { webhookId } = deleteWebhookSchema.parse(input);

  const [deleted] = await db
    .delete(webhooks)
    .where(and(eq(webhooks.id, webhookId), eq(webhooks.ownerId, userId)))
    .returning({ id: webhooks.id });

  if (!deleted) throw new Error('Webhook not found or access denied');

  revalidatePath('/dashboard/webhooks');
  return { success: true };
}

export async function listWebhooks() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  return db
    .select({
      id: webhooks.id,
      url: webhooks.url,
      promptId: webhooks.promptId,
      label: webhooks.label,
      createdAt: webhooks.createdAt,
    })
    .from(webhooks)
    .where(eq(webhooks.ownerId, userId));
}
