import { expect, test } from '@playwright/test';
import { features } from './three-in-one.spec.js';
import ThreeInOne from './three-in-one.page.js';

const miloLibs = process.env.MILO_LIBS || '';

async function clickEntitledCta(cta) {
  await expect(cta).not.toHaveClass(/loading-entitlements|placeholder-pending/);
  await cta.click();
}

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

    await test.step('Validate if modal reopens on back navigation', async () => {
      const cta = await page.locator('[data-wcs-osi="ByqyQ6QmyXhzAOnjIcfHcoF1l6nfkeLgbzWz-aeM8GQ"][data-checkout-workflow-step="segmentation"]');
      await clickEntitledCta(cta);
      await page.waitForSelector('.dialog-modal');
      const modal = threeInOne.getModal();
      expect(modal).toBeVisible();
      await page.goto('https://www.adobe.com');
      await page.goBack();
      const newModal = threeInOne.getModal();
      await expect(newModal).toBeVisible();
      await threeInOne.closeModal();
      expect(newModal).not.toBeVisible();
    });
  });

  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    for (const { sectionId, attributes, iframeSrc } of features[1].useCases) {
      await test.step(`Validate ${sectionId} CTA is visible and has proper attributes`, async () => {
        await page.goto(`${baseURL}${features[1].path}${features[0].browserParams}&${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        const cta = threeInOne.getFallbackCta(sectionId);
        for (const [key, value] of Object.entries(attributes)) {
          await expect(cta).toHaveAttribute(key, value);
        }
        await clickEntitledCta(cta);
        const modal = threeInOne.getModal();
        const iframe = await modal.locator('iframe');
        await expect(iframe).toHaveAttribute('src', iframeSrc);
        await threeInOne.closeModal();
      });
    }
  });

  test(`${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      const { sectionId, iframeSrc, attributes } = features[2];
      await page.goto(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      const cta = threeInOne.getFallbackCta(sectionId);
      for (const [key, value] of Object.entries(attributes)) {
        await expect(cta).toHaveAttribute(key, value);
      }
      await clickEntitledCta(cta);
      const modal = threeInOne.getModal();
      const iframe = await modal.locator('iframe');
      await expect(iframe).toHaveAttribute('src', iframeSrc);
    });
  });

  test(`${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      const { sectionId, iframeSrc, attributes } = features[3];
      await page.goto(`${baseURL}${features[3].path}${features[3].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      const cta = threeInOne.getFallbackCta(sectionId);
      for (const [key, value] of Object.entries(attributes)) {
        await expect(cta).toHaveAttribute(key, value);
      }
      await clickEntitledCta(cta);
      const modal = threeInOne.getModal();
      const iframe = await modal.locator('iframe');
      await expect(iframe).toHaveAttribute('src', iframeSrc);
    });
  });

  test(`${features[4].name}, ${features[4].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      await page.goto(`${baseURL}${features[4].path}${features[4].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${features[4].browserParams}&${miloLibs}`);
    });

    await test.step('Validate ThreeInOne modal without DC AddOn', async () => {
      const { iframeSrcNoAddOn, attributes } = features[4];
      const cta = await page.locator('[data-wcs-osi="-lYm-YaTSZoUgv1gzqCgybgFotLqRsLwf8CgYdvdnsQ"][data-checkout-workflow-step="segmentation"]');
      for (const [key, value] of Object.entries(attributes)) {
        await expect(cta).toHaveAttribute(key, value);
      }
      await cta.waitFor({ state: 'visible' });

      // Wait for entitlements to load
      await clickEntitledCta(cta);
      const modal = threeInOne.getModal();
      await page.waitForSelector('.dialog-modal');
      expect(modal).toBeVisible();
      const iframe = await modal.locator('iframe');
      await expect(iframe).toHaveAttribute('src', iframeSrcNoAddOn);
      await threeInOne.closeModal();
    });

    await test.step('Validate ThreeInOne modal with DC AddOn', async () => {
      await page.waitForLoadState('domcontentloaded');
      const { iframeSrcWithAddOn, attributes } = features[4];
      const addon1st = await page.locator('input#addon-checkbox').nth(1);
      expect(addon1st).toBeVisible();
      addon1st.check();
      await page.waitForTimeout(500);
      const cta = await page.locator('[data-wcs-osi="-lYm-YaTSZoUgv1gzqCgybgFotLqRsLwf8CgYdvdnsQ,bKwlW94xSVU_ykn4WHDjS1eiZrXopDo8VD7UhGAKYBI"][data-checkout-workflow-step="segmentation"]');
      for (const [key, value] of Object.entries(attributes)) {
        await expect(cta).toHaveAttribute(key, value);
      }
      await cta.waitFor({ state: 'visible' });
      await clickEntitledCta(cta);
      const modal = threeInOne.getModal();
      await page.waitForSelector('.dialog-modal');
      expect(modal).toBeVisible();
      const iframe = await modal.locator('iframe');
      await expect(iframe).toHaveAttribute('src', iframeSrcWithAddOn);
      await threeInOne.closeModal();
    });
  });
});
