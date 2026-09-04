'use server';

import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts } from '@/db/schema';
import { createPromptSchema, updatePromptSchema, deletePromptSchema } from '@/lib/validations/prompt';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { handleActionError } from '@/lib/action-error';
import { checkRateLimit } from '@/lib/rate-limit';

export async function createPrompt(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  const { success } = await checkRateLimit(`expensive:${userId}`);
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
  return updated;
}

