/**
 * gfp auth — Save API key for cloud sync.
 *
 * Usage:
 *   gfp auth <api-key>                  Save key with default base URL
 *   gfp auth <api-key> --url <base>     Save key with custom base URL
 */

import { updateConfig, requireGfpDir } from '../config.js';

interface AuthOptions {
  url?: string;
}

export function cmdAuth(apiKey: string, options: AuthOptions): void {
  if (!apiKey) {
    console.error('\x1b[31mError:\x1b[0m API key is required. Usage: gfp auth <api-key>');
    process.exit(1);
  }

  if (!apiKey.startsWith('gfp_live_')) {
    console.error('\x1b[31mError:\x1b[0m API key must start with gfp_live_');
    process.exit(1);
  }

  const gfpDir = requireGfpDir();
  const config = updateConfig(
    {
      apiKey,
      ...(options.url ? { baseUrl: options.url } : {}),
    },
    gfpDir
  );

  console.log('\x1b[32m✓\x1b[0m API key saved');
  console.log(`  \x1b[90mBase URL: ${config.baseUrl}\x1b[0m`);
  console.log('');
  console.log('You can now sync with:');
  console.log('  gfp push <name>   Sync local → cloud');
  console.log('  gfp pull <name>   Sync cloud → local');
}
