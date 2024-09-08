/* eslint-disable import/no-extraneous-dependencies, max-len, no-console */
import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './media.spec.js';
import MediaBlock from './media.page.js';

let webUtil;
let media;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Media Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    media = new MediaBlock(page);
  });

  // Test 0 : Media (small)
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Media (small) block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify media (small) block specs', async () => {
      await expect(media.mediaSmall).toBeVisible();

      await expect(await media.detailM).toContainText(data.detailText);
      await expect(await media.headingXS).toContainText(data.h2Text);
      await expect(await media.bodyS).toContainText(data.bodyText);
      await expect(await media.outlineButton).toContainText(data.outlineButtonText);
      await expect(await media.blueButton).toContainText(data.blueButtonText);

      await expect(await media.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(media.mediaImg, media.attributes['media.small'].image)).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await media.mediaSmall).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('media', 1));
      await expect(await media.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });
  });

  // Test 1 : Media
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to media block test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify media block specs', async () => {
      await expect(media.media).toBeVisible();

      await expect(await media.detailM).toContainText(data.detailText);
      await expect(await media.headingM).toContainText(data.h2Text);
      await expect(await media.bodyS).toContainText(data.bodyText);
      await expect(await media.blueButton).toContainText(data.blueButtonText);

      await expect(await media.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(media.mediaImg, media.attributes['media.small'].image)).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await media.media).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('media', 1));
      await expect(await media.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });
  });

  // Test 2 : Media (large, dark)
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to media block test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify media (large, dark) block specs', async () => {
      await expect(media.mediaLargeDark).toBeVisible();

      await expect(await media.detailL).toContainText(data.detailText);
      await expect(await media.headingXL).toContainText(data.h2Text);
      await expect(await media.bodyM).toContainText(data.bodyText);
      await expect(await media.blueButton).toContainText(data.blueButtonText);

      await expect(await media.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(media.mediaImg, media.attributes['media.large'].image)).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await media.mediaLargeDark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('media', 1));
      await expect(await media.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });
  });

  // Test 3 : Media (large, dark) video, autoplay infinite looping
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL, browserName }) => {
    test.skip(browserName === 'webkit', 'This feature is failing on Webkit browsers');
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Go to media block test page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify media (large, dark) block specs', async () => {
      await expect(media.mediaLargeDark).toBeVisible();

      await expect(await media.detailL).toContainText(data.detailText);
      await expect(await media.headingXL).toContainText(data.h2Text);
      await expect(await media.bodyM).toContainText(data.bodyText);
      await expect(await media.blueButton).toContainText(data.blueButtonText);

      await expect(await media.backgroundVideo).toBeVisible();
      expect(await webUtil.verifyAttributes(media.backgroundVideo, media.attributes['backgroundVideo.inline'])).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await media.mediaLargeDark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('media', 2));
      await expect(await media.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });
  });

  // Test 5 : Media (large, dark) video, autoplay loop once
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
    const { data } = features[4];

    await test.step('step-1: Go to media block test page', async () => {
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
    });

    await test.step('step-2: Verify media (large, dark) block specs', async () => {
      await expect(media.mediaLargeDark).toBeVisible();

      await expect(await media.detailL).toContainText(data.detailText);
      await expect(await media.headingXL).toContainText(data.h2Text);
      await expect(await media.bodyM).toContainText(data.bodyText);
      await expect(await media.blueButton).toContainText(data.blueButtonText);

      await expect(await media.backgroundVideo).toBeVisible();
      expect(await webUtil.verifyAttributes(media.backgroundVideo, media.attributes['backgroundVideo.loopOnce'])).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await media.mediaLargeDark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('media', 2));
      await expect(await media.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });
  });
});
