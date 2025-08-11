import { expect, test } from '@playwright/test';
import { features } from './plans.spec.js';
import MasPlans from './plans.page.js';
import { createWorkerPageSetup, PLANS_BASE_PATH } from '../../../../libs/commerce.js';

let masPlans;

test.skip(({ browserName }) => browserName !== 'chromium', 'Not supported to run on multiple browsers.');

const workerSetup = createWorkerPageSetup({
  pages: [
    { name: 'US', url: PLANS_BASE_PATH.US },
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

  test(`${features[0].name},${features[0].tags}`, async ({ baseURL }) => {
    const { data } = features[0];
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page and verify initial state and two cards', async () => {
      await workerSetup.verifyPageURL('US', PLANS_BASE_PATH.US, expect);
      await page.waitForLoadState('domcontentloaded');

      await page.waitForSelector('merch-card-collection');
      await expect(await masPlans.getCard(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCard(data.cards[1].id)).toBeVisible();

      await expect(await masPlans.getCardIcon(data.cards[0].id)).toBeVisible();
      const card2Icons = await masPlans.getCardIcon(data.cards[1].id);
      expect(await card2Icons.count()).toBe(2);
      await expect(await card2Icons.nth(0)).toBeVisible();
      await expect(await card2Icons.nth(1)).toBeVisible();

      await expect(await masPlans.getCardTitle(data.cards[0].id)).toHaveText(data.cards[0].title);
      await expect(await masPlans.getCardTitle(data.cards[1].id)).toHaveText(data.cards[1].title);

      await expect(await masPlans.getCardPrice(data.cards[0].id)).toContainText(new RegExp(data.cards[0].price));
      await expect(await masPlans.getCardPrice(data.cards[1].id)).toContainText(new RegExp(data.cards[1].price));

      await expect(await masPlans.getCardPrice(data.cards[0].id)).toContainText(data.cards[0].abmLabel);
      await expect(await masPlans.getCardPrice(data.cards[1].id)).toContainText(data.cards[1].abmLabel);

      await expect(await masPlans.getCardCTA(data.cards[0].id)).toBeVisible();
      await expect(await masPlans.getCardCTA(data.cards[0].id)).toContainText(data.cards[0].cta);
      expect(await masPlans.getCTAAttribute(data.cards[0].id, 'data-wcs-osi')).toEqual(data.cards[0].osi);

      await expect(await masPlans.getCardCTA(data.cards[1].id)).toBeVisible();
      await expect(await masPlans.getCardCTA(data.cards[1].id)).toContainText(data.cards[1].cta);
      expect(await masPlans.getCTAAttribute(data.cards[1].id, 'data-wcs-osi')).toEqual(data.cards[1].osi);
      await page.waitForTimeout(1000);
      await expect((await masPlans.getCardCTA(data.cards[0].id)).evaluate((el) => el.href)).resolves.toContain('commerce.adobe.com');
      await expect((await masPlans.getCardCTA(data.cards[1].id)).evaluate((el) => el.href)).resolves.toContain('commerce.adobe.com');

      // const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories.all.count);
    });

    await test.step('step-2: Verify Photo category products', async () => {
      const photoCategory = masPlans.getCategoryFilter('Photo');
      await photoCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories.photo.browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories.photo.count);
      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories.photo.products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-3: Verify Graphic Design category products', async () => {
      const graphicDesignCategory = masPlans.getCategoryFilter('Graphic Design');
      await graphicDesignCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['graphic-design'].browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories['graphic-design'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['graphic-design'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-4: Verify Video category products', async () => {
      const videoCategory = masPlans.getCategoryFilter('Video');
      await videoCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories.video.browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories.video.count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories.video.products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-5: Verify Illustration category products', async () => {
      const illustrationCategory = masPlans.getCategoryFilter('Illustration');
      await illustrationCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories.illustration.browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories.illustration.count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories.illustration.products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-6: Verify Acrobat and PDF category products', async () => {
      const acrobatCategory = masPlans.getCategoryFilter('Acrobat and PDF');
      await acrobatCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['acrobat-pdf'].browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories['acrobat-pdf'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['acrobat-pdf'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-7: Verify 3D and AR category products', async () => {
      const threeDCategory = masPlans.getCategoryFilter('3D and AR');
      await threeDCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['3d-ar'].browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories['3d-ar'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['3d-ar'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });

    await test.step('step-8: Verify Social Media category products', async () => {
      const socialMediaCategory = masPlans.getCategoryFilter('Social Media');
      await socialMediaCategory.click();
      await page.waitForSelector('merch-card:not([style*="display: none"])');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${data.categories['social-media'].browserFilter}`);

      const visibleCards = page.locator('merch-card:not([style*="display: none"])');
      // await expect(visibleCards).toHaveCount(data.categories['social-media'].count);

      const productTitles = await visibleCards.locator('h3').allTextContents();
      data.categories['social-media'].products.forEach((expectedProduct) => {
        expect(productTitles).toContain(expectedProduct);
      });
    });
  });

  test(`${features[1].name},${features[1].tags}`, async () => {
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page with edu deeplink', async () => {
      await page.goto(`${PLANS_BASE_PATH.US}${features[1].browserParams}`);
      await page.waitForLoadState('domcontentloaded');
      await workerSetup.verifyPageURL('US', PLANS_BASE_PATH.US + features[1].browserParams, expect);
    });

    await test.step('step-2: Verify edu tab is selected and its content is displayed', async () => {
      const eduTab = masPlans.getTabs('edu');
      await expect(eduTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await eduTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });

    await test.step('step-3: Verify Business tab is selected and its content is displayed', async () => {
      await page.goto(`${PLANS_BASE_PATH.US}?plans=team`);
      const businessTab = masPlans.getTabs('team');
      await expect(businessTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await businessTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });

    await test.step('step-3: Verify Schools & Universities tab is selected and its content is displayed', async () => {
      await page.goto(`${PLANS_BASE_PATH.US}?plans=edu-inst`);
      const businessTab = masPlans.getTabs('edu-inst');
      await expect(businessTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await businessTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });

    await test.step('step-4: Verify Individual tab is selected and its content is displayed', async () => {
      await page.goto(`${PLANS_BASE_PATH.US}?plans=individual`);
      const businessTab = masPlans.getTabs('individual');
      await expect(businessTab).toHaveAttribute('aria-selected', 'true');
      const controlledContentId = await businessTab.getAttribute('aria-controls');
      const controlledContent = page.locator(`#${controlledContentId}`);
      await expect(controlledContent).toBeVisible();
    });
  });

  test(`${features[2].name},${features[2].tags}`, async () => {
    const page = workerSetup.getPage('US');
    masPlans = new MasPlans(page);

    await test.step('step-1: Go to Plans page', async () => {
      await page.goto(`${PLANS_BASE_PATH.US}${features[2].browserParams}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('.dialog-modal#miniplans-buy-all-apps')).toBeVisible();
    });
  });
});
