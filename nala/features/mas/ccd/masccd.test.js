import { expect, test } from '@playwright/test';
import { features } from './masccd.spec.js';
import MerchCCD from './masccd.page.js';
import WebUtil from '../../../libs/webutil.js';
import { createWorkerPageSetup, addUrlQueryParams, validateCommerceUrl, DOCS_GALLERY_PATH } from '../../../libs/commerce.js';

let CCD;
let webUtil;

test.skip(({ browserName }) => browserName !== 'chromium', 'Not supported to run on multiple browsers.');

const workerSetup = createWorkerPageSetup({
  pages: [
    { name: 'US_LIGHT', url: DOCS_GALLERY_PATH.CCD.US },
    { name: 'US_DARK', url: addUrlQueryParams(DOCS_GALLERY_PATH.CCD.US, '?theme=darkest') },
    { name: 'FR_LIGHT', url: DOCS_GALLERY_PATH.CCD.FR },
    { name: 'FR_DARK', url: addUrlQueryParams(DOCS_GALLERY_PATH.CCD.FR, '&theme=darkest') },
  ],
});

test.describe('CCD Merchcard feature test suite', () => {
  test.beforeAll(async ({ browser, baseURL }) => {
    await workerSetup.setupWorkerPages({ browser, baseURL });
  });

  test.afterAll(async () => {
    await workerSetup.cleanupWorkerPages();
  });

  test.afterEach(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
    workerSetup.attachWorkerErrorsToFailure(testInfo);
  });

  // *** SUGGESTED CARDS: ***

  // @MAS-CCD-suggested-eyebrow : CCD suggested card with eyebrow, no legal link
  test(`${features[0].name},${features[0].tags}`, async () => {
    const { data } = features[0];
    console.info('[Test]: Using worker-scoped pre-loaded page');

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toContainText(data.eyebrow);
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('data-wcs-osi', data.osi);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec in dark mode', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-strikethrough : CCD suggested card with eyebrow, legal link, strikethrough price and ABM price label
  test(`${features[1].name},${features[1].tags}`, async () => {
    const { data } = features[1];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', data.cardDaaLH);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toContainText(data.eyebrow);
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', data.linkAnalyticsId);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toHaveAttribute('daa-ll', data.linkDaaLL);
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      await expect(await (await CCD.getCardPrice(data.id, 'suggested')).locator(CCD.priceStrikethrough)).toContainText(new RegExp(data.strikethroughPrice));
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(data.abmLabel);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('data-wcs-osi', data.osi);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', data.ctaAnalyticsId);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('daa-ll', data.ctaDaaLL);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'suggested'), CCD.suggestedCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPriceStrikethrough(data.id, 'suggested'), CCD.suggestedCssProp.strikethroughPrice.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'suggested'), CCD.suggestedCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPriceStrikethrough(data.id, 'suggested'), CCD.suggestedCssProp.strikethroughPrice.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-noeyebrow-priceunit : CCD suggested card with no eyebrow, no legal link and price with unit text
  test(`${features[2].name},${features[2].tags}`, async () => {
    const { data } = features[2];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      expect(await (await CCD.getCardPrice(data.id, 'suggested')).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-thin-suggested : CCD suggested card with eyebrow, no legal link and thin-strip background
  test(`${features[3].name},${features[3].tags}`, async () => {
    const { data } = features[3];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toContainText(data.eyebrow);
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-thin-seeterms : CCD suggested card with eyebrow, legal link and thin-strip background
  test(`${features[4].name},${features[4].tags}`, async () => {
    const { data } = features[4];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toContainText(data.eyebrow);
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText('Starting at');
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'suggested'), CCD.suggestedCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'suggested'), CCD.suggestedCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-thin-noeyebrow-priceunit : CCD suggested card with no eyebrow, no legal link and thin-strip background
  test(`${features[5].name},${features[5].tags}`, async () => {
    const { data } = features[5];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      expect(await (await CCD.getCardPrice(data.id, 'suggested')).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-wide-seeterms : CCD suggested card with eyebrow, legal link and wide-strip background
  test(`${features[6].name},${features[6].tags}`, async () => {
    const { data } = features[6];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toContainText(data.eyebrow);
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'suggested'), CCD.suggestedCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardEyebrow(data.id, 'suggested'), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'suggested'), CCD.suggestedCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-wide-noeyebrow-priceunit :
  // CCD suggested card with no eyebrow, no legal link, price with unit text and wide-strip background
  test(`${features[7].name},${features[7].tags}`, async () => {
    const { data } = features[7];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      expect(await (await CCD.getCardPrice(data.id, 'suggested')).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // *** SLICE SINGLE CARDS: ***

  // @MAS-CCD-slice-percentage : CCD single width slice card with mnemonic, badge and price
  test(`${features[8].name},${features[8].tags}`, async () => {
    const { data } = features[8];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', data.cardDaaLH);
      await expect(await CCD.getCardIcon(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.percentage);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('data-wcs-osi', data.osi);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const COMMERCE_URL_WITH_PROMO_REGEX = /https:\/\/commerce\.adobe\.com\/store\/email\?items%5B0%5D%5Bid%5D=([A-F0-9]{32}&apc=AAA12M50US&cli=adobe_com&ctx=fp&co=US&lang=en)/i;
      await expect((await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href)).resolves.toMatch(COMMERCE_URL_WITH_PROMO_REGEX);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', data.ctaAnalyticsId);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('daa-ll', data.ctadDaaLL);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-mnemonics : CCD single width slice card 2 mnemonics
  test(`${features[9].name},${features[9].tags}`, async () => {
    const { data } = features[9];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      const cardIcons = await CCD.getCardIcon(data.id, 'slice');
      expect(await cardIcons.count()).toBe(2);
      expect(await cardIcons.nth(0)).toBeVisible();
      expect(await cardIcons.nth(0)).toHaveAttribute('src', /assets\/img/);
      expect(await cardIcons.nth(1)).toBeVisible();
      expect(await cardIcons.nth(1)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      const cardIcons = await CCD.getCardIcon(data.id, 'slice');
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(0), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(1), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      const cardIcons = await CCD.getCardIcon(data.id, 'slice');
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(0), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(1), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-seeterms : CCD single width slice card with See terms link
  test(`${features[10].name},${features[10].tags}`, async () => {
    const { data } = features[10];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-percentage-seeterms : CCD single width slice card with percentage and See terms link
  test(`${features[11].name},${features[11].tags}`, async () => {
    const { data } = features[11];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.percentage);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-without-mnemonic : CCD single width slice card without mnemonic and without price
  test(`${features[12].name},${features[12].tags}`, async () => {
    const { data } = features[12];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardBadge(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-badge : CCD single width slice card with mnemonic, badge and price
  test(`${features[13].name},${features[13].tags}`, async () => {
    const { data } = features[13];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardBadge(data.id, 'slice')).toContainText(data.badge);
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardBadge(data.id, 'slice'), CCD.sliceCssProp.badge)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardBadge(data.id, 'slice'), CCD.sliceCssProp.badge)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // *** SLICE WIDE (DOUBLE) CARDS: ***

  // @MAS-CCD-slice-wide-seeterms : CCD double width slice card with See terms link
  test(`${features[14].name},${features[14].tags}`, async () => {
    const { data } = features[14];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice-wide')).toHaveAttribute('daa-lh', data.cardDaaLH);
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toContainText(data.description);
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', data.linkAnalyticsId);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('daa-ll', data.linkDaaLL);
      await expect(await CCD.getCardFooterLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardFooterLink(data.id, 'slice-wide')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardFooterLink(data.id, 'slice-wide')).toContainText(data.cta);
      // await (expect(await CCD.getCardCTALink(data.id, "slice-wide")).evaluate((el) => el.href)).resolves.toMatch(COMMERCE_LINK_REGEX());
      // await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
      // await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('daa-ll', data.ctaDaaLL);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardFooterLink(data.id, 'slice-wide'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardFooterLink(data.id, 'slice-wide'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-wide-badge : CCD double width slice card with mnemonic and badge
  test(`${features[15].name},${features[15].tags}`, async () => {
    const { data } = features[15];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice-wide')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).toContainText(data.badge);
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toHaveAttribute('data-wcs-osi', data.osi);
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice-wide')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardBadge(data.id, 'slice-wide'), CCD.sliceCssProp.badge)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardBadge(data.id, 'slice-wide'), CCD.sliceCssProp.badge)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-wide-price : CCD double width slice card with price
  test(`${features[16].name},${features[16].tags}`, async () => {
    const { data } = features[16];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice-wide')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice-wide')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-wide-strikethrough : CCD double width slice card with strikethrough price
  test(`${features[17].name},${features[17].tags}`, async () => {
    const { data } = features[17];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice-wide')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardPriceStrikethrough(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardPriceStrikethrough(data.id, 'slice-wide')).toContainText(new RegExp(data.strikethroughPrice));
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice-wide')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPriceStrikethrough(data.id, 'slice-wide'), CCD.sliceCssProp.strikethroughPrice.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPriceStrikethrough(data.id, 'slice-wide'), CCD.sliceCssProp.strikethroughPrice.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-wide-without-mnemonic : CCD double width slice card without mnemonic
  test(`${features[18].name},${features[18].tags}`, async () => {
    const { data } = features[18];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice-wide')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice-wide')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref)).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('US_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_DARK', `${DOCS_GALLERY_PATH.CCD.US}?theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-upt-link : CCD single width slice card with Universal Promo Terms link
  test(`${features[19].name},${features[19].tags}`, async () => {
    const { data } = features[19];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCardUptLink(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardUptLink(data.id, 'slice')).toContainText(data.linkText);
      await expect(await CCD.getCardUptLink(data.id, 'slice')).toHaveAttribute('href', data.uptLinkUrl);
      await expect(await CCD.getCardUptLink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });
  });

  // @MAS-CCD-FR-suggested-eyebrow : CCD suggested card with eyebrow, no legal link
  test(`${features[20].name},${features[20].tags}`, async () => {
    const { data } = features[20];
    console.info('[Test]: Using worker-scoped pre-loaded FR page');

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('FR_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_LIGHT', DOCS_GALLERY_PATH.CCD.FR, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).toContainText(data.eyebrow);
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('data-wcs-osi', data.osi);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref, { country: 'FR', language: 'fr' })).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
    });
  });

  // @MAS-CCD-regular-footer-link : CCD card with a regular footer link
  test(`${features[21].name},${features[21].tags}`, async () => {
    const { data } = features[21];

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('US_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('US_LIGHT', DOCS_GALLERY_PATH.CCD.US, expect);
    });
    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardFooterLink(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardFooterLink(data.id, 'slice')).not.toHaveAttribute('is');
    });
  });

  // @MAS-CCD-slice-FR : CCD single width slice card in FR locale
  test(`${features[22].name},${features[22].tags}`, async () => {
    const { data } = features[22];
    console.info('[Test]: Using worker-scoped pre-loaded FR page');

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('FR_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_LIGHT', DOCS_GALLERY_PATH.CCD.FR, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice')).toHaveAttribute('daa-lh', /.*/);
      const cardIcons = await CCD.getCardIcon(data.id, 'slice');
      expect(await cardIcons.count()).toBe(2);
      expect(await cardIcons.nth(0)).toBeVisible();
      expect(await cardIcons.nth(0)).toHaveAttribute('src', /assets\/img/);
      expect(await cardIcons.nth(1)).toBeVisible();
      expect(await cardIcons.nth(1)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref, { country: 'FR', language: 'fr' })).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      const cardIcons = await CCD.getCardIcon(data.id, 'slice');
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(0), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(1), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('FR_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_DARK', `${DOCS_GALLERY_PATH.CCD.FR}&theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      const cardIcons = await CCD.getCardIcon(data.id, 'slice');
      await expect(await CCD.getCard(data.id, 'slice')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice'), CCD.sliceCssProp.singleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(0), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await cardIcons.nth(1), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-slice-wide-FR : CCD double width slice card in FR locale
  test(`${features[23].name},${features[23].tags}`, async () => {
    const { data } = features[23];
    console.info('[Test]: Using worker-scoped pre-loaded FR page');

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('FR_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_LIGHT', DOCS_GALLERY_PATH.CCD.FR, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'slice-wide')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'slice-wide')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardBadge(data.id, 'slice-wide')).not.toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardImage(data.id, 'slice-wide')).toHaveAttribute('src', new RegExp(data.background));
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'slice-wide')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toContainText(data.linkText);
      await expect(await CCD.getCardLegalLink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'slice-wide')).toContainText(new RegExp(data.price));
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toHaveAttribute('class', /accent/);
      await expect(await CCD.getCardCTA(data.id, 'slice-wide')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'slice-wide')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref, { country: 'FR', language: 'fr' })).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'slice-wide')).toHaveAttribute('data-analytics-id', /.*/);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('FR_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_DARK', `${DOCS_GALLERY_PATH.CCD.FR}&theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'slice-wide')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'slice-wide'), CCD.sliceCssProp.doubleSize)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'slice-wide'), CCD.sliceCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardLegalLink(data.id, 'slice-wide'), CCD.sliceCssProp.legalLink.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'slice-wide'), CCD.sliceCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'slice-wide'), CCD.sliceCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'slice-wide'), CCD.sliceCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-FR : CCD suggested card in FR locale
  test(`${features[24].name},${features[24].tags}`, async () => {
    const { data } = features[24];
    console.info('[Test]: Using worker-scoped pre-loaded FR page');

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      const page = workerSetup.getPage('FR_LIGHT');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_LIGHT', DOCS_GALLERY_PATH.CCD.FR, expect);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('daa-lh', /.*/);
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardIcon(data.id, 'suggested')).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardTitle(data.id, 'suggested')).toContainText(data.title);
      await expect(await CCD.getCardEyebrow(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardDescription(data.id, 'suggested')).toContainText(data.description);
      await expect(await CCD.getCardLegalLink(data.id, 'suggested')).not.toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardPrice(data.id, 'suggested')).toContainText(new RegExp(data.price));
      expect(await (await CCD.getCardPrice(data.id, 'suggested')).locator('.price-unit-type').innerText()).toContain(data.priceUnit);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toBeVisible();
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toHaveAttribute('class', /primary/);
      await expect(await CCD.getCardCTA(data.id, 'suggested')).toContainText(data.cta);
      const ctaHref = await (await CCD.getCardCTALink(data.id, 'suggested')).evaluate((el) => el.href);
      expect(validateCommerceUrl(ctaHref, { country: 'FR', language: 'fr' })).toBe(true);
      await expect(await CCD.getCardCTALink(data.id, 'suggested')).toHaveAttribute('data-analytics-id', /.*/);
      await expect(await CCD.getCard(data.id, 'suggested')).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const page = workerSetup.getPage('FR_DARK');
      CCD = new MerchCCD(page);
      webUtil = new WebUtil(page);
      await workerSetup.verifyPageURL('FR_DARK', `${DOCS_GALLERY_PATH.CCD.FR}&theme=darkest`, expect);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getCard(data.id, 'suggested')).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getCard(data.id, 'suggested'), CCD.suggestedCssProp.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardIcon(data.id, 'suggested'), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardTitle(data.id, 'suggested'), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardDescription(data.id, 'suggested'), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardPrice(data.id, 'suggested'), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getCardCTA(data.id, 'suggested'), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-loc-masio-id : CCD verify id field in payload for FR locale
  test(`${features[25].name},${features[25].tags}`, async ({ browser }) => {
    const { data } = features[25];
    const testPage = `${features[25].path}?id=${data.id}${features[25].browserParams}`;

    await test.step('step-1: Make API request and verify payload id field', async () => {
      const context = await browser.newContext({ extraHTTPHeaders: { 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' } });
      const page = await context.newPage();

      try {
        const response = await page.goto(testPage);
        const responseData = await response.json();
        expect(responseData.id).toBe(data.loc_id);
      } finally {
        await context.close();
      }
    });
  });
});
