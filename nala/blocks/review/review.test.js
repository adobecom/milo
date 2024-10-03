import { expect, test } from '@playwright/test';
import { features } from './review.spec.js';
import ReviewBlock from './review.page.js';

let review;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Review Block test suite', () => {
  test.beforeEach(async ({ page, browser }) => {
    // review block requires clearing cookies
    const context = await browser.newContext();
    await context.clearCookies();
    review = new ReviewBlock(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to review feature test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify review block and submit the review < 3', async () => {
      const { data } = features[0];
      expect(await review.verifyReview(data)).toBeTruthy();
      expect(await review.submitReview(data)).toBeTruthy();
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('step-1: Go to review block test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify review block and submit the review > 3', async () => {
      const { data } = features[1];
      expect(await review.verifyReview(data)).toBeTruthy();
      expect(await review.submitReview(data)).toBeTruthy();
    });
  });
});
