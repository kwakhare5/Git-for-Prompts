import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authModule from '@/lib/auth';
import { updatePrompt, deletePrompt, togglePromptVisibility } from '@/lib/actions/prompts';
import { createVersion, restoreVersion } from '@/lib/actions/versions';
import { createTestCase, deleteTestCase } from '@/lib/actions/tests';
import { deleteApiKey } from '@/lib/actions/api-keys';
import { deleteWebhook } from '@/lib/actions/webhooks';

// Mock DB queries for deterministic BOLA testing
vi.mock('@/db', () => {
  return {
    db: {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => []),
          orderBy: vi.fn(() => ({ limit: vi.fn(() => []) })),
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn(() => []),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => []),
        })),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(() => []),
        })),
      })),
      transaction: vi.fn(async (cb) => cb({
        execute: vi.fn(),
        select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ orderBy: vi.fn(() => ({ limit: vi.fn(() => []) })) })) })) })),
        insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => [{ id: 'v2', versionNumber: 2 }]) })) })),
        update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
      })),
    },
  };
});

import { forkPrompt } from '@/lib/actions/prompts';
import { runTestsForVersion } from '@/lib/actions/tests';

describe('Cross-Tenant Authorization / BOLA Security Matrix', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated attempts across all actions', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(null);

    await expect(updatePrompt('prompt_b_123', { name: 'Hacked' })).rejects.toThrow('Unauthorized');
    await expect(deletePrompt({ promptId: 'prompt_b_123' })).rejects.toThrow('Unauthorized');
    await expect(togglePromptVisibility('prompt_b_123')).rejects.toThrow('Unauthorized');
    await expect(createVersion({ promptId: 'prompt_b_123', content: 'hacked' })).rejects.toThrow('Unauthorized');
    await expect(restoreVersion({ promptId: 'prompt_b_123', versionId: 'v1' })).rejects.toThrow('Unauthorized');
    await expect(createTestCase({ promptId: 'prompt_b_123', name: 't1', inputText: 'in', expectedCriteria: 'exp' })).rejects.toThrow('Unauthorized');
    await expect(deleteTestCase('test_case_b_123')).rejects.toThrow('Unauthorized');
    await expect(deleteApiKey({ id: 'key_b_123' })).rejects.toThrow('Unauthorized');
    await expect(deleteWebhook('webhook_b_123')).rejects.toThrow('Unauthorized');
    await expect(forkPrompt('prompt_b_private')).rejects.toThrow('Unauthorized');
    await expect(runTestsForVersion('version_b_1')).rejects.toThrow('Unauthorized');
  });

  it('rejects User A attempting to update User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(updatePrompt('prompt_b_123', { name: 'Renamed by A' })).rejects.toThrow();
  });

  it('rejects User A attempting to delete User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(deletePrompt({ promptId: 'prompt_b_123' })).rejects.toThrow();
  });

  it('rejects User A attempting to create version for User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(createVersion({ promptId: 'prompt_b_123', content: 'unauthorized content' })).rejects.toThrow();
  });

  it('rejects User A attempting to restore version for User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(restoreVersion({ promptId: 'prompt_b_123', versionId: 'version_b_1' })).rejects.toThrow();
  });

  it('rejects User A attempting to delete User B API key', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(deleteApiKey({ id: 'key_b_999' })).rejects.toThrow();
  });

  it('rejects User A attempting to delete User B webhook', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(deleteWebhook('webhook_b_999')).rejects.toThrow();
  });

  it('rejects User A attempting to fork private prompt owned by User B', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(forkPrompt('prompt_b_private')).rejects.toThrow();
  });

  it('rejects User A attempting to create test case for User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(createTestCase({ promptId: 'prompt_b_123', name: 'eval', inputText: 'hi', expectedCriteria: 'pass' })).rejects.toThrow();
  });

  it('rejects User A attempting to delete test case owned by User B', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(deleteTestCase('test_case_b_999')).rejects.toThrow();
  });

  it('rejects User A attempting to run evaluations for User B version', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue('user_A');

    await expect(runTestsForVersion('version_b_999')).rejects.toThrow();
  });
});
