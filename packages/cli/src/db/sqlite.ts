/**
 * SQLite storage adapter — implements @gfp/core StorageAdapter using sql.js.
 *
 * sql.js is a Wasm-based SQLite that works everywhere without native
 * compilation (no Visual Studio, no node-gyp). The tradeoff is async
 * initialization and slightly slower I/O, but for a CLI tool managing
 * prompts this is negligible.
 *
 * All data is persisted to disk via manual save after each write operation.
 */

import initSqlJs, { type Database, type SqlValue } from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';
import type {
  StorageAdapter,
  Prompt,
  Version,
  TestCase,
  TestResult,
} from '@gfp/core';
import type { PromptBundle } from '@gfp/core';
import { runMigrations } from './migrations.js';

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create and initialize a SqliteStorageAdapter.
 * Must be called with `await` — sql.js requires async Wasm init.
 */
export async function createSqliteAdapter(dbPath: string): Promise<SqliteStorageAdapter> {
  const SQL = await initSqlJs();

  let db: Database;
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');
  runMigrations(db);

  return new SqliteStorageAdapter(db, dbPath);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBundle(raw: string | null): PromptBundle | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PromptBundle;
  } catch {
    return null;
  }
}

function parseVariables(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

type RawRow = Record<string, unknown>;

function mapPrompt(row: RawRow): Prompt & { cloudPromptId: string | null } {
  return {
    id: row['id'] as string,
    name: row['name'] as string,
    description: (row['description'] as string) ?? null,
    currentVersionId: (row['current_version_id'] as string) ?? null,
    cloudPromptId: (row['cloud_prompt_id'] as string) ?? null,
    createdAt: row['created_at'] as string,
    updatedAt: row['updated_at'] as string,
  };
}

function mapVersion(row: RawRow): Version {
  return {
    id: row['id'] as string,
    promptId: row['prompt_id'] as string,
    versionNumber: row['version_number'] as number,
    content: row['content'] as string,
    bundle: parseBundle(row['bundle'] as string | null),
    commitMessage: (row['commit_message'] as string) ?? null,
    variables: parseVariables(row['variables'] as string | null),
    createdBy: row['created_by'] as string,
    createdAt: row['created_at'] as string,
  };
}

function mapTestCase(row: RawRow): TestCase {
  return {
    id: row['id'] as string,
    promptId: row['prompt_id'] as string,
    name: row['name'] as string,
    inputText: row['input_text'] as string,
    expectedCriteria: row['expected_criteria'] as string,
    createdAt: row['created_at'] as string,
  };
}

function mapTestResult(row: RawRow): TestResult {
  return {
    id: row['id'] as string,
    versionId: row['version_id'] as string,
    testCaseId: row['test_case_id'] as string,
    passed: (row['passed'] as number) === 1,
    actualOutput: row['actual_output'] as string,
    score: (row['score'] as number) ?? null,
    runAt: row['run_at'] as string,
  };
}

/**
 * Run a SELECT query and return results as an array of objects.
 * sql.js returns column-oriented data; this converts to row-oriented.
 */
function query(db: Database, sql: string, params: SqlValue[] = []): RawRow[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const rows: RawRow[] = [];
  while (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    const row: RawRow = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }
    rows.push(row);
  }
  stmt.free();
  return rows;
}

// ─── SQLite Adapter ──────────────────────────────────────────────────────────

export class SqliteStorageAdapter implements StorageAdapter {
  constructor(
    private db: Database,
    private dbPath: string
  ) {}

  /** Persist in-memory database to disk. */
  private save(): void {
    const data = this.db.export();
    writeFileSync(this.dbPath, Buffer.from(data));
  }

  close(): void {
    this.save();
    this.db.close();
  }

  // ── Prompts ──

  async getPrompt(id: string): Promise<(Prompt & { cloudPromptId: string | null }) | null> {
    const rows = query(this.db, 'SELECT * FROM prompts WHERE id = ?', [id]);
    return rows.length > 0 ? mapPrompt(rows[0]) : null;
  }

  async getPromptByName(name: string): Promise<(Prompt & { cloudPromptId: string | null }) | null> {
    const rows = query(this.db, 'SELECT * FROM prompts WHERE name = ?', [name]);
    return rows.length > 0 ? mapPrompt(rows[0]) : null;
  }

  async listPrompts(): Promise<(Prompt & { cloudPromptId: string | null })[]> {
    const rows = query(this.db, 'SELECT * FROM prompts ORDER BY updated_at DESC');
    return rows.map(mapPrompt);
  }

