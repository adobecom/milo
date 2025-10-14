// import { expect, test } from '@playwright/test';
// import { features } from './plans.spec.js';
// import MasPlans from './plans.page.js';
// import { createWorkerPageSetup, addUrlQueryParams, PLANS_NALA_PATH } from '../../../../libs/commerce.js';

// test.skip(({ browserName }) => browserName !== 'chromium', 'Not supported to run on multiple browsers.');

// const workerSetup = createWorkerPageSetup({
//   pages: [
//     { name: 'US', url: PLANS_NALA_PATH.US },
//   ],
// });

// test.describe('MAS Plans Page test suite', () => {
//   test.beforeAll(async ({ browser, baseURL }) => {
//     await workerSetup.setupWorkerPages({ browser, baseURL });
//   });

//   test.afterAll(async () => {
//     await workerSetup.cleanupWorkerPages();
//   });

//   test.afterEach(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
//     workerSetup.attachWorkerErrorsToFailure(testInfo);
//   });

//   // @MAS-Plans-Load
//   test(`${features[0].name},${features[0].tags}`, async () => {
//     const { data } = features[0];
//     const page = workerSetup.getPage('US');
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page and verify initial state and two cards', async () => {
//       await workerSetup.verifyPageURL('US', PLANS_NALA_PATH.US, expect);
//       await page.waitForLoadState('domcontentloaded');
//       await page.waitForSelector('merch-card-collection');
//     });

//     await test.step('step-2: Verify cards content is visible', async () => {
//       await expect(await masPlans.getCard(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCard(data.cards[0].id)).toHaveAttribute('size', 'wide');
//       await expect(await masPlans.getCard(data.cards[1].id)).toBeVisible();

//       await expect(await masPlans.getCardBadge(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardBadge(data.cards[0].id)).toContainText(new RegExp(data.cards[0].badge));

//       await expect(await masPlans.getCardIcon(data.cards[0].id)).toBeVisible();
//       const card2Icons = await masPlans.getCardIcon(data.cards[1].id);
//       expect(await card2Icons.count()).toBe(2);
//       await expect(await card2Icons.nth(0)).toBeVisible();
//       await expect(await card2Icons.nth(1)).toBeVisible();

//       await expect(await masPlans.getCardTitle(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardTitle(data.cards[0].id)).toHaveText(data.cards[0].title);
//       await expect(await masPlans.getCardTitle(data.cards[1].id)).toBeVisible();
//       await expect(await masPlans.getCardTitle(data.cards[1].id)).toHaveText(data.cards[1].title);

//       await expect(await masPlans.getCardPrice(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardPrice(data.cards[0].id)).toContainText(new RegExp(data.cards[0].price));
//       await expect(await masPlans.getCardPrice(data.cards[0].id)).toContainText(data.cards[0].abmLabel);
//       await expect(await masPlans.getCardPrice(data.cards[1].id)).toBeVisible();
//       await expect(await masPlans.getCardPrice(data.cards[1].id)).toContainText(new RegExp(data.cards[1].price));
//       await expect(await masPlans.getCardPrice(data.cards[1].id)).toContainText(data.cards[1].abmLabel);

//       await expect(await masPlans.getCardDescription(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardDescription(data.cards[0].id)).toContainText(data.cards[0].description);
//       await expect(await masPlans.getCardDescription(data.cards[1].id)).toBeVisible();
//       await expect(await masPlans.getCardDescription(data.cards[1].id)).toContainText(data.cards[1].description);

//       await expect(await masPlans.getCardCTA(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardCTA(data.cards[0].id)).toContainText(data.cards[0].cta);
//       expect(await masPlans.getCTAAttribute(data.cards[0].id, 'data-wcs-osi')).toEqual(data.cards[0].osi);

//       await expect(await masPlans.getCardCTA(data.cards[1].id)).toBeVisible();
//       await expect(await masPlans.getCardCTA(data.cards[1].id)).toContainText(data.cards[1].cta);
//       expect(await masPlans.getCTAAttribute(data.cards[1].id, 'data-wcs-osi')).toEqual(data.cards[1].osi);

