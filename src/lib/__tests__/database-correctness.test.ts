import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authModule from '@/lib/auth';
import { restoreVersion } from '@/lib/actions/versions';
import { forkPrompt } from '@/lib/actions/prompts';
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
    transaction: vi.fn(),
  },
}));

describe('Stage 2B — Database Correctness & Invariants', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves V2 PromptBundle when restoring a version', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_owner_1');

    const sampleBundle = {
      version: '2.0.0' as const,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      userTemplate: 'Hello {{name}}',
      systemPrompt: 'You are helpful',
    };

    const validPromptUuid = '11111111-1111-4111-a111-111111111111';
    const validVersionUuid = '22222222-2222-4222-a222-222222222222';

    const versionToRestore = {
      id: validVersionUuid,
      promptId: validPromptUuid,
      versionNumber: 1,
      content: 'Hello {{name}}',
      bundle: sampleBundle,
      commitMessage: 'v1 save',
      createdBy: 'user_owner_1',
      createdAt: new Date(),
    };

    const promptRow = {
      id: validPromptUuid,
      name: 'Customer Bot',
      ownerId: 'user_owner_1',
      isPublic: false,
    };

    let queryCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      return {
        from: () => ({
          where: () => {
            queryCount++;
            if (queryCount === 1) return [versionToRestore];
            return [promptRow];
          },
        }),
      } as unknown as ReturnType<typeof db.select>;
    });

    let transactionArg: Record<string, unknown> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(db.transaction).mockImplementation(async (cb: any) => {
      const mockTx = {
        execute: vi.fn().mockResolvedValue([]),
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ versionNumber: 1 }]),
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockImplementation((vals: Record<string, unknown>) => {
            transactionArg = vals;
            return {
              returning: vi.fn().mockResolvedValue([
                { id: '33333333-3333-4333-a333-333333333333', versionNumber: 2, ...vals },
              ]),
            };
          }),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockImplementation(() => {
              const res = Promise.resolve([]);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (res as any).returning = vi.fn().mockResolvedValue([]);
              return res;
            }),
          }),
        }),
      };
      return cb(mockTx);
    });

    const result = await restoreVersion({ promptId: validPromptUuid, versionId: validVersionUuid });

    expect(result).toBeDefined();
    expect(transactionArg).toBeDefined();
    expect(transactionArg?.bundle).toEqual(sampleBundle);
  });

  it('generates collision-free names when forking prompts repeatedly', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_forker');

    const validSourceUuid = '44444444-4444-4444-a444-444444444444';

    const sourcePrompt = {
      id: validSourceUuid,
      name: 'Support Agent',
      description: 'Helpful support bot',
      ownerId: 'user_original',
      isPublic: true,
    };

    const latestVer = {
      id: 'ver_1',
      promptId: validSourceUuid,
      versionNumber: 1,
      content: 'System prompt',
    };

    let queryCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      return {
        from: () => ({
          where: () => {
            queryCount++;
            let res: Record<string, unknown>[];
            if (queryCount === 1) res = [sourcePrompt];
            else if (queryCount === 2) res = [latestVer];
            else if (queryCount === 3) res = [{ id: 'existing_fork' }]; // Base name exists
            else res = []; // Copy 1 is free

            Object.assign(res, {
              orderBy: () => ({
                limit: () => [latestVer],
              }),
            });
            return res;
          },
        }),
      } as unknown as ReturnType<typeof db.select>;
    });

    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockImplementation((vals: Record<string, unknown>) => ({
        returning: vi.fn().mockResolvedValue([{ id: 'forked_id', ...vals }]),
      })),
    } as unknown as ReturnType<typeof db.insert>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(db.transaction).mockImplementation(async (cb: any) =>
      cb({
        execute: vi.fn(),
        select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) }) }) }),
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'v1', versionNumber: 1 }]) }) }),
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) }),
      })
    );

    const forked = await forkPrompt(validSourceUuid);
    expect(forked.name).toBe('Support Agent (fork) (Copy 1)');
  });
});
