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

const GITFORPROMPTS_DIR = '.gitforprompts';
const LEGACY_GFP_DIR = '.gfp';
const CONFIG_FILE = 'config.json';
const DB_FILE = 'bundles.db';
const DEFAULT_BASE_URL = 'https://gitforprompts.vercel.app';

// ─── Path helpers ────────────────────────────────────────────────────────────

/**
 * Find the .gitforprompts (or legacy .gfp) directory by walking up from cwd.
 * Returns { root, dirName } or null if not found (project not initialized).
 */
function findProjectRoot(startDir: string = process.cwd()): { root: string; dirName: string } | null {
  let dir = startDir;
  while (true) {
    const candidate = join(dir, GITFORPROMPTS_DIR);
    if (existsSync(candidate)) return { root: dir, dirName: GITFORPROMPTS_DIR };
    const legacyCandidate = join(dir, LEGACY_GFP_DIR);
    if (existsSync(legacyCandidate)) return { root: dir, dirName: LEGACY_GFP_DIR };
    const parent = join(dir, '..');
    if (parent === dir) return null; // reached filesystem root
    dir = parent;
  }
}

/**
 * Get the project directory path (.gitforprompts or legacy .gfp) for the current project.
 * Throws if not initialized.
 */
export function requireGfpDir(): string {
  const found = findProjectRoot();
  if (!found) {
    console.error('\x1b[31mError:\x1b[0m Not a gitforprompts project. Run: gitforprompts init');
    process.exit(1);
  }
  return join(found.root, found.dirName);
}

/** Path to the SQLite database file. */
export function getDbPath(projectDir?: string): string {
  const dir = projectDir ?? requireGfpDir();
  return join(dir, DB_FILE);
}

/** Path to the config file. */
function getConfigPath(projectDir?: string): string {
  const dir = projectDir ?? requireGfpDir();
  return join(dir, CONFIG_FILE);
}

// ─── Init ────────────────────────────────────────────────────────────────────

/**
 * Initialize a .gitforprompts directory in the current working directory.
 * Idempotent — won't overwrite existing config.
 */
export function initGfpDir(targetDir: string = process.cwd()): string {
  const legacyDir = join(targetDir, LEGACY_GFP_DIR);
  const primaryDir = join(targetDir, GITFORPROMPTS_DIR);
  const projectDir = existsSync(legacyDir) ? legacyDir : primaryDir;

  if (!existsSync(projectDir)) {
    mkdirSync(projectDir, { recursive: true });
  }

  const configPath = join(projectDir, CONFIG_FILE);
  if (!existsSync(configPath)) {
    const defaultConfig: GfpConfig = { baseUrl: DEFAULT_BASE_URL };
    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), { mode: 0o600 });
  }

  return projectDir;
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

function saveConfig(config: GfpConfig, gfpDir?: string): void {
  const configPath = getConfigPath(gfpDir);
  writeFileSync(configPath, JSON.stringify(config, null, 2), { mode: 0o600 });
}

export function updateConfig(partial: Partial<GfpConfig>, gfpDir?: string): GfpConfig {
  const config = loadConfig(gfpDir);
  const updated = { ...config, ...partial };
  saveConfig(updated, gfpDir);
  return updated;
}
