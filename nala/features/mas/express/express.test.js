import { expect, test } from '@playwright/test';
import { features } from './express.spec.js';
import ExpressCard from './express.page.js';
import { runAccessibilityTest } from '../../../libs/accessibility.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('MAS Express Cards test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);

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
      await expect(card.price).toContainText(data.price);
      await expect(card.priceNote).toContainText(data.priceNote);
      await expect(card.ctaButton).toContainText(data.cta);
    });

    await test.step('step-3: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);

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
      await expect(card.price).toContainText(data.price);
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

  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);

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
      await expect(card.price).toContainText(data.price);
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
});
