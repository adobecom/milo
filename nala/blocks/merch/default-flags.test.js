import { expect, test } from '@playwright/test';
import { features } from './default-flags.spec.js';
import DefaultFlags from './default-flags.page.js';
import { constructTestUrl } from '../../libs/commerce.js';

test.describe('DefaultFlags Block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const defaultFlags = new DefaultFlags(page);
    const testUrl = constructTestUrl(baseURL, features[0].path, features[0].browserParams);
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to page with DefaultFlags prices', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Validate if each price is visible and has proper text for EN', async () => {
      for (const { el, textEN } of Object.values(defaultFlags.prices)) {
        if (textEN) {
          await expect(el).toHaveText(textEN);
        } else {
          await expect(el).toHaveCount(0);
        }
      }
    });
  });

  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const defaultFlags = new DefaultFlags(page);
    const testUrl = constructTestUrl(baseURL, features[1].path, features[1].browserParams);
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to page with DefaultFlags prices', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Validate if each price is visible and has proper text for FR', async () => {
      for (const { el, textFR } of Object.values(defaultFlags.prices)) {
        if (textFR) {
          await expect(el).toHaveText(textFR);
        } else {
          await expect(el).toHaveCount(0);
        }
      }
    });
  });

  test(`${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const defaultFlags = new DefaultFlags(page);
    const testUrl = constructTestUrl(baseURL, features[2].path, features[2].browserParams);
    console.info(`[Test Page]: ${testUrl}`);

    await test.step('Navigate to page with DefaultFlags prices', async () => {
      await page.goto(testUrl);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testUrl);
    });

    await test.step('Validate if each price is visible and has proper text for NG', async () => {
      for (const { el, textNG } of Object.values(defaultFlags.prices)) {
        if (textNG) {
          await expect(el).toHaveText(textNG);
        } else {
          await expect(el).toHaveCount(0);
        }
      }
    });
  });
});
