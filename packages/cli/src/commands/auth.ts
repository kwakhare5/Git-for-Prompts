/**
 * gitforprompts auth — Save API key for cloud sync.
 *
 * Usage:
 *   gitforprompts auth <api-key>                  Save key with default base URL
 *   gitforprompts auth <api-key> --url <base>     Save key with custom base URL
 */

import { updateConfig, requireGfpDir } from '../config.js';

interface AuthOptions {
  url?: string;
}

export function cmdAuth(apiKey: string, options: AuthOptions): void {
  if (!apiKey) {
    console.error('\x1b[31mError:\x1b[0m API key is required. Usage: gitforprompts auth <api-key>');
    process.exitCode = 1;
    return;
  }

  if (!apiKey.startsWith('gfp_live_')) {
    console.error('\x1b[31mError:\x1b[0m API key must start with gfp_live_');
    process.exitCode = 1;
    return;
  }

  const projectDir = requireGfpDir();
  const config = updateConfig(
    {
      apiKey,
      ...(options.url ? { baseUrl: options.url } : {}),
    },
    projectDir
  );

  console.log('\x1b[32m✓\x1b[0m API key saved');
  console.log(`  \x1b[90mBase URL: ${config.baseUrl}\x1b[0m`);
  console.log('');
  console.log('You can now sync with:');
  console.log('  gitforprompts push <name>   Sync local → cloud');
  console.log('  gitforprompts pull <name>   Sync cloud → local');
}
