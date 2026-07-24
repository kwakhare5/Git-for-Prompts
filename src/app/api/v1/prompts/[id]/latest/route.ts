import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys, prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { interpolateVariables } from '@/lib/variables';
import { authenticateApiKey } from '@/lib/api-auth';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/prompts/[id]/latest
//
// Public API endpoint — authenticated via Bearer token.
// Returns the latest version content of a prompt owned by the key holder.
//
// Responses:
//   200 — prompt content JSON
//   401 — missing / invalid Authorization header or key mismatch
//   404 — prompt not found or not owned by this key's owner
//   429 — rate limit exceeded (60 req/min per IP)
//   500 — unexpected server error (no stack trace exposed)
// ─────────────────────────────────────────────────────────────────────────────
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 0. Rate limiting — by IP before any DB work
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? req.headers.get('x-real-ip')
      ?? '127.0.0.1';

    const { success } = await checkRateLimit(`api:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 60 requests per minute.' },
        { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' } },
      );
    }

    // 1. Authenticate API key — all auth logic in api-auth.ts
    const authResult = await authenticateApiKey(req);
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId, keyId } = authResult;

    const { id: promptId } = await params;

    // 2. Prompt + version reads — independent of auth, fire in parallel
    const [[prompt], [latest]] = await Promise.all([
      db.select().from(prompts).where(eq(prompts.id, promptId)),
      db.select().from(versions)
        .where(eq(versions.promptId, promptId))
        .orderBy(desc(versions.versionNumber))
        .limit(1),
    ]);

    // 3. Update lastUsedAt — fire-and-forget
    void db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, keyId)).execute();

    // 4. Resolve the prompt — must exist and belong to this key's owner
    if (!prompt || prompt.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    if (!latest) {
      return NextResponse.json(
        { error: 'This prompt has no versions yet' },
        { status: 404 },
      );
    }

    // 5. Collect ?variables[name]=value query params and interpolate
    const variableValues: Record<string, string> = {};
    for (const [key, val] of req.nextUrl.searchParams.entries()) {
      const match = key.match(/^variables\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/);
      if (match) variableValues[match[1]] = val;
    }

    const content =
      Object.keys(variableValues).length > 0
        ? interpolateVariables(latest.content, variableValues)
        : latest.content;

    return NextResponse.json({
      promptId: prompt.id,
      promptName: prompt.name,
      versionNumber: latest.versionNumber,
      commitMessage: latest.commitMessage ?? null,
      content,
      variables: latest.variables ?? [],
      createdAt: latest.createdAt,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
