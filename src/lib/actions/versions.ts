'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { versions, prompts } from '@/db/schema';
import { createVersionSchema, restoreVersionSchema } from '@/lib/validations/version';
import { revalidatePath } from 'next/cache';
import { eq, desc, and } from 'drizzle-orm';
import { ZodError } from 'zod';

export async function createVersion(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const validated = createVersionSchema.parse(input);

    // Verify prompt ownership before any writes
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, validated.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Prompt not found or access denied');

    // Wrap the read-increment-insert in a transaction to prevent race conditions.
    // Two concurrent saves would otherwise both read the same "highest version number"
    // and produce a duplicate versionNumber collision.
    const newVersion = await db.transaction(async (tx) => {
      const [lastVersion] = await tx
        .select({ versionNumber: versions.versionNumber })
        .from(versions)
        .where(eq(versions.promptId, validated.promptId))
        .orderBy(desc(versions.versionNumber))
        .limit(1);

      const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

      const [created] = await tx
        .insert(versions)
        .values({
          promptId: validated.promptId,
          versionNumber: nextVersionNumber,
          content: validated.content,
          commitMessage: validated.commitMessage,
          createdBy: userId,
        })
        .returning();

      await tx
        .update(prompts)
        .set({ currentVersionId: created.id, updatedAt: new Date() })
        .where(eq(prompts.id, validated.promptId));

      return created;
    });

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/prompts/${validated.promptId}`);
    return newVersion;
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Prompt not found or access denied') throw err;
    if (err instanceof ZodError) throw new Error(err.issues[0].message);
    throw new Error('Failed to create version');
  }
}

export async function restoreVersion(input: unknown) {
  const { userId } = await auth();
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


    // Wrap restore in a transaction — same race condition risk as createVersion
    const restoredVersion = await db.transaction(async (tx) => {
      const [lastVersion] = await tx
        .select({ versionNumber: versions.versionNumber })
        .from(versions)
        .where(eq(versions.promptId, validated.promptId))
        .orderBy(desc(versions.versionNumber))
        .limit(1);

      const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

      const [created] = await tx
        .insert(versions)
        .values({
          promptId: validated.promptId,
          versionNumber: nextVersionNumber,
          content: versionToRestore.content,
          commitMessage: `Restored from v${versionToRestore.versionNumber}`,
          createdBy: userId,
        })
        .returning();

      await tx
        .update(prompts)
        .set({ currentVersionId: created.id, updatedAt: new Date() })
        .where(eq(prompts.id, validated.promptId));

      return created;
    });

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/prompts/${validated.promptId}`);
    return restoredVersion;
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message.includes('not found')) throw err;
    if (err instanceof Error && err.message.includes('access denied')) throw err;
    if (err instanceof Error && err.message.includes('does not belong')) throw err;
    throw new Error('Failed to restore version');
  }
}
