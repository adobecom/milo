// Forge E2E tests -- runs against the Vite dev server (auto-started by
// playwright.forge.config.js). DEMO_MODE is always on in dev, so these tests
// exercise the full UI/UX workflow (input -> generate -> deploy) without needing
// a live backend or Anthropic API key. Each test is captured as a video.
//
// Run:
//   npm run nala:forge           # headless, video saved to test-results/forge/
//   npm run nala:forge:headed    # headed (default for local -- see config)
//   npm run nala:forge:ui        # Playwright UI mode (debug)

import { expect, test } from '@playwright/test';
import { features } from './forge.spec.js';
import ForgePage from './forge.page.js';

// Demo timeline: generation ~13s, deploy ~8s. Timeouts are per-step.
const GENERATION_TIMEOUT = 30 * 1000;
const DEPLOY_TIMEOUT = 20 * 1000;

test.describe('Forge -- end-to-end page generation (demo mode)', () => {
  // Test 0: URL source -> Reimagine (Stardust) -> pick a direction -> Send to Authoring
  test(
    `[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`,
    async ({ page, baseURL }) => {
      const forge = new ForgePage(page);

      // repoPath bypasses the ConnectConsumer modal; any non-empty value works in demo.
      await forge.seedDemoConfig({ repoPath: '/tmp/demo-repo' });

      await test.step('step-1: Load forge and verify the landing panel', async () => {
        await page.goto(`${baseURL}/tools/forge.html`);
        await page.waitForLoadState('domcontentloaded');
        await expect(forge.entryTitle).toBeVisible();
        await expect(forge.entryTitle).toContainText('real Adobe page');
        await expect(forge.urlDoor).toBeVisible();
        await expect(forge.figmaDoor).toBeVisible();
      });

      await test.step('step-2: Open URL door and enter a target page URL', async () => {
        await forge.openUrlDoor();
        await expect(forge.focusCard).toBeVisible();
        await forge.urlInput.fill(features[0].data.url);
        await expect(forge.generateBtn).toBeVisible();
        await expect(forge.generateBtn).toContainText('Reimagine');
      });

      await test.step('step-3: Start generation -- session transitions to active', async () => {
        await forge.generateBtn.click();
        await expect(forge.activeSession).toBeVisible({ timeout: 8 * 1000 });
        await expect(forge.generatingCard).toBeVisible({ timeout: 8 * 1000 });
      });

      await test.step('step-4: Stardust generates 3 directions -- gate verdict appears', async () => {
        await forge.waitForGate(GENERATION_TIMEOUT);
        await expect(forge.verdictGate).toContainText('Built, ready to send');
        // Reimagine flow: three direction cards, each with its own send button.
        await expect(forge.reimagineSendBtns).toHaveCount(3);
      });

      await test.step('step-5: Pick first direction and Send to Authoring', async () => {
        await forge.sendReimaginedVariant(DEPLOY_TIMEOUT);
        await expect(forge.verdictLive).toContainText('In Authoring, ready to edit');
      });
    },
  );

  // Test 1: Figma source -> Conformance -> Send to Authoring
  test(
    `[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`,
    async ({ page, baseURL }) => {
      const forge = new ForgePage(page);

      // figmaToken: Figma door opens directly (no OAuth modal).
      // repoPath: deploy proceeds without ConnectConsumer modal.
      await forge.seedDemoConfig({
        figmaToken: features[1].data.figmaToken,
        repoPath: '/tmp/demo-repo',
      });

      await test.step('step-1: Load forge with Figma pre-connected', async () => {
        await page.goto(`${baseURL}/tools/forge.html`);
        await page.waitForLoadState('domcontentloaded');
        await expect(forge.entryTitle).toBeVisible();
        await expect(page.locator('.pf-connected')).toBeVisible();
      });

      await test.step('step-2: Open Figma door -- frame URL is pre-filled', async () => {
        await forge.openFigmaDoor();
        await expect(forge.focusCard).toBeVisible();
        await expect(forge.figmaInput).toHaveValue(/figma\.com\/design/);
        await expect(forge.generateBtn).toBeVisible();
        await expect(forge.generateBtn).toContainText('Build my page');
      });

      await test.step('step-3: Start generation -- session transitions to active', async () => {
        await forge.generateBtn.click();
        await expect(forge.activeSession).toBeVisible({ timeout: 8 * 1000 });
        await expect(forge.generatingCard).toBeVisible({ timeout: 8 * 1000 });
      });

      await test.step('step-4: Generation completes -- gate verdict appears', async () => {
        await forge.waitForGate(GENERATION_TIMEOUT);
        await expect(forge.verdictGate).toContainText('Built, ready to send');
        await expect(forge.deployBtn).toBeVisible();
        await expect(forge.deployBtn).toContainText('Send to Authoring');
      });

      await test.step('step-5: Send to Authoring -- live verdict confirms delivery', async () => {
        await forge.sendToAuthoring(DEPLOY_TIMEOUT);
        await expect(forge.verdictLive).toContainText('In Authoring, ready to edit');
      });
    },
  );
});
