import { expect, test } from '@playwright/test';
import { writeFileSync } from 'fs';
import { features } from './three-in-one.spec.js';
import ThreeInOne from './three-in-one.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('ThreeInOne Block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }

    // Debug: Log environment info
    console.log('[DEBUG] Test environment info:');
    console.log('[DEBUG] Base URL:', process.env.BASE_URL || 'not set');
    console.log('[DEBUG] Browser:', browserName);
    console.log('[DEBUG] User agent:', await page.evaluate(() => navigator.userAgent));

    // Enable console logging from the page
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.text().includes('DEBUG')) {
        console.log(`[PAGE] ${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('Validate if each CTA is visible and has proper href', async () => {
      for (const { el, href } of Object.values(threeInOne.ctas)) {
        await expect(el).toBeVisible();
        await expect(el).toHaveAttribute('href', href);
      }
    });

    await test.step('Validate if modal reopens on back navigation', async () => {
      const cta = threeInOne.ctas.illustratorAndAcrobatProTwpSegmentation.el;

      // Debug: Log initial state
      console.log('[DEBUG] Initial page URL:', page.url());
      await threeInOne.debugModalState();

      await cta.click();
      const modal = await threeInOne.getModal();
      expect(modal).toBeVisible();

      // Debug: Log modal state after opening
      await threeInOne.debugModalState();

      // Debug: Wait for modal to be fully loaded
      await page.waitForTimeout(1000);

      await page.goto('https://www.adobe.com');

      // Debug: Log state after navigation
      console.log('[DEBUG] After navigation to adobe.com');
      console.log('[DEBUG] Current URL:', page.url());

      await page.goBack();

      // Debug: Log state after going back
      console.log('[DEBUG] After goBack()');
      await threeInOne.debugModalState();

      // Debug: Wait for page to stabilize
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Use the new retry method
      try {
        const newModal = await threeInOne.waitForModalWithRetry(10, 1000);
        await expect(newModal).toBeVisible();
        await threeInOne.closeModal();
      } catch (error) {
        console.error('[DEBUG] Modal reopening failed:', error.message);

        // Final debug state
        await threeInOne.debugModalState();

        // Take a screenshot for debugging
        await page.screenshot({ path: 'modal-reopen-failure.png', fullPage: true });

        throw error;
      }
    });

    await test.step('Validate if previous hash is preserved after modal is opened and closed', async () => {
      await page.evaluate(() => {
        window.location.hash = 'category=photo';
      });
      const cta = threeInOne.ctas.illustratorAndAcrobatProTwpSegmentation.el;
      await cta.click();
      const modal = await threeInOne.getModal();
      expect(modal).toBeVisible();
      await page.goBack();
      expect(page.url()).toContain('category=photo');
    });

    await test.step('Validate if multiple clicks on the same CTA open only one modal', async () => {
      const cta = threeInOne.ctas.illustratorAndAcrobatProTwpSegmentation.el;
      await Promise.all([
        cta.click(),
        cta.click(),
        cta.click(),
        cta.click(),
        cta.click(),
        cta.click(),
      ]);
      const modalsCount = await threeInOne.getModalsCount();
      expect(modalsCount).toBe(1);
      await threeInOne.closeModal();
    });
  });

  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    for (const { sectionId, attributes, iframeSrc } of features[1].useCases) {
      await test.step(`Validate ${sectionId} CTA is visible and has proper attributes`, async () => {
        await page.goto(`${baseURL}${features[1].path}${features[0].browserParams}&${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        const cta = threeInOne.getFallbackCta(sectionId);
        for (const [key, value] of Object.entries(attributes)) {
          await expect(cta).toHaveAttribute(key, value);
        }
        await cta.click();
        const modal = await threeInOne.getModal();
        const iframe = await modal.locator('iframe');
        await expect(iframe).toHaveAttribute('src', iframeSrc);
        await threeInOne.closeModal();
      });
    }
  });

  test(`${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      const { sectionId, iframeSrc, attributes } = features[2];
      await page.goto(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      const cta = threeInOne.getFallbackCta(sectionId);
      for (const [key, value] of Object.entries(attributes)) {
        await expect(cta).toHaveAttribute(key, value);
      }
      await cta.click();
      const modal = await threeInOne.getModal();
      const iframe = await modal.locator('iframe');
      await expect(iframe).toHaveAttribute('src', iframeSrc);
      await page.goto('https://www.adobe.com');
      await page.goBack();
      const newModal = await threeInOne.getModal();
      await expect(newModal).toBeVisible();
      await threeInOne.closeModal();
    });
  });

  test(`${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      const { sectionId, iframeSrc, attributes } = features[3];
      await page.goto(`${baseURL}${features[3].path}${features[3].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      const cta = threeInOne.getFallbackCta(sectionId);
      for (const [key, value] of Object.entries(attributes)) {
        await expect(cta).toHaveAttribute(key, value);
      }
      await cta.click();
      const modal = await threeInOne.getModal();
      const iframe = await modal.locator('iframe');
      await expect(iframe).toHaveAttribute('src', iframeSrc);
      await page.goto('https://www.adobe.com');
      await page.goBack();
      const newModal = await threeInOne.getModal();
      await expect(newModal).toBeVisible();
      await threeInOne.closeModal();
    });
  });

  // Production debugging test
  test('@ProductionDebug - Modal reopen on back navigation (detailed)', async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[PRODUCTION DEBUG] Test Page: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page and setup', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');

      // Enable detailed logging
      await page.evaluate(() => {
        window.debugModalState = () => {
          const modal = document.querySelector('.dialog-modal');
          const { hash } = window.location;
          console.log('[PAGE DEBUG] Modal state:', {
            modalExists: !!modal,
            modalVisible: modal ? modal.offsetParent !== null : false,
            hash,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          });
        };

        // Override console.log to capture all logs
        const originalLog = console.log;
        console.log = (...args) => {
          originalLog.apply(console, args);
          if (args[0] && typeof args[0] === 'string' && args[0].includes('DEBUG')) {
            window.lastDebugLog = args.join(' ');
          }
        };
      });
    });

    await test.step('Open modal and verify', async () => {
      const cta = threeInOne.ctas.illustratorAndAcrobatProTwpSegmentation.el;
      await expect(cta).toBeVisible();

      // Log initial state
      await page.evaluate(() => window.debugModalState());

      await cta.click();

      // Wait for modal to appear
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.debugModalState());

      const modal = await threeInOne.getModal();
      await expect(modal).toBeVisible();
    });

    await test.step('Navigate away and back', async () => {
      await page.goto('https://www.adobe.com');
      console.log('[PRODUCTION DEBUG] Navigated to adobe.com');

      await page.goBack();
      console.log('[PRODUCTION DEBUG] Navigated back');

      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);

      // Check state multiple times
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.debugModalState());
        await page.waitForTimeout(1000);
      }
    });

    await test.step('Verify modal reopening', async () => {
      try {
        const newModal = await threeInOne.waitForModalWithRetry(15, 1000);
        await expect(newModal).toBeVisible();
        console.log('[PRODUCTION DEBUG] Modal successfully reopened');
        await threeInOne.closeModal();
      } catch (error) {
        console.error('[PRODUCTION DEBUG] Modal reopening failed:', error.message);

        // Capture final state
        await page.evaluate(() => window.debugModalState());

        // Take screenshot and save page HTML
        await page.screenshot({ path: 'production-modal-failure.png', fullPage: true });
        const html = await page.content();
        writeFileSync('production-modal-failure.html', html);

        throw error;
      }
    });
  });
});
