import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateApiKey, touchApiKeyLastUsed } from '../api-auth';
import { NextRequest } from 'next/server';
import { db } from '@/db';

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

describe('Stage 2G — API Key Authentication, Scope Compatibility & Usage Tracking', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as unknown as ReturnType<typeof db.update>);
    vi.mocked(db.update).mockClear();
  });

  const validToken = 'gfp_live_11112222333344445555666677778888'; // 41 chars total

  it('rejects missing or malformed Authorization header without updating lastUsedAt', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest');
    const res = await authenticateApiKey(req);
    expect(res).toHaveProperty('status', 401);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('rejects oversized Authorization header (>512 bytes)', async () => {
    const hugeToken = 'gfp_live_' + 'a'.repeat(600);
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${hugeToken}` },
    });
    const res = await authenticateApiKey(req);
    expect(res).toHaveProperty('status', 401);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('authenticates valid active key with matching scope', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${validToken}` },
    });

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'key_1',
              ownerId: 'user_123',
              scopes: ['prompts:read', 'prompts:write'],
              revokedAt: null,
              expiresAt: null,
              lastUsedAt: null,
            },
          ]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).not.toHaveProperty('status');
    expect(res).toEqual({
      ownerId: 'user_123',
      keyId: 'key_1',
      scopes: ['prompts:read', 'prompts:write'],
    });
  });

  it('rejects legacy keys with empty scopes instead of granting implicit full access', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${validToken}` },
    });

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'key_legacy',
              ownerId: 'user_legacy',
              scopes: [],
              revokedAt: null,
              expiresAt: null,
              lastUsedAt: null,
            },
          ]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).toHaveProperty('status', 403);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('rejects key missing the required scope', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/versions', {
      headers: { Authorization: `Bearer ${validToken}` },
    });

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'key_1',
              ownerId: 'user_123',
              scopes: ['prompts:read'],
              revokedAt: null,
              expiresAt: null,
              lastUsedAt: null,
            },
          ]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const res = await authenticateApiKey(req, 'versions:write');
    expect(res).toHaveProperty('status', 403);
  });

  it('rejects revoked keys with generic 401 failure without updating lastUsedAt', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${validToken}` },
    });

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'key_1',
              ownerId: 'user_123',
              scopes: ['prompts:read'],
              revokedAt: new Date(Date.now() - 3600_000),
              expiresAt: null,
              lastUsedAt: null,
            },
          ]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).toHaveProperty('status', 401);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('rejects expired keys with generic 401 failure without updating lastUsedAt', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${validToken}` },
    });

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 'key_1',
              ownerId: 'user_123',
              scopes: ['prompts:read'],
              revokedAt: null,
              expiresAt: new Date(Date.now() - 1000),
              lastUsedAt: null,
            },
          ]),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).toHaveProperty('status', 401);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('throttles lastUsedAt updates within 10-minute window', async () => {
    const keyId = 'key_throttle_1';

    vi.mocked(db.update).mockClear();

    const recentDate = new Date(Date.now() - 2 * 60 * 1000);
    await touchApiKeyLastUsed(keyId, recentDate);
    expect(db.update).not.toHaveBeenCalled();

    const oldDate = new Date(Date.now() - 15 * 60 * 1000);
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as unknown as ReturnType<typeof db.update>);

    await touchApiKeyLastUsed(keyId, oldDate);
    expect(db.update).toHaveBeenCalled();
  });
});
