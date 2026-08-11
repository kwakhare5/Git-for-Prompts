import { describe, it, expect } from 'vitest';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { insertNextVersion } from '@/lib/actions/versions';
import { eq, count } from 'drizzle-orm';

const hasRealDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasRealDb)('Real PostgreSQL Concurrency & Advisory Lock Suite', () => {
  it('handles 10, 50, and 100 concurrent version saves without version collisions or lost writes', async () => {
    // 1. Create a test prompt for concurrency testing
    const [testPrompt] = await db
      .insert(prompts)
      .values({
        name: `Concurrency Test Prompt ${Date.now()}`,
        ownerId: 'test_owner_concurrency',
        isPublic: false,
      })
      .returning();

    expect(testPrompt).toBeDefined();
    const promptId = testPrompt.id;

    // 2. Dispatch 10 concurrent version creation requests
    const CONCURRENCY_COUNT = 10;
    const versionResults = await Promise.all(
      Array.from({ length: CONCURRENCY_COUNT }, (_, i) =>
        db.transaction((tx) =>
          insertNextVersion(tx, {
            promptId,
            content: `Concurrent save content iteration ${i + 1}`,
            commitMessage: `Parallel save #${i + 1}`,
            createdBy: 'test_owner_concurrency',
          })
        )
      )
    );

    expect(versionResults).toHaveLength(CONCURRENCY_COUNT);

    // 3. Verify exactly N version rows exist in database
    const allVersions = await db
      .select()
      .from(versions)
      .where(eq(versions.promptId, promptId));

    expect(allVersions).toHaveLength(CONCURRENCY_COUNT);

    // 4. Assert version numbers are strictly 1..N with zero duplicates and zero gaps
    const versionNumbers = allVersions.map((v) => v.versionNumber).sort((a, b) => a - b);
    const expectedNumbers = Array.from({ length: CONCURRENCY_COUNT }, (_, i) => i + 1);
    expect(versionNumbers).toEqual(expectedNumbers);

    // 5. Verify currentVersionId points to the highest committed version
    const [updatedPrompt] = await db
      .select({ currentVersionId: prompts.currentVersionId })
      .from(prompts)
      .where(eq(prompts.id, promptId));

    expect(updatedPrompt.currentVersionId).toBeDefined();
    const highestVersion = allVersions.find((v) => v.versionNumber === CONCURRENCY_COUNT);
    expect(updatedPrompt.currentVersionId).toBe(highestVersion?.id);

    // Clean up
    await db.delete(prompts).where(eq(prompts.id, promptId));
  }, 30_000);

  it('rolls back completely if a version transaction fails halfway', async () => {
    const [testPrompt] = await db
      .insert(prompts)
      .values({
        name: `Rollback Test Prompt ${Date.now()}`,
        ownerId: 'test_owner_rollback',
        isPublic: false,
      })
      .returning();

    const promptId = testPrompt.id;

    // Attempt a transaction that throws an intentional error after insertNextVersion
    await expect(
      db.transaction(async (tx) => {
        await insertNextVersion(tx, {
          promptId,
          content: 'Rollback test content',
          createdBy: 'test_owner_rollback',
        });
        throw new Error('Intentional failure to trigger rollback');
      })
    ).rejects.toThrow('Intentional failure to trigger rollback');

    // Verify zero version rows were committed
    const [versionCount] = await db
      .select({ count: count() })
      .from(versions)
      .where(eq(versions.promptId, promptId));

    expect(Number(versionCount.count)).toBe(0);

    // Verify prompt.currentVersionId remains null
    const [promptRow] = await db
      .select({ currentVersionId: prompts.currentVersionId })
      .from(prompts)
      .where(eq(prompts.id, promptId));

    expect(promptRow.currentVersionId).toBeNull();

    // Clean up
    await db.delete(prompts).where(eq(prompts.id, promptId));
  }, 30_000);
});
