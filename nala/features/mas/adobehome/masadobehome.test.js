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
      const element = await ah.getWidgetField(testData.data.id, testData.data.size, cssProps.typography);
      await expect(webUtil.verifyCSS(element, ah.widgetCssProp.typography[cssProps.typography])).toBeTruthy();
    }
  };

  test(features[1].name, async () => {
    const testData = features[1];

    await test.step('Verify dark theme styles', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });

    await test.step('Verify price styling', async () => {
      const price = await ah.getWidgetField(testData.data.id, testData.data.size, 'price');
      await expect(webUtil.verifyCSS(price, ah.widgetCssProp.typography.price)).toBeTruthy();
    });
  });

  test(features[0].name, async ({ page }) => {
    const testData = features[0];

    await test.step('Navigate to test page', async () => {
      await page.goto(testData.path);
      await page.waitForSelector(`aem-fragment[fragment="${testData.data.id}"]`, { state: 'visible' });
    });

    await test.step('Verify triple size layout', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });

    await test.step('Verify screenshot', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await expect(await widget.screenshot()).toMatchSnapshot('triple-widget.png');
    });
  });

  test(features[2].name, async () => {
    const testData = features[2];

    await test.step('Verify triple size layout', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      await verifyWidgetCSS(widget, testData);
    });
  });

  test('Validate full widget content', async () => {
    const testData = features[0];
    
    await test.step('Validate all content', async () => {
      const widget = await ah.getWidget(testData.data.id, testData.data.size);
      
      // Text content
      const title = await ah.getWidgetField(testData.data.id, testData.data.size, 'title');
      const description = await ah.getWidgetField(testData.data.id, testData.data.size, 'description');
      const price = await ah.getWidgetField(testData.data.id, testData.data.size, 'price');
      
      await expect.soft(title).toHaveText(testData.data.title);
      await expect.soft(description).toContainText('creative apps');
      await expect.soft(price).toHaveText(/US\$\d+\.\d{2}\/mo/);
      
      // Attributes
      await expect(widget.locator('a[role="button"]')).toHaveAttribute('daa-ll', testData.data.cta);
      
      // Visibility
      await expect(widget.locator('[slot="price"]')).toBeVisible();
      
      // Dynamic content
      const offerId = await widget.locator('aem-fragment').getAttribute('fragment');
      await expect(offerId).toBe(testData.data.offerid);
    });
  });

  test('Validate API response', async ({ page }) => {
    const testData = features[0];
    
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes(testData.data.offerid)),
      page.click(testData.data.cta),
    ]);
    await expect(response.status()).toBe(200);
  });

  // Batch validation using describe block
  test.describe('Batch validation', () => {
    features.forEach((testData) => {
      test(testData.name, async () => {
        await test.step(`Validate ${testData.name}`, async () => {
          const widget = await ah.getWidget(testData.data.id, testData.data.size);
          await expect(widget).toContainText(testData.data.description);
        });
      });
    });
  });
});
