'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts } from '@/db/schema';
import { createPromptSchema, updatePromptSchema, deletePromptSchema } from '@/lib/validations/prompt';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';

export async function createPrompt(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const validated = createPromptSchema.parse(input);

    const [prompt] = await db
      .insert(prompts)
      .values({ ...validated, ownerId: userId })
      .returning();

    revalidatePath('/dashboard');
    return prompt;
  } catch (err) {
    // Re-throw auth errors as-is; wrap everything else
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    throw new Error('Failed to create prompt');
  }
}

export async function updatePrompt(promptId: string, input: unknown) {
  const { userId } = await auth();
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
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Prompt not found or access denied') throw err;
    throw new Error('Failed to update prompt');
  }
}

export async function deletePrompt(input: unknown) {
  const { userId } = await auth();
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
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Prompt not found or access denied') throw err;
    throw new Error('Failed to delete prompt');
  }
}
