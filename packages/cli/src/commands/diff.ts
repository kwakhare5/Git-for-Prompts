/**
 * gfp diff — Compare two versions of a prompt in the terminal.
 */

import { diffVersions } from '@gfp/core';
import { getDbPath } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

export async function cmdDiff(name: string, v1Str: string, v2Str: string): Promise<void> {
  if (!name || !v1Str || !v2Str) {
    console.error('\x1b[31mError:\x1b[0m Usage: gfp diff <name> <v1> <v2>');
    process.exit(1);
  }

  const v1Num = parseInt(v1Str.replace(/^v/, ''), 10);
  const v2Num = parseInt(v2Str.replace(/^v/, ''), 10);
  if (isNaN(v1Num) || isNaN(v2Num)) {
    console.error('\x1b[31mError:\x1b[0m Version numbers must be integers (e.g., 1, 2 or v1, v2)');
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
    const ver1 = versions.find(v => v.versionNumber === v1Num);
    const ver2 = versions.find(v => v.versionNumber === v2Num);

    if (!ver1) {
      console.error(`\x1b[31mError:\x1b[0m Version ${v1Num} not found`);
      process.exit(1);
    }
    if (!ver2) {
      console.error(`\x1b[31mError:\x1b[0m Version ${v2Num} not found`);
      process.exit(1);
    }

    const diff = diffVersions(
      { content: ver1.content, bundle: ver1.bundle },
      { content: ver2.content, bundle: ver2.bundle }
    );

    console.log(`\x1b[1m${name}\x1b[0m — v${v1Num} → v${v2Num}\n`);

    if (!diff.hasChanges) {
      console.log('\x1b[90mNo changes between these versions.\x1b[0m');
      return;
    }

    console.log(`\x1b[90m${diff.summary}\x1b[0m\n`);

    for (const field of diff.fields) {
      if (field.type === 'unchanged') continue;

      const typeColor = field.type === 'added' ? '32' : field.type === 'removed' ? '31' : '33';
      console.log(`\x1b[${typeColor}m[${field.type.toUpperCase()}]\x1b[0m \x1b[1m${field.field}\x1b[0m`);

      if (field.before !== null) {
        const lines = field.before.split('\n');
        for (const line of lines) {
          console.log(`  \x1b[31m- ${line}\x1b[0m`);
        }
      }
      if (field.after !== null) {
        const lines = field.after.split('\n');
        for (const line of lines) {
          console.log(`  \x1b[32m+ ${line}\x1b[0m`);
        }
      }
      console.log('');
    }
  } finally {
    adapter.close();
  }
}