//       await expect(await masPlans.getCardStockCheckbox(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardStockCheckbox(data.cards[0].id)).toContainText(data.cards[0].stockCheckboxLabel);
//       await expect(await masPlans.getCardStockCheckbox(data.cards[1].id)).toBeVisible();
//       await expect(await masPlans.getCardStockCheckbox(data.cards[1].id)).toContainText(data.cards[1].stockCheckboxLabel);
//       await expect(await masPlans.getCardSecureTransaction(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getCardSecureTransaction(data.cards[1].id)).toBeVisible();
//     });

//     await test.step('step-3: Verify cards links params', async () => {
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toBeVisible();
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toBeVisible();

//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toHaveAttribute('data-analytics-id', data.cards[0].linkAnalyticsId);
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toHaveAttribute('data-analytics-id', data.cards[1].linkAnalyticsId);

//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toHaveAttribute('daa-ll', data.cards[0].linkDaaLL);
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toHaveAttribute('daa-ll', data.cards[1].linkDaaLL);

//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toHaveAttribute('aria-label', data.cards[0].linkAriaLabel);
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toHaveAttribute('aria-label', data.cards[1].linkAriaLabel);

//       // Verify checkout parameters for both cards "See All Plans" links
//       for (const card of data.cards) {
//         const linkHref = await masPlans.getSeeAllPlans3in1Link(card.id).getAttribute('href');
//         const searchParams = new URLSearchParams(decodeURI(linkHref).split('?')[1]);
//         const workflowStep = decodeURI(linkHref).split('?')[0];

//         expect(workflowStep).toContain('commerce.adobe.com');

//         const paramKeys = Object.keys(card.checkoutParams);
//         for (const paramKey of paramKeys) {
//           expect(searchParams.get(paramKey)).toBe(card.checkoutParams[paramKey]);
//         }
//       }
//     });

//     await test.step('step-4: Verify cards CTAs params', async () => {
//       await expect(await masPlans.getCardCTA(data.cards[0].id)).toHaveAttribute('data-analytics-id', data.cards[0].ctaAnalyticsId);
//       await expect(await masPlans.getCardCTA(data.cards[1].id)).toHaveAttribute('data-analytics-id', data.cards[1].ctaAnalyticsId);

//       await expect(await masPlans.getCardCTA(data.cards[0].id)).toHaveAttribute('daa-ll', data.cards[0].ctaDaaLL);
//       await expect(await masPlans.getCardCTA(data.cards[1].id)).toHaveAttribute('daa-ll', data.cards[1].ctaDaaLL);

//       await expect(await masPlans.getCardCTA(data.cards[0].id)).toHaveAttribute('aria-label', data.cards[0].ctaAriaLabel);
//       await expect(await masPlans.getCardCTA(data.cards[1].id)).toHaveAttribute('aria-label', data.cards[1].ctaAriaLabel);

//       // Verify checkout parameters for both cards
//       for (const card of data.cards) {
//         const ctaHref = await masPlans.getCardCTA(card.id).getAttribute('href');
//         const searchParams = new URLSearchParams(decodeURI(ctaHref).split('?')[1]);
//         const workflowStep = decodeURI(ctaHref).split('?')[0];

//         expect(workflowStep).toContain('commerce.adobe.com');

//         const paramKeys = Object.keys(card.checkoutParams);
//         for (const paramKey of paramKeys) {
//           expect(searchParams.get(paramKey)).toBe(card.checkoutParams[paramKey]);
//         }
//       }
//     });
//   });

//   // @MAS-Plans-Category
//   test(`${features[1].name},${features[1].tags}`, async () => {
//     const { data } = features[1];
//     const page = workerSetup.getPage('US');

//     await test.step('step-1: Go to Plans page', async () => {
//       await workerSetup.verifyPageURL('US', PLANS_NALA_PATH.US, expect);
//       await page.waitForLoadState('domcontentloaded');
//       await page.waitForSelector('merch-card-collection');
//       const visibleCards = page.locator('merch-card:visible');
//       await expect(visibleCards).toHaveCount(data.categories.all.count);
//     });

//     const categoryNames = Object.keys(data.categories).filter((key) => key !== 'all');

