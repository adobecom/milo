import { expect, test } from '@playwright/test';
import { features } from './mini.spec.js';
import MiniCard from './mini.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('CCD Mini Cards Feature', () => {
  let miniCard;

  test.beforeEach(async ({ page }) => {
    miniCard = new MiniCard(page);
  });

  features.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, baseURL }) => {
      const testPage = `${baseURL}${feature.path}${miloLibs}`;
      const { data } = feature;
      console.info('[Test Page]: ', testPage);

      await test.step('1. Go to CCD Mini Card feature test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(testPage);
      });

      await test.step('2. Verify CCD Mini Card content', async () => {
        const cardLocator = miniCard.getCard(data.fragment);
        await expect(cardLocator).toBeVisible();
        await cardLocator.evaluate((card) => card.checkReady());

        const regularPrice = await cardLocator.evaluate((card) => card.regularPrice);
        expect(regularPrice).toBe(data.regularPrice);

        if (data.promoPrice) {
          const promoPrice = await cardLocator.evaluate((card) => card.promoPrice);
          expect(promoPrice).toBe(data.promoPrice);
        }

        const planTypeText = await cardLocator.evaluate((card) => card.planTypeText);
        expect(planTypeText).toBe(data.planTypeText);

        const recurrenceText = await cardLocator.evaluate((card) => card.recurrenceText);
        expect(recurrenceText).toBe(data.recurrenceText);

        if (data.renewalText) {
          const renewalText = await cardLocator.evaluate((card) => card.renewalText);
          expect(renewalText).toBe(data.renewalText);
        }

        if (data.promoDurationText) {
          const promoDurationText = await cardLocator.evaluate((card) => card.promoDurationText);
          expect(promoDurationText).toBe(data.promoDurationText);
        }

        if (data.seeTerms) {
          const seeTerms = await cardLocator.evaluate((card) => card.seeTermsInfo);
          expect(seeTerms.text).toBe(data.seeTerms.text);
          expect(seeTerms.href).toBe(data.seeTerms.href);
        }

        const primaryCta = await cardLocator.evaluate((card) => card.primaryCta);
        expect(primaryCta.text).toBe(data.primaryCta.text);
        expect(primaryCta.href).toBe(data.primaryCta.href);

        const secondaryCta = await cardLocator.evaluate((card) => card.secondaryCta);
        expect(secondaryCta.text).toBe(data.secondaryCta.text);
        expect(secondaryCta.href).toBe(data.secondaryCta.href);
      });
    });
  });
});
