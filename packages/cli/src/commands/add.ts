/**
 * gitforprompts add — Create or update a prompt bundle in the local SQLite database.
 *
 * Usage:
 *   gitforprompts add <name> [content]             Add inline content directly
 *   gitforprompts add <name> --file <path>         Add from a text file
 *   gitforprompts add <name> --content "text"      Add inline content with flag
 *   gitforprompts add <name> --bundle <json-path>  Add a full bundle from JSON file
 */

import { existsSync, readFileSync } from 'fs';
import {
  validateBundle,
  extractContentFromBundle,
  extractBundleVariables,
  extractVariables,
  createBundleFromLegacy,
  type PromptBundle,
} from '@gfp/core';
import { getDbPath } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

interface AddOptions {
  file?: string;
  content?: string;
  bundle?: string;
  message?: string;
}

export async function cmdAdd(name: string, options: AddOptions): Promise<void> {
  if (!name) {
    console.error('\x1b[31mError:\x1b[0m Prompt name is required. Usage: gitforprompts add <name> [content]');
    process.exitCode = 1;
    return;
  }

  const dbPath = getDbPath();
  const adapter = await createSqliteAdapter(dbPath);

  try {
    // Resolve content and bundle from options
    let promptContent: string;
    let promptBundle: PromptBundle | undefined;

    if (options.bundle) {
      // Full bundle from JSON file
      if (!existsSync(options.bundle)) {
        console.error(`\x1b[31mError:\x1b[0m File not found: ${options.bundle}`);
        process.exitCode = 1;
        return;
      }
      const raw = readFileSync(options.bundle, 'utf8');
      promptBundle = validateBundle(JSON.parse(raw));
      promptContent = extractContentFromBundle(promptBundle);
    } else if (options.file) {
      // Text-only from file → wrap in legacy bundle
      if (!existsSync(options.file)) {
        console.error(`\x1b[31mError:\x1b[0m File not found: ${options.file}`);
        process.exitCode = 1;
        return;
      }
      promptContent = readFileSync(options.file, 'utf8');
      promptBundle = createBundleFromLegacy(promptContent);
    } else if (options.content) {
      // Inline text → wrap in legacy bundle
      promptContent = options.content;
      promptBundle = createBundleFromLegacy(promptContent);
    } else {
      console.error('\x1b[31mError:\x1b[0m Provide prompt content: gitforprompts add <name> "your prompt" or use --file / --bundle');
      process.exitCode = 1;
      return;
    }

    const variables = promptBundle
      ? extractBundleVariables(promptBundle)
      : extractVariables(promptContent);

    // Get or create the prompt
    let prompt = await adapter.getPromptByName(name);
    if (!prompt) {
      prompt = await adapter.createPrompt({
        name,
        description: null,
        currentVersionId: null,
      });
      console.log(`\x1b[32m✓\x1b[0m Created prompt: ${name}`);
    }

    // Get current version number
    const latest = await adapter.getLatestVersion(prompt.id);
    const nextVersion = (latest?.versionNumber ?? 0) + 1;

    // Insert new version
    const version = await adapter.insertVersion({
      promptId: prompt.id,
      versionNumber: nextVersion,
      content: promptContent,
      bundle: promptBundle ?? null,
      commitMessage: options.message ?? null,
      variables,
      createdBy: 'local',
    });

    console.log(`\x1b[32m✓\x1b[0m Saved as v${version.versionNumber}`);
    if (options.message) {
      console.log(`  \x1b[90mMessage: ${options.message}\x1b[0m`);
    }
    if (variables.length > 0) {
      console.log(`  \x1b[90mVariables: ${variables.map(v => `{{${v}}}`).join(', ')}\x1b[0m`);
    }
    if (promptBundle) {
      console.log(`  \x1b[90mModel: ${promptBundle.modelConfig.provider}/${promptBundle.modelConfig.model}\x1b[0m`);
    }
  } finally {
    adapter.close();
  }
}