//     for (const [index, categoryName] of categoryNames.entries()) {
//       const categoryData = data.categories[categoryName];
//       const stepNumber = index + 2; // Start from step 2
//       const masPlans = new MasPlans(page);

//       await test.step(`step-${stepNumber}: Verify ${categoryName} category products`, async () => {
//         const categoryFilter = masPlans.getCategoryFilter(categoryName);
//         await categoryFilter.click();
//         await page.waitForSelector('merch-card:visible');
//         await expect(page).toHaveURL(`${PLANS_NALA_PATH.US}${categoryData.browserFilter}`);
//         await expect(await masPlans.sidenav).toHaveAttribute('value', categoryData.sidenavValue);
//         await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
//         await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', categoryData.daaLh);

//         const visibleCards = page.locator('merch-card:visible');
//         await expect(visibleCards).toHaveCount(categoryData.count);

//         const productTitles = await visibleCards.locator('h3').allTextContents();
//         categoryData.products.forEach((expectedProduct) => {
//           expect(productTitles).toContain(expectedProduct);
//         });
//       });
//     }
//   });

//   // @MAS-Plans-Tabs-Deeplink
//   test(`${features[2].name},${features[2].tags}`, async () => {
//     const { data } = features[2];
//     const page = workerSetup.getPage('US');

//     const tabNames = Object.keys(data.tabs);

//     for (const [index, tabName] of tabNames.entries()) {
//       const tabData = data.tabs[tabName];
//       const stepNumber = index + 1;
//       const masPlans = new MasPlans(page);

//       await test.step(`step-${stepNumber}: Verify ${tabName} tab deeplink and content`, async () => {
//         const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, tabData.urlParam);
//         await page.goto(targetUrl);
//         await page.waitForLoadState('domcontentloaded');
//         const expectedUrl = addUrlQueryParams(PLANS_NALA_PATH.US);
//         await workerSetup.verifyPageURL('US', expectedUrl, expect);

//         const tab = masPlans.getTabs(tabData.tabId);
//         await expect(tab).toHaveAttribute('aria-selected', 'true');
//         const controlledContentId = await tab.getAttribute('aria-controls');
//         const controlledContent = page.locator(`#${controlledContentId}`);
//         await expect(controlledContent).toBeVisible();
//       });
//     }
//   });

//   // @MAS-Plans-Modal-Deeplink
//   test(`${features[3].name},${features[3].tags}`, async ({ page }) => {
//     await test.step('step-1: Go to Plans page', async () => {
//       const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, features[3].browserParams);
//       await page.goto(targetUrl);
//       await page.waitForLoadState('domcontentloaded');
//       await expect(page.locator(`.dialog-modal.three-in-one${features[3].browserParams}`)).toBeVisible({ timeout: 10000 });
//     });
//   });

//   // @MAS-Plans-Single-App-Deeplink
//   test(`${features[4].name},${features[4].tags}`, async ({ page }) => {
//     const { data } = features[4];
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page with edu deeplink', async () => {
//       const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, features[4].browserParams.landing);
//       await page.goto(targetUrl);
//       await page.waitForLoadState('domcontentloaded');
//       await page.waitForSelector('merch-card-collection');
//     });

//     await test.step('step-2: Verify hash URL changed correctly', async () => {
//       await expect(page).toHaveURL(`${PLANS_NALA_PATH.US}${features[4].browserParams.expected}`);
//     });

//     await test.step('step-3: Verify correct filter is selected', async () => {
//       await expect(await masPlans.sidenavList).toHaveAttribute('selected-value', data.selectedValue);
//       await expect(await masPlans.getCategoryFilter(data.filter)).toHaveAttribute('selected');
//     });

//     await test.step('step-4: Verify the card is moved to the second position', async () => {
//       const visibleCards = page.locator('merch-card:visible');
//       await expect(await visibleCards.nth(1)).toHaveAttribute('id', data.cardid);
//     });
//   });

//   // @MAS-Plans-Filter-Hash
//   test(`${features[5].name},${features[5].tags}`, async ({ page }) => {
//     const { data } = features[5];
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page with edu deeplink', async () => {
//       const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, features[5].browserParams.landing);
//       await page.goto(targetUrl);
//       await page.waitForLoadState('domcontentloaded');
//       await page.waitForSelector('merch-card-collection');
//     });

