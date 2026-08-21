import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSqliteAdapter } from '../db/sqlite';
import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import type { PromptBundle } from '@gfp/core';

describe('CLI SqliteStorageAdapter Unit & Integration Tests', () => {
  let testDbPath: string;
  let adapter: Awaited<ReturnType<typeof createSqliteAdapter>>;

  beforeEach(async () => {
    const testDir = join(tmpdir(), `gfp-test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
    mkdirSync(testDir, { recursive: true });
    testDbPath = join(testDir, 'bundles.db');
    adapter = await createSqliteAdapter(testDbPath);
  });

  afterEach(() => {
    if (existsSync(testDbPath)) {
      try {
        unlinkSync(testDbPath);
      } catch {
        // Ignore cleanup error on windows file lock
      }
    }
  });

  it('initializes SQLite database and tables', async () => {
    const prompts = await adapter.listPrompts();
    expect(prompts).toEqual([]);
  });

  it('creates and retrieves a prompt repository by name and id', async () => {
    const prompt = await adapter.createPrompt({
      name: 'security-reviewer',
      description: 'Audit node apps for vulnerabilities',
    });

    expect(prompt.id).toBeDefined();
    expect(prompt.name).toBe('security-reviewer');
    expect(prompt.description).toBe('Audit node apps for vulnerabilities');

    const fetchedById = await adapter.getPrompt(prompt.id);
    expect(fetchedById).toBeDefined();
    expect(fetchedById?.name).toBe('security-reviewer');

    const fetchedByName = await adapter.getPromptByName('security-reviewer');
    expect(fetchedByName).toBeDefined();
    expect(fetchedByName?.id).toBe(prompt.id);
  });

  it('inserts and auto-increments version numbers with immutable snapshots', async () => {
    const prompt = await adapter.createPrompt({ name: 'code-assistant' });

    const bundleV1: PromptBundle = {
      systemPrompt: 'You are a TypeScript assistant',
      userTemplate: 'Review this {{code}}',
      modelConfig: {
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
      },
    };

    const v1 = await adapter.insertVersion({
      promptId: prompt.id,
      content: bundleV1.userTemplate,
      bundle: bundleV1,
      commitMessage: 'Initial prompt commit',
      variables: ['code'],
      createdBy: 'local-user',
    });

    expect(v1.versionNumber).toBe(1);
    expect(v1.commitMessage).toBe('Initial prompt commit');
    expect(v1.bundle?.modelConfig.temperature).toBe(0.7);

    const bundleV2: PromptBundle = {
      ...bundleV1,
      modelConfig: {
        ...bundleV1.modelConfig,
        temperature: 0.2,
      },
    };

    const v2 = await adapter.insertVersion({
      promptId: prompt.id,
      content: bundleV2.userTemplate,
      bundle: bundleV2,
      commitMessage: 'Lowered temperature for deterministic output',
      variables: ['code'],
      createdBy: 'local-user',
    });

    expect(v2.versionNumber).toBe(2);
    expect(v2.bundle?.modelConfig.temperature).toBe(0.2);

    const versions = await adapter.listVersions(prompt.id);
    expect(versions).toHaveLength(2);
    expect(versions[0].versionNumber).toBe(2); // ordered descending
    expect(versions[1].versionNumber).toBe(1);

    const latest = await adapter.getLatestVersion(prompt.id);
    expect(latest).toBeDefined();
    expect(latest?.versionNumber).toBe(2);
  });

  it('persists and manages test cases and evaluation results', async () => {
    const prompt = await adapter.createPrompt({ name: 'eval-prompt' });

    const testCase = await adapter.createTestCase({
      promptId: prompt.id,
      name: 'no-injection-check',
      inputText: 'userInput: DROP TABLE users;',
      expectedCriteria: 'Must reject SQL injection attempt safely',
    });

    expect(testCase.id).toBeDefined();
    expect(testCase.name).toBe('no-injection-check');

    const testCases = await adapter.listTestCases(prompt.id);
    expect(testCases).toHaveLength(1);
    expect(testCases[0].name).toBe('no-injection-check');

    const v1 = await adapter.insertVersion({
      promptId: prompt.id,
      content: 'System prompt content',
      createdBy: 'local-user',
    });

    const result = await adapter.upsertTestResult({
      versionId: v1.id,
      testCaseId: testCase.id,
      passed: true,
      actualOutput: 'Safe rejection response',
      score: 100,
    });

    expect(result.passed).toBe(true);
    expect(result.actualOutput).toBe('Safe rejection response');

    const results = await adapter.getTestResults(v1.id);
    expect(results).toHaveLength(1);
    expect(results[0].passed).toBe(true);
  });
});
