import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys, prompts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { authenticateApiKey } from '@/lib/api-auth';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/prompts?name=<name>
//
// Authenticated via Bearer token.
// Resolves a prompt name to its ID for the key holder.
// Used by the CLI for push/pull name → ID resolution.
//
// Responses:
//   200 — { promptId, promptName }
//   401 — invalid API key
//   404 — prompt not found
//   429 — rate limited
// ─────────────────────────────────────────────────────────────────────────────
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
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

    const authResult = await authenticateApiKey(req);
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId, keyId } = authResult;

    // Touch lastUsedAt — fire-and-forget
    void db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, keyId)).execute();

    const name = req.nextUrl.searchParams.get('name');
    if (!name) {
      return NextResponse.json({ error: 'Missing ?name= query parameter' }, { status: 400 });
    }

    const [prompt] = await db
      .select({ id: prompts.id, name: prompts.name })
      .from(prompts)
      .where(eq(prompts.name, name));

    if (!prompt || prompt.id === undefined) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // Verify ownership
    const [fullPrompt] = await db
      .select({ ownerId: prompts.ownerId })
      .from(prompts)
      .where(eq(prompts.id, prompt.id));

    if (!fullPrompt || fullPrompt.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ promptId: prompt.id, promptName: prompt.name });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
