import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { interpolateVariables } from '@gfp/core';
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

    const rl = await checkRateLimit(`api:${ip}`);
    const headers = typeof getRateLimitHeaders === 'function' ? getRateLimitHeaders(rl) : {};

    if (!rl.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Max 60 requests per minute.',
          code: 'RATE_LIMIT_EXCEEDED',
          hint: 'Throttle requests according to RateLimit-Reset and Retry-After headers.',
        },
        { status: 429, headers },
      );
    }

    // 1. Authenticate API key with required scope
    const authResult = await authenticateApiKey(req, 'prompts:read');
    if (authResult instanceof NextResponse) {
      Object.entries(headers).forEach(([k, v]) => authResult.headers.set(k, v));
      return authResult;
    }
    const { ownerId } = authResult;

    const { id: promptId } = await params;

    // 2. Prompt + version reads — independent of auth, fire in parallel
    const [[prompt], [latest]] = await Promise.all([
      db.select().from(prompts).where(eq(prompts.id, promptId)),
      db.select().from(versions)
        .where(eq(versions.promptId, promptId))
        .orderBy(desc(versions.versionNumber))
        .limit(1),
    ]);

    // 4. Resolve the prompt — must exist and belong to this key's owner
    if (!prompt || prompt.ownerId !== ownerId) {
      return NextResponse.json(
        {
          error: 'Prompt not found',
          code: 'PROMPT_NOT_FOUND',
          hint: 'Verify that the prompt ID exists and is owned by the authenticated account. You can discover prompts using GET /api/v1/prompts?name=<name>.',
        },
        { status: 404, headers },
      );
    }

    if (!latest) {
      return NextResponse.json(
        {
          error: 'This prompt has no versions yet',
          code: 'NO_VERSIONS_FOUND',
          hint: 'Create an initial version by calling POST /api/v1/prompts/:id/versions or using the CLI command `gitforprompts push`.',
        },
        { status: 404, headers },
      );
    }

    // 5. Collect ?variables[name]=value query params and interpolate
    const variableValues: Record<string, string> = {};
    for (const [key, val] of req.nextUrl.searchParams.entries()) {
      const match = key.match(/^variables\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/);
      if (match) variableValues[match[1]] = val;
    }

    const hasVars = Object.keys(variableValues).length > 0;

    const content = hasVars
      ? interpolateVariables(latest.content, variableValues)
      : latest.content;

    return NextResponse.json(
      {
        promptId: prompt.id,
        promptName: prompt.name,
        versionNumber: latest.versionNumber,
        commitMessage: latest.commitMessage ?? null,
        content,
        variables: latest.variables ?? [],
        bundle: latest.bundle ?? null, // full bundle payload
        createdAt: latest.createdAt,
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        hint: 'An unexpected server error occurred. Please try again later or open an issue on GitHub.',
      },
      { status: 500 },
    );
  }
}
