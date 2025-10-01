import { expect, test } from '@playwright/test';
import { features } from './express.spec.js';
import ExpressCard from './express.page.js';
import { runAccessibilityTest } from '../../../libs/accessibility.js';
import { createWorkerPageSetup, DOCS_GALLERY_PATH } from '../../../libs/commerce.js';

test.skip(({ browserName }) => browserName !== 'chromium', 'Not supported to run on multiple browsers.');

const workerSetup = createWorkerPageSetup({
  pages: [
    { name: 'EXPRESS', url: DOCS_GALLERY_PATH.EXPRESS },
    { name: 'FULL_PRICING_EXPRESS', url: '/libs/features/mas/docs/express.html' },
  ],
});

test.describe('MAS Express Cards test suite', () => {
  test.beforeAll(async ({ browser, baseURL }) => {
    await workerSetup.setupWorkerPages({ browser, baseURL });
  });

  test.afterAll(async () => {
    await workerSetup.cleanupWorkerPages();
  });

  test.afterEach(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
    workerSetup.attachWorkerErrorsToFailure(testInfo);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async () => {
    const { data } = features[0];
    const page = workerSetup.getPage('EXPRESS');

    console.info(`[Test Page]: ${await page.url()}`);

    await test.step('step-1: Wait for Express page elements', async () => {
      await workerSetup.verifyPageURL('EXPRESS', DOCS_GALLERY_PATH.EXPRESS, expect);

      await page.waitForSelector('merch-card-collection', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="simplified-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Free card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      if (data.badge) {
        await expect(card.badge).toContainText(data.badge);
      }
      await expect(card.description).toContainText(data.description);
      await expect(card.price).toContainText(new RegExp(data.price));
      await expect(card.priceNote).toContainText(data.priceNote);
      await expect(card.ctaButton).toContainText(data.cta);
    });

    await test.step('step-3: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async () => {
    const { data } = features[1];
    const page = workerSetup.getPage('EXPRESS');

    console.info(`[Test Page]: ${await page.url()}`);

    await test.step('step-1: Wait for Express page elements', async () => {
      await workerSetup.verifyPageURL('EXPRESS', DOCS_GALLERY_PATH.EXPRESS, expect);

      await page.waitForSelector('merch-card-collection', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="simplified-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Premium card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      if (data.badge) {
        await expect(card.badge).toContainText(data.badge);
      }
      await expect(card.description).toContainText(data.description);

      const viewportWidth = page.viewportSize().width;
      if (viewportWidth >= 1200 && data.priceStrikethrough) {
        await expect(card.priceStrikethrough).toBeVisible();
      }
      await expect(card.price).toContainText(new RegExp(data.price));
      await expect(card.priceNote).toContainText(data.priceNote);

      await expect(card.ctaButton).toContainText(data.cta);

      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
    });

    await test.step('step-3: Verify mobile accordion functionality', async () => {
      const card = new ExpressCard(page, data.id);

      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);

      await card.ensureExpanded();

      await expect(card.description).toBeVisible();
      await expect(card.ctaButton).toBeVisible();

      if (await card.chevronButton.isVisible()) {
        await card.chevronButton.click();
        await page.waitForTimeout(300);
        expect(await card.isExpanded()).toBe('false');
      }

      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    await test.step('step-4: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async () => {
    const { data } = features[2];
    const page = workerSetup.getPage('EXPRESS');

    console.info(`[Test Page]: ${await page.url()}`);

    await test.step('step-1: Wait for Express page elements', async () => {
      await workerSetup.verifyPageURL('EXPRESS', DOCS_GALLERY_PATH.EXPRESS, expect);

      await page.waitForSelector('merch-card-collection', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="simplified-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Firefly Pro card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      if (data.badge) {
        await expect(card.badge).toContainText(data.badge);
      }
      await expect(card.description).toContainText(data.description);
      await expect(card.price).toContainText(new RegExp(data.price));
      await expect(card.priceNote).toContainText(data.priceNote);
      if (data.priceAdditionalNote) {
        await expect(card.priceAdditionalNote).toContainText(data.priceAdditionalNote);
      }
      await expect(card.ctaButton).toContainText(data.cta);

      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
    });

    await test.step('step-3: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[3].tcid}] ${features[3].name}, ${features[3].tags}`, async () => {
    const { data } = features[3];
    const page = workerSetup.getPage('FULL_PRICING_EXPRESS');

    console.info(`[Test Page]: ${await page.url()}`);

    await test.step('step-1: Wait for Full Pricing Express page elements', async () => {
      await workerSetup.verifyPageURL('FULL_PRICING_EXPRESS', '/libs/features/mas/docs/express.html', expect);

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="full-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Free card content', async () => {
      const card = new ExpressCard(page, data.id);

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
      const card = new ExpressCard(page, data.id);

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
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[4].tcid}] ${features[4].name}, ${features[4].tags}`, async () => {
    const { data } = features[4];
    const page = workerSetup.getPage('FULL_PRICING_EXPRESS');

    console.info(`[Test Page]: ${await page.url()}`);

    await test.step('step-1: Wait for Full Pricing Express page elements', async () => {
      await workerSetup.verifyPageURL('FULL_PRICING_EXPRESS', '/libs/features/mas/docs/express.html', expect);

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="full-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Premium card content', async () => {
      const card = new ExpressCard(page, data.id);

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
      const card = new ExpressCard(page, data.id);

      const bodyText = await card.description.textContent();
      expect(bodyText).toContain('Top features:');
      expect(bodyText).toContain(data.features.includesText);

      const featuresList = await card.getFeaturesList();
      expect(featuresList.length).toBeGreaterThan(5);

      const compareLinks = await card.description.locator('a:has-text("Compare all features")').count();
      expect(compareLinks).toBeGreaterThan(0);
    });

    await test.step('step-4: Verify card structure', async () => {
      const card = new ExpressCard(page, data.id);

      const variant = await card.variant();
      expect(variant).toBe('full-pricing-express');

      const descriptionCount = await card.description.count();
      expect(descriptionCount).toBe(1);
    });

    await test.step('step-5: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[5].tcid}] ${features[5].name}, ${features[5].tags}`, async () => {
    const { data } = features[5];
    const page = workerSetup.getPage('FULL_PRICING_EXPRESS');

    console.info(`[Test Page]: ${await page.url()}`);

    await test.step('step-1: Wait for Full Pricing Express page elements', async () => {
      await workerSetup.verifyPageURL('FULL_PRICING_EXPRESS', '/libs/features/mas/docs/express.html', expect);

      await page.waitForSelector('merch-card-collection.full-pricing-express', { timeout: 30000 });
      await page.waitForSelector('merch-card[variant="full-pricing-express"]', { timeout: 30000 });
      await page.waitForTimeout(3000);
    });

    await test.step('step-2: Verify Pro card content', async () => {
      const card = new ExpressCard(page, data.id);

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
      if (data.borderColor) {
        expect(await card.borderColor()).toBe(data.borderColor);
      }
    });

    await test.step('step-3: Verify mobile view behavior', async () => {
      const card = new ExpressCard(page, data.id);

      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);

      const mobileCheck = await card.checkMobileView();
      expect(mobileCheck.isMobile).toBeTruthy();

      expect(mobileCheck.buttonVisible).toBeTruthy();

      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
    });

    await test.step('step-4: Verify divider structure', async () => {
      const card = new ExpressCard(page, data.id);

      const hrElements = await card.description.locator('hr').count();
      expect(hrElements).toBe(2);
    });

    await test.step('step-5: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test('Collection alignment test, @express @collection @smoke @regression @milo', async () => {
    const simplifiedPage = workerSetup.getPage('EXPRESS');
    const fullPricingPage = workerSetup.getPage('FULL_PRICING_EXPRESS');

    await test.step('step-1: Verify simplified-pricing-express collection alignment', async () => {
      const collection = simplifiedPage.locator('merch-card-collection.simplified-pricing-express');
      await expect(collection).toBeVisible();

      const cards = simplifiedPage.locator('merch-card[variant="simplified-pricing-express"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);

      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const variant = await card.getAttribute('variant');
        expect(variant).toBe('simplified-pricing-express');
      }

      await simplifiedPage.waitForTimeout(500);

      const styles = await collection.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          descriptionHeight: computed.getPropertyValue('--consonant-merch-card-simplified-pricing-express-description-height'),
          priceHeight: computed.getPropertyValue('--consonant-merch-card-simplified-pricing-express-price-height'),
        };
      });

      expect(styles).toBeDefined();
    });

    await test.step('step-2: Verify full-pricing-express collection alignment', async () => {
      const collection = fullPricingPage.locator('merch-card-collection.full-pricing-express');
      await expect(collection).toBeVisible();

      const classes = await collection.getAttribute('class');
      expect(classes).toContain('full-pricing-express');

      const cards = fullPricingPage.locator('merch-card[variant="full-pricing-express"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);

      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const variant = await card.getAttribute('variant');
        expect(variant).toBe('full-pricing-express');
      }

      await fullPricingPage.waitForTimeout(500);

      const styles = await collection.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          priceHeight: computed.getPropertyValue('--consonant-merch-card-full-pricing-express-price-height'),
          ctaHeight: computed.getPropertyValue('--consonant-merch-card-full-pricing-express-cta-height'),
          shortDescriptionHeight: computed.getPropertyValue('--consonant-merch-card-full-pricing-express-short-description-height'),
        };
      });

      expect(styles).toBeDefined();
    });
  });
});
