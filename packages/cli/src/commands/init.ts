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
  console.log('\x1b[1mGet started in 3 steps:\x1b[0m');
  console.log('');
  console.log('  \x1b[33m1.\x1b[0m gfp add <name> --content "your prompt text"');
  console.log('     \x1b[90mSave your first prompt locally\x1b[0m');
  console.log('');
  console.log('  \x1b[33m2.\x1b[0m gfp auth <api-key>');
  console.log('     \x1b[90mConnect to cloud (get your key at gitforprompts.vercel.app/dashboard/api-keys)\x1b[0m');
  console.log('');
  console.log('  \x1b[33m3.\x1b[0m gfp push <name>');
  console.log('     \x1b[90mSync your prompt to the cloud dashboard\x1b[0m');
  console.log('');
}
