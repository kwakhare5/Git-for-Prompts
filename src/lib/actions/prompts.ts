'use server';

import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { createPromptSchema, updatePromptSchema, deletePromptSchema } from '@/lib/validations/prompt';
import { revalidatePath } from 'next/cache';
import { eq, and, desc } from 'drizzle-orm';
import { handleActionError } from '@/lib/action-error';
import { insertNextVersion } from '@/lib/actions/versions';

import { checkRateLimit } from '@/lib/rate-limit';

export async function createPrompt(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  const { success } = await checkRateLimit(`sa_create_prompt_${userId}`);
  if (!success) throw new Error('Rate limit exceeded. Please wait a minute before creating more prompts.');

  try {
    const validated = createPromptSchema.parse(input);

    const [prompt] = await db
      .insert(prompts)
      .values({ ...validated, ownerId: userId })
      .returning();

    revalidatePath('/dashboard');
    return prompt;
  } catch (err) {
    handleActionError(err, 'Failed to create prompt');
  }
}

export async function updatePrompt(promptId: string, input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const validated = updatePromptSchema.parse(input);

    const [updated] = await db
      .update(prompts)
      .set({ ...validated, updatedAt: new Date() })
      .where(and(eq(prompts.id, promptId), eq(prompts.ownerId, userId)))
      .returning();

    if (!updated) throw new Error('Prompt not found or access denied');

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/prompts/${promptId}`);
    return updated;
  } catch (err) {
    handleActionError(err, 'Failed to update prompt');
  }
}

export async function deletePrompt(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { promptId } = deletePromptSchema.parse(input);

    const [deleted] = await db
      .delete(prompts)
      .where(and(eq(prompts.id, promptId), eq(prompts.ownerId, userId)))
      .returning();

    if (!deleted) throw new Error('Prompt not found or access denied');

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    handleActionError(err, 'Failed to delete prompt');
  }
}

export async function togglePromptVisibility(promptId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  const [prompt] = await db
    .select({ isPublic: prompts.isPublic })
    .from(prompts)
    .where(and(eq(prompts.id, promptId), eq(prompts.ownerId, userId)));

  if (!prompt) throw new Error('Prompt not found or access denied');

  const [updated] = await db
    .update(prompts)
    .set({ isPublic: !prompt.isPublic, updatedAt: new Date() })
    .where(and(eq(prompts.id, promptId), eq(prompts.ownerId, userId)))
    .returning();

  revalidatePath(`/dashboard/prompts/${promptId}`);
  revalidatePath('/explore');
  return updated;
}

export async function forkPrompt(sourcePromptId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  // Fetch source prompt + latest version in one round trip
  const [[source], [latestVersion]] = await Promise.all([
    db.select().from(prompts).where(and(eq(prompts.id, sourcePromptId), eq(prompts.isPublic, true))),
    db
      .select()
      .from(versions)
      .where(eq(versions.promptId, sourcePromptId))
      .orderBy(desc(versions.versionNumber))
      .limit(1),
  ]);

  if (!source) throw new Error('Prompt not found or not public');

  // Resolve collision-free prompt name for user
  const baseName = `${source.name} (fork)`;
  let finalName = baseName;
  let counter = 1;

  while (counter < 100) {
    const [existing] = await db
      .select({ id: prompts.id })
      .from(prompts)
      .where(and(eq(prompts.ownerId, userId), eq(prompts.name, finalName)));

    if (!existing) break;
    finalName = `${baseName} (Copy ${counter})`;
    counter++;
  }

  const [forked] = await db
    .insert(prompts)
    .values({
      name: finalName,
      description: source.description,
      ownerId: userId,
      isPublic: false,
    })
    .returning();

  if (latestVersion) {
    // insertNextVersion: advisory lock, variable extraction, currentVersionId
    // update — same path used by createVersion, restoreVersion, and push API.
    // Pass bundle so V2 prompts (model config, system prompt, tools) are fully copied.
    await db.transaction((tx) =>
      insertNextVersion(tx, {
        promptId: forked.id,
        content: latestVersion.content,
        bundle: latestVersion.bundle ?? undefined,
        commitMessage: `Forked from "${source.name}"`,
        createdBy: userId,
      })
    );
  }

  revalidatePath('/dashboard');
  return forked;
}

