import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    transaction: vi.fn(),
  },
}));

vi.mock('@/lib/api-auth', () => ({
  authenticateApiKey: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 59 }),
  inProcessCounts: new Map(),
}));

import { GET as getLatestRoute } from '@/app/api/v1/prompts/[id]/latest/route';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { authenticateApiKey } from '@/lib/api-auth';
import { inProcessCounts } from '@/lib/rate-limit';

describe('Stage 2C — API Security & Enumeration Defense Matrix', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    inProcessCounts.clear();
  });

  const validPromptUuid = '11111111-1111-4111-a111-111111111111';

  it('returns generic 404 for prompt belonging to another owner (preventing tenant enumeration)', async () => {
    vi.mocked(authenticateApiKey).mockResolvedValue({
      ownerId: 'user_attacker',
      keyId: 'key_1',
      scopes: ['prompts:read'],
    });

    const promptOwnedByVictim = {
      id: validPromptUuid,
      name: 'Secret Victim Prompt',
      ownerId: 'user_victim', // Different owner!
      isPublic: false,
    };

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    // Promise.all in route handler
    vi.spyOn(Promise, 'all').mockResolvedValueOnce([[promptOwnedByVictim], []] as unknown as [unknown, unknown]);

    const req = new NextRequest(`https://example.com/api/v1/prompts/${validPromptUuid}/latest`, {
      headers: { Authorization: 'Bearer gfp_live_11112222333344445555666677778888' },
    });

    const res = await getLatestRoute(req, { params: Promise.resolve({ id: validPromptUuid }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Prompt not found'); // Generic 404 does not reveal prompt existence to attacker
  });
});
