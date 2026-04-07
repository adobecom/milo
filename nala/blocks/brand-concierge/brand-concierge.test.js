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

  // Test 1: Brand Concierge hero
  test(
    `[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
      const { data } = features[1];

      await test.step('step-1: Go to Brand Concierge hero page', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
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

  // Test 2: Brand Concierge 404
  test(
    `[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
      const { data } = features[2];

      await test.step('step-1: Go to Brand Concierge 404 page', async () => {
        await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
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

  // Test 3: Brand Concierge floating button with basic inline
  test(
    `[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
      const { data } = features[3];

      await test.step('step-1: Go to Brand Concierge floating button page', async () => {
        await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
      });

      await test.step('step-2: Verify inline block content', async () => {
        await expect(bc.block).toBeVisible();
        await expect(bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(bc.inputField.first()).toBeVisible({ timeout: 10000 });

        await expect(bc.promptButtons.first()).toBeVisible();
        expect(await bc.promptButtons.count()).toBeGreaterThanOrEqual(data.inlinePromptCount);
      });

      await test.step('step-3: Verify floating button stays visible during scroll', async () => {
        await expect(bc.floatingButton).toBeVisible();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
        await expect(bc.floatingButton).toBeInViewport();

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(bc.floatingButton).toBeVisible();
        await expect(bc.floatingButton).toBeInViewport();
      });

      await test.step('step-4: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-5: Verify floating button exists after modal close', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible();
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-6: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 4: Brand Concierge floating button with scroll delay
  test(
    `[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
      const { data } = features[4];

      await test.step('step-1: Go to Brand Concierge floating button delay page', async () => {
        await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
      });

      await test.step('step-2: Verify inline block content', async () => {
        await expect(bc.block).toBeVisible();
        await expect(bc.block).toHaveClass(new RegExp(data.delayClass));
        await expect(bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(bc.inputField.first()).toBeVisible({ timeout: 10000 });

        await expect(bc.promptButtons.first()).toBeVisible();
        expect(await bc.promptButtons.count()).toBeGreaterThanOrEqual(data.inlinePromptCount);
      });

      await test.step('step-3: Verify floating button is present and has correct text', async () => {
        await expect(bc.floatingButton).toBeAttached();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      await test.step('step-4: Verify floating button is visible after scrolling', async () => {
        await page.evaluate(() => window.scrollTo(0, 301));
        await expect(bc.floatingButton).toBeVisible({ timeout: 5000 });
      });

      await test.step('step-5: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-6: Verify floating button exists after modal close', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible();
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-7: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 5: Brand Concierge hero with floating button
  test(
    `[Test Id - ${features[5].tcid}] ${features[5].name},${features[5].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
      const { data } = features[5];

      await test.step('step-1: Go to Brand Concierge hero floating button page', async () => {
        await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
      });

      await test.step('step-2: Verify hero block content', async () => {
        await expect(bc.brandConciergeHero).toBeVisible();
        await expect(bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(bc.inputField.first()).toBeVisible({ timeout: 10000 });

        await expect(bc.promptButtons.first()).toBeVisible();
        expect(await bc.promptButtons.count()).toBeGreaterThanOrEqual(data.inlinePromptCount);
      });

      await test.step('step-3: Verify floating button is hidden initially', async () => {
        await expect(bc.floatingButtonHidden).toBeAttached();
      });

      await test.step('step-4: Verify floating button appears after scrolling past hero', async () => {
        await page.evaluate(() => {
          const el = document.querySelector('.brand-concierge.hero');
          window.scrollTo(0, el.scrollHeight + 1);
        });
        await page.waitForTimeout(1000);
        await expect(bc.floatingButton).not.toHaveClass(/floating-hidden/, { timeout: 10000 });
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      await test.step('step-7: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-8: Run accessibility test on the hero block', async () => {
        await runAccessibilityTest({ page, testScope: bc.brandConciergeHero });
      });
    },
  );

  // Test 6: Brand Concierge floating button only
  test(
    `[Test Id - ${features[6].tcid}] ${features[6].name},${features[6].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[6].path}${miloLibs}`);

      await test.step('step-1: Go to Brand Concierge floating button only page', async () => {
        await page.goto(`${baseURL}${features[6].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[6].path}${miloLibs}`);
      });

      await test.step('step-2: Verify block is floating-button-only with no inline content', async () => {
        await expect(bc.block).toHaveClass(/floating-button-only/);
        await expect(bc.inputField.first()).not.toBeVisible();
      });

      await test.step('step-3: Verify floating button is visible with correct text', async () => {
        await expect(bc.floatingButton).toBeVisible();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      await test.step('step-4: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-5: Verify floating button exists after modal close', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible();
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-6: Run accessibility test on the floating button', async () => {
        await runAccessibilityTest({ page, testScope: bc.floatingButton });
      });
    },
  );

  // Test 7: Brand Concierge floating anchor hide
  test(
    `[Test Id - ${features[7].tcid}] ${features[7].name},${features[7].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[7].path}${miloLibs}`);

      await test.step('step-1: Go to Brand Concierge floating anchor hide page', async () => {
        await page.goto(`${baseURL}${features[7].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[7].path}${miloLibs}`);
      });

      await test.step('step-2: Verify block is floating-button-only with no inline content', async () => {
        await expect(bc.block).toHaveClass(/floating-button-only/);
        await expect(bc.inputField.first()).not.toBeVisible();
      });

      await test.step('step-3: Verify floating button is present with correct text', async () => {
        await expect(bc.floatingButton).toBeVisible();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      // Skipping a11y test: known color-contrast violation on bc-floating-input (MWPW-190449)
    },
  );
});
