import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys, prompts, versions } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { extractVariables } from '@/lib/variables';
import { fireWebhooks } from '@/lib/webhooks';
import { authenticateApiKey } from '@/lib/api-auth';
import { z } from 'zod';

/**
 * POST /api/v1/prompts/[id]/versions
 *
 * Create a new version via API key auth.
 * Used by the gfp CLI: gfp push <promptId> <file>
 *
 * Body: { content: string, commitMessage?: string }
 * Auth: Bearer <api-key>
 */
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  content: z.string().min(1, 'Content is required').max(100_000),
  commitMessage: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1';
    const { success } = await checkRateLimit(`api:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 60 requests per minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Auth — all auth logic lives in api-auth.ts
    const authResult = await authenticateApiKey(req);
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId, keyId } = authResult;

    const { id: promptId } = await params;

    // Validate body
    let body: z.infer<typeof bodySchema>;
    try {
      body = bodySchema.parse(await req.json());
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Look up prompt and touch lastUsedAt in parallel
    const [[prompt]] = await Promise.all([
      db.select().from(prompts).where(eq(prompts.id, promptId)),
      db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, keyId)).execute(),
    ]);

    if (!prompt || prompt.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    const vars = extractVariables(body.content);

    // Use the same advisory-lock pattern as the server action — prevents
    // concurrent pushes from racing on the versionNumber sequence.
    const newVersion = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${promptId}))`);

      const [lastVersion] = await tx
        .select({ versionNumber: versions.versionNumber })
        .from(versions)
        .where(eq(versions.promptId, promptId))
        .orderBy(desc(versions.versionNumber))
        .limit(1);

      const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

      const [created] = await tx
        .insert(versions)
        .values({
          promptId,
          versionNumber: nextVersionNumber,
          content: body.content,
          commitMessage: body.commitMessage,
          createdBy: ownerId,
          variables: vars,
        })
        .returning();

      await tx
        .update(prompts)
        .set({ currentVersionId: created.id, updatedAt: new Date() })
        .where(eq(prompts.id, promptId));

      return created;
    });

    // Fire webhooks — fire-and-forget
    void fireWebhooks(ownerId, {
      event: 'version.created',
      promptId,
      promptName: prompt.name,
      versionId: newVersion.id,
      versionNumber: newVersion.versionNumber,
      commitMessage: newVersion.commitMessage ?? null,
      variables: vars,
      createdAt: newVersion.createdAt,
    });

    return NextResponse.json({
      versionId: newVersion.id,
      versionNumber: newVersion.versionNumber,
      variables: vars,
      createdAt: newVersion.createdAt,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
