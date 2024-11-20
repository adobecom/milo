import { expect, test } from '@playwright/test';
import { features } from './masccd.spec.js';
import MerchCCD from './masccd.page.js';

let CCD;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('CCD Merchcard feature test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    CCD = new MerchCCD(page);
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  // @MAS-CCD-suggested-eyebrow : CCD suggested card with eyebrow, no legal link
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    const { data } = features[0];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /content\/dam/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).toContainText(data.eyebrow);
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-strikethrough : CCD suggested card with eyebrow, legal link and strikethrough price
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path}${miloLibs}`;
    const { data } = features[1];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /content\/dam/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).toContainText(data.eyebrow);
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardLegalLink)).toContainText(data.linkText);
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.strikethroughPrice);
      const priceStyle = await card.locator(CCD.priceStrikethrough).evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('text-decoration'),
      );
      expect(await priceStyle).toContain('line-through');
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-noeyebrow-priceunit : CCD suggested card with no eyebrow, no legal link and price with unit text
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[2].path}${miloLibs}`;
    const { data } = features[2];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /content\/dam/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      expect(await card.locator(CCD.suggestedCardPrice).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-thin : CCD suggested card with eyebrow, no legal link and thin-strip background
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[3].path}${miloLibs}`;
    const { data } = features[3];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('background-image', new RegExp(data.background));
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /assets\/img/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).toContainText(data.eyebrow);
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-seeterms-thin : CCD suggested card with eyebrow, legal link and thin-strip background
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[4].path}${miloLibs}`;
    const { data } = features[4];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('background-image', new RegExp(data.background));
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /assets\/img/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).toContainText(data.eyebrow);
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardLegalLink)).toContainText(data.linkText);
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText('Starting at');
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-noeyebrow-priceunit-thin : CCD suggested card with no eyebrow, no legal link and thin-strip background
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[5].path}${miloLibs}`;
    const { data } = features[5];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('background-image', new RegExp(data.background));
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /assets\/img/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      expect(await card.locator(CCD.suggestedCardPrice).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-seeterms-wide : CCD suggested card with eyebrow, legal link and wide-strip background
  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[6].path}${miloLibs}`;
    const { data } = features[6];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('background-image', new RegExp(data.background));
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /assets\/img/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).toContainText(data.eyebrow);
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardLegalLink)).toContainText(data.linkText);
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });

  // @MAS-CCD-suggested-noeyebrow-priceunit-wide :
  // CCD suggested card with no eyebrow, no legal link, price with unit text and wide-strip background
  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[7].path}${miloLibs}`;
    const { data } = features[7];
    const card = CCD.suggestedCard.filter({ has: page.locator(`aem-fragment[fragment="${data.id}"]`) });
    console.info('[Test Page]: ', testPage);

    await test.step('step-1: Go to CCD Merch Card feature test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}`);
    });

    await test.step('step-2: Verify CCD Merch Card content/specs', async () => {
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('background-image', new RegExp(data.background));
      await expect(card.locator(CCD.suggestedCardIcon)).toHaveAttribute('src', /assets\/img/);
      await expect(card.locator(CCD.suggestedCardTitle)).toContainText(data.title);
      await expect(card.locator(CCD.suggestedCardEyebrow)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardDescription)).toContainText(data.description);
      await expect(card.locator(CCD.suggestedCardLegalLink)).not.toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardPrice)).toContainText(data.price);
      expect(await card.locator(CCD.suggestedCardPrice).locator('.price-unit-type').innerText()).not.toBe('');
      await expect(card.locator(CCD.suggestedCardCTA)).toBeVisible();
      await expect(card.locator(CCD.suggestedCardCTA)).toHaveAttribute('href', new RegExp(`${data.offerid}`));
      expect(await card.locator(CCD.suggestedCardCTA).innerText()).toContain(data.cta);
    });
  });
});
