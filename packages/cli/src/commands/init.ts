/**
 * gfp init — Initialize a .gfp project directory with SQLite database.
 */

import { join } from 'path';
import { initGfpDir, getDbPath } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

export async function cmdInit(): Promise<void> {
  const gfpDir = initGfpDir();
  const dbPath = getDbPath(gfpDir);

  // Create the database + run migrations
  const adapter = await createSqliteAdapter(dbPath);
  adapter.close();

  console.log('\x1b[32m✓\x1b[0m Initialized gfp project');
  console.log(`  \x1b[90mDatabase: ${dbPath}\x1b[0m`);
  console.log(`  \x1b[90mConfig:   ${join(gfpDir, 'config.json')}\x1b[0m`);
  console.log('');
  console.log('Next steps:');
  console.log('  gfp add <name>              Create a prompt bundle');
  console.log('  gfp auth <api-key>          Connect to cloud for sync');
}