  async createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'> | { name: string; description?: string | null; currentVersionId?: string | null }): Promise<Prompt & { cloudPromptId: string | null }> {
    const id = randomUUID();
    this.db.run(
      'INSERT INTO prompts (id, name, description, current_version_id) VALUES (?, ?, ?, ?)',
      [id, prompt.name, prompt.description ?? null, prompt.currentVersionId ?? null]
    );
    this.save();
    const rows = query(this.db, 'SELECT * FROM prompts WHERE id = ?', [id]);
    return mapPrompt(rows[0]);
  }

  /** Store the cloud prompt ID after a successful push or pull. */
  setCloudPromptId(localPromptId: string, cloudPromptId: string): void {
    this.db.run(
      "UPDATE prompts SET cloud_prompt_id = ?, updated_at = datetime('now') WHERE id = ?",
      [cloudPromptId, localPromptId]
    );
    this.save();
  }

  // ── Versions ──

  async getVersion(id: string): Promise<Version | null> {
    const rows = query(this.db, 'SELECT * FROM versions WHERE id = ?', [id]);
    return rows.length > 0 ? mapVersion(rows[0]) : null;
  }

  async getLatestVersion(promptId: string): Promise<Version | null> {
    const rows = query(
      this.db,
      'SELECT * FROM versions WHERE prompt_id = ? ORDER BY version_number DESC LIMIT 1',
      [promptId]
    );
    return rows.length > 0 ? mapVersion(rows[0]) : null;
  }

  async listVersions(promptId: string): Promise<Version[]> {
    const rows = query(
      this.db,
      'SELECT * FROM versions WHERE prompt_id = ? ORDER BY version_number DESC',
      [promptId]
    );
    return rows.map(mapVersion);
  }

  async insertVersion(version: {
    promptId: string;
    content: string;
    versionNumber?: number;
    bundle?: PromptBundle | null;
    commitMessage?: string | null;
    variables?: string[];
    createdBy?: string;
  }): Promise<Version> {
    const id = randomUUID();
    let versionNumber = version.versionNumber;
    if (typeof versionNumber !== 'number') {
      const rows = query(
        this.db,
        'SELECT COALESCE(MAX(version_number), 0) + 1 AS next_ver FROM versions WHERE prompt_id = ?',
        [version.promptId]
      );
      versionNumber = Number(rows[0]?.['next_ver'] ?? 1);
    }

    const bundleStr = version.bundle ? JSON.stringify(version.bundle) : null;
    const variablesStr = JSON.stringify(version.variables ?? []);
    const commitMsg = version.commitMessage ?? null;
    const createdBy = version.createdBy ?? 'local';

    this.db.run(
      `INSERT INTO versions (id, prompt_id, version_number, content, bundle, commit_message, variables, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, version.promptId, versionNumber, version.content, bundleStr, commitMsg, variablesStr, createdBy]
    );

    // Update prompt's currentVersionId
    this.db.run(
      "UPDATE prompts SET current_version_id = ?, updated_at = datetime('now') WHERE id = ?",
      [id, version.promptId]
    );

    this.save();
    const rows = query(this.db, 'SELECT * FROM versions WHERE id = ?', [id]);
    return mapVersion(rows[0]);
  }

  // ── Test cases ──

  async listTestCases(promptId: string): Promise<TestCase[]> {
    const rows = query(
      this.db,
      'SELECT * FROM test_cases WHERE prompt_id = ? ORDER BY created_at ASC',
      [promptId]
    );
    return rows.map(mapTestCase);
  }

  async createTestCase(testCase: Omit<TestCase, 'id' | 'createdAt'>): Promise<TestCase> {
    const id = randomUUID();
    this.db.run(
      'INSERT INTO test_cases (id, prompt_id, name, input_text, expected_criteria) VALUES (?, ?, ?, ?, ?)',
      [id, testCase.promptId, testCase.name, testCase.inputText, testCase.expectedCriteria]
    );
    this.save();
    const rows = query(this.db, 'SELECT * FROM test_cases WHERE id = ?', [id]);
    return mapTestCase(rows[0]);
  }

  // ── Test results ──

  async getTestResults(versionId: string): Promise<TestResult[]> {
    const rows = query(
      this.db,
      'SELECT * FROM test_results WHERE version_id = ? ORDER BY run_at DESC',
      [versionId]
    );
    return rows.map(mapTestResult);
  }

  async upsertTestResult(result: Omit<TestResult, 'id' | 'runAt'>): Promise<TestResult> {
    const id = randomUUID();
    this.db.run(
      `INSERT INTO test_results (id, version_id, test_case_id, passed, actual_output, score)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(version_id, test_case_id) DO UPDATE SET
         passed = excluded.passed,
         actual_output = excluded.actual_output,
         score = excluded.score,
         run_at = datetime('now')`,
      [id, result.versionId, result.testCaseId, result.passed ? 1 : 0, result.actualOutput, result.score ?? null]
    );
    this.save();

    const rows = query(
      this.db,
      'SELECT * FROM test_results WHERE version_id = ? AND test_case_id = ?',
      [result.versionId, result.testCaseId]
    );
    return mapTestResult(rows[0]);
  }

  async bulkUpsertTestResults(results: Omit<TestResult, 'id' | 'runAt'>[]): Promise<TestResult[]> {
    const upserted: TestResult[] = [];
    for (const result of results) {
      const r = await this.upsertTestResult(result);
      upserted.push(r);
    }
    return upserted;
  }
}
