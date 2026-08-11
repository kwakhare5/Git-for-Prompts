import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authModule from '@/lib/auth';
import { generateApiKey, revokeApiKey } from '@/lib/actions/api-keys';

const MAX_ACTIVE_KEYS_PER_USER = 10;
import { touchApiKeyLastUsed } from '@/lib/api-auth';
import { db } from '@/db';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Stage 2C — API Key Lifecycle & Limits', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('generates high-entropy API key with gfp_live_ prefix without storing plaintext', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_gen_1');

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]), // 0 existing active keys
      }),
    } as unknown as ReturnType<typeof db.select>);

    let insertedRecord: Record<string, unknown> | undefined;
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockImplementation((vals: Record<string, unknown>) => {
        insertedRecord = vals;
        return {
          returning: vi.fn().mockResolvedValue([
            {
              id: 'key_new_1',
              name: vals.name,
              createdAt: new Date(),
              expiresAt: null,
              scopes: vals.scopes,
            },
          ]),
        };
      }),
    } as unknown as ReturnType<typeof db.insert>);

    const res = await generateApiKey({ name: 'Prod Key' });

    expect(res).toBeDefined();
    expect(res.plainKey).toMatch(/^gfp_live_[a-f0-9]{32}$/);
    expect(insertedRecord).toBeDefined();
    expect(insertedRecord?.keyLookupHash).toBeDefined();
    expect(insertedRecord?.keyLookupHash).not.toEqual(res.plainKey);
    expect(insertedRecord).not.toHaveProperty('plainKey');
  });

  it('enforces MAX_ACTIVE_KEYS_PER_USER cap', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_spammer');

    // Return 10 active keys
    const mockActiveKeys = Array.from({ length: MAX_ACTIVE_KEYS_PER_USER }, (_, i) => ({
      id: `key_${i}`,
    }));

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockActiveKeys),
      }),
    } as unknown as ReturnType<typeof db.select>);

    await expect(generateApiKey({ name: 'Excess Key' })).rejects.toThrow(
      `Maximum active API keys limit (${MAX_ACTIVE_KEYS_PER_USER}) reached`
    );
  });

  it('soft-revokes API key via revokeApiKey', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_owner');

    let updateArgs: Record<string, unknown> | undefined;
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockImplementation((setVals: Record<string, unknown>) => {
        updateArgs = setVals;
        return {
          where: vi.fn().mockResolvedValue([]),
        };
      }),
    } as unknown as ReturnType<typeof db.update>);

    await revokeApiKey({ id: '11111111-1111-4111-a111-111111111111' });

    expect(updateArgs).toBeDefined();
    expect(updateArgs?.revokedAt).toBeInstanceOf(Date);
  });

  it('throttles lastUsedAt updates within 10-minute window', async () => {
    const keyId = 'key_throttle_1';

    vi.mocked(db.update).mockClear();

    // 1. Recently updated 2 minutes ago -> should NOT trigger DB update
    const recentDate = new Date(Date.now() - 2 * 60 * 1000);
    await touchApiKeyLastUsed(keyId, recentDate);
    expect(db.update).not.toHaveBeenCalled();

    // 2. Updated 15 minutes ago -> SHOULD trigger DB update
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
