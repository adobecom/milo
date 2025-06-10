import { expect, test } from '@playwright/test';
import { features } from './timeline.spec.js';
import TimelineBlock from './timeline.page.js';
import WebUtil from '../../libs/webutil.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let webUtil;
let timeline;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Timeline test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    timeline = new TimelineBlock(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to segment-timeline test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify segment-timeline specs', async () => {
      await expect(await timeline.timeline).toBeVisible();
      await expect(timeline.day1Heading).toContainText(data.day1hText);
      await expect(timeline.day8HeadingLeft).toContainText(data.day8hLeftText);
      await expect(timeline.day8HeadingRight).toContainText(data.day8hRightText);
      await expect(timeline.day21Heading).toContainText(data.day21hText);

      await expect(timeline.day1Paragraph).toContainText(data.day1pText);
      await expect(timeline.day8ParagraphLeft).toContainText(data.day8pLeftText);
      await expect(timeline.day8ParagraphRight).toContainText(data.day8pRightText);
      await expect(timeline.day21Paragraph).toContainText(data.day21pText);

      await expect(timeline.banner1).toContainText(data.banner1Text);
      await expect(timeline.banner2).toContainText(data.banner2Text);

      expect(
        await webUtil.verifyAttributes(
          timeline.banner1,
          timeline.attributes['segment-timeline'].backgroundLeft,
        ),
      ).toBeTruthy();
      expect(
        await webUtil.verifyAttributes(
          timeline.banner2,
          timeline.attributes['segment-timeline'].backgroundRight,
        ),
      ).toBeTruthy();
      expect(
        await webUtil.verifyAttributes(
          timeline.bar1,
          timeline.attributes['segment-timeline'].backgroundBar1,
        ),
      ).toBeTruthy();
      expect(
        await webUtil.verifyAttributes(
          timeline.bar2,
          timeline.attributes['segment-timeline'].backgroundBar2,
        ),
      ).toBeTruthy();
      expect(
        await webUtil.verifyAttributes(
          timeline.bar3,
          timeline.attributes['segment-timeline'].backgroundBar3,
        ),
      ).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await timeline.timeline).toHaveAttribute('daa-lh', 'b1|timeline');
    });

    await test.step('step-4: Verify the accessibility test on the segment-timeline', async () => {
      await runAccessibilityTest({ page, testScope: timeline.timeline });
    });
  });
});
