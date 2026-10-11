import type { Database, SqlValue } from 'sql.js';
import type {
  Prompt,
  Version,
  TestCase,
  TestResult,
  PromptBundle,
} from '@gfp/core';

export type RawRow = Record<string, unknown>;

export function parseBundle(raw: string | null): PromptBundle | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PromptBundle;
  } catch {
    return null;
  }
}

export function parseVariables(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function mapPrompt(row: RawRow): Prompt & { cloudPromptId: string | null } {
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

export function mapVersion(row: RawRow): Version {
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

export function mapTestCase(row: RawRow): TestCase {
  return {
    id: row['id'] as string,
    promptId: row['prompt_id'] as string,
    name: row['name'] as string,
    inputText: row['input_text'] as string,
    expectedCriteria: row['expected_criteria'] as string,
    createdAt: row['created_at'] as string,
  };
}

export function mapTestResult(row: RawRow): TestResult {
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
 * Run a SELECT query and return results as an array of row objects.
 * sql.js returns column-oriented data; this converts to row-oriented.
 */
export function query(db: Database, sql: string, params: SqlValue[] = []): RawRow[] {
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
