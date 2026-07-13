//  to run tests, here are some example commands:
//   npm run nala stage mep-next-button.test.js mode=debug
//   npm run nala stage tag=mepnext1 mode=debug

import { expect, test } from '@playwright/test';
import { features } from './mep-next-button.spec.js';
import MepButton from './mep-next-button.page.js';

const miloLibs = process.env.MILO_LIBS || '';

let mepButtonLoc;
test.beforeEach(async ({ page }) => {
  mepButtonLoc = new MepButton(page);
});

// Test 0: highlight options should show correct fragment paths, caas/mas badges
test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[0].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  // test the negative case first
  // test 4 will test the negative case for a MEP fragment

  await expect(mepButtonLoc.caasBadge).not.toBeVisible();
  await expect(mepButtonLoc.masCopyIDBadge).not.toBeVisible();

  // highlight options
  await mepButtonLoc.mepButton.click();

  await mepButtonLoc.expandIcon2.click();
  await mepButtonLoc.card2toggle1.click();
  await mepButtonLoc.card2toggle2.click();
  await mepButtonLoc.card2toggle3.click();
  await mepButtonLoc.card2toggle4.click();

  // test the positive case
  const fragment1attribute = await mepButtonLoc.fragment1.getAttribute('data-manifest-display');
  await expect(fragment1attribute).toContain('/drafts/nala/features/personalization/mep-next-button/fragments/insert-marquee');

  await expect(mepButtonLoc.fragment2).toHaveAttribute('data-fragment-display', '/drafts/nala/features/personalization/mep-next-button/fragments/fragment-in-base-page');

  await expect(mepButtonLoc.caasBadge).toBeVisible();
  await expect(mepButtonLoc.masCopyIDBadge).toBeVisible();
});

/* only works with a real domain (when code is live):

// Test 1: the mep button only appears with the mep URL parameter
test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page }) => {
  const URL = `${features[1].fullURL}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);

  // without the mep parameter the button should not appear
  await page.goto(URL);
  await expect(mepButtonLoc.mepButton).toHaveCount(0);

  // with the mep parameter the button should appear
  const mepURL = URL.includes('?') ? `${URL}&mep` : `${URL}?mep`;
  await page.goto(mepURL);
  await expect(mepButtonLoc.mepButton).toHaveCount(1);
});

*/

// Test 2: the close button should hide the drawer
test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[2].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  await mepButtonLoc.closeButton.click();
  // await expect(mepButtonLoc.mepButtonExpanded).not.toBeVisible();
  // alternate code because the above line of code mysteriously fails:
  await page.waitForTimeout(1500);
  const opacity = await mepButtonLoc.mepButtonExpanded.evaluate((el) => getComputedStyle(el).opacity);
  await expect(opacity).toBe('0');
});

// Test 3: the Actions and Summary tabs should switch content
test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[3].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // Actions tab is active by default
  await expect(mepButtonLoc.actionsTabContent).toBeVisible();
  await expect(mepButtonLoc.summaryTabContent).toBeHidden();

  // switch to the Summary tab
  await mepButtonLoc.summaryTab.click();
  await expect(mepButtonLoc.summaryTabContent).toBeVisible();
  await expect(mepButtonLoc.actionsTabContent).toBeHidden();

  // switch back to the Actions tab
  await mepButtonLoc.actionsTab.click();
  await expect(mepButtonLoc.actionsTabContent).toBeVisible();
  await expect(mepButtonLoc.summaryTabContent).not.toBeVisible();
});

// Test 4: toggling MEP highlight should set the highlight data attribute on the body
test(`[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[4].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // expand the Highlight card so its toggles are interactable
  await mepButtonLoc.highlightExpandIcon.click();

  // the checkbox input is visually hidden, so click the switch track to flip it
  await mepButtonLoc.toggleMepTrack.click();
  await expect(page.locator('body')).toHaveAttribute('data-mep-highlight', 'true');

  await mepButtonLoc.toggleMepTrack.click();
  await expect(page.locator('body')).toHaveAttribute('data-mep-highlight', 'false');
});

// Test 5: clicking a card header should expand and collapse the card
test(`[Test Id - ${features[5].tcid}] ${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[5].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // the Highlight card starts collapsed
  await expect(mepButtonLoc.highlightCard).not.toHaveClass(/expanded/);

  // clicking the header expands it
  await mepButtonLoc.highlightExpandIcon.click();
  await expect(mepButtonLoc.highlightCard).toHaveClass(/expanded/);

  // clicking again collapses it
  await mepButtonLoc.highlightExpandIcon.click();
  await expect(mepButtonLoc.highlightCard).not.toHaveClass(/expanded/);
});

// Test 6: enabling MEP highlight should add the mepHighlight param to the Preview button
test(`[Test Id - ${features[6].tcid}] ${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[6].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // enable the MEP highlight toggle
  await mepButtonLoc.highlightExpandIcon.click();
  await mepButtonLoc.toggleMepTrack.click();

  // the Preview button href should carry the highlight param through
  await expect(mepButtonLoc.previewButton).toHaveAttribute('href', /mepHighlight=true/);
});

// Test 7: enabling the Preview Link toggle should add mepButton=off to the Preview button
test(`[Test Id - ${features[7].tcid}] ${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[7].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // enable the Preview Link toggle in the Toggle card
  await mepButtonLoc.toggleCardExpandIcon.click();
  await mepButtonLoc.previewLinkTrack.click();

  // the Preview button href should disable the mep button on the previewed page
  await expect(mepButtonLoc.previewButton).toHaveAttribute('href', /mepButton=off/);
});

// Test 8: the Summary tab should render the summary cards
test(`[Test Id - ${features[8].tcid}] ${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[8].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // switch to the Summary tab and confirm the summary cards render
  await mepButtonLoc.summaryTab.click();
  await expect(mepButtonLoc.summaryTabContent).toBeVisible();
  await expect(mepButtonLoc.pageSummaryCard).toBeVisible();
  await expect(mepButtonLoc.summaryCards).toHaveCount(5);
});

// Test 9: loading a manifest via the Load Manifest field should apply it to the previewed page
test(`[Test Id - ${features[9].tcid}] ${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
  const URL = `${baseURL}${features[9].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);
  await page.goto(URL);

  // the accordion should not be present before the manifest is applied
  await expect(mepButtonLoc.accordion).toHaveCount(0);

  await mepButtonLoc.mepButton.click();
  await expect(mepButtonLoc.mepButtonExpanded).toBeVisible();

  // expand the Load Manifest card and enter the manifest path
  await mepButtonLoc.loadManifestExpandIcon.click();
  await mepButtonLoc.loadManifestInput.fill(features[9].data.pathToManifest);

  // previewing navigates to the page with the manifest applied
  await mepButtonLoc.previewButton.click();

  // the manifest should have inserted the accordion onto the page
  await expect(mepButtonLoc.accordion).toBeVisible();
});
