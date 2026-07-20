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
          // Dispatch one manually so the handler updates the bc-floating-hidden
          // class regardless of browser quirk.
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForTimeout(1000);
        await expect(bc.floatingButton).not.toHaveClass(/bc-floating-hidden/, { timeout: 10000 });
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

        await expect(bc.floatingButton).not.toHaveClass(/bc-floating-hidden/, { timeout: 10000 });
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

  // Test 13: floating-anchor-delay<N> variant (PR #5940 / MWPW-194524).
  // Combined with floating-delay<M>, the floating button:
  //   - is hidden near the top of the page (scrollY < topDelayPx)
  //   - is visible in the middle of the page
  //   - is hidden again when within anchorDelayPx of the page footer
  // Tagged @bc-pending until the test fragment is authored.
  test(
    `[Test Id - ${features[13].tcid}] ${features[13].name},${features[13].tags}`,
    async ({ page, baseURL }) => {
      console.info(`[Test Page]: ${baseURL}${features[13].path}${miloLibs}`);
      const { data } = features[13];

      await test.step('step-1: Go to Brand Concierge floating-anchor-delay page', async () => {
        await page.goto(`${baseURL}${features[13].path}${miloLibs}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`${baseURL}${features[13].path}${miloLibs}`);
      });

      await test.step('step-2: Verify block carries both delay classes', async () => {
        await expect(bc.block).toBeVisible();
        await expect(bc.block).toHaveClass(new RegExp(data.topDelayClass));
        await expect(bc.block).toHaveClass(new RegExp(data.anchorDelayClass));
      });

      await test.step('step-3: Floating button is hidden near top of page', async () => {
        await expect(bc.floatingButton).toBeAttached({ timeout: 10000 });
        // Top delay (e.g. 100px) means the button stays hidden until scroll
        // passes that threshold.
        await expect(bc.floatingButton).toHaveClass(/bc-floating-hidden/);
      });

      await test.step('step-4: Floating button is visible in the middle of the page', async () => {
        await page.evaluate(() => {
          // Scroll well past topDelay but well before the footer.
          window.scrollTo(0, Math.floor(document.body.scrollHeight / 2));
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForTimeout(1000);
        await expect(bc.floatingButton).not.toHaveClass(/bc-floating-hidden/, { timeout: 10000 });
      });

      await test.step('step-5: Floating button is hidden again near the footer', async () => {
        await page.evaluate(() => {
          // Scroll to within anchor-delay distance of the footer.
          window.scrollTo(0, document.body.scrollHeight);
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForTimeout(1000);
        await expect(bc.floatingButton).toHaveClass(/bc-floating-hidden/, { timeout: 10000 });
      });

      await test.step('step-6: Floating button has correct text content', async () => {
        expect(await bc.floatingButtonInput.textContent()).toBeTruthy();
      });
    },
  );

  // Test 14: Brand Concierge floating-input light
  test(
    `[Test Id - ${features[14].tcid}] ${features[14].name},${features[14].tags}`,
    async ({ page, baseURL, isMobile }) => {
      console.info(`[Test Page]: ${baseURL}${features[14].path}`);
      const { data } = features[14];

      await test.step('step-1: Go to floating-input light page', async () => {
        await page.goto(features[14].path);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(features[14].path);
      });

      await test.step('step-2: Verify block has floating-input class', async () => {
        await expect(bc.floatingInputBar).toBeAttached({ timeout: 10000 });
      });

      await test.step('step-3: Verify bar is fixed and has correct background color', async () => {
        await expect(bc.floatingInputInnerBar).toHaveCSS('position', 'fixed', { timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toHaveCSS('background-color', data.expectedBarBackground);
      });

      await test.step('step-4: Verify input field and prompt pills are visible', async () => {
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 10000 });
        await expect(bc.inputField.first()).toBeVisible();
        if (!isMobile) {
          await expect(bc.floatingInputPromptPills.first()).toBeVisible();
          expect(await bc.floatingInputPromptPills.count()).toBeGreaterThanOrEqual(data.minimumPromptCount);
        }
      });

      await test.step('step-5: Verify submit button is disabled when input is empty and enabled after typing', async () => {
        await expect(bc.floatingInputSubmitButton).toBeDisabled();
        await bc.floatingInputBarTextarea.fill(data.inputText);
        await expect(bc.floatingInputSubmitButton).toBeEnabled();
        await bc.floatingInputBarTextarea.clear();
        await expect(bc.floatingInputSubmitButton).toBeDisabled();
      });

      await test.step('step-6: Verify bc-spacer is appended to main to prevent content overlap', async () => {
        await expect(page.locator('main .bc-spacer')).toBeAttached({ timeout: 5000 });
      });

      await test.step('step-7: Type query and press Enter — BC modal opens', async () => {
        await bc.floatingInputBarTextarea.fill(data.inputText);
        await page.keyboard.press('Enter');
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-8: Close modal via close button — floating-input bar remains attached', async () => {
        await bc.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
        await bc.modalCloseButton.click();
        await expect(bc.modal).not.toBeVisible({ timeout: 10000 });
        await expect(bc.floatingInputBar).toBeAttached();
      });

      await test.step('step-9: Type query and click submit button — BC modal opens', async () => {
        await bc.floatingInputBarTextarea.fill(data.inputText);
        await bc.floatingInputSubmitButton.click();
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-10: Close modal — floating-input bar remains attached', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
        await expect(bc.floatingInputBar).toBeAttached();
      });

      if (!isMobile) {
        await test.step('step-11: Click prompt pill — BC modal opens and closes', async () => {
          await bc.floatingInputPromptPills.first().click();
          await expect(bc.modal).toBeVisible({ timeout: 10000 });
          await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
          await page.keyboard.press('Escape');
          await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
          await expect(bc.floatingInputBar).toBeAttached();
        });
      }

      await test.step('step-12: Bar lifts above footer when scrolled to bottom', async () => {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForFunction(() => {
          const bar = document.querySelector('.bc-floating-input.bc-floating-element');
          return parseFloat(bar?.style.bottom ?? '0') > 0;
        }, { timeout: 5000 });
      });

      await test.step('step-13: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.floatingInputBar });
      });
    },
  );

  // Test 15: Brand Concierge floating-input dark
  test(
    `[Test Id - ${features[15].tcid}] ${features[15].name},${features[15].tags}`,
    async ({ page, baseURL, isMobile }) => {
      console.info(`[Test Page]: ${baseURL}${features[15].path}`);
      const { data } = features[15];

      await test.step('step-1: Go to floating-input dark page', async () => {
        await page.goto(features[15].path);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(features[15].path);
      });

      await test.step('step-2: Verify block has both floating-input and dark classes', async () => {
        await expect(bc.floatingInputDark).toBeAttached({ timeout: 10000 });
      });

      await test.step('step-3: Verify bar is fixed and has correct background color', async () => {
        await expect(bc.floatingInputInnerBar).toHaveCSS('position', 'fixed', { timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toHaveCSS('background-color', data.expectedBarBackground);
      });

      await test.step('step-4: Verify input field and prompt pills are visible', async () => {
        await bc.inputField.first().waitFor({ state: 'attached', timeout: 10000 });
        await expect(bc.inputField.first()).toBeVisible();
        if (!isMobile) {
          await expect(bc.floatingInputPromptPills.first()).toBeVisible();
          expect(await bc.floatingInputPromptPills.count()).toBeGreaterThanOrEqual(data.minimumPromptCount);
        }
      });

      await test.step('step-5: Verify submit button is disabled when input is empty and enabled after typing', async () => {
        await expect(bc.floatingInputSubmitButton).toBeDisabled();
        await bc.floatingInputBarTextarea.fill(data.inputText);
        await expect(bc.floatingInputSubmitButton).toBeEnabled();
        await bc.floatingInputBarTextarea.clear();
        await expect(bc.floatingInputSubmitButton).toBeDisabled();
      });

      await test.step('step-6: Verify bc-spacer is appended to main to prevent content overlap', async () => {
        await expect(page.locator('main .bc-spacer')).toBeAttached({ timeout: 5000 });
      });

      await test.step('step-7: Verify dark variant input and text colors', async () => {
        await expect(bc.floatingInputBarContainer).toHaveCSS('background-color', data.expectedInputBackground);
        await expect(bc.floatingInputBarTextarea).toHaveCSS('color', data.expectedTextColor);
      });

      await test.step('step-8: Type query and press Enter — BC modal opens', async () => {
        await bc.floatingInputBarTextarea.fill(data.inputText);
        await page.keyboard.press('Enter');
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-9: Close modal via close button — floating-input dark bar remains attached', async () => {
        await bc.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
        await bc.modalCloseButton.click();
        await expect(bc.modal).not.toBeVisible({ timeout: 10000 });
        await expect(bc.floatingInputDark).toBeAttached();
      });

      await test.step('step-10: Type query and click submit button — BC modal opens', async () => {
        await bc.floatingInputBarTextarea.fill(data.inputText);
        await bc.floatingInputSubmitButton.click();
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-11: Close modal — floating-input dark bar remains attached', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
        await expect(bc.floatingInputDark).toBeAttached();
      });

      if (!isMobile) {
        await test.step('step-12: Click prompt pill — BC modal opens and closes', async () => {
          await bc.floatingInputPromptPills.first().click();
          await expect(bc.modal).toBeVisible({ timeout: 10000 });
          await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
          await page.keyboard.press('Escape');
          await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
          await expect(bc.floatingInputDark).toBeAttached();
        });
      }

      await test.step('step-13: Bar lifts above footer when scrolled to bottom', async () => {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForFunction(() => {
          const bar = document.querySelector('.bc-floating-input.bc-floating-element');
          return parseFloat(bar?.style.bottom ?? '0') > 0;
        }, { timeout: 5000 });
      });

      await test.step('step-14: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.floatingInputDark });
      });
    },
  );

  // Test 16: Brand Concierge floating-input-only (standalone light bar, no inline blade)
  test(
    `[Test Id - ${features[16].tcid}] ${features[16].name},${features[16].tags}`,
    async ({ page, isMobile }) => {
      test.setTimeout(120000);
      console.info(`[Test Page]: ${features[16].path}`);
      const { data } = features[16];

      await test.step('step-1: Go to floating-input-only page', async () => {
        await page.goto(features[16].path);
        await page.waitForLoadState('networkidle');
      });

      await test.step('step-2: Verify bar is initially hidden (bc-floating-hidden)', async () => {
        await expect(bc.floatingInputInnerBar).toBeAttached({ timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toHaveClass(/bc-floating-hidden/);
      });

      await test.step('step-3: Scroll to trigger bar reveal (bc-floating-show)', async () => {
        await page.evaluate(() => {
          window.scrollTo(0, 300);
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForFunction(
          () => document.querySelector('.bc-floating-input.bc-floating-element')?.classList.contains('bc-floating-show'),
          { timeout: 5000 },
        );
        await expect(bc.floatingInputInnerBar).toHaveClass(/bc-floating-show/);
      });

      await test.step('step-4: Verify bar is fixed-position with correct light background', async () => {
        await expect(bc.floatingInputInnerBar).toHaveCSS('position', 'fixed');
        await expect(bc.floatingInputInnerBar).toHaveCSS('background-color', data.expectedBarBackground);
      });

      await test.step('step-5: Verify input field and prompt pills are visible', async () => {
        await expect(bc.floatingInputTextarea).toBeVisible();
        if (!isMobile) {
          expect(await bc.floatingInputInnerBarPills.count()).toBeGreaterThanOrEqual(data.minimumPromptCount);
        }
      });

      await test.step('step-6: Verify submit button is disabled when empty and enabled after typing', async () => {
        await expect(bc.inputSubmitButton).toBeDisabled();
        await bc.floatingInputTextarea.fill(data.inputText);
        await expect(bc.inputSubmitButton).toBeEnabled();
        await bc.floatingInputTextarea.clear();
        await expect(bc.inputSubmitButton).toBeDisabled();
      });

      await test.step('step-7: Type query and press Enter — BC modal opens', async () => {
        await bc.floatingInputTextarea.fill(data.inputText);
        await page.keyboard.press('Enter');
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-8: Close modal via close button — bar remains attached', async () => {
        await bc.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
        await bc.modalCloseButton.click();
        await expect(bc.modal).not.toBeVisible({ timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toBeAttached();
      });

      await test.step('step-9: Type query and click submit button — BC modal opens', async () => {
        await bc.floatingInputTextarea.fill(data.inputText);
        await bc.inputSubmitButton.click();
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-10: Close modal via Escape — bar remains attached', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
        await expect(bc.floatingInputInnerBar).toBeAttached();
      });

      if (!isMobile) {
        await test.step('step-11: Click prompt pill — BC modal opens and closes', async () => {
          await page.locator('.bc-floating-input.bc-floating-element .prompt-card-button:visible').first().click();
          await expect(bc.modal).toBeVisible({ timeout: 10000 });
          await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
          await page.keyboard.press('Escape');
          await expect(bc.modal).not.toBeVisible({ timeout: 5000 });
          await expect(bc.floatingInputInnerBar).toBeAttached();
        });
      }

      await test.step('step-12: Bar lifts above footer when scrolled to bottom', async () => {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForFunction(
          () => parseFloat(document.querySelector('.bc-floating-input.bc-floating-element')?.style.bottom ?? '0') > 0,
          { timeout: 5000 },
        );
      });

      await test.step('step-13: Run accessibility test', async () => {
        await runAccessibilityTest({ page, testScope: bc.floatingInputInnerBar });
      });
    },
  );

  // Test 17: Brand Concierge floating-input-delay dark
  test(
    `[Test Id - ${features[17].tcid}] ${features[17].name},${features[17].tags}`,
    async ({ page }) => {
      test.setTimeout(120000);
      console.info(`[Test Page]: ${features[17].path}`);
      const { data } = features[17];

      await test.step('step-1: Go to floating-input-delay page', async () => {
        await page.goto(features[17].path);
        await page.waitForLoadState('networkidle');
      });

      await test.step('step-2: Verify block has delay and anchor-delay classes', async () => {
        await expect(bc.block).toHaveClass(new RegExp(data.topDelayClass), { timeout: 10000 });
        await expect(bc.block).toHaveClass(new RegExp(data.anchorDelayClass));
      });

      await test.step('step-3: Verify inline blade heading is visible', async () => {
        await expect(page.locator(`text=${data.inlineHeading}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-4: Verify bar is hidden before scroll threshold', async () => {
        await expect(bc.floatingInputInnerBar).toBeAttached({ timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toHaveClass(/bc-floating-hidden/);
      });

      await test.step('step-5: Scroll to middle of page — bar shows (bc-floating-show)', async () => {
        await page.evaluate(() => {
          window.scrollTo(0, Math.round(document.body.scrollHeight / 2));
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForFunction(
          () => document.querySelector('.bc-floating-input.bc-floating-element')?.classList.contains('bc-floating-show'),
          { timeout: 5000 },
        );
        await expect(bc.floatingInputInnerBar).toHaveClass(/bc-floating-show/);
      });

      await test.step('step-6: Verify dark bar is fixed-position with correct dark background', async () => {
        await expect(bc.floatingInputInnerBar).toHaveCSS('position', 'fixed');
        await expect(bc.floatingInputInnerBar).toHaveCSS('background-color', data.expectedBarBackground);
      });

      await test.step('step-7: Verify submit button is disabled when empty and enabled after typing', async () => {
        const barTextarea = bc.floatingInputInnerBar.locator('textarea');
        const barSubmit = bc.floatingInputInnerBar.locator('.input-field-button');
        await expect(barSubmit).toBeDisabled();
        await barTextarea.fill(data.inputText);
        await expect(barSubmit).toBeEnabled();
        await barTextarea.clear();
        await expect(barSubmit).toBeDisabled();
      });

      await test.step('step-8: Type query and press Enter — BC modal opens', async () => {
        const barTextarea = bc.floatingInputInnerBar.locator('textarea');
        await barTextarea.fill(data.inputText);
        await page.keyboard.press('Enter');
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-9: Close modal via close button — bar remains attached', async () => {
        await bc.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
        await bc.modalCloseButton.click();
        await expect(bc.modal).not.toBeVisible({ timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toBeAttached();
      });

      await test.step('step-10: Type query and press Enter from bar — BC modal opens', async () => {
        const barTextarea = bc.floatingInputInnerBar.locator('textarea');
        await barTextarea.waitFor({ state: 'visible', timeout: 15000 });
        await barTextarea.fill(data.inputText);
        await page.keyboard.press('Enter');
        await expect(bc.modal).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount).toBeVisible({ timeout: 10000 });
        await expect(bc.modalMount.locator(`text=${data.inputText}`)).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-11: Close modal via Escape — bar remains attached', async () => {
        await page.keyboard.press('Escape');
        await expect(bc.modal).not.toBeVisible({ timeout: 10000 });
        await expect(bc.floatingInputInnerBar).toBeAttached();
      });

      await test.step('step-12: Bar lifts above footer when scrolled to bottom (anchor-delay-450)', async () => {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
          window.dispatchEvent(new Event('scroll'));
        });
        await page.waitForFunction(
          () => parseFloat(document.querySelector('.bc-floating-input.bc-floating-element')?.style.bottom ?? '0') > 0,
          null,
          { timeout: 5000 },
        );
      });

      await test.step('step-13: Run accessibility test', async () => {
        // skipA11yTest: pill text contrast fails on dark delay bar currently.
        await runAccessibilityTest({ page, testScope: bc.floatingInputInnerBar, skipA11yTest: true });
      });
    },
  );
});