//     await test.step('step-2: Verify hash URL changed correctly', async () => {
//       await expect(page).toHaveURL(`${PLANS_NALA_PATH.US}${features[5].browserParams.expected}`);
//     });

//     await test.step('step-3: Verify correct filter is selected', async () => {
//       await expect(await masPlans.sidenavList).toHaveAttribute('selected-value', data.selectedValue);
//       await expect(await masPlans.getCategoryFilter(data.filter)).toHaveAttribute('selected');
//     });
//   });

//   // @MAS-Plans-Buynow-Modal-Stock
//   test(`${features[6].name},${features[6].tags}`, async ({ page }) => {
//     const { data } = features[6];
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page', async () => {
//       const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, features[6].browserParams);
//       await page.goto(targetUrl);
//       await page.waitForLoadState('domcontentloaded');
//     });

//     await test.step('step-2: Verify CTA opens modal', async () => {
//       await expect(await masPlans.getCardCTA(data.cardid)).toBeVisible({ timeout: 30000 });
//       await expect(await masPlans.getCardCTA(data.cardid)).not.toHaveClass(/loading-entitlements|placeholder-pending|placeholder-failed/);
//       await expect(await masPlans.getCardStockCheckbox(data.cardid)).not.toHaveAttribute('checked');
//       expect(await masPlans.getCTAAttribute(data.cardid, 'data-wcs-osi')).not.toContain(data.stockOSI);
//       await masPlans.getCardCTA(data.cardid).click();
//       await expect(await masPlans.threeInOneModal).toBeVisible();

//       await masPlans.closeModal();
//       await expect(await masPlans.threeInOneModal).not.toBeVisible({ timeout: 5000 });
//       await page.waitForTimeout(2000);
//     });

//     await test.step('step-3: Check Stock checkbox', async () => {
//       await expect(await masPlans.getCardStockCheckbox(data.cardid)).toBeVisible();
//       await masPlans.getCardStockCheckbox(data.cardid).locator('[role="checkbox"]').click();
//       await expect(await masPlans.getCardStockCheckbox(data.cardid)).toHaveAttribute('checked');
//       await page.waitForTimeout(2000);
//     });

//     await test.step('step-4: Verify Stock offer in the CTA and modal', async () => {
//       await expect(await masPlans.getCardCTA(data.cardid)).toBeVisible();
//       await expect(await masPlans.getCardCTA(data.cardid)).not.toHaveClass(/loading-entitlements|placeholder-pending|placeholder-failed/);
//       expect(await masPlans.getCTAAttribute(data.cardid, 'data-wcs-osi')).toContain(data.stockOSI);
//       expect(await masPlans.getCTAAttribute(data.cardid, 'href')).toContain(data.stockCheckoutParam);

//       await masPlans.getCardCTA(data.cardid).click();
//       await expect(await masPlans.threeInOneModal).toBeVisible();
//       const frame = page.frameLocator('iframe:visible');
//       await expect(frame.locator(masPlans.threeInOneStockCheckbox)).toBeVisible({ timeout: 30000 });
//       await expect(frame.locator(masPlans.threeInOneStockCheckbox)).toBeChecked();
//     });
//   });

//   // @MAS-Plans-See-All-Plans-Modal-Stock
//   test(`${features[7].name},${features[7].tags}`, async () => {
//     const { data } = features[7];
//     const page = workerSetup.getPage('US');
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page', async () => {
//       await workerSetup.verifyPageURL('US', PLANS_NALA_PATH.US, expect);
//       await page.waitForLoadState('domcontentloaded');
//     });

//     await test.step('step-2: Verify CTA opens modal', async () => {
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cardid)).toBeVisible();
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cardid)).not.toHaveClass(/loading-entitlements|placeholder-pending|placeholder-failed/);
//       await expect(await masPlans.getCardStockCheckbox(data.cardid)).not.toHaveAttribute('checked');
//       await masPlans.getSeeAllPlans3in1Link(data.cardid).click();
//       await expect(await masPlans.threeInOneModal).toBeVisible();

