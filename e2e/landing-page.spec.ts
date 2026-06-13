import { test, expect } from '@playwright/test';

test.describe('Landing Page Interactive Widgets', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local server
    await page.goto('/');
  });

  test('SDK Section - Switch Tabs and Update Code Content', async ({ page }) => {
    const codeBlock = page.locator('pre');
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText('import { GFPClient }');

    // Click Go SDK Tab
    const goTab = page.getByRole('button', { name: 'Go SDK', exact: true });
    await goTab.click();
    await expect(codeBlock).toContainText('gfp.NewClient');

    // Click Python Tab
    const pythonTab = page.getByRole('button', { name: 'Python', exact: true });
    await pythonTab.click();
    await expect(codeBlock).toContainText('GFPClient(');

    // Click cURL Tab
    const curlTab = page.getByRole('button', { name: 'cURL', exact: true });
    await curlTab.click();
    await expect(codeBlock).toContainText('curl -X GET');
  });

  test('Git Tree SVG Explorer - Click Nodes and View Prompt Details', async ({ page }) => {
    // Ensure "Branching Commits" tab is active (it is default, but let's be explicit)
    await page.getByRole('button', { name: 'Branching Commits' }).click();

    // Click Node v1 group container instead of text to avoid overlapping circle interceptions
    const v1Group = page.locator('g.node-v1');
    await v1Group.click();

    // Check if the Git Tree inspector is now visible
    const inspector = page.locator('div:has-text("Prompt Inspector")').first();
    await expect(inspector).toBeVisible();
    await expect(inspector).toContainText('v1');
    await expect(inspector).toContainText('Initial prompt draft');

    // Click Node v2 group container
    const v2Group = page.locator('g.node-v2');
    await v2Group.click();
    await expect(inspector).toContainText('v2');
    await expect(inspector).toContainText('feat: add refund check');
  });

  test('Test Pipeline - Switch Scenario and Update Assertions', async ({ page }) => {
    // 1. Activate the Automated Test Runner tab first so the Pipeline Graphic is rendered
    await page.getByRole('button', { name: 'Automated Test Runner' }).click();

    // 2. Now search for the scenario check buttons inside the graphic
    const damagedReturnsBtn = page.getByRole('button', { name: 'Damaged Returns Check', exact: true });
    const lateShipmentBtn = page.getByRole('button', { name: 'Late Shipment Check', exact: true });

    await expect(damagedReturnsBtn).toBeVisible();
    await expect(lateShipmentBtn).toBeVisible();

    // Click Late Shipment Check Scenario
    await lateShipmentBtn.click();
    await expect(page.locator('text=shipment_v1')).toBeVisible();

    // Click Damaged Returns Check Scenario back
    await damagedReturnsBtn.click();
    await expect(page.locator('text=returns_v2')).toBeVisible();
  });
});
