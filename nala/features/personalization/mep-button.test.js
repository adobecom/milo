// to run the test: npm run nala stage mep-button.test.js

import { expect, test } from '@playwright/test';
import { features } from './mep-button.spec.js';
import MepButtonPage from './mep-button.page.js';
import MarqueePage from '../../blocks/marquee/marquee.page.js';

const miloLibs = process.env.MILO_LIBS || '';

let mepButtonLoc;
test.beforeEach(async ({ page }) => {
  mepButtonLoc = new MepButtonPage(page);
});

// Test 0: the manifest link should end in .json
test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[0].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.manifestHref).toHaveCount(1);
});

// Test 1: the mep parameter enables the mep button
test(`${features[1].name},${features[1].tags}`, async ({ page }) => {
  const URL = features[1].path;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(mepButtonLoc.mepButton).toHaveCount(0);

  await page.goto(`${URL}?mep`); // with mep parameter
  await expect(mepButtonLoc.mepButton).toHaveCount(1);
});

// Test 2: the highlight option works, including on merch cards
test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[2].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await mepButtonLoc.mepButton.click();
  await mepButtonLoc.highlightCheckbox.check();
  const highlightCSSContentTextBox = await page.evaluate("window.getComputedStyle(document.querySelector('#text-intro'), '::before').getPropertyValue('content')");
  const highlightCSSContentMerchCard = await page.evaluate("window.getComputedStyle(document.querySelector('.merch-card'), '::before').getPropertyValue('content')");
  const highlightCSSContentMarquee = await page.evaluate("window.getComputedStyle(document.querySelector('.marquee h2'), '::before').getPropertyValue('content')");
  // please note: the nala server sometimes replaces "mep-button.json" with "attr(data-manifest-id)", so the test will only check for this: "content updated by:"
  await expect(highlightCSSContentTextBox).toContain('content updated by:');
  await expect(highlightCSSContentMerchCard).toContain('content updated by:');
  await expect(highlightCSSContentMarquee).toContain('content updated by: ');
});

// Test 3: there should be 3 manifests listed in the manifest button
test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[3].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.manifest).toHaveCount(3);
});

// Test 4: promos should appear appropriately on button
test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[4].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.firstManifestType).toContainText('promo');
  await expect(mepButtonLoc.firstManifestType).toContainText('inactive');
  /*
  The server time on the nala server is different by 6 hours, so these tests are omitted:
  await expect(mepButtonLoc.firstManifestDates).toContainText('Mar 21, 2035 11:00 PM');
  await expect(mepButtonLoc.firstManifestDates).toContainText('Mar 30, 2036 11:00 PM');
  */
});

// Test 5: test the ability to add a manifest via the MEP button
test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
  const marqueePageLoc = new MarqueePage(page);
  const URL = `${baseURL}${features[5].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);
  await expect(marqueePageLoc.marquee).toHaveCount(0);
  await mepButtonLoc.mepButton.click();
  await mepButtonLoc.manifestInput.fill(features[5].data.pathToManifest);
  await mepButtonLoc.previewButton.click();
  await expect(marqueePageLoc.marquee).toHaveCount(1);
});

// Test 6: test the Target status in the MEP button
test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
  const targetOnURL = `${baseURL}${features[6].data.pathOn}${miloLibs}`;
  const targetOffURL = `${baseURL}${features[6].data.pathOff}${miloLibs}`;
  const postLCPURL = `${baseURL}${features[6].data.pathPostLCP}${miloLibs}`;

  console.info(`[Test Page]: ${targetOnURL}`);
  await page.goto(targetOnURL);
  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.targetStatus.nth(0)).toHaveText('on');

  console.info(`[Test Page]: ${postLCPURL}`);
  await page.goto(postLCPURL);
  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.targetStatus.nth(0)).toHaveText('on post LCP');

  console.info(`[Test Page]: ${targetOffURL}`);
  await page.goto(targetOffURL);
  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.targetStatus.nth(0)).toHaveText('off');
});
