// to run the test: npm run nala stage mep-button.test.js

import { expect, test } from '@playwright/test';
import { features } from './mep-button.spec.js';

const miloLibs = process.env.MILO_LIBS || '';
const mepButtonLoc = '.mep-badge';

// Test 0: the href of the pencil icon in the MEP Button should have a link which ends in .json (linking to a mep manifest)"
test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const pencilIconHrefLoc = '.mep-edit-manifest[href$=".json"]'; // pencil icon with href that ends in .json
  const URL = `${baseURL}${features[0].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await page.locator(mepButtonLoc).click();
  await expect(page.locator(pencilIconHrefLoc)).toHaveCount(1);
});

// Test 1: the mep parameter enables the mep button
test(`${features[1].name},${features[1].tags}`, async ({ page }) => {
  const URL = features[1].path;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(page.locator(mepButtonLoc)).toHaveCount(0);

  await page.goto(`${URL}?mep`); // with mep parameter
  await expect(page.locator(mepButtonLoc)).toHaveCount(1);
});

// Test 2: the highlight option works, including on merch cards
test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[2].path}${miloLibs}`;
  const highlightLoc = '#mepHighlightCheckbox'; // hightlight checkbox

  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await page.locator(mepButtonLoc).click();
  await page.locator(highlightLoc).check();
  const highlightCSSContentTextBox = await page.evaluate("window.getComputedStyle(document.querySelector('#text-intro'), '::before').getPropertyValue('content')");
  const highlightCSSContentMerchCard = await page.evaluate("window.getComputedStyle(document.querySelector('.merch-card'), '::before').getPropertyValue('content')");
  const highlightCSSContentMarquee = await page.evaluate("window.getComputedStyle(document.querySelector('.marquee h2'), '::before').getPropertyValue('content')");
  await expect(highlightCSSContentTextBox).toContain('content updated by: mep-button.json');
  await expect(highlightCSSContentMerchCard).toContain('content updated by: mep-button.json');
  await expect(highlightCSSContentMarquee).toContain('content updated by: mep-button.json');
});

// Test 3: there should be 3 manifests on this page
test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[3].path}${miloLibs}`;
  const pencilIconLoc = '.mep-edit-manifest';
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await page.locator(mepButtonLoc).click();
  await page.waitForTimeout(100);
  await expect(page.locator(pencilIconLoc)).toHaveCount(3);
});
