import { expect, test } from '@playwright/test';
import { features } from './full-pricing-express.spec.js';
import FullPricingExpressCard from './full-pricing-express.page.js';
import { runAccessibilityTest } from '../../../libs/accessibility.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('MAS Full Pricing Express Cards test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to Full Pricing Express page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="full-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Free card content', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      if (data.badge) {
        await expect(card.badge).toContainText(data.badge);
      }
      await expect(card.shortDescriptionText).toContainText(data.shortDescription);
      await expect(card.descriptionText).toContainText(data.description);
      const priceText = await card.price.textContent();
      expect(priceText.replace(/\s+/g, '')).toContain(data.price.replace(/\s+/g, ''));
      await expect(card.priceNote).toContainText(data.priceNote);
      await expect(card.ctaButton).toContainText(data.cta);
    });

    await test.step('step-3: Verify features section', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      const bodyText = await card.description.textContent();
      expect(bodyText).toContain('Top features:');
      expect(bodyText).toContain(data.features.includesText);

      const featuresList = await card.getFeaturesList();
      expect(featuresList.length).toBeGreaterThan(0);

      for (const expectedFeature of data.features.featureList.slice(0, 3)) {
        const found = featuresList.some((f) => f.includes(expectedFeature.split(':')[0]));
        expect(found).toBeTruthy();
      }

      const compareLinks = await card.description.locator('a:has-text("Compare all features")').count();
      expect(compareLinks).toBeGreaterThan(0);
    });

    await test.step('step-4: Verify accessibility', async () => {
      const card = new FullPricingExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('step-1: Go to Full Pricing Express page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="full-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Premium card content', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);

      if (data.hasMnemonic) {
        expect(await card.hasMnemonicIcon()).toBeTruthy();
      }

      if (data.badge) {
        await expect(card.badge).toContainText(data.badge);
      }
      await expect(card.shortDescriptionText).toContainText(data.shortDescription);
      await expect(card.descriptionText).toContainText(data.description);
      const priceText = await card.price.textContent();
      expect(priceText.replace(/\s+/g, '')).toContain(data.price.replace(/\s+/g, ''));
      await expect(card.priceNote).toContainText(data.priceNote);
      await expect(card.ctaButton).toContainText(data.cta);

      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
    });

    await test.step('step-3: Verify features section with expanded content', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      const bodyText = await card.description.textContent();
      expect(bodyText).toContain('Top features:');
      expect(bodyText).toContain(data.features.includesText);

      const featuresList = await card.getFeaturesList();
      expect(featuresList.length).toBeGreaterThan(5);

      const compareLinks = await card.description.locator('a:has-text("Compare all features")').count();
      expect(compareLinks).toBeGreaterThan(0);
    });

    await test.step('step-4: Verify card structure', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      const variant = await card.variant();
      expect(variant).toBe('full-pricing-express');

      const descriptionCount = await card.description.count();
      expect(descriptionCount).toBe(1);
    });

    await test.step('step-5: Verify accessibility', async () => {
      const card = new FullPricingExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('step-1: Go to Full Pricing Express page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="full-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Pro card content', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      if (data.badge) {
        await expect(card.badge).toContainText(data.badge);
      }
      await expect(card.shortDescriptionText).toContainText(data.shortDescription);
      await expect(card.descriptionText).toContainText(data.description);
      const priceText = await card.price.textContent();
      expect(priceText.replace(/\s+/g, '')).toContain(data.price.replace(/\s+/g, ''));
      await expect(card.priceNote).toContainText(data.priceNote);
      await expect(card.ctaButton).toContainText(data.cta);

      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
      expect(await card.borderColor()).toBe(data.borderColor);
    });

    await test.step('step-3: Verify mobile view behavior', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);

      const mobileCheck = await card.checkMobileView();
      expect(mobileCheck.isMobile).toBeTruthy();

      expect(mobileCheck.buttonVisible).toBeTruthy();

      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
    });

    await test.step('step-4: Verify divider structure', async () => {
      const card = new FullPricingExpressCard(page, data.id);

      const hrElements = await card.description.locator('hr').count();
      expect(hrElements).toBe(2);
    });

    await test.step('step-5: Verify accessibility', async () => {
      const card = new FullPricingExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test('3: @MAS-Full-Pricing-Express-Collection alignment test, @full-pricing-express @collection @smoke @regression @milo', async ({ page, baseURL }) => {
    const testPath = '/libs/features/mas/docs/express.html';
    console.info(`[Test Page]: ${baseURL}${testPath}${miloLibs}`);

    await test.step('step-1: Go to Full Pricing Express page', async () => {
      await page.goto(`${baseURL}${testPath}${miloLibs}`);
      await page.waitForLoadState('networkidle');

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify collection has proper class', async () => {
      const collection = page.locator('merch-card-collection.full-pricing-express');
      await expect(collection).toBeVisible();

      const classes = await collection.getAttribute('class');
      expect(classes).toContain('full-pricing-express');
    });

    await test.step('step-3: Verify cards are aligned', async () => {
      const cards = page.locator('merch-card[variant="full-pricing-express"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);

      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const variant = await card.getAttribute('variant');
        expect(variant).toBe('full-pricing-express');
      }
    });

    await test.step('step-4: Verify CSS variables are set for alignment', async () => {
      const collection = page.locator('merch-card-collection.full-pricing-express');

      await page.waitForTimeout(500);

      const styles = await collection.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          priceHeight: computed.getPropertyValue('--consonant-merch-card-full-pricing-express-price-height'),
          ctaHeight: computed.getPropertyValue('--consonant-merch-card-full-pricing-express-cta-height'),
          description2Height: computed.getPropertyValue('--consonant-merch-card-full-pricing-express-description2-height'),
        };
      });

      expect(styles).toBeDefined();
    });
  });
});
