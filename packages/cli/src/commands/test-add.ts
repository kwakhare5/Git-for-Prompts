/**
 * gitforprompts test-add — Add a test case to a local prompt.
 *
 * Usage:
 *   gitforprompts test-add <name> --test-name "Happy path" --input "user message" --criteria "should respond politely"
 *
 * After adding test cases, run:
 *   gitforprompts run <name> --provider openai --api-key sk-...
 */

import { getDbPath } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

interface TestAddOptions {
  testName?: string;
  input?: string;
  criteria?: string;
}

export async function cmdTestAdd(name: string, options: TestAddOptions): Promise<void> {
  if (!name) {
    console.error('\x1b[31mError:\x1b[0m Prompt name is required. Usage: gitforprompts test-add <name>');
    process.exitCode = 1;
    return;
  }

  if (!options.input) {
    console.error('\x1b[31mError:\x1b[0m --input is required. Example: --input "Hello, how do I cancel my order?"');
    process.exitCode = 1;
    return;
  }

  if (!options.criteria) {
    console.error('\x1b[31mError:\x1b[0m --criteria is required. Example: --criteria "should offer a refund option"');
    process.exitCode = 1;
    return;
  }

  const dbPath = getDbPath();
  const adapter = await createSqliteAdapter(dbPath);

  try {
    const prompt = await adapter.getPromptByName(name);
    if (!prompt) {
      console.error(`\x1b[31mError:\x1b[0m Prompt "${name}" not found. Run: gitforprompts add ${name} [content]`);
      process.exitCode = 1;
      return;
    }

    const testName = options.testName ?? `Test ${Date.now()}`;

    const testCase = await adapter.createTestCase({
      promptId: prompt.id,
      name: testName,
      inputText: options.input,
      expectedCriteria: options.criteria,
    });

    console.log(`\x1b[32m✓\x1b[0m Added test case: ${testCase.name}`);
    console.log(`  \x1b[90mInput:    ${testCase.inputText}\x1b[0m`);
    console.log(`  \x1b[90mCriteria: ${testCase.expectedCriteria}\x1b[0m`);
    console.log('');
    console.log(`\x1b[90mRun tests with: gitforprompts run ${name} --provider openai --api-key sk-...\x1b[0m`);
  } finally {
    adapter.close();
  }
}
