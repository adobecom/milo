import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './language-selector.spec.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';
import LanguageSelector from './language-selector.page.js';

let webUtil;
let globalFooter;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Marquee Anchors test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    globalFooter = new LanguageSelector(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Global footer test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Language selsector specs', async () => {
      await expect(await globalFooter.languageSelector).toBeVisible();

      await globalFooter.closeOneTrustBanner();
      await globalFooter.openRegionPicker();
      await expect(await globalFooter.languageDropdown).toBeVisible();
      await expect(await globalFooter.searchLanguage).toBeVisible();
      await expect(await globalFooter.selectedLanguageName).toContainText(data.selectedLanguage);
      await expect(await globalFooter.languageItems.nth(1)).toContainText(data.languageOption1);
      await expect(await globalFooter.languageItems.nth(2)).toContainText(data.languageOption2);
      await expect(await globalFooter.languageItems.nth(3)).toContainText(data.languageOption3);
      await expect(await globalFooter.languageItems.nth(4)).toContainText(data.languageOption4);
      await expect(await globalFooter.languageItems.nth(5)).toContainText(data.languageOption5);
      await expect(await globalFooter.languageItems.nth(6)).toContainText(data.languageOption6);
    });

    await test.step('step-3: Verify the accessibility test on the Language selector', async () => {
      await runAccessibilityTest({ page, testScope: globalFooter.languageSelector });
    });
  });

  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify specs on the page', async () => {
      await expect(await globalFooter.languageSelector).toBeVisible();

      await expect(await globalFooter.headingXL).toContainText(data.h2Text);
      await expect(await globalFooter.bodyM).toContainText(data.bodyText);
      await expect(await globalFooter.outlineButton).toContainText(data.outlineButtonText);
      await expect(await globalFooter.blueButton).toContainText(data.blueButtonText);
      await globalFooter.openRegionPicker();
      await expect(await globalFooter.languageDropdown).toBeVisible();
      await expect(await globalFooter.searchLanguage).toBeVisible();
      await expect(await globalFooter.selectedLanguageName).toContainText(data.selectedLanguage);
      await expect(await globalFooter.languageItems.nth(1)).toContainText(data.languageOption1);
      await expect(await globalFooter.languageItems.nth(2)).toContainText(data.languageOption2);
      await expect(await globalFooter.languageItems.nth(3)).toContainText(data.languageOption3);
      await expect(await globalFooter.languageItems.nth(4)).toContainText(data.languageOption4);
      await expect(await globalFooter.languageItems.nth(5)).toContainText(data.languageOption5);
      await expect(await globalFooter.languageItems.nth(6)).toContainText(data.languageOption6);
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await globalFooter.marqueeSmallLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await globalFooter.outlineButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await globalFooter.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify the accessibility test', async () => {
      await runAccessibilityTest({ page, testScope: globalFooter.languageSelector });
    });
  });
});
