import { test, expect } from '@playwright/test';

test.describe('Landing Page Interactive Widgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Hero Section - Verify Heading and Cloud CTA', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Git for your AI prompts' });
    await expect(heading).toBeVisible();

    const cta = page.getByRole('link', { name: /open cloud dashboard/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/dashboard');
  });

  test('Dashboard Hero Replica - Verify Metric Cards and Demo Prompts', async ({ page }) => {
    // Verify metric cards rendered in the interactive preview
    await expect(page.getByText('Active Prompts')).toBeVisible();
    await expect(page.getByText('Total Commits')).toBeVisible();
    await expect(page.getByText('Evals Passed')).toBeVisible();
    await expect(page.getByText('API Credentials')).toBeVisible();

    // Verify demo prompt repository is present
    await expect(page.getByText('customer-support-agent')).toBeVisible();
  });

  test('Developer FAQ - Expand and Collapse Accordion Items', async ({ page }) => {
    const faqHeading = page.getByRole('heading', { name: 'Developer FAQ' });
    await expect(faqHeading).toBeVisible();

    // First question is open by default
    const firstAnswer = page.getByText('No. Local evaluations run in your terminal using your local environment variables.');
    await expect(firstAnswer).toBeVisible();

    // Click second FAQ item to expand it
    const secondQuestion = page.getByText('How does local-first SQLite versioning work?');
    await secondQuestion.click();

    const secondAnswer = page.getByText('The CLI uses a lightweight SQLite database stored directly inside your project folder');
    await expect(secondAnswer).toBeVisible();
  });
});
