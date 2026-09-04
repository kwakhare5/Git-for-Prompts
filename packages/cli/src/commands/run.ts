/**
 * gitforprompts run — Execute eval test cases locally against a prompt bundle.
 *
 * Uses the user's own API key for AI calls.
 *
 * Usage:
 *   gitforprompts run <name>                              Run with default provider
 *   gitforprompts run <name> --provider openai --model gpt-4o --api-key sk-...
 */

import {
  runEvaluations,
  createBundleFromLegacy,
  type AIProvider,
  type ChatMessage,
  type PromptBundle,
} from '@gfp/core';
import { getDbPath, loadConfig } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

interface RunOptions {
  provider?: string;
  model?: string;
  apiKey?: string;
}

/**
 * Create an AIProvider that calls any OpenAI-compatible API.
 */
function createProvider(
  baseUrl: string,
  apiKey: string,
  defaultModel: string
): AIProvider {
  return {
    async chat(
      messages: ChatMessage[],
      config?: { model?: string; temperature?: number; jsonMode?: boolean }
    ): Promise<string> {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config?.model ?? defaultModel,
          messages,
          temperature: config?.temperature ?? 0.1,
          ...(config?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`AI API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json() as { choices: Array<{ message: { content: string } }> };
      return data.choices[0].message.content;
    },
  };
}

const PROVIDER_URLS: Record<string, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  ollama: 'http://localhost:11434/v1/chat/completions',
};

export async function cmdRun(name: string, options: RunOptions): Promise<void> {
  if (!name) {
    console.error('\x1b[31mError:\x1b[0m Prompt name is required. Usage: gitforprompts run <name>');
    process.exitCode = 1;
    return;
  }

  const dbPath = getDbPath();
  const adapter = await createSqliteAdapter(dbPath);
  const config = loadConfig();

  try {
    // Resolve provider settings
    const providerName = options.provider ?? config.defaultProvider ?? 'openai';
    const apiKey = options.apiKey ?? process.env[`${providerName.toUpperCase()}_API_KEY`];

    if (!apiKey) {
      console.error(`\x1b[31mError:\x1b[0m No API key found. Provide with --api-key or set ${providerName.toUpperCase()}_API_KEY env var`);
      process.exitCode = 1;
      return;
    }

    const baseUrl = PROVIDER_URLS[providerName] ?? providerName; // Allow raw URL as provider

    // Load prompt + latest version
    const prompt = await adapter.getPromptByName(name);
    if (!prompt) {
      console.error(`\x1b[31mError:\x1b[0m Prompt "${name}" not found`);
      process.exitCode = 1;
      return;
    }

    const latest = await adapter.getLatestVersion(prompt.id);
    if (!latest) {
      console.error(`\x1b[31mError:\x1b[0m No versions found for "${name}"`);
      process.exitCode = 1;
      return;
    }

    // Load test cases
    const testCases = await adapter.listTestCases(prompt.id);
    if (testCases.length === 0) {
      console.log('\x1b[33m⚠\x1b[0m No test cases found. Create test cases first.');
      return;
    }

    // Resolve bundle
    const bundle: PromptBundle = latest.bundle ?? createBundleFromLegacy(latest.content);
    const modelStr = options.model ?? bundle.modelConfig.model;

    console.log(`\x1b[1mRunning ${testCases.length} test(s) for "${name}" v${latest.versionNumber}\x1b[0m`);
    console.log(`  \x1b[90mProvider: ${providerName}  Model: ${modelStr}\x1b[0m\n`);

    // Create provider and run evals
    const provider = createProvider(baseUrl, apiKey, modelStr);
    const results = await runEvaluations(provider, bundle, testCases);

    // Persist results locally
    const rowsToInsert = results
      .filter((r): r is Extract<typeof r, { ok: true }> => r.ok)
      .map((r) => ({
        versionId: latest.id,
        testCaseId: r.testCaseId,
        passed: r.result.passed,
        actualOutput: r.result.actualOutput,
        score: null,
      }));

    if (rowsToInsert.length > 0) {
      await adapter.bulkUpsertTestResults(rowsToInsert);
    }

    // Display results
    let passed = 0;
    let failed = 0;
    let errored = 0;

    for (const result of results) {
      const tc = testCases.find(t => t.id === result.testCaseId);
      const tcName = tc?.name ?? result.testCaseId;

      if (!result.ok) {
        errored++;
        console.log(`  \x1b[31m✗\x1b[0m ${tcName} — \x1b[31mError: ${result.message}\x1b[0m`);
      } else if (result.result.passed) {
        passed++;
        console.log(`  \x1b[32m✓\x1b[0m ${tcName} — ${result.result.reason}`);
      } else {
        failed++;
        console.log(`  \x1b[31m✗\x1b[0m ${tcName} — ${result.result.reason}`);
      }
    }

    console.log(`\n  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m  ${errored > 0 ? `\x1b[33m${errored} errors\x1b[0m` : ''}`);
  } finally {
    adapter.close();
  }
}
