import { expect, test } from '@playwright/test';
import { features } from './masacom.spec.js';
import MasAcom from './masacom.page.js';
import WebUtil from '../../../libs/webutil.js';

let acomPage;
let webUtil;
const COMMERCE_LINK_REGEX = /https:\/\/commerce\.adobe\.com\/store\/email\?items%5B0%5D%5Bid%5D=([A-F0-9]{32}&apc=FY25PLES256MROW&cli=adobe_com&ctx=fp&co=US&lang=en)/i;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('ACOM MAS cards feature test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

    webUtil = new WebUtil(page);
    acomPage = new MasAcom(page);
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  // *** PLANS CARDS: ***

  // @MAS-Plans
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    const { data } = features[0];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to Plans Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
    });

    await test.step('step-2: Verify Plans Merch Card content', async () => {
      await expect(acomPage.getCard(data.id)).toBeVisible();
      await expect(acomPage.getCardIcon(data.id)).toBeVisible();
      await expect(acomPage.getCardIcon(data.id)).toHaveAttribute('src', /content\/dam/);
      await expect(await acomPage.getCardTitle(data.id)).toBeVisible();
      await expect(await acomPage.getCardTitle(data.id)).toContainText(data.title);
      const description = await acomPage.getCardDescription(data.id);
      await expect(description).toBeVisible();
      await expect(description).toContainText(data.description);
      await expect(description).toContainText(data.description);
      await expect(await acomPage.getSeeAllPlansLink(data.id)).toHaveText(data.seeAllPlansText);
      // await expect(await acomPage.getStockCheckbox(data.id)).toContainText(data.stockCheckboxLabel);
      await expect(await acomPage.getCardPrice(data.id)).toBeVisible();
      await expect(await acomPage.getCardPrice(data.id)).toContainText(data.price);
      await expect(await acomPage.getCardPromoText(data.id)).toBeVisible();
      await expect(await acomPage.getCardPromoText(data.id)).toContainText(data.promoText);
      await expect(await acomPage.getCardCTA(data.id)).toBeVisible();
      await expect(await acomPage.getCardCTA(data.id)).toHaveAttribute('class', /con-button blue/);
      await expect(await acomPage.getCardCTA(data.id)).toHaveAttribute('data-wcs-osi', data.ctaOsi);
      await expect(await acomPage.getCardCTA(data.id)).toContainText(data.cta);
      await expect((await acomPage.getCardCTA(data.id)).evaluate((el) => el.href)).resolves.toMatch(COMMERCE_LINK_REGEX);
      await expect(await acomPage.getCardCTA(data.id)).toHaveAttribute('data-analytics-id', /.*/);
    });
  });

  // @MAS-Plans-CSS
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path}${miloLibs}`;
    const { data } = features[1];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to Plans Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}`);
    });

    await test.step('step-2: Verify Plans Merch Card CSS', async () => {
      await expect(acomPage.getCard(data.id)).toBeVisible();
      expect(await webUtil.verifyCSS(await acomPage.getCard(data.id), acomPage.cssProp.card)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardIcon(data.id), acomPage.cssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardBadge(data.id), acomPage.cssProp.badge)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardTitle(data.id), acomPage.cssProp.title)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardPrice(data.id), acomPage.cssProp.price)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardStrikethroughPrice(data.id), acomPage.cssProp.strikethroughPrice)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardPromoText(data.id), acomPage.cssProp.promoText)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardDescription(data.id).first(), acomPage.cssProp.description)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getSeeAllPlansLink(data.id), acomPage.cssProp.legalLink)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardCallout(data.id), acomPage.cssProp.callout)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await acomPage.getStockCheckbox(data.id), acomPage.cssProp.stockCheckbox.text)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await acomPage.getStockCheckboxIcon(data.id), acomPage.cssProp.stockCheckbox.checkbox)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardSecureTransaction(data.id), acomPage.cssProp.secureTransaction)).toBeTruthy();
      expect(await webUtil.verifyCSS(await acomPage.getCardCTA(data.id), acomPage.cssProp.cta)).toBeTruthy();
    });
  });

  // @MAS-Plans-Students-CSS
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[2].path}${miloLibs}`;
    const { data } = features[2];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to Plans Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}`);
    });

    await test.step('step-2: Verify Plans Students Merch Card CSS', async () => {
      await expect(acomPage.getCard(data.id)).toBeVisible();
      await expect(acomPage.getCard(data.id)).toHaveAttribute('variant', 'plans-students');
      expect(await webUtil.verifyCSS(await acomPage.getCard(data.id), acomPage.studentsCssProp.card)).toBeTruthy();
    });
  });
});
