import { expect, test } from '@playwright/test';
import { features } from './plans.spec.js';
import MasPlans from './plans.page.js';
import { createWorkerPageSetup, PLANS_NALA_PATH } from '../../../../libs/commerce.js';

let masPlans;

test.skip(({ browserName }) => browserName !== 'chromium', 'Not supported to run on multiple browsers.');

const workerSetup = createWorkerPageSetup({
  pages: [
    { name: 'US', url: PLANS_NALA_PATH.US },
  ],
});

test.describe('MAS Plans Page test suite', () => {
  test.beforeAll(async ({ browser, baseURL }) => {
    await workerSetup.setupWorkerPages({ browser, baseURL });
  });

  test.afterAll(async () => {
    await workerSetup.cleanupWorkerPages();
  });

  test.afterEach(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
    workerSetup.attachWorkerErrorsToFailure(testInfo);
  });

  // @MAS-Plans-Load
  test(`${features[0].name},${features[0].tags}`, async () => {
    const { data } = features[0];
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page and verify initial state and two cards', async () => {
      await workerSetup.verifyPageURL('US', PLANS_NALA_PATH.US, expect);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('merch-card-collection');
    });

    await test.step('step-2: Verify cards content is visible', async () => {
      await expect(await masPlans.getCard(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCard(data.cards[0].id)).toHaveAttribute('size', 'wide');
      await expect(await masPlans.getCard(data.cards[1].id)).toBeVisible();

      await expect(await masPlans.getCardIcon(data.cards[0].id)).toBeVisible();
      const card2Icons = await masPlans.getCardIcon(data.cards[1].id);
      expect(await card2Icons.count()).toBe(2);
      await expect(await card2Icons.nth(0)).toBeVisible();
      await expect(await card2Icons.nth(1)).toBeVisible();

      await expect(await masPlans.getCardTitle(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardTitle(data.cards[0].id)).toHaveText(data.cards[0].title);
      await expect(await masPlans.getCardTitle(data.cards[1].id)).toBeVisible();
      await expect(await masPlans.getCardTitle(data.cards[1].id)).toHaveText(data.cards[1].title);

      await expect(await masPlans.getCardPrice(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardPrice(data.cards[0].id)).toContainText(new RegExp(data.cards[0].price));
      await expect(await masPlans.getCardPrice(data.cards[0].id)).toContainText(data.cards[0].abmLabel);
      await expect(await masPlans.getCardPrice(data.cards[1].id)).toBeVisible();
      await expect(await masPlans.getCardPrice(data.cards[1].id)).toContainText(new RegExp(data.cards[1].price));
      await expect(await masPlans.getCardPrice(data.cards[1].id)).toContainText(data.cards[1].abmLabel);

      await expect(await masPlans.getCardDescription(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardDescription(data.cards[0].id)).toContainText(data.cards[0].description);
      await expect(await masPlans.getCardDescription(data.cards[1].id)).toBeVisible();
      await expect(await masPlans.getCardDescription(data.cards[1].id)).toContainText(data.cards[1].description);

      await expect(await masPlans.getCardCTA(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardCTA(data.cards[0].id)).toContainText(data.cards[0].cta);
      expect(await masPlans.getCTAAttribute(data.cards[0].id, 'data-wcs-osi')).toEqual(data.cards[0].osi);

      await expect(await masPlans.getCardCTA(data.cards[1].id)).toBeVisible();
      await expect(await masPlans.getCardCTA(data.cards[1].id)).toContainText(data.cards[1].cta);
      expect(await masPlans.getCTAAttribute(data.cards[1].id, 'data-wcs-osi')).toEqual(data.cards[1].osi);

      await expect(await masPlans.getCardStockCheckbox(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardStockCheckbox(data.cards[1].id)).toBeVisible();
      await expect(await masPlans.getCardSecureTransaction(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardSecureTransaction(data.cards[1].id)).toBeVisible();
    });

    await test.step('step-3: Verify cards links params', async () => {
      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toBeVisible();

      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toHaveAttribute('data-analytics-id', data.cards[0].linkAnalyticsId);
      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toHaveAttribute('data-analytics-id', data.cards[1].linkAnalyticsId);

      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toHaveAttribute('daa-ll', data.cards[0].linkDaaLL);
      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toHaveAttribute('daa-ll', data.cards[1].linkDaaLL);

      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[0].id)).toHaveAttribute('aria-label', data.cards[0].linkAriaLabel);
      await expect(await masPlans.getSeeAllPlans3in1Link(data.cards[1].id)).toHaveAttribute('aria-label', data.cards[1].linkAriaLabel);

      const link1href = await masPlans.getSeeAllPlans3in1Link(data.cards[0].id).getAttribute('href');
      const searchParams1 = new URLSearchParams(decodeURI(link1href).split('?')[1]);
      const workflowStep1 = decodeURI(link1href).split('?')[0];
      expect(workflowStep1).toContain('commerce.adobe.com');
      expect(searchParams1.get('co')).toBe(data.cards[0].checkoutParams.co);
      expect(searchParams1.get('ctx')).toBe(data.cards[0].checkoutParams.ctx);
      expect(searchParams1.get('lang')).toBe(data.cards[0].checkoutParams.lang);
      expect(searchParams1.get('cli')).toBe(data.cards[0].checkoutParams.cli);
      expect(searchParams1.get('ms')).toBe(data.cards[0].checkoutParams.ms);
      expect(searchParams1.get('ot')).toBe(data.cards[0].checkoutParams.ot);
      expect(searchParams1.get('cs')).toBe(data.cards[0].checkoutParams.cs);
      expect(searchParams1.get('pa')).toBe(data.cards[0].checkoutParams.pa);
      expect(searchParams1.get('rtc')).toBe(data.cards[0].checkoutParams.rtc);
      expect(searchParams1.get('lo')).toBe(data.cards[0].checkoutParams.lo);
      expect(searchParams1.get('af')).toBe(data.cards[0].checkoutParams.af);

      const link2href = await masPlans.getSeeAllPlans3in1Link(data.cards[1].id).getAttribute('href');
      const searchParams2 = new URLSearchParams(decodeURI(link2href).split('?')[1]);
      const workflowStep2 = decodeURI(link2href).split('?')[0];
      expect(workflowStep2).toContain('commerce.adobe.com');
      expect(searchParams2.get('co')).toBe(data.cards[1].checkoutParams.co);
      expect(searchParams2.get('ctx')).toBe(data.cards[1].checkoutParams.ctx);
      expect(searchParams2.get('lang')).toBe(data.cards[1].checkoutParams.lang);
      expect(searchParams2.get('cli')).toBe(data.cards[1].checkoutParams.cli);
      expect(searchParams2.get('ms')).toBe(data.cards[1].checkoutParams.ms);
      expect(searchParams2.get('ot')).toBe(data.cards[1].checkoutParams.ot);
      expect(searchParams2.get('cs')).toBe(data.cards[1].checkoutParams.cs);
      expect(searchParams2.get('pa')).toBe(data.cards[1].checkoutParams.pa);
      expect(searchParams2.get('rtc')).toBe(data.cards[1].checkoutParams.rtc);
      expect(searchParams2.get('lo')).toBe(data.cards[1].checkoutParams.lo);
      expect(searchParams2.get('af')).toBe(data.cards[1].checkoutParams.af);
    });

    await test.step('step-4: Verify cards CTAs params', async () => {
      await expect(await masPlans.getCardCTA(data.cards[0].id)).toHaveAttribute('data-analytics-id', data.cards[0].ctaAnalyticsId);
      await expect(await masPlans.getCardCTA(data.cards[1].id)).toHaveAttribute('data-analytics-id', data.cards[1].ctaAnalyticsId);

      await expect(await masPlans.getCardCTA(data.cards[0].id)).toHaveAttribute('daa-ll', data.cards[0].ctaDaaLL);
      await expect(await masPlans.getCardCTA(data.cards[1].id)).toHaveAttribute('daa-ll', data.cards[1].ctaDaaLL);

      await expect(await masPlans.getCardCTA(data.cards[0].id)).toHaveAttribute('aria-label', data.cards[0].ctaAriaLabel);
      await expect(await masPlans.getCardCTA(data.cards[1].id)).toHaveAttribute('aria-label', data.cards[1].ctaAriaLabel);

      const cta1href = await masPlans.getCardCTA(data.cards[0].id).getAttribute('href');
      const searchParams1 = new URLSearchParams(decodeURI(cta1href).split('?')[1]);
      const workflowStep1 = decodeURI(cta1href).split('?')[0];
      expect(workflowStep1).toContain('commerce.adobe.com');
      expect(searchParams1.get('co')).toBe(data.cards[0].checkoutParams.co);
      expect(searchParams1.get('ctx')).toBe(data.cards[0].checkoutParams.ctx);
      expect(searchParams1.get('lang')).toBe(data.cards[0].checkoutParams.lang);
      expect(searchParams1.get('cli')).toBe(data.cards[0].checkoutParams.cli);
      expect(searchParams1.get('ms')).toBe(data.cards[0].checkoutParams.ms);
      expect(searchParams1.get('ot')).toBe(data.cards[0].checkoutParams.ot);
      expect(searchParams1.get('cs')).toBe(data.cards[0].checkoutParams.cs);
      expect(searchParams1.get('pa')).toBe(data.cards[0].checkoutParams.pa);
      expect(searchParams1.get('rtc')).toBe(data.cards[0].checkoutParams.rtc);
      expect(searchParams1.get('lo')).toBe(data.cards[0].checkoutParams.lo);
      expect(searchParams1.get('af')).toBe(data.cards[0].checkoutParams.af);

      const cta2href = await masPlans.getCardCTA(data.cards[1].id).getAttribute('href');
      const searchParams2 = new URLSearchParams(decodeURI(cta2href).split('?')[1]);
      const workflowStep2 = decodeURI(cta2href).split('?')[0];
      expect(workflowStep2).toContain('commerce.adobe.com');
      expect(searchParams2.get('co')).toBe(data.cards[1].checkoutParams.co);
      expect(searchParams2.get('ctx')).toBe(data.cards[1].checkoutParams.ctx);
      expect(searchParams2.get('lang')).toBe(data.cards[1].checkoutParams.lang);
      expect(searchParams2.get('cli')).toBe(data.cards[1].checkoutParams.cli);
      expect(searchParams2.get('ms')).toBe(data.cards[1].checkoutParams.ms);
      expect(searchParams2.get('ot')).toBe(data.cards[1].checkoutParams.ot);
      expect(searchParams2.get('cs')).toBe(data.cards[1].checkoutParams.cs);
      expect(searchParams2.get('pa')).toBe(data.cards[1].checkoutParams.pa);
      expect(searchParams2.get('rtc')).toBe(data.cards[1].checkoutParams.rtc);
      expect(searchParams2.get('lo')).toBe(data.cards[1].checkoutParams.lo);
      expect(searchParams2.get('af')).toBe(data.cards[1].checkoutParams.af);
    });
  });

  // @MAS-Plans-Category
  test(`${features[1].name},${features[1].tags}`, async ({ baseURL }) => {
    const { data } = features[1];
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page', async () => {
      await workerSetup.verifyPageURL('US', PLANS_NALA_PATH.US, expect);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('merch-card-collection');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories.all.count);
    });

    await test.step('step-2: Verify Photo category products', async () => {
      const photoCategory = masPlans.getCategoryFilter('Photo');
      await photoCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories.photo.browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', 'photography');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', 'photography--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories.photo.count);
      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories.photo.products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-3: Verify Graphic Design category products', async () => {
      const graphicDesignCategory = masPlans.getCategoryFilter('Graphic Design');
      await graphicDesignCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['graphic-design'].browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', 'design');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', 'design--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories['graphic-design'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['graphic-design'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-4: Verify Video category products', async () => {
      const videoCategory = masPlans.getCategoryFilter('Video');
      await videoCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories.video.browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', 'video-audio');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', 'video-audio--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories.video.count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories.video.products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-5: Verify Illustration category products', async () => {
      const illustrationCategory = masPlans.getCategoryFilter('Illustration');
      await illustrationCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories.illustration.browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', 'illustration');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', 'illustration--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories.illustration.count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories.illustration.products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-6: Verify Acrobat and PDF category products', async () => {
      const acrobatCategory = masPlans.getCategoryFilter('Acrobat and PDF');
      await acrobatCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['acrobat-pdf'].browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', 'acrobat');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', 'acrobat--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories['acrobat-pdf'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['acrobat-pdf'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-7: Verify 3D and AR category products', async () => {
      const threeDCategory = masPlans.getCategoryFilter('3D and AR');
      await threeDCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['3d-ar'].browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', '3dar');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', '3dar--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories['3d-ar'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['3d-ar'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-8: Verify Social Media category products', async () => {
      const socialMediaCategory = masPlans.getCategoryFilter('Social Media');
      await socialMediaCategory.click();
      await page.waitForSelector('merch-card:visible');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['social-media'].browserFilter}`);
      await expect(await masPlans.sidenav).toHaveAttribute('value', 'social');
      await expect(await masPlans.sidenav).toHaveAttribute('role', 'tablist');
      await expect(await masPlans.collectionContainerIndividuals).toHaveAttribute('daa-lh', 'social--cat');
      const visibleCards = page.locator('merch-card:visible');
      await expect(visibleCards).toHaveCount(data.categories['social-media'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['social-media'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });
  });

  // @MAS-Plans-Tabs-Deeplink
  test(`${features[2].name},${features[2].tags}`, async () => {
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page with edu deeplink', async () => {
      await page.goto(`${PLANS_NALA_PATH.US}${features[2].browserParams.edu}`);
      await page.waitForLoadState('domcontentloaded');
      await workerSetup.verifyPageURL('US', PLANS_NALA_PATH.US + features[2].browserParams.edu, expect);
    });

    await test.step('step-2: Verify edu tab is selected and its content is displayed', async () => {
      const eduTab = masPlans.getTabs('edu');
      await expect(eduTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await eduTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });

    await test.step('step-3: Verify Business tab is selected and its content is displayed', async () => {
      await page.goto(`${PLANS_NALA_PATH.US}${features[2].browserParams.team}`);
      const businessTab = masPlans.getTabs('team');
      await expect(businessTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await businessTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });

    await test.step('step-3: Verify Schools & Universities tab is selected and its content is displayed', async () => {
      await page.goto(`${PLANS_NALA_PATH.US}${features[2].browserParams.edu_inst}`);
      const businessTab = masPlans.getTabs('edu_inst');
      await expect(businessTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await businessTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });

    await test.step('step-4: Verify Individual tab is selected and its content is displayed', async () => {
      await page.goto(`${PLANS_NALA_PATH.US}${features[2].browserParams.individual}`);
      const businessTab = masPlans.getTabs('individual');
      await expect(businessTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await businessTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });
  });

  // @MAS-Plans-Modal-Deeplink
  test(`${features[3].name},${features[3].tags}`, async () => {
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page', async () => {
      await page.goto(`${PLANS_NALA_PATH.US}${features[3].browserParams}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('.dialog-modal.three-in-one#miniplans-buy-all-apps')).toBeVisible();
    });
  });
});
