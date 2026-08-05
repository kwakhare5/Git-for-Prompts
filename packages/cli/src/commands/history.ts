/**
 * gfp history — Show version history for a prompt.
 */

import { getDbPath } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

export async function cmdHistory(name: string): Promise<void> {
  if (!name) {
    console.error('\x1b[31mError:\x1b[0m Prompt name is required. Usage: gfp history <name>');
    process.exit(1);
  }

  const dbPath = getDbPath();
  const adapter = await createSqliteAdapter(dbPath);

  try {
    const prompt = await adapter.getPromptByName(name);
    if (!prompt) {
      console.error(`\x1b[31mError:\x1b[0m Prompt "${name}" not found`);
      process.exit(1);
    }

    const versions = await adapter.listVersions(prompt.id);
    if (versions.length === 0) {
      console.log(`No versions found for "${name}"`);
      return;
    }

    console.log(`\x1b[1m${name}\x1b[0m — ${versions.length} version(s)\n`);

    for (const v of versions) {
      const current = v.id === prompt.currentVersionId ? ' \x1b[32m← current\x1b[0m' : '';
      const model = v.bundle ? `\x1b[36m${v.bundle.modelConfig.provider}/${v.bundle.modelConfig.model}\x1b[0m` : '\x1b[90mtext-only\x1b[0m';
      const msg = v.commitMessage ? ` — ${v.commitMessage}` : '';
      const vars = v.variables.length > 0 ? ` [${v.variables.map(v => `{{${v}}}`).join(', ')}]` : '';

      console.log(`  \x1b[33mv${v.versionNumber}\x1b[0m  ${v.createdAt}  ${model}${msg}${vars}${current}`);
    }
  } finally {
    adapter.close();
  }
}
