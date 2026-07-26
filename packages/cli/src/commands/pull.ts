/**
 * gfp pull — Sync latest cloud version to local SQLite.
 *
 * Usage:
 *   gfp pull <name>                Pull latest cloud version by name
 *   gfp pull <name> --cloud-id <id>  Target a specific cloud prompt ID
 *
 * Flow:
 *   1. Resolve cloud prompt ID (from local cache, --cloud-id flag, or name lookup)
 *   2. GET /api/v1/prompts/:id/latest
 *   3. If local prompt doesn't exist, create it
 *   4. Insert cloud version as new local version
 *   5. Cache cloud prompt ID
 */

import { validateBundle, extractContentFromBundle, extractBundleVariables, extractVariables } from '@gfp/core';
import { getDbPath, loadConfig } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

interface PullOptions {
  cloudId?: string;
}

type ApiResponse = Record<string, unknown>;

async function apiRequest(
  url: string,
  apiKey: string,
): Promise<{ status: number; data: ApiResponse }> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': 'gfp-cli/0.2.0',
    },
  });

  const text = await res.text();
  let data: ApiResponse;
  try {
    data = JSON.parse(text) as ApiResponse;
  } catch {
    data = { raw: text };
  }

  return { status: res.status, data };
}

export async function cmdPull(name: string, options: PullOptions): Promise<void> {
  if (!name) {
    console.error('\x1b[31mError:\x1b[0m Prompt name is required. Usage: gfp pull <name>');
    process.exit(1);
  }

  const config = loadConfig();
  if (!config.apiKey) {
    console.error('\x1b[31mError:\x1b[0m No API key. Run: gfp auth <api-key>');
    process.exit(1);
  }

  const dbPath = getDbPath();
  const adapter = await createSqliteAdapter(dbPath);

  try {
    // 1. Get or look up local prompt to find cloudPromptId
    const localPrompt = await adapter.getPromptByName(name);
    let cloudPromptId = options.cloudId ?? localPrompt?.cloudPromptId;

    if (!cloudPromptId) {
      // Look up by name in cloud
      console.log(`\x1b[90mLooking up cloud prompt by name "${name}"…\x1b[0m`);
      const lookupRes = await apiRequest(
        `${config.baseUrl}/api/v1/prompts?name=${encodeURIComponent(name)}`,
        config.apiKey
      );

      if (lookupRes.status === 200) {
        cloudPromptId = lookupRes.data['promptId'] as string;
        console.log(`\x1b[90mFound cloud prompt: ${cloudPromptId}\x1b[0m`);
      } else if (lookupRes.status === 404) {
        console.error(`\x1b[31mError:\x1b[0m Prompt "${name}" not found in cloud.`);
        console.error('Check the dashboard or provide the cloud prompt ID directly:');
        console.error(`  gfp pull ${name} --cloud-id <your-cloud-prompt-id>`);
        process.exit(1);
      } else if (lookupRes.status === 401) {
        console.error('\x1b[31mError:\x1b[0m API key invalid or expired. Run: gfp auth <api-key>');
        process.exit(1);
      } else {
        console.error(`\x1b[31mError:\x1b[0m API error ${lookupRes.status}: ${JSON.stringify(lookupRes.data)}`);
        process.exit(1);
      }
    }

    // 2. Fetch latest version from cloud
    console.log(`\x1b[90mFetching latest version from cloud…\x1b[0m`);
    const res = await apiRequest(
      `${config.baseUrl}/api/v1/prompts/${cloudPromptId}/latest`,
      config.apiKey
    );

    if (res.status === 401) {
      console.error('\x1b[31mError:\x1b[0m API key invalid or expired. Run: gfp auth <api-key>');
      process.exit(1);
    }
    if (res.status === 404) {
      console.error(`\x1b[31mError:\x1b[0m Cloud prompt has no versions yet.`);
      process.exit(1);
    }
    if (res.status !== 200) {
      console.error(`\x1b[31mError:\x1b[0m Pull failed ${res.status}: ${JSON.stringify(res.data)}`);
      process.exit(1);
    }

    // 3. Parse cloud response
    const cloudBundle = res.data['bundle']
      ? validateBundle(res.data['bundle'])
      : undefined;

    const cloudContent = cloudBundle
      ? extractContentFromBundle(cloudBundle)
      : (res.data['content'] as string);

    const cloudVariables = cloudBundle
      ? extractBundleVariables(cloudBundle)
      : extractVariables(cloudContent);

    const cloudVersionNumber = res.data['versionNumber'] as number;
    const cloudCommitMessage = (res.data['commitMessage'] as string) ?? null;

    // 4. Get or create local prompt
    let prompt = localPrompt;
    if (!prompt) {
      prompt = await adapter.createPrompt({
        name,
        description: null,
        currentVersionId: null,
      });
      console.log(`\x1b[32m✓\x1b[0m Created local prompt: ${name}`);
    }

    // Get local version count to assign next version number
    const localVersions = await adapter.listVersions(prompt.id);
    const nextLocalVersion = (localVersions[0]?.versionNumber ?? 0) + 1;

    // 5. Insert cloud version locally
    const version = await adapter.insertVersion({
      promptId: prompt.id,
      versionNumber: nextLocalVersion,
      content: cloudContent,
      bundle: cloudBundle ?? null,
      commitMessage: cloudCommitMessage
        ? `[cloud v${cloudVersionNumber}] ${cloudCommitMessage}`
        : `[cloud v${cloudVersionNumber}]`,
      variables: cloudVariables,
      createdBy: 'cloud',
    });

    // 6. Cache cloud prompt ID
    adapter.setCloudPromptId(prompt.id, cloudPromptId);

    console.log(`\x1b[32m✓\x1b[0m Pulled cloud v${cloudVersionNumber} → local v${version.versionNumber}`);
    if (cloudVariables.length > 0) {
      console.log(`  \x1b[90mVariables: ${cloudVariables.map(v => `{{${v}}}`).join(', ')}\x1b[0m`);
    }
    if (cloudBundle) {
      console.log(`  \x1b[90mModel: ${cloudBundle.modelConfig.provider}/${cloudBundle.modelConfig.model}\x1b[0m`);
    }
  } finally {
    adapter.close();
  }
}
