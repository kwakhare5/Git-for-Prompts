/**
 * Config — .gfp/config.json reader/writer.
 *
 * The CLI stores its configuration in a `.gfp/` directory inside the
 * project root (wherever `gfp init` was run). The config file stores:
 *   - apiKey: for cloud sync (gfp push/pull)
 *   - baseUrl: cloud API base URL
 *   - defaultProvider: AI provider for local evals
 *   - defaultModel: AI model for local evals
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GfpConfig {
  apiKey?: string;
  baseUrl: string;
  defaultProvider?: string;
  defaultModel?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GFP_DIR = '.gfp';
const CONFIG_FILE = 'config.json';
const DB_FILE = 'bundles.db';
const DEFAULT_BASE_URL = 'https://gitforprompts.vercel.app';

// ─── Path helpers ────────────────────────────────────────────────────────────

/**
 * Find the .gfp directory by walking up from cwd.
 * Returns null if not found (project not initialized).
 */
export function findGfpRoot(startDir: string = process.cwd()): string | null {
  let dir = startDir;
  while (true) {
    const candidate = join(dir, GFP_DIR);
    if (existsSync(candidate)) return dir;
    const parent = join(dir, '..');
    if (parent === dir) return null; // reached filesystem root
    dir = parent;
  }
}

/**
 * Get the .gfp directory path for the current project.
 * Throws if not initialized.
 */
export function requireGfpDir(): string {
  const root = findGfpRoot();
  if (!root) {
    console.error('\x1b[31mError:\x1b[0m Not a gfp project. Run: gfp init');
    process.exit(1);
  }
  return join(root, GFP_DIR);
}

/** Path to the SQLite database file. */
export function getDbPath(gfpDir?: string): string {
  const dir = gfpDir ?? requireGfpDir();
  return join(dir, DB_FILE);
}

/** Path to the config file. */
export function getConfigPath(gfpDir?: string): string {
  const dir = gfpDir ?? requireGfpDir();
  return join(dir, CONFIG_FILE);
}

// ─── Init ────────────────────────────────────────────────────────────────────

/**
 * Initialize a .gfp directory in the current working directory.
 * Idempotent — won't overwrite existing config.
 */
export function initGfpDir(targetDir: string = process.cwd()): string {
  const gfpDir = join(targetDir, GFP_DIR);
  if (!existsSync(gfpDir)) {
    mkdirSync(gfpDir, { recursive: true });
  }

  const configPath = join(gfpDir, CONFIG_FILE);
  if (!existsSync(configPath)) {
    const defaultConfig: GfpConfig = { baseUrl: DEFAULT_BASE_URL };
    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), { mode: 0o600 });
  }

  return gfpDir;
}

// ─── Config CRUD ─────────────────────────────────────────────────────────────

export function loadConfig(gfpDir?: string): GfpConfig {
  const configPath = getConfigPath(gfpDir);
  if (!existsSync(configPath)) {
    return { baseUrl: DEFAULT_BASE_URL };
  }
  try {
    return JSON.parse(readFileSync(configPath, 'utf8')) as GfpConfig;
  } catch {
    return { baseUrl: DEFAULT_BASE_URL };
  }
}

export function saveConfig(config: GfpConfig, gfpDir?: string): void {
  const configPath = getConfigPath(gfpDir);
  writeFileSync(configPath, JSON.stringify(config, null, 2), { mode: 0o600 });
}

export function updateConfig(partial: Partial<GfpConfig>, gfpDir?: string): GfpConfig {
  const config = loadConfig(gfpDir);
  const updated = { ...config, ...partial };
  saveConfig(updated, gfpDir);
  return updated;
}
