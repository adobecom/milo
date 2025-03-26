import { expect, test } from '@playwright/test';
import { features } from './masdocs.spec.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('MAS Docs feature test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  // *** Checkout Link Page: ***

  // @MAS-DOCS-checkout-link
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to MAS Checkout Link Docs page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
    });

    await test.step('step-2: Verify on load pending & resolved events', async () => {
      const eventsLog = page.locator('#log');
      await expect(eventsLog).toHaveText('checkout-link resolvedcheckout-link resolved');
    });

    await test.step('step-3: Verify on click pending & resolved events', async () => {
      const btnRefresh = page.locator('#btnRefresh');
      const eventsLog = page.locator('#log');
      await btnRefresh.click();
      await expect(eventsLog).toHaveText('checkout-link resolvedcheckout-link resolvedcheckout-link resolvedcheckout-link resolved');
    });
  });

  // @MAS-DOCS-merch-card
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path}${miloLibs}`;
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to MAS Merch Card Docs page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}`);
    });

    await test.step('step-2: Verify successfull mas:ready events', async () => {
      const eventsLog = page.locator('#log-mas-ready');
      await expect(eventsLog).toContainText("'mas:ready' on MERCH-CARD #card1");
      await expect(eventsLog).toContainText("'mas:ready' on MERCH-CARD #cardSwc");
      await expect(eventsLog).toContainText("'mas:ready' on MERCH-CARD #headless");
      await expect(eventsLog).toContainText("'mas:ready' on MERCH-CARD #psCard2");
      await expect(eventsLog).toContainText("'mas:ready' on MERCH-CARD #valid-card");
      await expect(eventsLog).toContainText("'mas:ready' on MERCH-CARD #static");
    });

    await test.step('step-3: Verify error events if WCS or Odin request failed', async () => {
      const masFailedLog = page.locator('#log-mas-failed');
      await expect(masFailedLog).toContainText(/'mas:failed' on A #wrongosi/);

      const aemErrorLog = page.locator('#log-aem-error');
      await expect(aemErrorLog).toContainText(/'aem:error' on AEM-FRAGMENT #invalid-fragment-id/);

      const masErrorLog = page.locator('#log-mas-error');
      await expect(masErrorLog).toContainText(/'mas:error' on MERCH-CARD #wrongosi/);
      await expect(masErrorLog).toContainText(/'mas:error' on MERCH-CARD #invalid-fragment-id/);
    });
  });
});
