import { expect, test } from '@playwright/test';
import { features } from './masccd.spec.js';
import MerchCCD from './masccd.page.js';
import WebUtil from '../../libs/webutil.js';

let CCD;
let webUtil;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('CCD Merchcard feature test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    CCD = new MerchCCD(page);
    webUtil = new WebUtil(page);
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  // @MAS-CCD-suggested-eyebrow : CCD suggested card with eyebrow, no legal link
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    const { data } = features[0];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toContainText(data.eyebrow);
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-strikethrough : CCD suggested card with eyebrow, legal link and strikethrough price
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path}${miloLibs}`;
    const { data } = features[1];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toContainText(data.eyebrow);
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).toContainText(data.linkText);
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.strikethroughPrice);
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardLegalLink(data.id), CCD.suggestedCssProp.legalLink)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPriceStrikethrough(data.id), CCD.suggestedCssProp.strikethroughPrice.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[1].path}${features[1].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${features[1].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardLegalLink(data.id), CCD.suggestedCssProp.legalLink)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPriceStrikethrough(data.id), CCD.suggestedCssProp.strikethroughPrice.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-noeyebrow-priceunit : CCD suggested card with no eyebrow, no legal link and price with unit text
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[2].path}${miloLibs}`;
    const { data } = features[2];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /content\/dam/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      expect(await (await CCD.getSuggestedCardPrice(data.id)).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-thin-suggested : CCD suggested card with eyebrow, no legal link and thin-strip background
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[3].path}${miloLibs}`;
    const { data } = features[3];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toContainText(data.eyebrow);
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
      await expect(await CCD.getSuggestedCard(data.id)).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-thin-seeterms : CCD suggested card with eyebrow, legal link and thin-strip background
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[4].path}${miloLibs}`;
    const { data } = features[4];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toContainText(data.eyebrow);
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).toContainText(data.linkText);
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText('Starting at');
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
      await expect(await CCD.getSuggestedCard(data.id)).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardLegalLink(data.id), CCD.suggestedCssProp.legalLink)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[4].path}${features[4].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${features[4].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardLegalLink(data.id), CCD.suggestedCssProp.legalLink)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-thin-noeyebrow-priceunit : CCD suggested card with no eyebrow, no legal link and thin-strip background
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[5].path}${miloLibs}`;
    const { data } = features[5];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      expect(await (await CCD.getSuggestedCardPrice(data.id)).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
      await expect(await CCD.getSuggestedCard(data.id)).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[5].path}${features[5].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${features[5].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-wide-seeterms : CCD suggested card with eyebrow, legal link and wide-strip background
  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[6].path}${miloLibs}`;
    const { data } = features[6];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).toContainText(data.eyebrow);
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).toContainText(data.linkText);
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
      await expect(await CCD.getSuggestedCard(data.id)).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardLegalLink(data.id), CCD.suggestedCssProp.legalLink)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[6].path}${features[6].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}${features[6].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardEyebrow(data.id), CCD.suggestedCssProp.eyebrow.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardLegalLink(data.id), CCD.suggestedCssProp.legalLink)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });

  // @MAS-CCD-suggested-wide-noeyebrow-priceunit :
  // CCD suggested card with no eyebrow, no legal link, price with unit text and wide-strip background
  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[7].path}${miloLibs}`;
    const { data } = features[7];
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardIcon(data.id)).toHaveAttribute('src', /assets\/img/);
      await expect(await CCD.getSuggestedCardTitle(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardTitle(data.id)).toContainText(data.title);
      await expect(await CCD.getSuggestedCardEyebrow(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardDescription(data.id)).toContainText(data.description);
      await expect(await CCD.getSuggestedCardLegalLink(data.id)).not.toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardPrice(data.id)).toContainText(data.price);
      expect(await (await CCD.getSuggestedCardPrice(data.id)).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(await CCD.getSuggestedCardCTA(data.id)).toBeVisible();
      await expect(await CCD.getSuggestedCardCTA(data.id)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      await expect(await CCD.getSuggestedCardCTA(data.id)).toContainText(data.cta);
      await expect(await CCD.getSuggestedCard(data.id)).toHaveAttribute('background-image', new RegExp(data.background));
    });

    await test.step('step-3: Verify CCD Merch Card spec', async () => {
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.light)).toBeTruthy();
      expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.light)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.light)).toBeTruthy();
    });

    await test.step('step-4: Go to CCD Merch Card feature test page in dark mode', async () => {
      const darkThemePage = `${baseURL}${features[7].path}${features[7].browserParams}&${miloLibs}`;
      await page.goto(darkThemePage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}${features[7].browserParams}&${miloLibs}`);
    });

    await test.step('step-5: Verify CCD Merch Card spec', async () => {
      await expect(await CCD.getSuggestedCard(data.id)).toBeVisible();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCard(data.id), CCD.suggestedCssProp.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardIcon(data.id), CCD.suggestedCssProp.icon)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardTitle(data.id), CCD.suggestedCssProp.title.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardDescription(data.id), CCD.suggestedCssProp.description.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardPrice(data.id), CCD.suggestedCssProp.price.dark)).toBeTruthy();
      // expect(await webUtil.verifyCSS(await CCD.getSuggestedCardCTA(data.id), CCD.suggestedCssProp.cta.dark)).toBeTruthy();
    });
  });
});
