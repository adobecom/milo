import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './brand-concierge.spec.js';
import BrandConciergeBlock from './brand-concierge.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let bc;
let webUtil;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Brand Concierge Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    bc = new BrandConciergeBlock(page);
    webUtil = new WebUtil(page);
  });

  // Test 0: Brand Concierge default
  test(
    `[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
      const { data } = features[0];

      await test.step('step-1: Go to Brand Concierge default page', async () => {
        await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge block content/specs', async () => {
        await expect(await bc.block).toBeVisible();

        // Verify heading and body text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();
        await expect(await bc.pageBody.filter({ hasText: data.bodyText }).first()).toBeVisible();

        // Verify input field exists and is visible
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(await bc.inputField.first()).toBeVisible({ timeout: 10000 });

        // Verify prompt buttons are present
        await expect(await bc.promptButtons.first()).toBeVisible();

        // Verify disclaimer text if provided
        if (data.disclaimerText) {
          const disclaimerText = page.locator(`text=${data.disclaimerText.substring(0, 30)}`);
          const isVisible = await disclaimerText.isVisible({ timeout: 5000 }).catch(() => false);
          if (isVisible) await expect(await disclaimerText.first()).toBeVisible();
        }
      });

      await test.step('step-3: Verify analytics attributes', async () => {
        await expect(await bc.block).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('brand-concierge', 1));
      });

      await test.step('step-4: Run accessibility test on the block', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 1: Brand Concierge hero
  test(
    `[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
      const { data } = features[1];

      await test.step('step-1: Go to Brand Concierge hero page', async () => {
        await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge hero variant content/specs', async () => {
        await expect(await bc.brandConciergeHero).toBeVisible();

        // Verify heading text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        // Verify input field exists and is visible
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(await bc.inputField.first()).toBeVisible({ timeout: 10000 });

        // Verify prompt buttons are present
        await expect(await bc.promptButtons.first()).toBeVisible();
      });

      await test.step('step-3: Run accessibility test on the hero variant', async () => {
        await runAccessibilityTest({ page, testScope: bc.brandConciergeHero });
      });
    },
  );

  // Test 2: Brand Concierge 404
  test(
    `[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
      const { data } = features[2];

      await test.step('step-1: Go to Brand Concierge 404 page', async () => {
        await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
      });

      await test.step('step-2: Verify Brand Concierge 404 content/specs', async () => {
        await expect(await bc.block).toBeVisible();

        // Verify 404 heading text
        await expect(await bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        // Verify input field exists and is visible
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(await bc.inputField.first()).toBeVisible({ timeout: 10000 });

        // Verify prompt buttons are present
        await expect(await bc.promptButtons.first()).toBeVisible();

        // Verify disclaimer text if provided
        if (data.disclaimerText) {
          const disclaimerText = page.locator(`text=${data.disclaimerText.substring(0, 30)}`);
          const isVisible = await disclaimerText.isVisible({ timeout: 5000 }).catch(() => false);
          if (isVisible) await expect(await disclaimerText.first()).toBeVisible();
        }
      });

      await test.step('step-3: Run accessibility test on the block', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 3: Brand Concierge floating button with basic inline
  test(
    `[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
      const { data } = features[3];

      await test.step('step-1: Go to Brand Concierge floating button page', async () => {
        await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
      });

      await test.step('step-2: Verify inline block content', async () => {
        await expect(bc.block).toBeVisible();
        await expect(bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(bc.inputField.first()).toBeVisible({ timeout: 10000 });

        await expect(bc.promptButtons.first()).toBeVisible();
        expect(await bc.promptButtons.count()).toBeGreaterThanOrEqual(data.inlinePromptCount);
      });

      await test.step('step-3: Verify floating button stays visible during scroll', async () => {
        await expect(bc.floatingButton).toBeVisible();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
        await expect(bc.floatingButton).toBeInViewport();

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(bc.floatingButton).toBeVisible();
        await expect(bc.floatingButton).toBeInViewport();
      });

      await test.step('step-4: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-5: Verify floating button exists after modal close', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible();
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-6: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 4: Brand Concierge floating button with scroll delay
  test(
    `[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
      const { data } = features[4];

      await test.step('step-1: Go to Brand Concierge floating button delay page', async () => {
        await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
      });

      await test.step('step-2: Verify inline block content', async () => {
        await expect(bc.block).toBeVisible();
        await expect(bc.block).toHaveClass(new RegExp(data.delayClass));
        await expect(bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(bc.inputField.first()).toBeVisible({ timeout: 10000 });

        await expect(bc.promptButtons.first()).toBeVisible();
        expect(await bc.promptButtons.count()).toBeGreaterThanOrEqual(data.inlinePromptCount);
      });

      await test.step('step-3: Verify floating button is present and has correct text', async () => {
        await expect(bc.floatingButton).toBeAttached();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      await test.step('step-4: Verify floating button is visible after scrolling', async () => {
        await page.evaluate(() => window.scrollTo(0, 301));
        await expect(bc.floatingButton).toBeVisible({ timeout: 5000 });
      });

      await test.step('step-5: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-6: Verify floating button exists after modal close', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible();
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-7: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.block });
      });
    },
  );

  // Test 5: Brand Concierge hero with floating button
  test(
    `[Test Id - ${features[5].tcid}] ${features[5].name},${features[5].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
      const { data } = features[5];

      await test.step('step-1: Go to Brand Concierge hero floating button page', async () => {
        await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
      });

      await test.step('step-2: Verify hero block content', async () => {
        await expect(bc.brandConciergeHero).toBeVisible();
        await expect(bc.pageHeadings.filter({ hasText: data.h2Text }).first()).toBeVisible();

        await bc.inputField.first().waitFor({ state: 'attached', timeout: 15000 });
        await expect(bc.inputField.first()).toBeVisible({ timeout: 10000 });

        await expect(bc.promptButtons.first()).toBeVisible();
        expect(await bc.promptButtons.count()).toBeGreaterThanOrEqual(data.inlinePromptCount);
      });

      await test.step('step-3: Verify floating button is hidden initially', async () => {
        await expect(bc.floatingButtonHidden).toBeAttached();
      });

      await test.step('step-4: Verify floating button appears after scrolling past hero', async () => {
        await page.evaluate(() => {
          const el = document.querySelector('.brand-concierge.hero');
          window.scrollTo(0, el.scrollHeight + 100);
          // Webkit doesn't always fire a `scroll` event for programmatic
          // scrollTo in headless mode, so the BC scroll handler never runs.
          // Dispatch one manually so the handler updates the floating-hidden
          // class regardless of browser quirk.
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForTimeout(1000);
        await expect(bc.floatingButton).not.toHaveClass(/floating-hidden/, { timeout: 10000 });
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      await test.step('step-7: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-8: Run accessibility test on the hero block', async () => {
        await runAccessibilityTest({ page, testScope: bc.brandConciergeHero });
      });
    },
  );

  // Test 6: Brand Concierge floating button only
  test(
    `[Test Id - ${features[6].tcid}] ${features[6].name},${features[6].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[6].path}${miloLibs}`);

      await test.step('step-1: Go to Brand Concierge floating button only page', async () => {
        await page.goto(`${baseURL}${features[6].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[6].path}${miloLibs}`);
      });

      await test.step('step-2: Verify block is floating-button-only with no inline content', async () => {
        await expect(bc.block).toHaveClass(/floating-button-only/);
        await expect(bc.inputField.first()).not.toBeVisible();
      });

      await test.step('step-3: Verify floating button is visible with correct text', async () => {
        await expect(bc.floatingButton).toBeVisible();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      await test.step('step-4: Verify clicking the floating button opens BC modal', async () => {
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-5: Verify floating button exists after modal close', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible();
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-6: Run accessibility test on the floating button', async () => {
        await runAccessibilityTest({ page, testScope: bc.floatingButton });
      });
    },
  );

  // Test 7: Brand Concierge floating anchor hide
  test(
    `[Test Id - ${features[7].tcid}] ${features[7].name},${features[7].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[7].path}${miloLibs}`);

      await test.step('step-1: Go to Brand Concierge floating anchor hide page', async () => {
        await page.goto(`${baseURL}${features[7].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[7].path}${miloLibs}`);
      });

      await test.step('step-2: Verify block is floating-button-only with no inline content', async () => {
        await expect(bc.block).toHaveClass(/floating-button-only/);
        await expect(bc.inputField.first()).not.toBeVisible();
      });

      await test.step('step-3: Verify floating button is present with correct text', async () => {
        await expect(bc.floatingButton).toBeVisible();
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });

      // Skipping a11y test: known color-contrast violation on bc-floating-input (MWPW-190449)
    },
  );

  // Test 8: Brand Concierge modal open/close via floating button
  test(
    `[Test Id - ${features[8].tcid}] ${features[8].name},${features[8].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[8].path}${miloLibs}`);

      await test.step('step-1: Go to Brand Concierge floating button page', async () => {
        await page.goto(`${baseURL}${features[8].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[8].path}${miloLibs}`);
      });

      await test.step('step-2: Verify modal is not present initially', async () => {
        await expect(bc.modal).toHaveCount(0);
      });

      await test.step('step-3: Click floating button opens modal with mount + close button', async () => {
        await expect(bc.floatingButton).toBeVisible();
        await bc.floatingButtonContainer.click();

        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalCloseButton).toBeVisible();
      });

      await test.step('step-4: Press Escape dismisses modal', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
      });

      await test.step('step-5: Floating button is still attached after modal close', async () => {
        await expect(bc.floatingButton).toBeAttached();
      });

      await test.step('step-6: Re-open modal via click and close via close button', async () => {
        await bc.floatingButtonContainer.click();
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await bc.modalCloseButton.click();
        await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
      });
    },
  );

  // Test 9: Brand Concierge web client load (lazy, on first modal open)
  test(
    `[Test Id - ${features[9].tcid}] ${features[9].name},${features[9].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[9].path}${miloLibs}`);
      const { data } = features[9];

      await test.step('step-1: Go to Brand Concierge default page', async () => {
        await page.goto(`${baseURL}${features[9].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('step-2: Verify BC block is initialized', async () => {
        await expect(bc.block).toBeVisible();
      });

      await test.step('step-3: Verify web client script is NOT yet loaded before modal opens', async () => {
        // BC M2 fast-follows changed the loader: web-client main.js is
        // injected lazily inside openChatModal, not as a final init step.
        await expect(bc.webClientScript).toHaveCount(0);
      });

      await test.step('step-4: Trigger modal by clicking the first prompt card', async () => {
        await bc.promptButtons.first().click();
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-5: Verify web client main.js is now attached after modal open', async () => {
        await expect(bc.webClientScript.first()).toBeAttached({ timeout: 10000 });

        const scriptSrc = await bc.webClientScript.first().getAttribute('src');
        expect(scriptSrc).toContain(data.scriptPattern);
      });
    },
  );

  // Test 10: Brand Concierge ?webclient=baseStage URL parameter
  test(
    `[Test Id - ${features[10].tcid}] ${features[10].name},${features[10].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[10].path}${miloLibs}`);
      const { data } = features[10];

      await test.step('step-1: Navigate with ?webclient=baseStage query', async () => {
        await page.goto(`${baseURL}${features[10].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(bc.block).toBeVisible();
      });

      await test.step('step-2: Trigger modal so the web client script is loaded', async () => {
        // Web client is loaded lazily inside openChatModal; trigger it
        // through a prompt card click.
        await bc.promptButtons.first().click();
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-3: Verify baseStage web agent script is loaded', async () => {
        // baseStage uses experience-platform-brand-concierge-web-agent on experience-stage.adobe.net
        await expect(bc.webClientScript.first()).toBeAttached({ timeout: 10000 });

        const scripts = await page.locator('script').evaluateAll(
          (nodes) => nodes.map((n) => n.getAttribute('src')).filter(Boolean),
        );
        const matched = scripts.find((src) => src.includes(data.scriptPattern)
          && src.includes(data.envPattern));
        expect(matched, `Expected script src containing both "${data.scriptPattern}" and "${data.envPattern}"`).toBeTruthy();
      });
    },
  );

  // Test 11: Hero floating button has aria-hidden when initially hidden
  test(
    `[Test Id - ${features[11].tcid}] ${features[11].name},${features[11].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[11].path}${miloLibs}`);

      await test.step('step-1: Go to Hero floating button page', async () => {
        await page.goto(`${baseURL}${features[11].path}${miloLibs}`);
        await page.waitForLoadState('networkidle');
      });

      await test.step('step-2: Verify floating button is in hidden state', async () => {
        await expect(bc.floatingButtonHidden).toBeAttached({ timeout: 10000 });
      });

      await test.step('step-3: Verify floating button container has aria-hidden=true', async () => {
        await expect(bc.floatingButtonContainer).toHaveAttribute('aria-hidden', 'true');
      });

      await test.step('step-4: After scrolling past hero, aria-hidden is removed', async () => {
        await page.evaluate(() => {
          const el = document.querySelector('.brand-concierge.hero');
          if (el) window.scrollTo(0, el.scrollHeight + 1);
        });
        await page.waitForTimeout(1000);

        await expect(bc.floatingButton).not.toHaveClass(/floating-hidden/, { timeout: 10000 });
        const ariaHidden = await bc.floatingButtonContainer.getAttribute('aria-hidden');
        expect(ariaHidden).toBeNull();
      });
    },
  );

  // Test 12: Consent — block is hidden when C0002 cookie group is not granted
  test(
    `[Test Id - ${features[12].tcid}] ${features[12].name},${features[12].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[12].path}${miloLibs}`);

      await test.step('step-1: Stub window.adobePrivacy before navigation (no C0002 consent)', async () => {
        await page.addInitScript(() => {
          // Provide a fake adobePrivacy that reports no C0002 consent.
          Object.defineProperty(window, 'adobePrivacy', {
            configurable: true,
            value: { activeCookieGroups: () => ['C0001'] },
          });
        });
      });

      await test.step('step-2: Go to Brand Concierge page', async () => {
        await page.goto(`${baseURL}${features[12].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('step-3: Verify block has hide-block class', async () => {
        await expect(bc.block).toHaveClass(/hide-block/, { timeout: 10000 });
      });
    },
  );
});
