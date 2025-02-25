import { expect, test } from '@playwright/test';
import { features } from './masadobehome.spec.js';
import WebUtil from '../../../libs/webutil.js';
import AdobeHomePage from './masadobehome.page.js';

test.describe('Merch AH Try Buy Widget test suite', () => {
  let ah;
  let webUtil;

  test.beforeEach(async ({ page }) => {
    ah = new AdobeHomePage(page);
    webUtil = new WebUtil(page);
  });

  const verifyWidgetCSS = async (widget, testData) => {
    const { cssProps } = testData.data;

    if (cssProps?.theme) {
      await expect(webUtil.verifyCSS(widget, ah.widgetCssProp.base[cssProps.theme])).toBeTruthy();
    }

    if (cssProps?.size) {
      await expect(webUtil.verifyCSS(widget, ah.widgetCssProp.sizes[cssProps.size])).toBeTruthy();
    }

    if (cssProps?.typography) {
      const element = await ah.getWidgetField(testData.data.id, cssProps.typography);
      await expect(webUtil.verifyCSS(element, ah.widgetCssProp.typography[cssProps.typography])).toBeTruthy();
    }
  };

  test(features[0].name, async ({ page, baseURL }) => {
    const testData = features[0];

    await test.step('Navigate to page', async () => {
      await page.goto(`${baseURL}${testData.path}`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify widget presence', async () => {
      const widget = await ah.getWidget(testData.data.id);
      await expect(widget).toBeVisible();
      await verifyWidgetCSS(widget, testData);
    });

    await test.step('Verify content', async () => {
      const fields = ['title', 'description', 'price', 'cta'];
      for (const field of fields) {
        const element = await ah.getWidgetField(testData.data.id, field);
        await expect(element).toHaveText(testData.data[field]);
      }
    });
  });

  test(features[1].name, async ({ page, baseURL }) => {
    const testData = features[1];

    await test.step('Navigate to dark theme page', async () => {
      await page.goto(`${baseURL}${testData.path}${testData.browserParams}`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify dark theme styles', async () => {
      const widget = await ah.getWidget(testData.data.id);
      await verifyWidgetCSS(widget, testData);
    });

    await test.step('Verify price styling', async () => {
      const price = await ah.getWidgetField(testData.data.id, 'price');
      await expect(webUtil.verifyCSS(price, ah.widgetCssProp.typography.price)).toBeTruthy();
    });
  });

  test(features[2].name, async ({ page, baseURL }) => {
    const testData = features[2];

    await test.step('Navigate to page', async () => {
      await page.goto(`${baseURL}${testData.path}`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify triple size layout', async () => {
      const widget = await ah.getWidget(testData.data.id);
      await verifyWidgetCSS(widget, testData);
      await expect(widget).toHaveCSS('height', ah.widgetCssProp.sizes.triple.height);
    });
  });
});
