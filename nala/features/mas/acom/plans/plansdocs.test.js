// import { expect, test } from '@playwright/test';
// import { features } from './plansdocs.spec.js';
// import MasPlans from './plans.page.js';
// import WebUtil from '../../../../libs/webutil.js';
// import { createWorkerPageSetup, validateCommerceUrl, DOCS_GALLERY_PATH } from '../../../../libs/commerce.js';

// let acomPage;
// let webUtil;

// test.skip(({ browserName }) => browserName !== 'chromium', 'Not supported to run on multiple browsers.');

// const workerSetup = createWorkerPageSetup({
//   pages: [
//     { name: 'US', url: DOCS_GALLERY_PATH.PLANS },
//   ],
// });

// test.describe('ACOM MAS cards feature test suite', () => {
//   test.beforeAll(async ({ browser, baseURL }) => {
//     await workerSetup.setupWorkerPages({ browser, baseURL });
//   });

//   test.afterAll(async () => {
//     await workerSetup.cleanupWorkerPages();
//   });

//   test.afterEach(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
//     workerSetup.attachWorkerErrorsToFailure(testInfo);
//   });

// *** PLANS CARDS: ***

// @MAS-Plans
// test(`${features[0].name},${features[0].tags}`, async () => {
//   const { data } = features[0];

//   await test.step('step-1: Go to Plans Merch Card feature test page', async () => {
//     const page = workerSetup.getPage('US');
//     acomPage = new MasPlans(page);
//     webUtil = new WebUtil(page);

//     await workerSetup.verifyPageURL('US', DOCS_GALLERY_PATH.PLANS, expect);
//   });

//   await test.step('step-2: Verify Plans Merch Card content', async () => {
//     await expect(acomPage.getCard(data.id)).toBeVisible();
//     await expect(acomPage.getCardIcon(data.id)).toBeVisible();
//     await expect(acomPage.getCardIcon(data.id)).toHaveAttribute('src', /content\/dam/);
//     await expect(await acomPage.getCardTitle(data.id)).toBeVisible();
//     await expect(await acomPage.getCardTitle(data.id)).toContainText(data.title);
//     const description = await acomPage.getCardDescription(data.id);
//     await expect(description).toBeVisible();
//     await expect(description).toContainText(data.description);
//     await expect(description).toContainText(data.description);
//     await expect(await acomPage.getSeeAllPlansLink(data.id)).toHaveText(data.seeAllPlansText);
//     // await expect(await acomPage.getCardStockCheckbox(data.id)).toContainText(data.stockCheckboxLabel);
//     await expect(await acomPage.getCardPrice(data.id)).toBeVisible();
//     await expect(await acomPage.getCardPrice(data.id)).toContainText(new RegExp(data.price));
//     await expect(await acomPage.getCardPromoText(data.id)).toBeVisible();
//     await expect(await acomPage.getCardPromoText(data.id)).toContainText(data.promoText);
//     await expect(await acomPage.getCardCTA(data.id)).toBeVisible();
//     await expect(await acomPage.getCardCTA(data.id)).toHaveAttribute('class', /con-button blue/);
//     await expect(await acomPage.getCardCTA(data.id)).toHaveAttribute('data-wcs-osi', data.ctaOsi);
//     await expect(await acomPage.getCardCTA(data.id)).toContainText(data.cta);
//     const ctaHref = await (await acomPage.getCardCTA(data.id)).evaluate((el) => el.href);
//     expect(validateCommerceUrl(ctaHref, { requiredParams: ['apc'] })).toBe(true);
//     await expect(await acomPage.getCardCTA(data.id)).toHaveAttribute('data-analytics-id', /.*/);
//   });
// });

// // @MAS-Plans-CSS
// test(`${features[1].name},${features[1].tags}`, async () => {
//   const { data } = features[1];

//   await test.step('step-1: Go to Plans Merch Card feature test page', async () => {
//     const page = workerSetup.getPage('US');
//     acomPage = new MasPlans(page);
//     webUtil = new WebUtil(page);

//     await workerSetup.verifyPageURL('US', DOCS_GALLERY_PATH.PLANS, expect);
//   });

//   await test.step('step-2: Verify Plans Merch Card CSS', async () => {
//     await expect(acomPage.getCard(data.id)).toBeVisible();
//     expect(await webUtil.verifyCSS(await acomPage.getCard(data.id), acomPage.cssProp.card)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardIcon(data.id), acomPage.cssProp.icon)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardBadge(data.id), acomPage.cssProp.badge)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardTitle(data.id), acomPage.cssProp.title)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardPrice(data.id), acomPage.cssProp.price)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardStrikethroughPrice(data.id), acomPage.cssProp.strikethroughPrice)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardPromoText(data.id), acomPage.cssProp.promoText)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardDescription(data.id).first(), acomPage.cssProp.description)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getSeeAllPlansLink(data.id), acomPage.cssProp.legalLink)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardCallout(data.id), acomPage.cssProp.callout)).toBeTruthy();
//     // expect(await webUtil.verifyCSS(await acomPage.getCardStockCheckbox(data.id), acomPage.cssProp.stockCheckbox.text)).toBeTruthy();
//     // expect(await webUtil.verifyCSS(await acomPage.getCardStockCheckboxIcon(data.id), acomPage.cssProp.stockCheckbox.checkbox)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardSecureTransaction(data.id), acomPage.cssProp.secureTransaction)).toBeTruthy();
//     expect(await webUtil.verifyCSS(await acomPage.getCardCTA(data.id), acomPage.cssProp.cta)).toBeTruthy();
//   });
// });

// // @MAS-Plans-Students-CSS
// test(`${features[2].name},${features[2].tags}`, async () => {
//   const { data } = features[2];

//   await test.step('step-1: Go to Plans Merch Card feature test page', async () => {
//     const page = workerSetup.getPage('US');
//     acomPage = new MasPlans(page);
//     webUtil = new WebUtil(page);

//     await workerSetup.verifyPageURL('US', DOCS_GALLERY_PATH.PLANS, expect);
//   });

//   await test.step('step-2: Verify Plans Students Merch Card CSS', async () => {
//     await expect(acomPage.getCard(data.id)).toBeVisible();
//     await expect(acomPage.getCard(data.id)).toHaveAttribute('variant', 'plans-students');
//     expect(await webUtil.verifyCSS(await acomPage.getCard(data.id), acomPage.studentsCssProp.card)).toBeTruthy();
//   });
// });
// });
