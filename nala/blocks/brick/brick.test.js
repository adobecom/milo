import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import Brick from './brick.page.js';
import { features } from './brick.spec.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let webUtil;
let brick;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Brick Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    brick = new Brick(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Brick page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick specs', async () => {
      await expect(brick.brick).toBeVisible();

      await expect(await brick.headingXL).toContainText(data.h3Text);
      await expect(await brick.bodyM).toContainText(data.bodyText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await brick.blueButtonL).toContainText(data.blueButtonText);

      expect(await webUtil.verifyAttributes(brick.iconImage, brick.attributes['brick.icon.area'].iconImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundMobile, brick.attributes['brick.background.mobile'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundTablet, brick.attributes['brick.background.tablet'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundDesktop, brick.attributes['brick.background.desktop'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.brickMediaImg, brick.attributes['brick.media'].img)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brick).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h3Text));
      await expect(await brick.blueButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brick });
    });
  });

  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to Brick_rounded-corners-l-heading-button-fill', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-l-heading-button-fill specs', async () => {
      await expect(brick.brickButtonFill).toBeVisible();

      await expect(await brick.headingL).toContainText(data.h2Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.whiteButtonL).toContainText(data.whiteButtonText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(brick.iconImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.iconImage, brick.attributes['brick.fill.icon'].iconImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickButtonFill).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.whiteButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.whiteButtonText, 1, data.h2Text));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-l-heading-button-fill block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickButtonFill });
    });
  });

  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to Brick_rounded-corners-clickable', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-clickable specs', async () => {
      await expect(brick.brickClickable).toBeVisible();

      await brick.closeGeoroutingWrapper();
      await expect(await brick.headingL).toContainText(data.h1Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);

      await test.step('step-3: Verify analytic attributes', async () => {
        await expect(await brick.brickClickable).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      });

      await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-clickable block', async () => {
        await runAccessibilityTest({ page, testScope: brick.brickClickable });
      });
    });
  });

  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Go to Brick_rounded-corners-light-default-heading', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-light-default-heading specs', async () => {
      await expect(brick.brickDefaultHeading).toBeVisible();

      await expect(await brick.headingXL).toContainText(data.h3Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(brick.brickMedia).toBeVisible();

      const sourceElement = await brick.brickMedia.locator('source');
      expect(await sourceElement.getAttribute('src')).toContain('.mp4');
      expect(await sourceElement.getAttribute('type')).toContain('video/mp4');
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickDefaultHeading).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h3Text));
      await expect(await brick.pausePlayWrapper).toHaveAttribute('daa-ll', expect.stringContaining('Pause'));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-light-default-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickDefaultHeading });
    });
  });

  test(`[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
    const { data } = features[4];

    await test.step('step-1: Go to Brick_rounded-corners-light-s-heading', async () => {
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-light-s-heading specs', async () => {
      await expect(brick.brickHeadingS).toBeVisible();

      await expect(await brick.heading).toContainText(data.headingXL);
      await expect(await brick.bodyM).toContainText(data.textBodyM);
      await expect(await brick.headingS).toContainText(data.h1Text);
      await expect(await brick.brickBodyM).toContainText(data.brickTextBodyM);

      const borderRadius = await brick.brickHeadingS.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(
        brick.attributes['brick.headingS'].blockStyle.borderRadius,
      );

      await expect(await brick.sectionBackgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.sectionBackgroundImage, brick.attributes['section.headingS'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(brick.sectionXXLspacing).toHaveAttribute('daa-lh', 's1');
      await expect(await brick.brickHeadingS).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 2));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-light-s-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickHeadingS });
    });
  });

  test(`[Test Id - ${features[5].tcid}] ${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
    const { data } = features[5];

    await test.step('step-1: Go to Brick_rounded-corners-dark-m-heading', async () => {
      await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-dark-m-heading specs', async () => {
      await expect(brick.brickHeadingM).toBeVisible();

      await expect(await brick.headingM).toContainText(data.h2Text);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await brick.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.backgroundImage, brick.attributes['brick.headingM'].backgroundImg)).toBeTruthy();

      const borderRadius = await brick.brickHeadingM.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(
        brick.attributes['brick.headingM'].blockStyle.borderRadius,
      );
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickHeadingM).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-light-default-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickHeadingM });
    });
  });

  test(`[Test Id - ${features[6].tcid}] ${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[6].path}${miloLibs}`);
    const { data } = features[6];

    await test.step('step-1: Go to Brick_rounded-corners-click-l-heading', async () => {
      await page.goto(`${baseURL}${features[6].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-click-l-heading specs', async () => {
      await expect(brick.brickHeadingL).toBeVisible();

      await expect(await brick.headingL).toContainText(data.h2Text);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await brick.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.backgroundImage, brick.attributes['brick.headingL'].backgroundImg)).toBeTruthy();
      const borderRadius = await brick.brickHeadingL.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(brick.attributes['brick.headingL'].blockStyle.borderRadius);
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickHeadingL).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-click-l-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickHeadingL });
    });
  });

  test(`[Test Id - ${features[7].tcid}] ${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[7].path}${miloLibs}`);
    const { data } = features[7];

    await test.step('step-1: Go to Brick_rounded-corners-light-xxl-heading-center', async () => {
      await page.goto(`${baseURL}${features[7].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_rounded-corners-light-xxl-heading-center specs', async () => {
      await expect(brick.brickHeadingXXL).toBeVisible();

      await expect(await brick.headingXXL).toContainText(data.h2Text);
      await expect(await brick.brickTextDetailL).toContainText(data.textDetailL);

      await expect(await brick.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.backgroundImage, brick.attributes['brick.headingXXL'].backgroundImg)).toBeTruthy();
      const borderRadius = await brick.brickHeadingXXL.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(brick.attributes['brick.headingXXL'].blockStyle.borderRadius);
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickHeadingXXL).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_rounded-corners-light-xxl-heading-center block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickHeadingXXL });
    });
  });

  test(`[Test Id - ${features[8].tcid}] ${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[8].path}${miloLibs}`);
    const { data } = features[8];

    await test.step('step-1: Go to Brick_m-rounded-corners-light-s-heading', async () => {
      await page.goto(`${baseURL}${features[8].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[8].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_m-rounded-corners-light-s-heading specs', async () => {
      await expect(brick.brickRoundedCornersM).toBeVisible();

      await expect(await brick.headingS).toContainText(data.h1Text);
      await expect(await brick.bodyM).toContainText(data.textBodyM);
      await expect(await brick.headingS).toContainText(data.h1Text);
      await expect(await brick.brickBodyM).toContainText(data.brickTextBodyM);

      const borderRadius = await brick.brickRoundedCornersM.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(brick.attributes['brick.M.rounded.corners'].blockStyle.borderRadius);

      await expect(await brick.sectionBackgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.sectionBackgroundImage, brick.attributes['section.headingS'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(brick.sectionXXLspacing).toHaveAttribute('daa-lh', 's1');
      await expect(await brick.brickRoundedCornersM).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 2));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_m-rounded-corners-light-s-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickRoundedCornersM });
    });
  });

  test(`[Test Id - ${features[9].tcid}] ${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[9].path}${miloLibs}`);
    const { data } = features[9];

    await test.step('step-1: Go to Brick_square-corners-light-s-heading', async () => {
      await page.goto(`${baseURL}${features[9].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[9].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_square-corners-light-s-heading specs', async () => {
      await expect(brick.brickSquareCorners).toBeVisible();

      await expect(await brick.headingS).toContainText(data.h1Text);
      await expect(await brick.bodyM).toContainText(data.textBodyM);
      await expect(await brick.headingS).toContainText(data.h1Text);
      await expect(await brick.brickBodyM).toContainText(data.brickTextBodyM);

      const borderRadius = await brick.brickSquareCorners.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(brick.attributes['brick.square.corners'].blockStyle.borderRadius);

      await expect(await brick.sectionBackgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.sectionBackgroundImage, brick.attributes['brick.square.corners'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(brick.sectionXXLspacing).toHaveAttribute('daa-lh', 's1');
      await expect(await brick.brickSquareCorners).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 2));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_square-corners-light-s-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickSquareCorners });
    });
  });

  test(`[Test Id - ${features[10].tcid}] ${features[10].name},${features[10].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[10].path}${miloLibs}`);
    const { data } = features[10];

    await test.step('step-1: Go to Brick_split-rounded-corners-dark-l-heading', async () => {
      await page.goto(`${baseURL}${features[10].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[10].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_split-rounded-corners-dark-l-heading specs', async () => {
      await expect(brick.brickSplit).toBeVisible();

      await expect(await brick.headingL).toContainText(data.h2Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await brick.blueButtonL).toContainText(data.blueButtonText);
      await expect(brick.iconImage).toBeVisible();

      await expect(await brick.splitBackgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.splitBackgroundImage, brick.attributes['brick.split.background'].backgroundImg)).toBeTruthy();
      const borderRadius = await brick.brickSplit.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(brick.attributes['brick.split.background'].blockStyle.borderRadius);
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickSplit).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await brick.blueButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_split-rounded-corners-dark-l-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickSplit });
    });
  });

  test(`[Test Id - ${features[11].tcid}] ${features[11].name},${features[11].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[11].path}${miloLibs}`);
    const { data } = features[11];

    await test.step('step-1: Go to Brick_split-two-column-rounded-corners-dark-l-heading', async () => {
      await page.goto(`${baseURL}${features[11].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[11].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_split-two-column-rounded-corners-dark-l-heading specs', async () => {
      await expect(brick.brickSplit).toBeVisible();

      await expect(await brick.headingL).toContainText(data.h3Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await brick.whiteButtonL).toContainText(data.whiteButtonText);

      await expect(await brick.splitForegroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.splitForegroundImage, brick.attributes['brick.split.foreground'].backgroundImg)).toBeTruthy();
      const borderRadius = await brick.brickSplit.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(brick.attributes['brick.split.foreground'].blockStyle.borderRadius);
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickSplit).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h3Text));
      await expect(await brick.whiteButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.whiteButtonText, 2, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_split-two-column-rounded-corners-dark-l-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickSplit });
    });
  });

  test(`[Test Id - ${features[12].tcid}] ${features[12].name},${features[12].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[12].path}${miloLibs}`);
    const { data } = features[12];

    await test.step('step-1: Go to Brick_supplemental-text-rounded-corners-l-heading', async () => {
      await page.goto(`${baseURL}${features[12].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[12].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_supplemental-text-rounded-corners-l-heading specs', async () => {
      await expect(brick.brickSupplemental).toBeVisible();

      await expect(await brick.headingL).toContainText(data.h2Text);
      await expect(await brick.brickBodyXS).toContainText(data.supplementalText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);

      await expect(await brick.backgroundImage).toBeVisible();
      expect(await webUtil.verifyAttributes(brick.backgroundImage, brick.attributes['brick.supplemental'].backgroundImg)).toBeTruthy();
      const borderRadius = await brick.brickSupplemental.evaluate(
        (el) => getComputedStyle(el).borderRadius,
      );
      expect(borderRadius).toBe(
        brick.attributes['brick.supplemental'].blockStyle.borderRadius,
      );
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickSupplemental).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_supplemental-text-rounded-corners-l-heading block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickSupplemental });
    });
  });

  test(`[Test Id - ${features[13].tcid}] ${features[13].name},${features[13].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[13].path}${miloLibs}`);
    const { data } = features[13];

    await test.step('step-1: Go to Brick_image-bottom-center', async () => {
      await page.goto(`${baseURL}${features[13].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[13].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_image-bottom-center specs', async () => {
      await expect(brick.brickImageCenter).toBeVisible();

      await expect(await brick.headingXL).toContainText(data.h3Text);
      await expect(await brick.brickTextDetailL).toContainText(data.paragraphText);
      await expect(await brick.whiteButtonL).toContainText(data.whiteButtonText);

      expect(await webUtil.verifyAttributes(brick.backgroundMobile, brick.attributes['brick.center.background.mobile'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundTablet, brick.attributes['brick.center.background.tablet'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundDesktop, brick.attributes['brick.center.background.desktop'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickImageCenter).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.whiteButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.whiteButtonText, 1, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_image-bottom-center block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickImageCenter });
    });
  });

  test(`[Test Id - ${features[14].tcid}] ${features[14].name},${features[14].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[14].path}${miloLibs}`);
    const { data } = features[14];

    await test.step('step-1: Go to Brick_image-bottom-right', async () => {
      await page.goto(`${baseURL}${features[14].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[14].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_image-bottom-right specs', async () => {
      await expect(brick.brickImageRight).toBeVisible();

      await expect(await brick.headingM).toContainText(data.h1Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await brick.whiteButtonL).toContainText(data.whiteButtonText);

      expect(await webUtil.verifyAttributes(brick.backgroundMobile, brick.attributes['brick.right.background.mobile'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundTablet, brick.attributes['brick.right.background.tablet'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundDesktop, brick.attributes['brick.right.background.desktop'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickImageLeft).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h1Text));
      await expect(await brick.whiteButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.whiteButtonText, 2, data.h1Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_image-bottom-right block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickImageRight });
    });
  });

  test(`[Test Id - ${features[15].tcid}] ${features[15].name},${features[15].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[15].path}${miloLibs}`);
    const { data } = features[15];

    await test.step('step-1: Go to Brick_image-bottom-left', async () => {
      await page.goto(`${baseURL}${features[15].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[15].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_image-bottom-left specs', async () => {
      await expect(brick.brickImageLeft).toBeVisible();

      await expect(await brick.headingL).toContainText(data.h3Text);
      await expect(await brick.brickBodyM).toContainText(data.bodyText);
      await expect(await brick.whiteButtonL).toContainText(data.whiteButtonText);

      expect(await webUtil.verifyAttributes(brick.backgroundMobile, brick.attributes['brick.left.background.mobile'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundTablet, brick.attributes['brick.left.background.tablet'].backgroundImg)).toBeTruthy();
      expect(await webUtil.verifyAttributes(brick.backgroundDesktop, brick.attributes['brick.left.background.desktop'].backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await brick.brickImageLeft).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brick', 1));
      await expect(await brick.whiteButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.whiteButtonText, 1, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Brick_image-bottom-left block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickImageLeft });
    });
  });

  test(`[Test Id - ${features[16].tcid}] ${features[16].name},${features[16].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[16].path}${miloLibs}`);
    const { data } = features[16];

    await test.step('step-1: Go to Brick_grid page', async () => {
      await page.goto(`${baseURL}${features[16].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[16].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Brick_grid specs', async () => {
      await expect(brick.brickGrid).toBeVisible();
      await page.waitForTimeout(2000);
      const brickElements = await brick.getAllBricks();
      const count = await brickElements.count();
      expect(count).toBeGreaterThan(0);
      await expect(brickElements).toHaveCount(3);

      for (let i = 0; i < count; i++) {
        const brickInstance = brick.getBrick(i);
        expect(brickInstance.headingXL).toContainText(data.h3Text);
        expect(brickInstance.brickBodyM).toContainText(data.bodyText);
        expect(brickInstance.outlineButtonL).toContainText(data.outlineButtonText);
        expect(brickInstance.blueButtonL).toContainText(data.blueButtonText);

        expect(await webUtil.verifyAttributes(brickInstance.iconImage, brick.attributes['brick.icon.area'].iconImg)).toBeTruthy();
        expect(await webUtil.verifyAttributes(brickInstance.backgroundMobile, brick.attributes['brick.background.mobile'].backgroundImg)).toBeTruthy();
        expect(await webUtil.verifyAttributes(brickInstance.backgroundTablet, brick.attributes['brick.background.tablet'].backgroundImg)).toBeTruthy();
        expect(await webUtil.verifyAttributes(brickInstance.backgroundDesktop, brick.attributes['brick.background.desktop'].backgroundImg)).toBeTruthy();
        expect(await webUtil.verifyAttributes(brickInstance.brickMediaImg, brick.attributes['brick.media'].img)).toBeTruthy();
      }
      await expect(brick.sectionMetadata).toContainText('masonry');
      await brick.checkSectionMetadataTexts();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      const brickElements = await brick.getAllBricks();
      await expect(brickElements).toHaveCount(3);

      for (let i = 0; i < 3; i++) {
        const singleBrick = brickElements.nth(i);
        const brickInstance = brick.getBrick(i);

        const expectedDaaLh = await webUtil.getBlockDaalh('brick', i + 1);
        await expect(singleBrick).toHaveAttribute('daa-lh', expectedDaaLh);

        const expectedOutlineDaaLl = await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h3Text);
        await expect(brickInstance.outlineButtonL).toHaveAttribute('daa-ll', expectedOutlineDaaLl);

        const expectedBlueDaaLl = await webUtil.getLinkDaall(data.blueButtonText, 2, data.h3Text);
        await expect(brickInstance.blueButtonL).toHaveAttribute('daa-ll', expectedBlueDaaLl);
      }
    });

    await test.step('step-4: Verify the accessibility test on the Brick_grid block', async () => {
      await runAccessibilityTest({ page, testScope: brick.brickGrid });
    });
  });
});
