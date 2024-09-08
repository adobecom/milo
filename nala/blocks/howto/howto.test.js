/* eslint-disable import/no-extraneous-dependencies, max-len, no-console */
import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './howto.spec.js';
import HowToBlock from './howto.page.js';

let webUtil;
let howTo;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo HowTo block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    howTo = new HowToBlock(page);
  });

  // Test 0 : HowTo default block
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to HowTo block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify HowTo specs', async () => {
      await expect(howTo.howTo).toBeVisible();
      await expect(await howTo.list).toHaveCount(4);

      expect(await webUtil.verifyCSS(howTo.foreground, howTo.cssProperties['.how-to .foreground'])).toBeTruthy();
      expect(await webUtil.verifyCSS(howTo.heading, howTo.cssProperties['body-m'])).toBeTruthy();
      expect(await webUtil.verifyCSS(howTo.image, howTo.cssProperties['how-to-media'])).toBeTruthy();
    });
  });

  // Test 1 : how-to (large) block
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('step-1: Go to HowTo large block test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify HowTo large specs', async () => {
      await expect(howTo.howToLarge).toBeVisible();
      await expect(await howTo.list).toHaveCount(4);

      expect(await webUtil.verifyCSS(howTo.heading, howTo.cssProperties['body-m'])).toBeTruthy();
      expect(await webUtil.verifyCSS(howTo.howToLarge, howTo.cssProperties['how-to-large-image'])).toBeTruthy();
      // eslint-disable-next-line max-len
      expect(await webUtil.verifyAttributes(await howTo.largeImage, howTo.attProperties['how-to-large-image'])).toBeTruthy();
    });
  });

  // Test 2 : how-to (seo) block
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('step-1: Go to HowTo SEO block test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify HowTo SEO specs', async () => {
      await expect(howTo.howToSeo).toBeVisible();
      await expect(await howTo.list).toHaveCount(4);

      expect(await webUtil.verifyCSS(howTo.heading, howTo.cssProperties['body-m'])).toBeTruthy();
      expect(await webUtil.verifyCSS(howTo.howToSeo, howTo.cssProperties['how-to-seo'])).toBeTruthy();
    });
  });
});
