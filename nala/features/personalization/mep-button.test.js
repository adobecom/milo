// to run the test: npm run nala stage mep-button.test.js

import { expect, test } from '@playwright/test';
import { features } from './mep-button.spec.js';
import MepButtonPage from './mep-button.page.js';

const miloLibs = process.env.MILO_LIBS || '';

let MepButtonLoc;
test.beforeEach(async ({ page }) => {
  MepButtonLoc = new MepButtonPage(page);
});

// Test 0: the href of the pencil icon in the MEP Button should have a link which ends in .json (linking to a mep manifest)"
test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[0].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await MepButtonLoc.mepButton.click();
  await expect(MepButtonLoc.manifestHref).toHaveCount(1);
});

// Test 1: the mep parameter enables the mep button
test(`${features[1].name},${features[1].tags}`, async ({ page }) => {
  const URL = features[1].path;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(MepButtonLoc.mepButton).toHaveCount(0);

  await page.goto(`${URL}?mep`); // with mep parameter
  await expect(MepButtonLoc.mepButton).toHaveCount(1);
});

// Test 2: the highlight option works, including on merch cards
test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[2].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await MepButtonLoc.mepButton.click();
  await MepButtonLoc.highlightCheckbox.check();
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
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await MepButtonLoc.mepButton.click();
  await expect(MepButtonLoc.manifest).toHaveCount(3);
});

// Test 4: promos should appear appropriately on button
test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[4].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await MepButtonLoc.mepButton.click();
  await expect(MepButtonLoc.manifestList).toContainText('promo');
  await expect(MepButtonLoc.manifestList).toContainText('inactive');
  await expect(MepButtonLoc.manifestList).toContainText('Mar 21, 2035 11:00 PM');
  await expect(MepButtonLoc.manifestList).toContainText('Mar 30, 2036 11:00 PM');
});
