/* eslint-disable import/no-extraneous-dependencies, max-len, no-console, no-plusplus */
import { expect, test } from '@playwright/test';
import { features } from './merchcard.spec.js';
import MerchCard from './merchcard.pages.js';

let merchCard;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Merchcard block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    merchCard = new MerchCard(page);
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  // Test 0 : Merch Card (Segment)
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[0].path}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
    });

    await test.step('step-2: Verify Merch Card content/specs', async () => {
      await expect(await merchCard.segment).toBeVisible();
      await expect(await merchCard.segmentTitle).toContainText(data.title);
      // await expect(await merchCard.price).toContainText(data.price);
      // await expect(await merchCard.strikethroughPrice).toContainText(data.strikethroughPrice);

      await expect(await merchCard.segmentDescription1).toContainText(data.description);
      await expect(await merchCard.linkText1).toContainText(data.link1Text);
      await expect(await merchCard.linkText2).toContainText(data.link2Text);
      await expect(await merchCard.footer).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toContainText(data.footerOutlineButtonText);
      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButtonText);
    });
  });

  // Test 1 : Merch Card (Segment) with Badge
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card with Badge content/specs', async () => {
      await expect(await merchCard.segment).toBeVisible();
      await expect(await merchCard.segmentTitle).toContainText(data.title);

      await expect(await merchCard.segmentRibbon).toBeVisible();
      await expect(await merchCard.segmentRibbon).toContainText(data.badgeText);

      // await expect(await merchCard.price).toContainText(data.price);
      // await expect(await merchCard.strikethroughPrice).toContainText(data.strikethroughPrice);

      await expect(await merchCard.segmentDescription1).toContainText(data.description);
      await expect(await merchCard.linkText1).toContainText(data.link1Text);
      await expect(await merchCard.linkText2).toContainText(data.link2Text);

      await expect(await merchCard.footer).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toContainText(data.footerOutlineButtonText);

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButtonText);
    });

    await test.step('step-3: Verify Merch Card attributes', async () => {
      await expect(await merchCard.segmentRibbon).toHaveAttribute('style', merchCard.attributes.segmentRibbon.style);
    });
  });

  // Test 2 : Merch Card (Special Offers)
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card special offers content/specs', async () => {
      await expect(await merchCard.sepcialOffers).toBeVisible();
      await expect(await merchCard.sepcialOffersImage).toBeVisible();

      await expect(await merchCard.sepcialOffersTitleH4).toBeVisible();
      await expect(await merchCard.sepcialOffersTitleH4).toContainText(data.titleH4);
      await expect(await merchCard.sepcialOffersTitleH3).toContainText(data.titleH3);

      await expect(await merchCard.sepcialOffersDescription1).toContainText(data.description1);
      await expect(await merchCard.sepcialOffersDescription2).toContainText(data.description2);

      await expect(await merchCard.footer).toBeVisible();
      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButtonText);
    });
  });

  // Test 3 : Merch Card (Special Offers) with badge
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card special offers content/specs', async () => {
      await expect(await merchCard.sepcialOffers).toBeVisible();
      await expect(await merchCard.sepcialOffersImage).toBeVisible();

      await expect(await merchCard.sepcialOffersRibbon).toBeVisible();
      await expect(await merchCard.sepcialOffersRibbon).toContainText(data.badgeText);

      await expect(await merchCard.sepcialOffersTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.sepcialOffersTitleH4).toContainText(data.titleH4);

      await expect(await merchCard.sepcialOffersDescription1).toContainText(data.description);
      await expect(await merchCard.seeTermsTextLink).toContainText(data.link1Text);

      await expect(await merchCard.footer).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toContainText(data.footerOutlineButtonText);

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButtonText);
    });

    await test.step('step-3: Verify Merch Card attributes', async () => {
      await expect(await merchCard.sepcialOffersRibbon).toHaveAttribute(
        'style',
        merchCard.attributes.specialOfferRibbon.style,
      );
    });
  });

  // Test 4 : Merch Card (plans)
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
    const { data } = features[4];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card special offers content/specs', async () => {
      await expect(await merchCard.plans).toBeVisible();
      await expect(await merchCard.productIcon).toBeVisible();

      await expect(await merchCard.plansCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.plansCardTitleH5).toContainText(data.titleH5);

      // await expect(await merchCard.price).toContainText(data.price);
      await expect(await merchCard.plansCardDescription1).toContainText(data.description);
      await expect(await merchCard.seePlansTextLink).toContainText(data.link1Text);

      await expect(await merchCard.footer).toBeVisible();

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButtonText);
    });
  });

  // Test 5 : Merch Card (plans) with badge
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
    const { data } = features[5];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card special offers content/specs', async () => {
      await expect(await merchCard.plans).toBeVisible();
      await expect(await merchCard.productIcon).toBeVisible();

      await expect(await merchCard.plansRibbon).toBeVisible();
      await expect(await merchCard.plansRibbon).toContainText(data.badgeText);

      await expect(await merchCard.plansCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.plansCardTitleH4).toContainText(data.titleH4);

      // await expect(await merchCard.price).toContainText(data.price);
      await expect(await merchCard.plansCardDescription2).toContainText(data.description);
      await expect(await merchCard.seePlansTextLink).toContainText(data.link1Text);

      await expect(await merchCard.footer).toBeVisible();

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButtonText);
    });
  });

  // Test 6 : Merch Card (plans) with secure
  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[6].path}${miloLibs}`);
    const { data } = features[6];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[6].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card special offers content/specs', async () => {
      await expect(await merchCard.plans).toBeVisible();
      await expect(await merchCard.productIcon).toBeVisible();

      await expect(await merchCard.plansCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.plansCardTitleH5).toContainText(data.titleH5);

      // await expect(await merchCard.price).toContainText(data.price);
      await expect(await merchCard.plansCardDescription1).toContainText(data.description);
      await expect(await merchCard.seePlansTextLink).toContainText(data.link1Text);

      await expect(await merchCard.footer).toBeVisible();

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButton1Text);

      await expect(await merchCard.secureTransactionLabel).toContainText(data.secureLabel);
    });
  });

  // Test 7 : Merch Card (plans, secure) with badge
  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[7].path}${miloLibs}`);
    const { data } = features[7];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[7].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card special offers content/specs', async () => {
      await expect(await merchCard.plans).toBeVisible();
      await expect(await merchCard.productIcon).toBeVisible();

      await expect(await merchCard.plansRibbon).toBeVisible();
      await expect(await merchCard.plansRibbon).toContainText(data.badgeText);

      await expect(await merchCard.plansCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.plansCardTitleH5).toContainText(data.titleH5);

      // await expect(await merchCard.price).toContainText(data.price);
      await expect(await merchCard.plansCardDescription1).toContainText(data.description);
      await expect(await merchCard.seePlansTextLink).toContainText(data.link1Text);

      await expect(await merchCard.footer).toBeVisible();
      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButton1Text);

      await expect(await merchCard.secureTransactionLabel).toContainText(data.secureLabel);
    });
  });

  // Test 8 : Merch Card (catalog)
  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[8].path}${miloLibs}`);
    const { data } = features[8];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[8].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[8].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card catalog content/specs', async () => {
      await expect(await merchCard.catalog).toBeVisible();
      await expect(await merchCard.catalogCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.catalogCardTitleH4).toContainText(data.titleH4);

      // await expect(await merchCard.price).toContainText(data.price);

      await expect(await merchCard.catalogCardDescription2).toContainText(data.description);
      await expect(await merchCard.seeWhatsIncludedTextLink).toContainText(data.link1Text);
      await expect(await merchCard.learnMoreTextLink).toContainText(data.link2Text);

      await expect(await merchCard.footer).toBeVisible();

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButton1Text);

      await expect(await merchCard.footerOutlineButton).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toContainText(data.footerOutlineButtonText);
    });
  });

  // Test 9 : Merch Card (catalog) with badge
  test(`${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[9].path}${miloLibs}`);
    const { data } = features[9];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[9].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[9].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card catalog with badge content/specs', async () => {
      await expect(await merchCard.catalog).toBeVisible();

      await expect(await merchCard.catalog).toHaveAttribute('badge-background-color', data.badgeBgColor);
      await expect(await merchCard.catalog).toHaveAttribute('badge-color', data.badgeColor);
      await expect(await merchCard.catalog).toHaveAttribute('badge-text', data.badgeText);

      await expect(await merchCard.catalogCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.catalogCardTitleH4).toContainText(data.titleH4);

      // await expect(await merchCard.price).toContainText(data.price);

      await expect(await merchCard.catalogCardDescription2).toContainText(data.description);
      await expect(await merchCard.seeWhatsIncludedTextLink).toContainText(data.link1Text);
      await expect(await merchCard.learnMoreTextLink).toContainText(data.link2Text);

      await expect(await merchCard.footer).toBeVisible();

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButton1Text);

      await expect(await merchCard.footerOutlineButton).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toContainText(data.footerOutlineButtonText);
    });
  });

  // Test 10 : Merch Card (catalog) with more info and badge
  test(`${features[10].name},${features[10].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[10].path}${miloLibs}`);
    const { data } = features[10];

    await test.step('step-1: Go to Merch Card feature test page', async () => {
      await page.goto(`${baseURL}${features[10].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[10].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Merch Card catalog with badge content/specs', async () => {
      await expect(await merchCard.catalog).toBeVisible();

      await expect(await merchCard.catalog).toHaveAttribute('badge-background-color', data.badgeBgColor);
      await expect(await merchCard.catalog).toHaveAttribute('badge-color', data.badgeColor);
      await expect(await merchCard.catalog).toHaveAttribute('badge-text', data.badgeText);

      await expect(await merchCard.catalogCardTitleH3).toContainText(data.titleH3);
      await expect(await merchCard.catalogCardTitleH4).toContainText(data.titleH4);

      // await expect(await merchCard.price).toContainText(data.price);

      await expect(await merchCard.catalogCardDescription2).toContainText(data.description);
      await expect(await merchCard.seeWhatsIncludedTextLink).toContainText(data.link1Text);
      await expect(await merchCard.learnMoreTextLink).toContainText(data.link2Text);

      await expect(await merchCard.footer).toBeVisible();

      await expect(await merchCard.footerBlueButton).toBeVisible();
      await expect(await merchCard.footerBlueButton).toContainText(data.footerBlueButton1Text);

      await expect(await merchCard.footerOutlineButton).toBeVisible();
      await expect(await merchCard.footerOutlineButton).toContainText(data.footerOutlineButtonText);
    });

    await test.step('step-3: click more info link and verify action menu list', async () => {
      await merchCard.catalog.hover();
      await merchCard.catalog.click();
      await page.waitForTimeout(1000);

      await expect(await merchCard.catalogActionMenuList).toHaveCount(data.actionMenuListCount);
      await expect(await merchCard.catalogActionMenuPText1).toContainText(data.actionMenuText1);
      await expect(await merchCard.catalogActionMenuPText2).toContainText(data.actionMenuText2);
      await expect(await merchCard.catalogActionMenuPText3).toContainText(data.actionMenuText3);
    });
  });
});
