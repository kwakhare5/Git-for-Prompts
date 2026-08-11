'use server';

import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { versions, prompts } from '@/db/schema';
import { createVersionSchema, restoreVersionSchema } from '@/lib/validations/version';
import { revalidatePath } from 'next/cache';
import { eq, desc, and, sql } from 'drizzle-orm';
import { handleActionError } from '@/lib/action-error';
import { extractVariables, extractBundleVariables, extractContentFromBundle, type PromptBundle } from '@gfp/core';
import { fireWebhooks } from '@/lib/webhooks';

// Type of the transaction object drizzle hands to a `db.transaction(async (tx) => ...)`
// callback. Derived from `db.transaction` itself (not hardcoded against Drizzle's
// internal generics), so it stays correct across driver/version changes.
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// ─────────────────────────────────────────────────────────────────────────────
// insertNextVersion — shared by createVersion and restoreVersion.
//
// Both callers need the exact same "read the highest version number for this
// prompt, insert version N+1, point the prompt at it" sequence. It used to be
// duplicated in full in both functions; extracted here so there's one place
// to reason about correctness.
//
// RACE CONDITION FIX:
// The original code wrapped the read-increment-insert in a `db.transaction`
// and called that "race-condition protection." Under Postgres's default
// READ COMMITTED isolation, a transaction boundary alone does NOT prevent two
// concurrent transactions from both reading the same "current max version"
// before either commits — the `versions_prompt_version_unique` index would
// only turn that race into a hard 23505 unique-violation error at insert
// time (surfaced to the user as "Failed to create version," losing their
// edit) rather than actually preventing it.
//
// It also couldn't have worked for a prompt's very first version at all:
// `SELECT ... FOR UPDATE` — the standard row-locking fix — has no row to
// lock when zero versions exist yet, so two concurrent first-saves would
// still race regardless.
//
// `pg_advisory_xact_lock` fixes both cases. It takes a lock keyed off a hash
// of promptId (not a table row), so it works identically whether this is
// version 1 or version 500, is held only for the transaction's lifetime, and
// releases automatically on commit or rollback — no cleanup code needed.
// ─────────────────────────────────────────────────────────────────────────────
export async function insertNextVersion(
  tx: Tx,
  params: {
    promptId: string;
    content: string;
    commitMessage?: string;
    createdBy: string;
    bundle?: PromptBundle; // V2: optional full bundle payload
  }
) {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${params.promptId}))`);

  const [lastVersion] = await tx
    .select({ versionNumber: versions.versionNumber })
    .from(versions)
    .where(eq(versions.promptId, params.promptId))
    .orderBy(desc(versions.versionNumber))
    .limit(1);

  const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

  // V2: if a bundle is provided, derive content + variables from it.
  // V1: use raw content string and extract variables from it.
  const resolvedContent = params.bundle
    ? extractContentFromBundle(params.bundle)
    : params.content;

  const resolvedVariables = params.bundle
    ? extractBundleVariables(params.bundle)
    : extractVariables(params.content);

  const [created] = await tx
    .insert(versions)
    .values({
      promptId: params.promptId,
      versionNumber: nextVersionNumber,
      content: resolvedContent,
      bundle: params.bundle ?? null,
      commitMessage: params.commitMessage,
      createdBy: params.createdBy,
      variables: resolvedVariables,
    })
    .returning();

  await tx
    .update(prompts)
    .set({ currentVersionId: created.id, updatedAt: new Date() })
    .where(eq(prompts.id, params.promptId));

  return created;
}

export async function createVersion(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const validated = createVersionSchema.parse(input);

    // Verify prompt ownership before any writes
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, validated.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Prompt not found or access denied');

    const newVersion = await db.transaction((tx) =>
      insertNextVersion(tx, {
        promptId: validated.promptId,
        content: validated.content ?? '', // derived from bundle if not provided
        bundle: validated.bundle,
        commitMessage: validated.commitMessage,
        createdBy: userId,
      })
    );

    // Fire webhooks after commit — fire-and-forget, never blocks the save
    void fireWebhooks(userId, {
      event: 'version.created',
      promptId: validated.promptId,
      promptName: prompt.name,
      versionId: newVersion.id,
      versionNumber: newVersion.versionNumber,
      commitMessage: newVersion.commitMessage ?? null,
      variables: newVersion.variables,
      createdAt: newVersion.createdAt,
    });

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/prompts/${validated.promptId}`);
    return newVersion;
  } catch (err) {
    handleActionError(err, 'Failed to create version');
  }
}

export async function restoreVersion(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const validated = restoreVersionSchema.parse(input);

    // Get the version to restore + verify ownership in parallel
    const [[versionToRestore], [prompt]] = await Promise.all([
      db.select().from(versions).where(eq(versions.id, validated.versionId)),
      db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, validated.promptId), eq(prompts.ownerId, userId))),
    ]);

    if (!versionToRestore) throw new Error('Version not found');
    if (!prompt) throw new Error('Prompt not found or access denied');

    // Security: ensure the version actually belongs to the requested prompt.
    // Without this, a user could pass their own promptId + a foreign versionId
    // to read another user's prompt content into their own version history.
    if (versionToRestore.promptId !== validated.promptId) {
      throw new Error('Version does not belong to this prompt');
    }

    const restoredVersion = await db.transaction((tx) =>
      insertNextVersion(tx, {
        promptId: validated.promptId,
        content: versionToRestore.content,
        bundle: (versionToRestore.bundle as PromptBundle) ?? undefined,
        commitMessage: `Restored from v${versionToRestore.versionNumber}`,
        createdBy: userId,
      })
    );

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/prompts/${validated.promptId}`);
    return restoredVersion;
  } catch (err) {
    handleActionError(err, 'Failed to restore version');
  }
}

