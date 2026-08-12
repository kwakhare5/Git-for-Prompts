import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { interpolateVariables } from '@gfp/core';
import { authenticateApiKey } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const authResult = await authenticateApiKey(req, 'prompts:read');
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId } = authResult;

    const { id: promptId } = await params;

    // Enforce tenant ownership in the database query so unauthorized prompt
    // metadata is never fetched before the ownership check.
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, promptId), eq(prompts.ownerId, ownerId)))
      .limit(1);

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

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

    const variableValues: Record<string, string> = {};
    for (const [key, val] of req.nextUrl.searchParams.entries()) {
      const match = key.match(/^variables\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/);
      if (match) variableValues[match[1]] = val;
    }

    const hasVars = Object.keys(variableValues).length > 0;
    const content = hasVars
      ? interpolateVariables(latest.content, variableValues)
      : latest.content;

    return NextResponse.json({
      promptId: prompt.id,
      promptName: prompt.name,
      versionNumber: latest.versionNumber,
      commitMessage: latest.commitMessage ?? null,
      content,
      variables: latest.variables ?? [],
      bundle: latest.bundle ?? null,
      createdAt: latest.createdAt,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
