#!/usr/bin/env node
/**
 * gitforprompts — Git for Prompts CLI
 *
 * The local-first prompt package manager.
 * Version, diff, and evaluate your prompt bundles entirely offline.
 *
 * Commands:
 *   gitforprompts init                           Initialize .gitforprompts project
 *   gitforprompts add <name> [options]           Add/update a prompt bundle
 *   gitforprompts list                           List all local prompt bundles
 *   gitforprompts history <name>                 Show version history
 *   gitforprompts diff <name> <v1> <v2>          Compare two versions
 *   gitforprompts run <name> [options]           Run eval tests locally
 *   gitforprompts test-add <name> [options]      Add a test case to a prompt
 *   gitforprompts auth <api-key>                 Save API key for cloud sync
 *   gitforprompts push <name>                    Sync local → cloud
 *   gitforprompts pull <name>                    Sync cloud → local
 */

import { Command } from 'commander';
import { cmdInit } from './commands/init.js';
import { cmdAdd } from './commands/add.js';
import { cmdList } from './commands/list.js';
import { cmdHistory } from './commands/history.js';
import { cmdDiff } from './commands/diff.js';
import { cmdRun } from './commands/run.js';
import { cmdAuth } from './commands/auth.js';
import { cmdPush } from './commands/push.js';
import { cmdPull } from './commands/pull.js';
import { cmdTestAdd } from './commands/test-add.js';

const program = new Command();

program
  .name('gitforprompts')
  .description('Git for Prompts — the local-first prompt package manager')
  .version('1.0.0');

// ─── init ────────────────────────────────────────────────────────────────────

program
  .command('init')
  .description('Initialize a gitforprompts project with local SQLite storage')
  .action(async () => {
    await cmdInit();
  });

// ─── add ─────────────────────────────────────────────────────────────────────

program
  .command('add')
  .argument('<name>', 'Prompt name')
  .argument('[content]', 'Inline prompt content')
  .description('Add or update a prompt bundle')
  .option('-f, --file <path>', 'Read prompt content from a text file')
  .option('-c, --content <text>', 'Inline prompt content')
  .option('-b, --bundle <path>', 'Read full bundle from a JSON file')
  .option('-m, --message <msg>', 'Commit message for this version')
  .action(async (name: string, contentArg: string | undefined, options) => {
    if (contentArg && !options.content) {
      options.content = contentArg;
    }
    await cmdAdd(name, options);
  });

// ─── list ────────────────────────────────────────────────────────────────────

program
  .command('list')
  .description('List all locally saved prompt bundles')
  .action(async () => {
    await cmdList();
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
  .argument('<api-key>', 'Your API key (starting with gfp_live_*)')
  .description('Save API key for cloud sync (gitforprompts push/pull)')
  .option('-u, --url <base>', 'Custom base URL for the cloud API')
  .action((apiKey: string, options) => {
    cmdAuth(apiKey, options);
  });

// ─── test-add ────────────────────────────────────────────────────────────────

program
  .command('test-add')
  .argument('<name>', 'Prompt name')
  .description('Add a test case to a local prompt (enables gitforprompts run)')
  .option('-n, --test-name <name>', 'Test case name')
  .option('-i, --input <text>', 'Input text to send to the prompt')
  .option('-c, --criteria <text>', 'Expected criteria the output should meet')
  .action(async (name: string, options) => {
    await cmdTestAdd(name, options);
  });

// ─── push / pull ─────────────────────────────────────────────────────────────

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