//       await masPlans.closeModal();
//       await expect(await masPlans.threeInOneModal).not.toBeVisible({ timeout: 5000 });
//       await page.waitForTimeout(2000);
//     });

//     await test.step('step-3: Check Stock checkbox', async () => {
//       await expect(await masPlans.getCardStockCheckbox(data.cardid)).toBeVisible();
//       await masPlans.getCardStockCheckbox(data.cardid).locator('[role="checkbox"]').click();
//       await expect(await masPlans.getCardStockCheckbox(data.cardid)).toHaveAttribute('checked');
//       await page.waitForTimeout(2000);
//     });

//     await test.step('step-4: Verify Stock offer in the link and modal', async () => {
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cardid)).toBeVisible();
//       await expect(await masPlans.getSeeAllPlans3in1Link(data.cardid)).not.toHaveClass(/loading-entitlements|placeholder-pending|placeholder-failed/);
//       expect(await masPlans.getSeeAllPlans3in1Link(data.cardid).getAttribute('data-wcs-osi')).toContain(data.stockOSI);
//       expect(await masPlans.getSeeAllPlans3in1Link(data.cardid).getAttribute('href')).toContain(data.stockCheckoutParam);

//       await masPlans.getSeeAllPlans3in1Link(data.cardid).click();
//       await expect(await masPlans.threeInOneModal).toBeVisible();
//       const frame = await page.frameLocator('iframe:visible');
//       await expect(await frame.locator(masPlans.threeInOneStockCheckbox)).toBeVisible({ timeout: 30000 });
//       await expect(await frame.locator(masPlans.threeInOneStockCheckbox)).toBeChecked();

//       await masPlans.closeModal();
//     });
//   });

//   // @MAS-Plans-Quantity-Selector
//   test(`${features[8].name},${features[8].tags}`, async ({ page }) => {
//     const { data } = features[8];
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page', async () => {
//       const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, features[8].browserParams);
//       await page.goto(targetUrl);
//       await page.waitForLoadState('domcontentloaded');
//     });

//     await test.step('step-2: Change quantity', async () => {
//       await expect(await masPlans.getCard(data.cardid)).toBeVisible({ timeout: 30000 });
//       await expect(await masPlans.getCardQS(data.cardid).locator('input')).toHaveValue('1');
//       await masPlans.getCardQS(data.cardid).locator('button').click();
//       await expect(await masPlans.getCardQS(data.cardid).locator('.popover')).toBeVisible();
//       await masPlans.getCardQS(data.cardid).locator('.popover').locator(`.item:has-text("${data.quantity}")`).click();
//       await expect(await masPlans.getCardQS(data.cardid).locator('input')).toHaveValue(`${data.quantity}`);
//     });

//     await test.step('step-2: Open modal and verify quantity', async () => {
//       await expect(await masPlans.getCardCTA(data.cardid)).toBeVisible();
//       await expect(await masPlans.getCardCTA(data.cardid)).not.toHaveClass(/loading-entitlements|placeholder-pending|placeholder-failed/);
//       await masPlans.getCardCTA(data.cardid).click();
//       await expect(await masPlans.threeInOneModal).toBeVisible();
//       const frame = page.frameLocator('iframe:visible');
//       await expect(frame.locator(masPlans.threeInOneQuantitySelector)).toBeVisible({ timeout: 30000 });
//       await expect(frame.locator(masPlans.threeInOneQuantitySelector).locator('button')).toContainText(`${data.quantity}`);
//     });
//   });

//   // @MAS-Plans-literals-override
//   test(`${features[9].name},${features[9].tags}`, async ({ page }) => {
//     const { data } = features[9];
//     const masPlans = new MasPlans(page);

//     await test.step('step-1: Go to Plans page', async () => {
//       const targetUrl = addUrlQueryParams(PLANS_NALA_PATH.US, features[9].browserParams);
//       await page.goto(targetUrl);
//       await page.waitForLoadState('domcontentloaded');
//     });

//     await test.step('step-2: Verify the literals are overridden', async () => {
//       await expect(await masPlans.getCard(data.cardid)).toBeVisible({ timeout: 30000 });
//       await expect(await masPlans.getCardPrice(data.cardid)).toContainText(data.unitText);
//     });
//   });
// });
