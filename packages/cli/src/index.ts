#!/usr/bin/env node
/**
 * gfp — Git for Prompts CLI
 *
 * Commands:
 *   gfp auth                    Save your API key
 *   gfp list                    List all your prompts
 *   gfp pull <promptId>         Download latest prompt to <name>.prompt
 *   gfp push <promptId> <file>  Push a file as a new version
 *
 * Config: ~/.gfp/config.json  (API key + base URL)
 *
 * Zero runtime dependencies — uses only Node.js built-ins.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import * as https from 'https';
import * as http from 'http';
import * as readline from 'readline';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONFIG_DIR = join(homedir(), '.gfp');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');

interface Config {
  apiKey: string;
  baseUrl: string;
}

function loadConfig(): Config | null {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as Config;
  } catch {
    return null;
  }
}

function saveConfig(config: Config): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
}

function requireConfig(): Config {
  const config = loadConfig();
  if (!config) {
    die('Not authenticated. Run: gfp auth');
  }
  return config!;
}

// ─── HTTP helper ─────────────────────────────────────────────────────────────

function request(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string }
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;

    const req = transport.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: options.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'gfp-cli/0.1.0',
          ...(options.headers ?? {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
      }
    );

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function apiGet(path: string, config: Config): Promise<unknown> {
  const res = await request(`${config.baseUrl}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
  });
  if (res.status === 401) die('API key invalid or expired. Run: gfp auth');
  if (res.status >= 400) die(`API error ${res.status}: ${res.body}`);
  return JSON.parse(res.body);
}

async function apiPost(path: string, body: unknown, config: Config): Promise<unknown> {
  const res = await request(`${config.baseUrl}/api/v1${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify(body),
  });
  if (res.status === 401) die('API key invalid or expired. Run: gfp auth');
  if (res.status >= 400) die(`API error ${res.status}: ${res.body}`);
  return JSON.parse(res.body);
}

// ─── Prompts ─────────────────────────────────────────────────────────────────

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function die(msg: string): never {
  console.error(`\x1b[31mError:\x1b[0m ${msg}`);
  process.exit(1);
}

function ok(msg: string): void {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`);
}

function info(msg: string): void {
  console.log(`\x1b[90m${msg}\x1b[0m`);
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdAuth(): Promise<void> {
  const existing = loadConfig();
  const baseUrl = await prompt(
    `Base URL [${existing?.baseUrl ?? 'https://gitforprompts.vercel.app'}]: `
  );
  const apiKey = await prompt('API key (gfp_live_...): ');

  if (!apiKey.startsWith('gfp_live_')) die('API key must start with gfp_live_');

  const url = (baseUrl.trim() || existing?.baseUrl || 'https://gitforprompts.vercel.app').replace(/\/$/, '');
  saveConfig({ apiKey, baseUrl: url });
  ok(`Authenticated. Config saved to ${CONFIG_PATH}`);
}

async function cmdList(): Promise<void> {
  const config = requireConfig();
  info('Fetching prompts…');

  // Note: this endpoint needs to be added — for now list is based on what API exposes
  // Placeholder — full list endpoint is a future API addition
  console.log('');
  console.log('\x1b[33mNote:\x1b[0m The list API endpoint is not yet implemented in the server.');
  console.log('To pull a prompt, you need its promptId from the dashboard URL:');
  console.log('  https://gitforprompts.com/dashboard/prompts/<promptId>');
  console.log('');
  console.log('Then run: gfp pull <promptId>');
  void config;
}

async function cmdPull(promptId: string): Promise<void> {
  if (!promptId) die('Usage: gfp pull <promptId>');
  const config = requireConfig();
  info(`Pulling prompt ${promptId}…`);

  const data = await apiGet(`/prompts/${promptId}/latest`, config) as {
    promptName: string;
    versionNumber: number;
    content: string;
    variables: string[];
    commitMessage: string | null;
  };

  // Sanitize filename
  const filename = `${data.promptName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.prompt`;
  writeFileSync(filename, data.content, 'utf8');

  ok(`Pulled: ${filename}`);
  info(`  Version: v${data.versionNumber}`);
  if (data.commitMessage) info(`  Message: ${data.commitMessage}`);
  if (data.variables.length > 0) info(`  Variables: ${data.variables.map((v) => `{{${v}}}`).join(', ')}`);
}

async function cmdPush(promptId: string, filePath: string): Promise<void> {
  if (!promptId || !filePath) die('Usage: gfp push <promptId> <file>');
  if (!existsSync(filePath)) die(`File not found: ${filePath}`);

  const config = requireConfig();
  const content = readFileSync(filePath, 'utf8');
  const commitMessage = await prompt('Commit message (optional): ');

  info(`Pushing ${filePath} to prompt ${promptId}…`);

  const data = await apiPost(`/prompts/${promptId}/versions`, {
    content,
    commitMessage: commitMessage || undefined,
  }, config) as { versionNumber: number };

  ok(`Pushed as v${data.versionNumber}`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const [, , cmd, ...args] = process.argv;

  switch (cmd) {
    case 'auth':
      await cmdAuth();
      break;
    case 'list':
      await cmdList();
      break;
    case 'pull':
      await cmdPull(args[0]);
      break;
    case 'push':
      await cmdPush(args[0], args[1]);
      break;
    default:
      console.log(`
\x1b[1mgfp\x1b[0m — Git for Prompts CLI

\x1b[33mCommands:\x1b[0m
  gfp auth                    Authenticate with your API key
  gfp list                    List your prompts
  gfp pull <promptId>         Download latest version to <name>.prompt
  gfp push <promptId> <file>  Push file as a new version

\x1b[33mExamples:\x1b[0m
  gfp auth
  gfp pull abc-123-def
  gfp push abc-123-def customer-support.prompt
`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
