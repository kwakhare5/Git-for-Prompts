/**
 * SQLite schema migrations for the local gfp CLI database.
 *
 * Mirrors the cloud Postgres schema but uses SQLite-native types.
 * Called on every `gfp init` and on first DB access to ensure tables exist.
 */

import type { Database } from 'sql.js';

export function runMigrations(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      current_version_id TEXT,
      cloud_prompt_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  // Idempotent migration for existing Phase 3 DBs — silently ignore if already exists
  try { db.run('ALTER TABLE prompts ADD COLUMN cloud_prompt_id TEXT'); } catch { /* already exists */ }

  db.run(`
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      bundle TEXT,
      commit_message TEXT,
      variables TEXT DEFAULT '[]',
      created_by TEXT NOT NULL DEFAULT 'local',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(prompt_id, version_number)
    )
  `);

  db.run('CREATE INDEX IF NOT EXISTS versions_prompt_id_idx ON versions(prompt_id)');

  db.run(`
    CREATE TABLE IF NOT EXISTS test_cases (
      id TEXT PRIMARY KEY,
      prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      input_text TEXT NOT NULL,
      expected_criteria TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS test_results (
      id TEXT PRIMARY KEY,
      version_id TEXT NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
      test_case_id TEXT NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
      passed INTEGER NOT NULL,
      actual_output TEXT NOT NULL,
      score INTEGER,
      run_at TEXT DEFAULT (datetime('now')),
      UNIQUE(version_id, test_case_id)
    )
  `);
}
