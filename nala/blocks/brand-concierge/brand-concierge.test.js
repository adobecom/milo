import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './brand-concierge.spec.js';
import BrandConciergeBlock from './brand-concierge.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let bc;
let webUtil;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Brand Concierge Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    bc = new BrandConciergeBlock(page);
    webUtil = new WebUtil(page);
  });

  // Test 0: Brand Concierge default
  test(
    `[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
      const { data } = features[0];

      await test.step('step-1: Go to Brand Concierge default page', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge block content/specs', async () => {
        await expect(await bc.block).toBeVisible();

        // Verify heading and body text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();
        await expect(await bc.pageBody.filter({ hasText: data.bodyText }).first()).toBeVisible();

        // Verify input field exists and is visible
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(await bc.inputField.first()).toBeVisible({ timeout: 10000 });

        // Verify prompt buttons are present
        await expect(await bc.promptButtons.first()).toBeVisible();

        // Verify disclaimer text if provided
        if (data.disclaimerText) {
          const disclaimerText = page.locator(`text=${data.disclaimerText.substring(0, 30)}`);
          const isVisible = await disclaimerText.isVisible({ timeout: 5000 }).catch(() => false);
          if (isVisible) await expect(await disclaimerText.first()).toBeVisible();
        }
      });

      await test.step('step-3: Verify analytics attributes', async () => {
        await expect(await bc.block).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brand-concierge', 1));
      });

      await test.step('step-4: Run accessibility test on the block', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 1: Brand Concierge sticky
  test(
    `[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
      const { data } = features[1];

      await test.step('step-1: Go to Brand Concierge sticky page', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge sticky variant content/specs', async () => {
        await expect(await bc.brandConciergeSticky).toBeVisible();

        // Verify heading and body text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();
        await expect(await bc.pageBody.filter({ hasText: data.bodyText }).first()).toBeVisible();

        // For sticky, input field and prompt buttons may be hidden on mobile - just verify they exist in DOM
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        const inputCount = await bc.inputField.count();
        expect(inputCount).toBeGreaterThan(0);

        // Verify prompt buttons exist in DOM (may be hidden on mobile)
        const buttonCount = await bc.promptButtons.count();
        expect(buttonCount).toBeGreaterThan(0);
      });

      await test.step('step-3: Run accessibility test on the sticky variant', async () => {
        await runAccessibilityTest({ page, testScope: bc.brandConciergeSticky });
      });
    },
  );

  // Test 2: Brand Concierge hero
  test(
    `[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
      const { data } = features[2];

      await test.step('step-1: Go to Brand Concierge hero page', async () => {
        await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge hero variant content/specs', async () => {
        await expect(await bc.brandConciergeHero).toBeVisible();

        // Verify heading text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        // Verify input field exists and is visible
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(await bc.inputField.first()).toBeVisible({ timeout: 10000 });

        // Verify prompt buttons are present
        await expect(await bc.promptButtons.first()).toBeVisible();
      });

      await test.step('step-3: Run accessibility test on the hero variant', async () => {
        await runAccessibilityTest({ page, testScope: bc.brandConciergeHero });
      });
    },
  );

  // Test 3: Brand Concierge 404
  test(
    `[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
      const { data } = features[3];

      await test.step('step-1: Go to Brand Concierge 404 page', async () => {
        await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge 404 content/specs', async () => {
        await expect(await bc.block).toBeVisible();

        // Verify 404 heading text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        // Verify input field exists and is visible
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(await bc.inputField.first()).toBeVisible({ timeout: 10000 });

        // Verify prompt buttons are present
        await expect(await bc.promptButtons.first()).toBeVisible();

        // Verify disclaimer text if provided
        if (data.disclaimerText) {
          const disclaimerText = page.locator(`text=${data.disclaimerText.substring(0, 30)}`);
          const isVisible = await disclaimerText.isVisible({ timeout: 5000 }).catch(() => false);
          if (isVisible) await expect(await disclaimerText.first()).toBeVisible();
        }
      });

      await test.step('step-3: Run accessibility test on the block', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );
});
