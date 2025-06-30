import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './reading-time.spec.js';
import ReadingTimeBlock from './reading-time.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let readingTime;
let webUtil;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Reading-time feature test suite', () => {
  test.beforeEach(async ({ page }) => {
    readingTime = new ReadingTimeBlock(page);
    webUtil = new WebUtil(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];
    await test.step('step-1: Go to Reading-time feature test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Reading-time specs', async () => {
      await expect(await readingTime.readingTime).toBeVisible();
      await expect(await readingTime.readingTime).toContainText(data.timeText);
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(readingTime.readingTime).toHaveAttribute('daa-lh', 'b1|reading-time');
    });

    await test.step('step-4: Verify the accessibility test on Reading-time block', async () => {
      await runAccessibilityTest({ page, testScope: readingTime.readingTime, skipA11yTest: true });
    });
  });

  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    await test.step('step-1: Go to Reading-time without text test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Reading-time without text specs', async () => {
      await expect(await readingTime.readingTime).toBeVisible();
      const actual = parseInt((await readingTime.getReadingText()).split(' ')[0], 10);
      const contentText = await readingTime.getContentText();
      const wordCount = contentText.trim().split(/\s+/).length;
      const expected = Math.ceil(wordCount / 200);
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);
      await expect(await readingTime.media).toBeVisible();
      await expect(await readingTime.foregroundImage).toBeVisible();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(readingTime.readingTime).toHaveAttribute('daa-lh', 'b1|reading-time');
      expect(await webUtil.verifyAttributes(readingTime.image, readingTime.attributes['foreground.image'].foregroundImg)).toBeTruthy();
    });

    await test.step('step-4: Verify the accessibility test on Reading-time without text block', async () => {
      await runAccessibilityTest({ page, testScope: readingTime.readingTime, skipA11yTest: true });
    });
  });

  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to Reading-time with text test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Reading-time with text specs', async () => {
      await expect(await readingTime.readingTime).toBeVisible();
      await expect(await readingTime.detailM).toContainText(data.detailText);
      await expect(await readingTime.headingXL).toContainText(data.h2Text);
      await expect(await readingTime.bodyM).toContainText(data.bodyText);
      await expect(await readingTime.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await readingTime.blueButtonL).toContainText(data.blueButtonText);

      const actual = parseInt((await readingTime.getReadingText()).split(' ')[0], 10);
      const contentText = await readingTime.getContentText();
      const wordCount = contentText.trim().split(/\s+/).length;
      const expected = Math.ceil(wordCount / 200);
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);

      for (const sectionId of ['s2', 's3', 's4', 's5']) {
        const section = readingTime.page.locator(`.section[daa-lh="${sectionId}"]`);
        const heading = section.locator('h3.heading-l');
        await expect(heading).toContainText(data.h3Text);
        const paragraphs = section.locator('p.body-l');
        await expect(paragraphs.nth(0)).toContainText(data.bodyTextL);
        await expect(paragraphs.nth(1)).toContainText(data.bodyTextL);
        const listItems = section.locator('ul.body-l > li');
        await expect(listItems).toHaveCount(3);
        for (let i = 0; i < 3; i++) {
          await expect(listItems.nth(i)).toContainText(data.listItemsText);
        }
      }
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(readingTime.readingTime).toHaveAttribute('daa-lh', 'b1|reading-time');
      expect(await webUtil.verifyAttributes(readingTime.assetImage, readingTime.attributes['asset.image'].assetImg)).toBeTruthy();
    });

    await test.step('step-4: Verify the accessibility test on Reading-time with text block', async () => {
      await runAccessibilityTest({ page, testScope: readingTime.readingTime, skipA11yTest: true });
    });
  });
});
