import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys, prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createHash } from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';
import { interpolateVariables } from '@/lib/variables';

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
    // 0. Rate limiting — check by IP before any DB work
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? req.headers.get('x-real-ip')
      ?? '127.0.0.1';

    const { success } = await checkRateLimit(`api:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 60 requests per minute.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }

    // 1. Extract Bearer token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Authorization: Bearer <your-key>' },
        { status: 401 },
      );
    }
    const token = authHeader.slice(7).trim();

    // 2. Validate key format
    if (!token.startsWith('gfp_live_')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 401 });
    }

    // 3. O(1) key lookup via SHA-256 hash.
    //    Our API keys have 128 bits of entropy (randomBytes(16)) — SHA-256
    //    collision attacks are computationally infeasible for secrets of this
    //    size. bcrypt is for low-entropy user passwords; using it here added
    //    ~100ms CPU-bound latency per request with no security benefit.
    //    The SHA-256 index lookup is both the lookup AND the verification.
    const lookupHash = createHash('sha256').update(token).digest('hex');
    const { id: promptId } = await params;

    // 4. Fire the key lookup and the two prompt reads in parallel.
    //
    //    These three queries are mutually independent: the prompt and
    //    version reads only need `promptId` (already available from the
    //    route params), and neither one depends on whether the API key
    //    turns out to be valid. The original code awaited them one at a
    //    time — key lookup, then prompt, then version — paying three
    //    sequential round trips on the hot path of a public API endpoint.
    //
    //    Trade-off: an invalid-key request now also pays for a prompt +
    //    version read it doesn't need, instead of failing fast after the
    //    key lookup alone. That's the right trade here — this endpoint is
    //    already rate-limited per IP (step 0), and it turns three sequential
    //    round trips into one for every legitimate, valid-key request, which
    //    is the overwhelming majority of traffic to a "read my own prompt"
    //    endpoint.
    const [[candidateKey], [prompt], [latest]] = await Promise.all([
      db.select().from(apiKeys).where(eq(apiKeys.keyLookupHash, lookupHash)).limit(1),
      db.select().from(prompts).where(eq(prompts.id, promptId)),
      db.select().from(versions).where(eq(versions.promptId, promptId)).orderBy(desc(versions.versionNumber)).limit(1),
    ]);

    if (!candidateKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // 5. Update lastUsedAt — fire-and-forget with .execute()
    void db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, candidateKey.id))
      .execute();

    // 6. Resolve the prompt — must exist and belong to this key's owner
    if (!prompt || prompt.ownerId !== candidateKey.ownerId) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    if (!latest) {
      return NextResponse.json(
        { error: 'This prompt has no versions yet' },
        { status: 404 },
      );
    }

    // 7. Collect ?variables[name]=value query params and interpolate
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
    // Never expose stack traces or DB internals to the client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
