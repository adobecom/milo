import { expect, test } from '@playwright/test';
import { features } from './iframe.spec.js';
import IframeBlock from './iframe.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Iframe Block test suite', () => {
  // Iframe Block Checks:
  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const Iframe = new IframeBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page with Iframe block', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Iframe block content', async () => {
      await expect(Iframe.miloIframeContainer).toBeVisible();
      await expect(Iframe.iframeContainer).toBeVisible();
    });
  });
});
