import { expect, test } from '@playwright/test';
import { features } from './block-group.spec.js';
import BlockGroupBlock from './block-group.page.js';

let group;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Block Group Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    group = new BlockGroupBlock(page);
  });

  // Test 0 : Block Group Carousel
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to Block Group carousel test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify block-group-start elements are present on the page', async () => {
      expect(await group.start.count()).toBeGreaterThan(0);
    });

    await test.step('step-3: Verify block-group-end elements are present on the page', async () => {
      expect(await group.end.count()).toBeGreaterThan(0);
    });
  });

  // Test 1 : Block Group Tabs
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('step-1: Go to Block Group tabs test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify block-group-start elements are present on the page', async () => {
      expect(await group.start.count()).toBeGreaterThan(0);
    });

    await test.step('step-3: Verify block-group-end elements are present on the page', async () => {
      expect(await group.end.count()).toBeGreaterThan(0);
    });
  });
});
