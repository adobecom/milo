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

      await test.step('step-2: Verify Brand Concierge block is visible', async () => {
        await bc.verifyBlockVisible();
      });

      await test.step('step-3: Verify content text', async () => {
        await bc.verifyContentText(data);
      });

      await test.step('step-4: Verify input field is present', async () => {
        await bc.verifyInputFieldPresent();
      });

      await test.step('step-5: Verify prompt buttons', async () => {
        await bc.verifyPromptButtons();
      });

      await test.step('step-6: Verify disclaimer message', async () => {
        await bc.verifyDisclaimerPresent(data);
      });

      await test.step('step-7: Verify analytics attributes', async () => {
        await expect(bc.block).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brand-concierge', 1));
      });

      await test.step('step-8: Run accessibility on the block', async () => {
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
        await page.waitForLoadState('networkidle'); // Wait for network to be idle for sticky variant
        await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge sticky variant', async () => {
        await expect(bc.brandConciergeSticky).toBeVisible();
      });

      await test.step('step-3: Verify content text', async () => {
        await bc.verifyContentText(data);
      });

      await test.step('step-4: Verify input field is present', async () => {
        await bc.verifyInputFieldPresent();
      });

      await test.step('step-5: Verify prompt buttons', async () => {
        await bc.verifyPromptButtons();
      });

      await test.step('step-6: Run accessibility on the sticky variant', async () => {
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

      await test.step('step-2: Verify Brand Concierge hero variant', async () => {
        await expect(bc.brandConciergeHero).toBeVisible();
      });

      await test.step('step-3: Verify heading text', async () => {
        await bc.verifyContentText(data);
      });

      await test.step('step-4: Verify input field is present', async () => {
        await bc.verifyInputFieldPresent();
      });

      await test.step('step-5: Verify prompt buttons', async () => {
        await bc.verifyPromptButtons();
      });

      await test.step('step-6: Run accessibility on the hero variant', async () => {
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

      await test.step('step-2: Verify Brand Concierge block is visible', async () => {
        await bc.verifyBlockVisible();
      });

      await test.step('step-3: Verify 404 heading text', async () => {
        await bc.verifyContentText(data);
      });

      await test.step('step-4: Verify input field is present', async () => {
        await bc.verifyInputFieldPresent();
      });

      await test.step('step-5: Verify prompt buttons', async () => {
        await bc.verifyPromptButtons();
      });

      await test.step('step-6: Verify disclaimer message', async () => {
        await bc.verifyDisclaimerPresent(data);
      });

      await test.step('step-7: Run accessibility on the block', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );
});
