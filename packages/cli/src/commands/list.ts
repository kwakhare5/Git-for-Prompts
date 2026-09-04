/**
 * gitforprompts list — Show all locally saved prompt bundles.
 *
 * Usage:
 *   gitforprompts list
 */

import { getDbPath } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

export async function cmdList(): Promise<void> {
  const dbPath = getDbPath();
  const adapter = await createSqliteAdapter(dbPath);

  try {
    const prompts = await adapter.listPrompts();

    if (prompts.length === 0) {
      console.log('\x1b[90mNo prompts yet. Run: gitforprompts add <name> [content]\x1b[0m');
      return;
    }

    console.log(`\x1b[1m${prompts.length} prompt(s)\x1b[0m\n`);

    for (const p of prompts) {
      const cloud = p.cloudPromptId
        ? `\x1b[32m☁ synced\x1b[0m`
        : `\x1b[90m○ local only\x1b[0m`;

      console.log(`  \x1b[33m${p.name}\x1b[0m  ${cloud}`);

      if (p.currentVersionId) {
        console.log(`  \x1b[90mUpdated: ${p.updatedAt}\x1b[0m`);
      }
    }

    console.log('');
    console.log('\x1b[90mRun `gitforprompts history <name>` to see versions for a prompt.\x1b[0m');
  } finally {
    adapter.close();
  }
}
