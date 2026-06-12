import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys, prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';

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
//   500 — unexpected server error (no stack trace exposed)
// ─────────────────────────────────────────────────────────────────────────────
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    // 3. O(1) key lookup via SHA-256 hash, then bcrypt verification.
    //    SHA-256 is deterministic so we can query the indexed column directly.
    //    bcrypt.compare is the final proof — SHA-256 alone is not sufficient
    //    because SHA-256 is fast (brute-forceable for short secrets).
    const lookupHash = createHash('sha256').update(token).digest('hex');

    const [candidateKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyLookupHash, lookupHash))
      .limit(1);

    if (!candidateKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Verify with bcrypt as the authoritative check
    const isValid = await bcrypt.compare(token, candidateKey.keyHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // 4. Update lastUsedAt — fire-and-forget with .execute()
    void db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, candidateKey.id))
      .execute();

    // 5. Resolve the prompt — must exist and belong to this key's owner
    const { id: promptId } = await params;

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(eq(prompts.id, promptId));

    if (!prompt || prompt.ownerId !== candidateKey.ownerId) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // 6. Get the latest version
    const [latest] = await db
      .select()
      .from(versions)
      .where(eq(versions.promptId, promptId))
      .orderBy(desc(versions.versionNumber))
      .limit(1);

    if (!latest) {
      return NextResponse.json(
        { error: 'This prompt has no versions yet' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      promptId: prompt.id,
      promptName: prompt.name,
      versionNumber: latest.versionNumber,
      commitMessage: latest.commitMessage ?? null,
      content: latest.content,
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
