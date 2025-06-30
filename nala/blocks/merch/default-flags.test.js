import { expect, test } from '@playwright/test';
import { features } from './default-flags.spec.js';
import DefaultFlags from './default-flags.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('DefaultFlags Block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const defaultFlags = new DefaultFlags(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page with DefaultFlags prices', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
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
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('Navigate to page with DefaultFlags prices', async () => {
      await page.goto(`${baseURL}${features[1].path}${features[1].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${features[1].browserParams}&${miloLibs}`);
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
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('Navigate to page with DefaultFlags prices', async () => {
      await page.goto(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
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
