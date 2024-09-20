import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './marquee.spec.js';
import MarqueeBlock from './marquee.page.js';

let webUtil;
let marquee;
let consoleErrors = [];

const miloLibs = process.env.MILO_LIBS || '';
const knownConsoleErrors = [
  'Access-Control-Allow-Origin',
  'Failed to load resource: net::ERR_FAILED',
  'adobeid-na1-stg1.services',
  'Attestation check for Topics',
  'Access to fetch at',
  'net::ERR_HTTP2_PROTOCOL_ERROR',
];

test.describe('Milo Marquee Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    marquee = new MarqueeBlock(page);

    page.on('console', (exception) => {
      if (exception.type() === 'error') {
        consoleErrors.push(exception.text());
      }
    });
  });

  test.afterEach(async () => {
    consoleErrors = [];
  });

  // Test 0 : Marquee (light)
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Marquee (light) block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify marquee(light) specs', async () => {
      await expect(await marquee.marqueeLight).toBeVisible();

      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.outlineButton).toContainText(data.outlineButtonText);
      await expect(await marquee.blueButton).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundImage, marquee.attributes['marquee.light'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await marquee.marqueeLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.outlineButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await marquee.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify browser console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 1 : Marquee (small)
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to Marquee (small) block test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (small) specs', async () => {
      await expect(await marquee.marqueeSmall).toBeVisible();

      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.blueButton).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundImage, marquee.attributes['marquee.small'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSmall).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify browser console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 2 : Marquee (small,light)
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to Marquee (small, light ) block test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (small, light) specs', async () => {
      await expect(await marquee.marqueeSmallLight).toBeVisible();

      await expect(await marquee.detailM).toContainText(data.detailText);
      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.outlineButton).toContainText(data.outlineButtonText);
      await expect(await marquee.blueButton).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundImage, marquee.attributes['marquee.small.light'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSmallLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.outlineButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await marquee.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify browser console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 3 : Marquee (large)
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Go to Marquee (large ) block test page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (large) specs', async () => {
      await expect(await marquee.marqueeLarge).toBeVisible();

      await expect(await marquee.headingXXL).toContainText(data.h2Text);
      await expect(await marquee.bodyXL).toContainText(data.bodyText);
      await expect(await marquee.outlineButtonXL).toContainText(data.outlineButtonText);
      await expect(await marquee.blueButtonXL).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundImage, marquee.attributes['marquee.large'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeLarge).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.outlineButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await marquee.blueButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify browser console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 4 : Marquee (large,light)
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
    const { data } = features[4];

    await test.step('step-1: Go to Marquee (large, light ) block test page', async () => {
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (large, light) specs', async () => {
      await expect(await marquee.marqueeLargeLight).toBeVisible();

      await expect(await marquee.headingXXL).toContainText(data.h2Text);
      await expect(await marquee.bodyXL).toContainText(data.bodyText);
      await expect(await marquee.outlineButtonXL).toContainText(data.outlineButtonText);
      await expect(await marquee.blueButtonXL).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundImage, marquee.attributes['marquee.large.light'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeLargeLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.outlineButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await marquee.blueButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 5 : Marquee (quiet)
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
    const { data } = features[5];

    await test.step('step-1: Go to Marquee (quiet ) block test page', async () => {
      await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (quiet) specs', async () => {
      await expect(await marquee.marqueeQuiet).toBeVisible();

      await expect(await marquee.detailM).toContainText(data.detailText);
      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.blueButton).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundImage).toBeHidden();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeQuiet).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 6 : Marquee (inline)
  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[6].path}${miloLibs}`);
    const { data } = features[6];

    await test.step('step-1: Go to Marquee (inline ) block test page', async () => {
      await page.goto(`${baseURL}${features[6].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (inline) specs', async () => {
      await expect(await marquee.marqueeInline).toBeVisible();

      await expect(await marquee.detailM).toContainText(data.detailText);
      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);

      await expect(await marquee.backgroundImage).toBeHidden();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeInline).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 7 : Marquee (split,small)
  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[7].path}${miloLibs}`);
    const { data } = features[7];

    await test.step('step-1: Go to Marquee (split, small ) block test page', async () => {
      await page.goto(`${baseURL}${features[7].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (split, small) specs', async () => {
      await expect(marquee.marqueeSplitSmall).toBeVisible();

      await expect(await marquee.detailM).toContainText(data.detailText);
      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.outlineButton).toContainText(data.outlineButtonText);
      await expect(await marquee.blueButton).toContainText(data.blueButtonText);

      expect(await webUtil.verifyAttributes(marquee.marqueeSplitSmall, marquee.attributes['marquee.split.small'].style)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSplitSmall).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.outlineButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await marquee.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 8 : Marquee (split,large)
  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[8].path}${miloLibs}`);
    const { data } = features[8];

    await test.step('step-1: Go to Marquee (split, large ) block test page', async () => {
      await page.goto(`${baseURL}${features[8].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[8].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (split, large) specs ', async () => {
      await expect(await marquee.marqueeSplitLarge).toBeVisible();

      await expect(await marquee.detailL).toContainText(data.detailText);
      await expect(await marquee.headingXXL).toContainText(data.h2Text);
      await expect(await marquee.bodyXL).toContainText(data.bodyText);
      await expect(await marquee.blueButtonXL).toContainText(data.blueButtonText);
      await expect(await marquee.actionLink2).toContainText(data.linkText);

      await expect(await marquee.iconImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.iconImage, marquee.attributes['marquee.split.large'].iconImg)).toBeTruthy();

      await expect(await marquee.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.mediaImage, marquee.attributes['marquee.split.large'].mediaImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSplitLarge).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
      await expect(await marquee.actionLink2).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 2, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 9 : Marquee (split,one-third,large,light)
  test(`${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[9].path}${miloLibs}`);
    const { data } = features[9];

    await test.step('step-1: Go to Marquee (split, one-third, large, light ) block test page', async () => {
      await page.goto(`${baseURL}${features[9].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[9].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (split, one-third, large, light) specs', async () => {
      await expect(marquee.marqueeSplitOneThirdLargeLight).toBeVisible();

      await expect(await marquee.detailL).toContainText(data.detailText);
      await expect(await marquee.headingXXL).toContainText(data.h2Text);
      await expect(await marquee.bodyXL).toContainText(data.bodyText);
      await expect(await marquee.blueButtonXL).toContainText(data.blueButtonText);
      await expect(await marquee.actionLink2).toContainText(data.linkText);

      await expect(await marquee.iconImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.iconImage, marquee.attributes['marquee.split.one-third-large'].iconImg)).toBeTruthy();

      await expect(await marquee.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.mediaImage, marquee.attributes['marquee.split.one-third-large'].mediaImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSplitOneThirdLargeLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
      await expect(await marquee.actionLink2).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 2, data.h2Text));
    });

    await test.step('step-3: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 10 : Marquee (split,one-third)
  test(`${features[10].name},${features[10].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[10].path}${miloLibs}`);
    const { data } = features[10];

    await test.step('step-1: Go to Marquee (split, one-third ) block test page', async () => {
      await page.goto(`${baseURL}${features[10].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[10].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (split, one-third) specs', async () => {
      await expect(await marquee.marqueeSplitOneThird).toBeVisible();

      await expect(await marquee.detailM).toContainText(data.detailText);
      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.blueButtonL).toContainText(data.blueButtonText);
      await expect(await marquee.actionLink2).toContainText(data.linkText);

      await expect(await marquee.iconImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.iconImage, marquee.attributes['marquee.split.one-third'].iconImg)).toBeTruthy();

      await expect(await marquee.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.mediaImage, marquee.attributes['marquee.split.one-third'].mediaImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSplitOneThird).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
      await expect(await marquee.actionLink2).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 2, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 11 : Marquee (split,one-third,small,light)
  test(`${features[11].name},${features[11].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[11].path}${miloLibs}`);
    const { data } = features[11];

    await test.step('step-1: Go to Marquee (split,one-third,small,light ) block test page', async () => {
      await page.goto(`${baseURL}${features[11].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[11].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (split,one-third,small,light) specs', async () => {
      await expect(marquee.marqueeSplitOneThirdSmallLight).toBeVisible();

      await expect(await marquee.detailM).toContainText(data.detailText);
      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.blueButtonL).toContainText(data.blueButtonText);

      await expect(await marquee.mediaImage).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.mediaImage, marquee.attributes['marquee.split.one-third'].mediaImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSplitOneThirdSmallLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 12 : Marquee small (background video playsinline)
  test(`${features[12].name},${features[12].tags}`, async ({ page, baseURL, browserName }) => {
    test.slow();
    test.skip(browserName === 'webkit', 'This feature is failing on Webkit browsers');
    console.info(`[Test Page]: ${baseURL}${features[12].path}${miloLibs}`);
    const { data } = features[12];

    await test.step('step-1: Go to Marquee (small) block test page', async () => {
      await page.goto(`${baseURL}${features[12].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[12].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (small) background video playsinline specs', async () => {
      await expect(await marquee.marqueeSmallDark).toBeVisible();

      await expect(await marquee.headingXL).toContainText(data.h2Text);
      await expect(await marquee.bodyM).toContainText(data.bodyText);
      await expect(await marquee.blueButton).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundVideo).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundVideo, marquee.attributes['backgroundVideo.inline'])).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeSmallDark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 13 : Marquee large (background video playsinline desktop)
  test(`${features[13].name},${features[13].tags}`, async ({ page, baseURL, browserName }) => {
    test.skip(browserName === 'webkit', 'This feature is failing on Webkit browsers');
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[13].path}${miloLibs}`);
    const { data } = features[13];

    await test.step('step-1: Go to Marquee (large, light ) block test page', async () => {
      await page.goto(`${baseURL}${features[13].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[13].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (large, light) desktop background specs', async () => {
      await expect(await marquee.marqueeLargeLight).toBeVisible();

      await expect(await marquee.headingXXL).toContainText(data.h2Text);
      await expect(await marquee.bodyXL).toContainText(data.bodyText);
      await expect(await marquee.blueButtonXL).toContainText(data.blueButtonText);
      await expect(await marquee.actionLink2).toContainText(data.linkText);

      await expect(await marquee.backgroundVideoDesktop).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundVideoDesktop, marquee.attributes['backgroundVideo.inline'])).toBeTruthy();

      const sourceElement = await marquee.backgroundVideoDesktop.locator('source');
      expect(await sourceElement.getAttribute('src')).toContain('.mp4');
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeLargeLight).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 1));
      await expect(await marquee.blueButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
      await expect(await marquee.actionLink2).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 2, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });

  // Test 14 : Marquee large (background video playsinline loop once)
  test(`${features[14].name},${features[14].tags}`, async ({ page, baseURL }) => {
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[14].path}${miloLibs}`);
    const { data } = features[14];

    await test.step('step-1: Go to Marquee (large, dark ) block test page', async () => {
      await page.goto(`${baseURL}${features[14].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[14].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Marquee (large, dark) background specs', async () => {
      await expect(await marquee.marqueeLargeDark).toBeVisible();

      await expect(await marquee.headingXXL).toContainText(data.h2Text);
      await expect(await marquee.bodyXL).toContainText(data.bodyText);
      await expect(await marquee.blueButtonXL).toContainText(data.blueButtonText);

      await expect(await marquee.backgroundVideo).toBeVisible();
      expect(await webUtil.verifyAttributes(marquee.backgroundVideo, marquee.attributes['backgroundVideo.loopOnce'])).toBeTruthy();

      const sourceElement = await marquee.backgroundVideo.locator('source');
      expect(await sourceElement.getAttribute('src')).toContain('.mp4');
      expect(await sourceElement.getAttribute('type')).toContain('video/mp4');
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await marquee.marqueeLargeDark).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('marquee', 2));
      await expect(await marquee.blueButtonXL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify and log if any console errors', async () => {
      consoleErrors.length > knownConsoleErrors.length && console.log('[Console error]:', consoleErrors);
      expect.soft(consoleErrors.length).toBeLessThanOrEqual(knownConsoleErrors.length);
    });
  });
});
