import { expect, test } from '@playwright/test';
import { features } from './masadobehome.spec.js';
import WebUtil from '../../../libs/webutil.js';
import AdobeHomePage from './masadobehome.page.js';

test.describe('Mas Adobe Home Widget test suite', () => {
  let mas;
  let webUtil;

  test.beforeEach(async ({ page }) => {
    mas = new AdobeHomePage(page);
    webUtil = new WebUtil(page);
  });

  test('@MAS-AH-Try-Buy-Widget-basic : Verify basic widget functionality', async ({ page, baseURL }) => {
    const testData = features[0];

    await test.step('Navigate to test page', async () => {
      await page.goto(`${baseURL}${testData.path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify widget presence', async () => {
      const widget = await mas.getWidget(testData.data.id);
      await expect(widget).toBeVisible();
    });

    await test.step('Verify widget styling', async () => {
      const widget = await mas.getWidget(testData.data.id);
      expect(await webUtil.verifyCSS(widget, mas.widgetCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(widget, mas.widgetCssProp.sizes.single)).toBeTruthy();
    });

    await test.step('Verify dark theme', async () => {
      await page.goto(`${baseURL}${testData.path}${testData.browserParams}`);
      await page.waitForLoadState('domcontentloaded');

      const widget = await mas.getWidget(testData.data.id);
      expect(await webUtil.verifyCSS(widget, mas.widgetCssProp.dark)).toBeTruthy();
    });
  });

  test('@MAS-AH-Try-Buy-Widget-badge : Verify widget with badge', async ({ page, baseURL }) => {
    const testData = features[1];

    await test.step('Navigate to test page', async () => {
      await page.goto(`${baseURL}${testData.path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify badge presence', async () => {
      const badge = await mas.getWidgetField(testData.data.id, 'badge');
      await expect(badge).toBeVisible();
      expect(await badge.textContent()).to.equal(testData.data.badge);
    });
  });

  test('@MAS-AH-Try-Buy-Widget-custom-colors : Verify custom color handling', async ({ page, baseURL }) => {
    const testData = features[2];

    await test.step('Navigate to test page', async () => {
      await page.goto(`${baseURL}${testData.path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify custom background color', async () => {
      const widget = await mas.getWidget(testData.data.id);
      expect(await webUtil.verifyCSSProperty(widget, 'background-color', testData.data.expectedBgColor)).toBeTruthy();
    });

    await test.step('Verify custom border color', async () => {
      const widget = await mas.getWidget(testData.data.id);
      expect(await webUtil.verifyCSSProperty(widget, 'border-color', testData.data.expectedBorderColor)).toBeTruthy();
    });
  });
}); 
