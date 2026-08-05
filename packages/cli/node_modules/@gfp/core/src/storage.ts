/**
 * Storage — adapter interface for prompt persistence.
 *
 * Both the cloud (Drizzle + Postgres) and local (better-sqlite3) storage
 * layers implement this interface. @gfp/core never imports any specific
 * database driver — it only depends on this contract.
 *
 * The eval runner and diff engine consume StorageAdapter to remain
 * fully portable between CLI and Next.js.
 */

import type { PromptBundle } from './bundle.js';

// ─── Shared entity types ─────────────────────────────────────────────────────

export type Prompt = {
  id: string;
  name: string;
  description: string | null;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Version = {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  bundle: PromptBundle | null;
  commitMessage: string | null;
  variables: string[];
  createdBy: string;
  createdAt: string;
};

export type TestCase = {
  id: string;
  promptId: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
  createdAt: string;
};

export type TestResult = {
  id: string;
  versionId: string;
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  score: number | null;
  runAt: string;
};

// ─── Storage adapter interface ───────────────────────────────────────────────

export interface StorageAdapter {
  // Prompts
  getPrompt(id: string): Promise<Prompt | null>;
  getPromptByName(name: string): Promise<Prompt | null>;
  listPrompts(): Promise<Prompt[]>;
  createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt>;

  // Versions
  getVersion(id: string): Promise<Version | null>;
  getLatestVersion(promptId: string): Promise<Version | null>;
  listVersions(promptId: string): Promise<Version[]>;
  insertVersion(version: Omit<Version, 'id' | 'createdAt'>): Promise<Version>;

  // Test cases
  listTestCases(promptId: string): Promise<TestCase[]>;
  createTestCase(testCase: Omit<TestCase, 'id' | 'createdAt'>): Promise<TestCase>;

  // Test results
  getTestResults(versionId: string): Promise<TestResult[]>;
  upsertTestResult(result: Omit<TestResult, 'id' | 'runAt'>): Promise<TestResult>;
  bulkUpsertTestResults(results: Omit<TestResult, 'id' | 'runAt'>[]): Promise<TestResult[]>;
}
