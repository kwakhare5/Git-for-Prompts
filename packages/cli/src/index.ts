#!/usr/bin/env node
/**
 * gfp — Git for Prompts CLI
 *
 * The local-first prompt package manager.
 * Version, diff, and evaluate your prompt bundles entirely offline.
 *
 * Commands:
 *   gfp init                           Initialize .gfp project
 *   gfp add <name> [options]           Add/update a prompt bundle
 *   gfp history <name>                 Show version history
 *   gfp diff <name> <v1> <v2>          Compare two versions
 *   gfp run <name> [options]           Run eval tests locally
 *   gfp auth <api-key>                 Save API key for cloud sync
 *   gfp push <name>                    Sync local → cloud (Phase 4)
 *   gfp pull <name>                    Sync cloud → local (Phase 4)
 */

import { Command } from 'commander';
import { cmdInit } from './commands/init.js';
import { cmdAdd } from './commands/add.js';
import { cmdHistory } from './commands/history.js';
import { cmdDiff } from './commands/diff.js';
import { cmdRun } from './commands/run.js';
import { cmdAuth } from './commands/auth.js';
import { cmdPush } from './commands/push.js';
import { cmdPull } from './commands/pull.js';

const program = new Command();

program
  .name('gfp')
  .description('Git for Prompts — the local-first prompt package manager')
  .version('0.2.0');

// ─── init ────────────────────────────────────────────────────────────────────

program
  .command('init')
  .description('Initialize a .gfp project with local SQLite storage')
  .action(async () => {
    await cmdInit();
  });

// ─── add ─────────────────────────────────────────────────────────────────────

program
  .command('add')
  .argument('<name>', 'Prompt name')
  .description('Add or update a prompt bundle')
  .option('-f, --file <path>', 'Read prompt content from a text file')
  .option('-c, --content <text>', 'Inline prompt content')
  .option('-b, --bundle <path>', 'Read full bundle from a JSON file')
  .option('-m, --message <msg>', 'Commit message for this version')
  .action(async (name: string, options) => {
    await cmdAdd(name, options);
  });

// ─── history ─────────────────────────────────────────────────────────────────

program
  .command('history')
  .argument('<name>', 'Prompt name')
  .description('Show version history for a prompt')
  .action(async (name: string) => {
    await cmdHistory(name);
  });

// ─── diff ────────────────────────────────────────────────────────────────────

program
  .command('diff')
  .argument('<name>', 'Prompt name')
  .argument('<v1>', 'First version number')
  .argument('<v2>', 'Second version number')
  .description('Compare two versions of a prompt')
  .action(async (name: string, v1: string, v2: string) => {
    await cmdDiff(name, v1, v2);
  });

// ─── run ─────────────────────────────────────────────────────────────────────

program
  .command('run')
  .argument('<name>', 'Prompt name')
  .description('Run eval test cases against the latest version')
  .option('-p, --provider <name>', 'AI provider (openai, groq, openrouter, ollama)')
  .option('-m, --model <name>', 'AI model override')
  .option('-k, --api-key <key>', 'API key for the provider')
  .action(async (name: string, options) => {
    await cmdRun(name, options);
  });

// ─── auth ────────────────────────────────────────────────────────────────────

program
  .command('auth')
  .argument('<api-key>', 'Your gfp_live_* API key')
  .description('Save API key for cloud sync (gfp push/pull)')
  .option('-u, --url <base>', 'Custom base URL for the cloud API')
  .action((apiKey: string, options) => {
    cmdAuth(apiKey, options);
  });

// ─── push / pull stubs ──────────────────────────────────────────────────────

program
  .command('push')
  .argument('<name>', 'Prompt name')
  .description('Sync latest local bundle to cloud')
  .option('--cloud-id <id>', 'Target a specific cloud prompt ID (bypasses name lookup)')
  .option('-m, --message <msg>', 'Override commit message for this push')
  .action(async (name: string, options) => {
    await cmdPush(name, options);
  });

program
  .command('pull')
  .argument('<name>', 'Prompt name')
  .description('Sync latest cloud version to local')
  .option('--cloud-id <id>', 'Target a specific cloud prompt ID (bypasses name lookup)')
  .action(async (name: string, options) => {
    await cmdPull(name, options);
  });

// ─── parse ───────────────────────────────────────────────────────────────────

program.parse();
