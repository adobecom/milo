import { expect, test } from '@playwright/test';
import { features } from './express.spec.js';
import ExpressCard from './express.page.js';
import { runAccessibilityTest } from '../../../libs/accessibility.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('MAS Express Cards test suite', () => {
  // Test 0: Free Card
  test(`[Test Id - ${features[0].tcid}] ${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Free card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      await expect(card.badge).toContainText(data.badge);
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

  // Test 1: Premium Card
  test(`[Test Id - ${features[1].tcid}] ${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify Premium card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      await expect(card.badge).toContainText(data.badge);
      await expect(card.description).toContainText(data.description);

      // Premium card has strikethrough price (only visible on desktop)
      const viewportWidth = page.viewportSize().width;
      if (viewportWidth >= 1200) {
        await expect(card.priceStrikethrough).toBeVisible();
      }
      await expect(card.price).toContainText(data.price);
      await expect(card.priceNote).toContainText(data.priceNote);

      await expect(card.ctaButton).toContainText(data.cta);

      // Verify gradient border
      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
    });

    await test.step('step-3: Verify mobile accordion functionality', async () => {
      const card = new ExpressCard(page, data.id);

      // Test on mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);

      // Ensure card is expanded
      await card.ensureExpanded();

      // Verify content is visible when expanded
      await expect(card.description).toBeVisible();
      await expect(card.ctaButton).toBeVisible();

      // Test collapse
      if (await card.chevronButton.isVisible()) {
        await card.chevronButton.click();
        await page.waitForTimeout(300);
        expect(await card.isExpanded()).toBe('false');
      }

      // Restore viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    await test.step('step-4: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  // Test 2: Teams Card
  test(`[Test Id - ${features[2].tcid}] ${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);

      await page.waitForSelector('merch-card', { timeout: 10000 });
      await page.waitForTimeout(2000);
    });

    await test.step('step-2: Verify Teams card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      await expect(card.badge).toContainText(data.badge);
      await expect(card.description).toContainText(data.description);
      await expect(card.price).toContainText(data.price);
      await expect(card.priceNote).toContainText(data.priceNote);
      await expect(card.priceAdditionalNote).toContainText(data.priceAdditionalNote);
      await expect(card.ctaButton).toContainText(data.cta);

      // Verify gradient border
      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
    });

    await test.step('step-3: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });

  // Test 3: Enterprise Card
  test(`[Test Id - ${features[3].tcid}] ${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const { data } = features[3];
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);

    await test.step('step-1: Go to Express page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);

      await page.waitForSelector('merch-card', { timeout: 10000 });
      await page.waitForTimeout(2000);
    });

    await test.step('step-2: Verify Enterprise card content', async () => {
      const card = new ExpressCard(page, data.id);

      await expect(card.card).toBeVisible();
      await expect(await card.variant()).toBe(data.variant);

      await expect(card.title).toContainText(data.title);
      await expect(card.badge).toContainText(data.badge);
      await expect(card.description).toContainText(data.description);

      // Enterprise card has heading in price slot
      await expect(card.priceHeading).toContainText(data.priceHeading);
      await expect(card.priceNote).toContainText(data.priceNote);

      // Enterprise card has link instead of button
      await expect(card.ctaLink).toContainText(data.ctaLink);
      await expect(card.ctaLink).toHaveAttribute('href', data.ctaUrl);

      // Verify gradient border
      expect(await card.hasGradientBorder()).toBe(data.gradientBorder);
    });

    await test.step('step-3: Verify accessibility', async () => {
      const card = new ExpressCard(page, data.id);
      await runAccessibilityTest({ page, testScope: card.card });
    });
  });
});
