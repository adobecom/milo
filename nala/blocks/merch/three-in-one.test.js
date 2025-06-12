import { expect, test } from '@playwright/test';
import { features } from './three-in-one.spec.js';
import ThreeInOne from './three-in-one.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('ThreeInOne Block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('Validate if each CTA is visible and has proper href', async () => {
      for (const { el, href } of Object.values(threeInOne.ctas)) {
        await expect(el).toBeVisible();
        await expect(el).toHaveAttribute('href', href);
      }
    });
  });

  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne Fallback CTAs', async () => {
      await page.goto(`${baseURL}${features[1].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
    });

    for (const { sectionId, attributes, iframeSrc } of features[1].useCases) {
      await test.step(`Validate ${sectionId} CTA is visible and has proper attributes`, async () => {
        const cta = threeInOne.getFallbackCta(sectionId);
        for (const [key, value] of Object.entries(attributes)) {
          await expect(cta).toHaveAttribute(key, value);
        }
        await cta.click();
        const modal = threeInOne.getModal();
        const iframe = await modal.locator('iframe');
        await expect(iframe).toHaveAttribute('src', iframeSrc);
        await threeInOne.closeModal();
      });
    }
  });
});
