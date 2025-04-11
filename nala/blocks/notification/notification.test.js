import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './notification.spec.js';
import NotificationBlock from './notification.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let webUtil;
let notification;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Notification Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    notification = new NotificationBlock(page);
  });

  // Test 0 : Notification
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Notification block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Notification specs', async () => {
      await expect(await notification.notification).toBeVisible();

      await expect(await notification.headingM).toContainText(data.h3Text);
      await expect(await notification.bodyM).toContainText(data.bodyM);
      await expect(await notification.blueButton).toContainText(data.blueButtonText);

      await expect(await notification.backgroundImage).toBeVisible();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await notification.notification).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('notification', 1));
      await expect(await notification.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 1, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Notification block', async () => {
      await runAccessibilityTest({ page, testScope: notification.notification });
    });
  });
});
