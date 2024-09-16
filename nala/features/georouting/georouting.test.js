import { expect, test } from '@playwright/test';
import { features } from './georouting.spec.js';
import Georouting from './georouting.page.js';

let modal;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Georouting feature test suite', () => {
  test.beforeEach(async ({ page }) => {
    modal = new Georouting(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL, browserName }) => {
    test.skip(browserName === 'webkit', 'This feature is failing on Webkit browsers');
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Clear cookies and access "DE" page from "US" region', async () => {
      await page.context().clearCookies();
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
      await modal.geoModal.waitFor({ state: 'visible', timeout: 30000 });
    });

    await test.step('step-2: Verify georouting modal and its content', async () => {
      expect(await modal.verifyGeoModal(data)).toBeTruthy();
    });

    await test.step('step-3: Click "Deutschland" link from modal and then verify international cookie value', async () => {
      await modal.deLink.click();
      expect((await page.context().cookies()).find((cookie) => cookie.name === data.cookieName).value).toEqual(data.cookieValue);
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[1].path}&${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Clear cookies and access "US" page with query param (akamailLocale=DE)', async () => {
      await page.context().clearCookies();
      await page.goto(`${baseURL}${features[1].path}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}&${miloLibs}`);
      await modal.geoModal.waitFor({ state: 'visible', timeout: 10000 });
    });

    await test.step('step-2: Verify georouting modal and its content', async () => {
      expect(await modal.verifyGeoModal(data)).toBeTruthy();
    });

    await test.step('step-3: Click "Deutschland" button and then verify international cookie value', async () => {
      await modal.deLink.click();
      expect((await page.context().cookies()).find((cookie) => cookie.name === data.cookieName).value).toEqual(data.cookieValue);
    });
  });

  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Clear cookies and access "US" page', async () => {
      await page.context().clearCookies();
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Click "Change region" link from footer and navigate to "Deutschland" page', async () => {
      await modal.changeRegionLink.click();
      await modal.changeRegionModal.waitFor({ state: 'visible', timeout: 10000 });
      await modal.deLink.click();
    });

    await test.step('step-3: Verify international cookie value', async () => {
      expect((await page.context().cookies()).find((cookie) => cookie.name === data.cookieName).value).toEqual(data.cookieValue);
    });
  });

  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[3].path}&${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Clear cookies and access "US" page', async () => {
      await page.context().clearCookies();
      await page.goto(`${baseURL}${features[3].path}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}&${miloLibs}`);
      await modal.geoModal.waitFor({ state: 'visible', timeout: 10000 });
    });

    await test.step('step-2: Verify multi tab georouting modal and its content', async () => {
      expect(await modal.verifyMultiTabGeoModal(data)).toBeTruthy();
    });
  });

  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);

    await test.step('step-1: Clear cookies and access given "DE" page', async () => {
      await page.context().clearCookies();
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
    });

    await test.step('step-2: Verify that georouting modal is not shown', async () => {
      await expect(await modal.geoModal).not.toBeVisible();
    });
  });

  test(`${features[5].name},${features[5].tags}`, async ({ page, browserName, baseURL }) => {
    test.skip(browserName === 'webkit', 'This feature is failing on Webkit browsers');
    test.slow();
    console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
    const { data } = features[5];

    await test.step('step-1: Clear cookies and access given "DE" page', async () => {
      await page.context().clearCookies();
      await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
      await modal.geoModal.waitFor({ state: 'visible', timeout: 10000 });
    });

    await test.step('step-2: Close the georouting modal and then check that international cookie is not added', async () => {
      await modal.geoModalClose.click();
      expect((await page.context().cookies()).find((cookie) => cookie.name === data.cookieName)).toBeUndefined();
    });
  });
});
