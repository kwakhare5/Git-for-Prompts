/**
 * §7.2 — E2E tests for authenticated dashboard flows.
 *
 * These tests require:
 * 1. A running Next.js dev server (`pnpm dev`)
 * 2. A test Clerk user logged in via environment variables:
 *    E2E_TEST_EMAIL / E2E_TEST_PASSWORD in .env.local
 *
 * Run: npx playwright test e2e/dashboard.spec.ts
 *
 * Flow tested:
 * - Sign in through Clerk
 * - Create a new prompt from the dashboard
 * - Verify it appears in the prompt grid
 * - Open the prompt → write first version → save
 * - Verify version badge shows v1
 * - Two-step delete confirmation on API key revoke
 * - Sign out
 */

import { test, expect, type Page } from '@playwright/test';

// ─── Auth helpers ─────────────────────────────────────────────────────────────

async function signIn(page: Page) {
  await page.goto('/sign-in');

  // Clerk hosted sign-in form
  await page.getByLabel('Email address').fill(process.env.E2E_TEST_EMAIL ?? 'test@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByLabel('Password').fill(process.env.E2E_TEST_PASSWORD ?? 'testpassword');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Should redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 15_000 });
}

async function signOut(page: Page) {
  // Clerk user button → sign out
  const userBtn = page.locator('[data-locator="user-button"]').or(page.locator('[aria-label="Open user button"]'));
  await userBtn.click();
  const signOutBtn = page.getByRole('menuitem', { name: /sign out/i }).or(page.getByText(/sign out/i));
  await signOutBtn.click();
  await page.waitForURL('/', { timeout: 10_000 });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Dashboard — Prompt CRUD', () => {
  const PROMPT_NAME = `E2E Test Prompt ${Date.now()}`;
  let promptUrl: string;

  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test.afterEach(async ({ page }) => {
    await signOut(page).catch(() => {}); // best-effort cleanup
  });

  test('creates a new prompt and it appears in the grid', async ({ page }) => {
    await page.goto('/dashboard');

    // Open "New Prompt" modal / page
    await page.getByRole('link', { name: /new prompt/i }).click();

    // Fill in name and optional description
    await page.getByLabel(/name/i).fill(PROMPT_NAME);
    await page.getByLabel(/description/i).fill('Created by E2E test');

    // Submit
    await page.getByRole('button', { name: /create/i }).click();

    // Should redirect to the new prompt's detail page
    await page.waitForURL('**/dashboard/prompts/**', { timeout: 10_000 });
    promptUrl = page.url();

    expect(page.url()).toContain('/dashboard/prompts/');
    await expect(page.getByRole('heading', { name: PROMPT_NAME })).toBeVisible();
  });

  test('saves a new version and shows v1 badge', async ({ page }) => {
    // Navigate to the prompt created in the previous test
    await page.goto(promptUrl ?? '/dashboard');

    // Click "New Version" to open the editor
    await page.getByRole('link', { name: /new version/i }).click();
    await page.waitForURL('**/edit', { timeout: 5_000 });

    // Type content into Monaco (Monaco uses .view-lines for content area)
    const editorContainer = page.locator('.monaco-editor').first();
    await editorContainer.click();
    await page.keyboard.type('You are an E2E test assistant. Always respond helpfully.');

    // Save
    await page.getByRole('button', { name: /save/i }).click();

    // Should redirect back to prompt detail
    await page.waitForURL('**/dashboard/prompts/**', { timeout: 10_000 });

    // Version badge should show v1
    await expect(page.locator('span').filter({ hasText: /^v1$/ })).toBeVisible();

    // Version history sidebar should say "1 version"
    await expect(page.getByText(/1 version/i)).toBeVisible();
  });

  test('version history sidebar shows total count accurately', async ({ page }) => {
    await page.goto(promptUrl ?? '/dashboard');
    await expect(page.getByText(/version/i)).toBeVisible();
    // The count displayed should be a number (not "0 versions" since we saved v1)
    await expect(page.locator('span.tabular-nums')).not.toHaveText('0 versions');
  });

  test('dashboard prompt grid shows the new prompt', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(PROMPT_NAME)).toBeVisible();
  });
});

test.describe('Dashboard — API Keys', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test.afterEach(async ({ page }) => {
    await signOut(page).catch(() => {});
  });

  test('generates a new API key and shows the full key once', async ({ page }) => {
    await page.goto('/dashboard/api-keys');

    // Fill key name
    await page.getByPlaceholder(/key name/i).fill('E2E Test Key');
    await page.getByRole('button', { name: /generate/i }).click();

    // Full key should be shown (starts with gfp_live_)
    await expect(page.getByText(/gfp_live_/)).toBeVisible();

    // Copy button should be present
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('two-step revoke: first click shows confirmation, second executes', async ({ page }) => {
    await page.goto('/dashboard/api-keys');

    // Find a Revoke button (there should be at least one from the previous test or existing keys)
    const revokeBtn = page.getByRole('button', { name: /revoke/i }).first();

    // Bail if no keys exist — graceful skip
    const count = await revokeBtn.count();
    test.skip(count === 0, 'No API keys to test revoke flow with');

    // First click: should show "Revoke key?" confirmation
    await revokeBtn.click();
    await expect(page.getByText(/revoke key\?/i)).toBeVisible();

    // "Cancel" should dismiss confirmation without deleting
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByText(/revoke key\?/i)).not.toBeVisible();

    // First click again, then Confirm
    await revokeBtn.click();
    await expect(page.getByText(/revoke key\?/i)).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();

    // Confirmation UI should disappear after revoke
    await expect(page.getByText(/revoke key\?/i)).not.toBeVisible();
  });
});

test.describe('Dashboard — Version History Indicator', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test.afterEach(async ({ page }) => {
    await signOut(page).catch(() => {});
  });

  test('does not show truncation notice when under the limit', async ({ page }) => {
    await page.goto('/dashboard');

    // Open first available prompt
    const firstCard = page.locator('a').filter({ hasText: /view|open/i }).first();
    const cardCount = await firstCard.count();
    test.skip(cardCount === 0, 'No prompts available for history test');

    await firstCard.click();
    await page.waitForURL('**/dashboard/prompts/**');

    // Truncation notice should NOT be visible for prompts with few versions
    await expect(page.getByText(/oldest versions not shown/i)).not.toBeVisible();
  });
});
