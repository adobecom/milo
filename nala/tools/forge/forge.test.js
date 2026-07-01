// Forge E2E tests -- two modes via FORGE_TEST_MODE env var:
//
//   demo (default)  Vite dev + demoApi fixtures. ~30s, no backend needed.
//                  Covers the full UI/UX flow. Good for fast iteration.
//
//   real            Vite dev with DEMO_MODE=false + live milo-logs-deploy.
//                  Sessions take 20-30 min. Needs ANTHROPIC_API_KEY set on
//                  the backend. Use FORGE_SERVER_URL to point at the backend
//                  (default http://localhost:8080).
//
// Run:
//   npm run nala:forge                          # demo mode
//   FORGE_TEST_MODE=real npm run nala:forge   # real backend

import { expect, test } from '@playwright/test';
import { features } from './forge.spec.js';
import ForgePage from './forge.page.js';

const MODE = process.env.FORGE_TEST_MODE || 'demo';
const isReal = MODE === 'real';

const SERVER_URL = process.env.FORGE_SERVER_URL || 'http://localhost:8080';

const GENERATION_TIMEOUT = isReal ? 32 * 60 * 1000 : 30 * 1000;
const DEPOY_TIMEOUT = isReal ? 5 * 60 * 1000 : 20 * 1000;

async function seedConfig(forge, { serverUrl = '' } = {}) {
  await forge.seedDemoConfig({
    repoPath: '/tmp/demo-repo',
    consumerPreviewUrl: 'http://localhost:3000',
    serverUrl: serverUrl || (isReal ? SERVER_URL : ''),
  });
}

test.describe(`Forge -- end-to-end page generation (${MODE} mode)`, () => {
  // Test 0: URL source -> Reimagine -> Send to Authoring
  test(
    `[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`,
    async ({ page, baseURL }) => {
      const forge = new ForgePage(page);
      await seedConfig(forge);
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
        await expect(forge.activeSession).toBeVisible({ timeout: 10 * 1000 });
        await expect(forge.generatingCard).toBeVisible({ timeout: 10 * 1000 });
      });
      await test.step('step-4: Generation completes -- gate verdict appears', async () => {
        await forge.waitForGate(GENERATION_TIMEOUT);
        await expect(forge.verdictGate).toContainText('Built, ready to send');
        if (!isReal) {
          await expect(forge.reimagineSendBtns).toHaveCount(3);
        } else {
          await expect(forge.reimagineSendBtns.first()).toBeVisible();
        }
      });
      await test.step('step-5: Pick first direction and Send to Authoring', async () => {
        await forge.sendReimaginedVariant(DEPOY_TIMEOUT);
        await expect(forge.verdictLive).toContainText('In Authoring, ready to edit');
      });
    },
  );

  // Test 1: Figma source -> Conformance -> Send to Authoring
  test(
    `[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`,
    async ({ page, baseURL }) => {
      const forge = new ForgePage(page);
      await seedConfig(forge);
      await test.step('step-1: Load forge', async () => {
        await page.goto(`${baseURL}/tools/forge.html`);
        await page.waitForLoadState('domcontentloaded');
        await expect(forge.entryTitle).toBeVisible();
      });
      await test.step('step-2: Open Figma door -- frame URL is pre-filled', async () => {
        await forge.openFigmaDoor();
        await expect(forge.focusCard).toBeVisible();
        if (isReal && process.env.FORGE_FIGMA_URL) {
          await forge.figmaInput.fill(process.env.FORGE_FIGMA_URL);
        }
        await expect(forge.figmaInput).toHaveValue(/figma\.com\/design/);
        await expect(forge.generateBtn).toContainText('Build my page');
      });
      await test.step('step-3: Start generation -- session transitions to active', async () => {
        await forge.generateBtn.click();
        await expect(forge.activeSession).toBeVisible({ timeout: 10 * 1000 });
        await expect(forge.generatingCard).toBeVisible({ timeout: 10 * 1000 });
      });
      await test.step('step-4: Generation completes -- gate verdict appears', async () => {
        await forge.waitForGate(GENERATION_TIMEOUT);
        await expect(forge.verdictGate).toContainText('Built, ready to send');
        await expect(forge.deployBtn).toBeVisible();
        await expect(forge.deployBtn).toContainText('Send to Authoring');
      });
      await test.step('step-5: Send to Authoring -- live verdict confirms delivery', async () => {
        await forge.sendToAuthoring(DEPOY_TIMEOUT);
        await expect(forge.verdictLive).toContainText('In Authoring, ready to edit');
      });
    },
  );
});
 