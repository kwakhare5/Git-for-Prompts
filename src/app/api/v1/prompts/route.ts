import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { authenticateApiKey } from '@/lib/api-auth';
import { z } from 'zod';

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

    const authResult = await authenticateApiKey(req, 'prompts:read');
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId } = authResult;

    const name = req.nextUrl.searchParams.get('name');
    if (!name) {
      return NextResponse.json({ error: 'Missing ?name= query parameter' }, { status: 400 });
    }

    const [prompt] = await db
      .select({ id: prompts.id, name: prompts.name, ownerId: prompts.ownerId })
      .from(prompts)
      .where(and(eq(prompts.name, name), eq(prompts.ownerId, ownerId)));

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ promptId: prompt.id, promptName: prompt.name });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/prompts
//
// Authenticated via Bearer token.
// Creates a new prompt owned by the key holder.
// Used by the CLI: `gitforprompts push` auto-creates the cloud prompt on first push.
//
// Body: { name: string, description?: string }
//
// Responses:
//   201 — { promptId, promptName }
//   400 — invalid body
//   401 — invalid API key
//   409 — a prompt with this name already exists for this owner
//   429 — rate limited
// ─────────────────────────────────────────────────────────────────────────────

const createPromptBodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
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

    const authResult = await authenticateApiKey(req, 'prompts:write');
    if (authResult instanceof NextResponse) return authResult;
    const { ownerId } = authResult;

    let body: z.infer<typeof createPromptBodySchema>;
    try {
      body = createPromptBodySchema.parse(await req.json());
    } catch {
      return NextResponse.json({ error: 'Invalid request body. name (string, required) and optional description must be provided.' }, { status: 400 });
    }

    // Check for name collision (same owner)
    const [existing] = await db
      .select({ id: prompts.id })
      .from(prompts)
      .where(and(eq(prompts.name, body.name), eq(prompts.ownerId, ownerId)));

    if (existing) {
      return NextResponse.json(
        { error: `A prompt named "${body.name}" already exists.`, promptId: existing.id },
        { status: 409 }
      );
    }

    const [created] = await db
      .insert(prompts)
      .values({
        name: body.name,
        description: body.description ?? null,
        ownerId,
      })
      .returning({ id: prompts.id, name: prompts.name });

    return NextResponse.json({ promptId: created.id, promptName: created.name }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

