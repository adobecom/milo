import { expect, test } from '@playwright/test';
import Mnemonic from './mnemonic.page.js';
import { features } from './mnemonic.spec.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let mnemonic;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Mnemonic List test suite', () => {
  test.beforeEach(async ({ page }) => {
    mnemonic = new Mnemonic(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Mnemonic List page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Mnemonic List specs', async () => {
      await expect(mnemonic.mnemonicList).toBeVisible();

      await expect(mnemonic.productItems.nth(0)).toContainText(data.trackingHeader1);
      await expect(mnemonic.productItems.nth(1)).toContainText(data.trackingHeader2);
      await expect(mnemonic.productItemsImg.nth(0)).toHaveAttribute('src', '/assets/img/acrobat-pro.svg');
      await expect(mnemonic.productItems.nth(2)).toContainText(data.trackingHeader3);
      await expect(mnemonic.productItemsImg.nth(1)).toHaveAttribute('src', '/assets/img/illustrator.svg');
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(mnemonic.mnemonicList).toHaveAttribute('daa-lh', 'b1|mnemonic-list');
    });

    await test.step('step-4: Verify the accessibility test on the Mnemonic List', async () => {
      await runAccessibilityTest({ page, testScope: mnemonic.mnemonicList });
    });
  });
});
