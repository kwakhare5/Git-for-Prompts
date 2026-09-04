import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { fireWebhooks } from '@/lib/webhooks';
import { authenticateApiKey } from '@/lib/api-auth';
import { validateBundle, extractContentFromBundle, extractBundleVariables, extractVariables, promptBundleSchema } from '@gfp/core';
import { z } from 'zod';

/**
 * POST /api/v1/prompts/[id]/versions
 *
 * Create a new version via API key auth.
 * Used by the gitforprompts CLI: gitforprompts push <promptId> <file>
 *
 * Body: { content?: string, bundle?: PromptBundle, commitMessage?: string }
 *   — `content` is derived from bundle.userTemplate automatically when bundle is provided
 * Auth: Bearer <api-key>
 */
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  content: z.string().max(100_000).optional(),
  bundle: promptBundleSchema.optional(),
  commitMessage: z.string().max(500).optional(),
}).refine(
  (data) => data.content || data.bundle,
  { message: 'Either content or bundle is required' }
);

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

    // 1. Authenticate API key with required scope
    const authResult = await authenticateApiKey(req, 'versions:write');
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId, keyId } = authResult;

    // 2. Layered Rate Limit — Key-specific limit for expensive version creation (20 req/min/key)
    try {
      const { success } = await checkRateLimit(`expensive:${keyId}`);
      if (!success) {
        return NextResponse.json(
          { error: 'Expensive operations rate limit exceeded. Max 20 version creations per minute.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    } catch (err) {
      console.error('[POST /versions] Rate limiter failed (expensive operation fail-closed):', err);
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503, headers: { 'Retry-After': '60' } }
      );
    }

    const { id: promptId } = await params;

    // Validate body
    let body: z.infer<typeof bodySchema>;
    try {
      body = bodySchema.parse(await req.json());
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate bundle if provided
    const parsedBundle = body.bundle ? validateBundle(body.bundle) : undefined;

    // Derive content + variables from whichever source is present
    const resolvedContent = parsedBundle
      ? extractContentFromBundle(parsedBundle)
      : (body.content ?? '');
    const vars = parsedBundle
      ? extractBundleVariables(parsedBundle)
      : extractVariables(resolvedContent);

    // Look up prompt
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(eq(prompts.id, promptId));

    if (!prompt || prompt.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

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
          content: resolvedContent,
          bundle: parsedBundle ?? null,
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
      bundle: newVersion.bundle ?? null,
      createdAt: newVersion.createdAt,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
