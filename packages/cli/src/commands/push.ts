/**
 * gfp push — Sync latest local bundle to cloud.
 *
 * Usage:
 *   gfp push <name>                Push latest local version to cloud
 *   gfp push <name> --cloud-id <id>  Target a specific cloud prompt ID
 *
 * Flow:
 *   1. Load local prompt + latest version
 *   2. Resolve cloud prompt ID (from local cache, --cloud-id flag, or name lookup)
 *   3. POST bundle (or content) to /api/v1/prompts/:id/versions
 *   4. Cache the cloud prompt ID locally for future pushes
 */

import { getDbPath, loadConfig } from '../config.js';
import { createSqliteAdapter } from '../db/sqlite.js';

interface PushOptions {
  cloudId?: string;
  message?: string;
}

type ApiResponse = Record<string, unknown>;

async function apiRequest(
  url: string,
  apiKey: string,
  method: 'GET' | 'POST',
  body?: unknown
): Promise<{ status: number; data: ApiResponse }> {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'gfp-cli/0.1.0',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
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

export async function cmdPush(name: string, options: PushOptions): Promise<void> {
  if (!name) {
    console.error('\x1b[31mError:\x1b[0m Prompt name is required. Usage: gfp push <name>');
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
    // 1. Load local prompt + latest version
    const prompt = await adapter.getPromptByName(name);
    if (!prompt) {
      console.error(`\x1b[31mError:\x1b[0m Prompt "${name}" not found locally. Run: gfp add <name>`);
      process.exit(1);
    }

    const latest = await adapter.getLatestVersion(prompt.id);
    if (!latest) {
      console.error(`\x1b[31mError:\x1b[0m No versions found for "${name}". Run: gfp add <name>`);
      process.exit(1);
    }

    // 2. Resolve cloud prompt ID
    let cloudPromptId = options.cloudId ?? prompt.cloudPromptId;

    if (!cloudPromptId) {
      // Try to look up by name
      console.log(`\x1b[90mLooking up cloud prompt by name "${name}"…\x1b[0m`);
      const lookupRes = await apiRequest(
        `${config.baseUrl}/api/v1/prompts?name=${encodeURIComponent(name)}`,
        config.apiKey,
        'GET'
      );

      if (lookupRes.status === 200) {
        cloudPromptId = lookupRes.data['promptId'] as string;
        console.log(`\x1b[90mFound cloud prompt: ${cloudPromptId}\x1b[0m`);
      } else if (lookupRes.status === 404) {
        // Auto-create the cloud prompt
        console.log(`\x1b[90mPrompt "${name}" not found in cloud. Creating it…\x1b[0m`);
        const createRes = await apiRequest(
          `${config.baseUrl}/api/v1/prompts`,
          config.apiKey,
          'POST',
          { name }
        );

        if (createRes.status === 201) {
          cloudPromptId = createRes.data['promptId'] as string;
          console.log(`\x1b[32m✓\x1b[0m Created cloud prompt: ${name} (${cloudPromptId})`);
        } else if (createRes.status === 401) {
          console.error('\x1b[31mError:\x1b[0m API key invalid or expired. Run: gfp auth <api-key>');
          process.exit(1);
        } else if (createRes.status === 409) {
          // Race condition: someone else created it. Try lookup again.
          const retryRes = await apiRequest(
            `${config.baseUrl}/api/v1/prompts?name=${encodeURIComponent(name)}`,
            config.apiKey,
            'GET'
          );
          if (retryRes.status === 200) {
            cloudPromptId = retryRes.data['promptId'] as string;
          } else {
            console.error(`\x1b[31mError:\x1b[0m Could not create or find cloud prompt. Try: gfp push ${name} --cloud-id <id>`);
            process.exit(1);
          }
        } else {
          console.error(`\x1b[31mError:\x1b[0m Failed to create cloud prompt ${createRes.status}: ${JSON.stringify(createRes.data)}`);
          process.exit(1);
        }
      } else if (lookupRes.status === 401) {
        console.error('\x1b[31mError:\x1b[0m API key invalid or expired. Run: gfp auth <api-key>');
        process.exit(1);
      } else {
        console.error(`\x1b[31mError:\x1b[0m API error ${lookupRes.status}: ${JSON.stringify(lookupRes.data)}`);
        process.exit(1);
      }
    }

    // 3. POST the bundle (or content for V1 fallback)
    console.log(`\x1b[90mPushing v${latest.versionNumber} → cloud prompt ${cloudPromptId}…\x1b[0m`);

    const pushBody: Record<string, unknown> = {
      commitMessage: options.message ?? latest.commitMessage ?? undefined,
    };

    if (latest.bundle) {
      pushBody['bundle'] = latest.bundle;
    } else {
      pushBody['content'] = latest.content;
    }

    const pushRes = await apiRequest(
      `${config.baseUrl}/api/v1/prompts/${cloudPromptId}/versions`,
      config.apiKey,
      'POST',
      pushBody
    );

    if (pushRes.status === 201) {
      const cloudVersion = pushRes.data['versionNumber'] as number;
      console.log(`\x1b[32m✓\x1b[0m Pushed as cloud v${cloudVersion}`);

      // 4. Cache cloud prompt ID locally
      adapter.setCloudPromptId(prompt.id, cloudPromptId);
      console.log(`\x1b[90mCloud prompt ID cached for future pushes\x1b[0m`);
    } else if (pushRes.status === 401) {
      console.error('\x1b[31mError:\x1b[0m API key invalid or expired. Run: gfp auth <api-key>');
      process.exit(1);
    } else {
      console.error(`\x1b[31mError:\x1b[0m Push failed ${pushRes.status}: ${JSON.stringify(pushRes.data)}`);
      process.exit(1);
    }
  } finally {
    adapter.close();
  }
}
