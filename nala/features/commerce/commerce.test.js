import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './commerce.spec.js';
import CommercePage from './commerce.page.js';
import FedsLogin from '../feds/login/login.page.js';
import FedsHeader from '../feds/header/header.page.js';
import { PRICE_PATTERN, constructTestUrl } from '../../libs/commerce.js';

let COMM;
test.beforeEach(async ({ page, baseURL, browserName }) => {
  test.skip(browserName !== 'chromium', 'Not supported to run on multiple browsers.');

  COMM = new CommercePage(page);
  if (browserName === 'chromium') {
    await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
  }

  const skipOn = ['bacom', 'business'];
  skipOn.some((skip) => {
    if (baseURL.includes(skip)) test.skip(true, `Skipping the commerce tests for ${baseURL}`);
    return null;
  });
});

test.describe('Commerce feature test suite', () => {
  // @Commerce-Price-Term - Validate price with term display
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[0].path);
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate regular price display', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.price.innerText()).toMatch(PRICE_PATTERN.US.yr);
      expect(await COMM.price.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.price.locator('.price-tax-inclusivity').innerText()).toBe('');
    });

    await test.step('Validate optical price display', async () => {
      await COMM.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceOptical.innerText()).toMatch(PRICE_PATTERN.US.mo);
      expect(await COMM.priceOptical.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.priceOptical.locator('.price-tax-inclusivity').innerText()).toBe('');
    });

    await test.step('Validate strikethrough price display', async () => {
      await COMM.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceStrikethrough.innerText()).toMatch(PRICE_PATTERN.US.yr);
      expect(await COMM.priceStrikethrough.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-tax-inclusivity').innerText()).toBe('');
      const priceStyle = await COMM.priceStrikethrough.evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('text-decoration'),
      );
      expect(await priceStyle).toContain('line-through');
    });
  });

  // @Commerce-Price-Unit-Term - Validate price with term and unit display
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[1].path);
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate regular price display', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.price.innerText()).toContain('US$');
      expect(await COMM.price.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-unit-type').innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-tax-inclusivity').innerText()).toBe('');
    });

    await test.step('Validate optical price display', async () => {
      await COMM.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceOptical.innerText()).toContain('US$');
      expect(await COMM.priceOptical.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-unit-type').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-tax-inclusivity').innerText()).toBe('');
    });

    await test.step('Validate strikethrough price display', async () => {
      await COMM.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceStrikethrough.innerText()).toContain('US$');
      expect(await COMM.priceStrikethrough.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-unit-type').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-tax-inclusivity').innerText()).toBe('');
      const priceStyle = await COMM.priceStrikethrough.evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('text-decoration'),
      );
      expect(await priceStyle).toContain('line-through');
    });
  });

  // @Commerce-Price-Taxlabel-Unit-Term - Validate price with term, unit and tax label display
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[2].path);
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate regular price display', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.price.innerText()).toContain('€');
      expect(await COMM.price.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-unit-type').innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-tax-inclusivity').innerText()).not.toBe('');
    });

    await test.step('Validate optical price display', async () => {
      await COMM.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceOptical.innerText()).toContain('€');
      expect(await COMM.priceOptical.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-unit-type').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-tax-inclusivity').innerText()).not.toBe('');
    });

    await test.step('Validate strikethrough price display', async () => {
      await COMM.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceStrikethrough.innerText()).toContain('€');
      expect(await COMM.priceStrikethrough.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-unit-type').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-tax-inclusivity').innerText()).not.toBe('');
      const priceStyle = await COMM.priceStrikethrough.evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('text-decoration'),
      );
      expect(await priceStyle).toContain('line-through');
    });
  });

  // @Commerce-Promo - Validate price and CTAs have promo code applied
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[3].path);
    const { data } = features[3];

    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate regular price has promo', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.price).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.price).toHaveAttribute('data-display-old-price', 'true');
      await COMM.price.locator('.price').first().waitFor({ state: 'visible', timeout: 10000 });
      await COMM.price.locator('.price-strikethrough').waitFor({ state: 'visible', timeout: 10000 });
    });

    await test.step('Validate optical price has promo', async () => {
      await COMM.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.priceOptical).toHaveAttribute('data-promotion-code', data.promo);
    });

    await test.step('Validate strikethrough price has promo', async () => {
      await COMM.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.priceStrikethrough).toHaveAttribute('data-promotion-code', data.promo);
    });

    await test.step('Validate Buy now CTA has promo', async () => {
      await COMM.buyNowCta.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.buyNowCta).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.promo}`));
    });

    await test.step('Validate Free Trial CTA has promo', async () => {
      await COMM.freeTrialCta.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.freeTrialCta).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.promo}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.workflow}`));
    });
  });

  // @Commerce-Upgrade-Entitlement - Validate Upgrade commerce flow
  test(`${features[4].name}, ${features[4].tags}`, async ({ page, baseURL }) => {
    test.skip(); // Skipping due to missing login

    const testPage = constructTestUrl(baseURL, features[4].path);
    console.info('[Test Page]: ', testPage);

    const { data } = features[4];
    const Login = new FedsLogin(page);
    const Header = new FedsHeader(page);

    // Go to test example
    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    // Login with Adobe test account:
    await test.step('Login with a valid Adobe account', async () => {
      await Header.signInButton.click();
      if (COMM.loginType.isVisible()) {
        await COMM.loginType.click();
      }
      await Login.loginOnAppForm(process.env.IMS_EMAIL_PAID_PS, process.env.IMS_PASS_PAID_PS);
    });

    // Validate Upgrade eligibility check w.r.t Buy CTA
    await test.step('Verify cc all apps card cta title', async () => {
      await page.waitForLoadState('domcontentloaded');
      await COMM.ccAllAppsCTA.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.ccAllAppsCTA).toHaveText(data.UpgradeCTATitle);
    });

    // Validate Upgrade eligibility check w.r.t Switch modal
    await test.step('Verify Switch modal launch for Upgrade', async () => {
      await COMM.ccAllAppsCTA.click();
      await COMM.switchModalIframe.waitFor({ state: 'visible', timeout: 45000 });
      await expect(COMM.switchModalIframe).toBeVisible();
    });
  });

  // @Commerce-Download-Entitlement - Validate Download commerce flow
  test(`${features[5].name}, ${features[5].tags}`, async ({ page, baseURL }) => {
    test.skip(); // Skipping due to missing login

    const testPage = constructTestUrl(baseURL, features[5].path);
    console.info('[Test Page]: ', testPage);
    const { data } = features[5];
    const Login = new FedsLogin(page);
    const Header = new FedsHeader(page);

    // Go to test example
    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    // Login with Adobe test account:
    await test.step('Login with a valid Adobe account', async () => {
      await Header.signInButton.click();
      if (COMM.loginType.isVisible()) {
        await COMM.loginType.click();
      }
      await Login.loginOnAppForm(process.env.IMS_EMAIL_PAID_PS, process.env.IMS_PASS_PAID_PS);
    });

    // Validate Download eligibility check w.r.t Buy CTA
    await test.step('Verify photoshop card cta title', async () => {
      await page.waitForLoadState('domcontentloaded');
      await COMM.photoshopBuyCTA.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.photoshopBuyCTA).toHaveText(data.DownloadCTATitle);
      await expect(COMM.photoshopFreeCTA).toHaveText(data.TrialCTATitle);
    });

    // Validate Download eligibility check w.r.t download link
    await test.step('Verify download link for download', async () => {
      await COMM.photoshopBuyCTA.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.url()).toContain(data.DownloadUrl);
    });
  });

  // @Commerce-KitchenSink-Smoke - Validate commerce CTA and checkout placeholders
  test(`${features[6].name}, ${features[6].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[6].path);
    const webUtil = new WebUtil(page);

    console.info('[Test Page]: ', testPage);

    // Go to test example
    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    // Validate there are no unresolved commerce placeholders
    await test.step('Validate wcs placeholders', async () => {
      await COMM.merchCard.first().waitFor({ state: 'visible', timeout: 45000 });
      await webUtil.scrollPage('down', 'slow');
      const unresolvedPlaceholders = await page.evaluate(
        () => [...document.querySelectorAll('[data-wcs-osi]')].filter(
          (el) => !el.classList.contains('placeholder-resolved'),
        ),
      );
      expect(unresolvedPlaceholders.length).toBe(0);
    });

    // Validate commerce checkout links are indeed commerce
    await test.step('Validate checkout links', async () => {
      const invalidCheckoutLinks = await page.evaluate(
        () => [...document.querySelectorAll('[data-wcs-osi][is="checkout-link"]')].filter(
          (el) => !el.getAttribute('href').includes('commerce'),
        ),
      );
      expect(invalidCheckoutLinks.length).toBe(0);
    });
  });

  // @Commerce-DE - Validate commerce CTA and checkout placeholders in DE locale
  test(`${features[7].name}, ${features[7].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[7].path);
    const { data } = features[7];

    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    // Validate there are no unresolved commerce placeholders
    await test.step('Validate wcs placeholders', async () => {
      const unresolvedPlaceholders = await page.evaluate(
        () => [...document.querySelectorAll('[data-wcs-osi]')].filter(
          (el) => !el.classList.contains('placeholder-resolved'),
        ),
      );
      expect(unresolvedPlaceholders.length).toBe(0);
    });

    await test.step('Validate Buy now CTA', async () => {
      await COMM.buyNowCta.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.buyNowCta).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.promo}`));
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.CO}`));
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.lang}`));
    });

    await test.step('Validate Free Trial CTA', async () => {
      await COMM.freeTrialCta.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.freeTrialCta).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.promo}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.CO}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.lang}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.workflow}`));
    });

    await test.step('Validate regular price display', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.price.innerText()).toContain('€/Jahr');
      expect(await COMM.price.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.price.locator('.price-tax-inclusivity').innerText()).toBe('');
      await expect(COMM.price).toHaveAttribute('data-promotion-code', data.promo);
    });

    await test.step('Validate optical price display', async () => {
      await COMM.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceOptical.innerText()).toContain('€/Monat');
      expect(await COMM.priceOptical.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.priceOptical.locator('.price-tax-inclusivity').innerText()).toBe('');
      await expect(COMM.priceOptical).toHaveAttribute('data-promotion-code', data.promo);
    });

    await test.step('Validate strikethrough price display', async () => {
      await COMM.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceStrikethrough.innerText()).toContain('€/Jahr');
      expect(await COMM.priceStrikethrough.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-tax-inclusivity').innerText()).toBe('');
      const priceStyle = await COMM.priceStrikethrough.evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('text-decoration'),
      );
      expect(await priceStyle).toContain('line-through');
      await expect(COMM.priceStrikethrough).toHaveAttribute('data-promotion-code', data.promo);
    });
  });

  // @Commerce-Old-Promo - Validate promo price WITHOUT old price
  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[8].path);
    const { data } = features[8];

    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate promo price does not show old price', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.price).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.price).not.toHaveAttribute('data-display-old-price', 'true');
      // expect(await COMM.price.innerText()).toContain('US$17.24');
      // expect(await COMM.price.innerText()).not.toContain('US$34.49');
      await expect(await COMM.price.locator('.price').first()).toBeVisible();
      await expect(await COMM.price.locator('.price-strikethrough')).not.toBeVisible();
    });
  });

  // @Commerce-GB - Validate commerce CTA and checkout placeholders in UK locale
  test(`${features[9].name}, ${features[9].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[9].path);
    const { data } = features[9];

    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    // Validate there are no unresolved commerce placeholders
    await test.step('Validate wcs placeholders', async () => {
      const unresolvedPlaceholders = await page.evaluate(
        () => [...document.querySelectorAll('[data-wcs-osi]')].filter(
          (el) => !el.classList.contains('placeholder-resolved'),
        ),
      );
      expect(unresolvedPlaceholders.length).toBe(0);
    });

    await test.step('Validate Buy now CTA', async () => {
      await COMM.buyNowCta.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.buyNowCta).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.promo}`));
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.CO}`));
      await expect(COMM.buyNowCta).toHaveAttribute('href', new RegExp(`${data.lang}`));
    });

    await test.step('Validate Free Trial CTA', async () => {
      await COMM.freeTrialCta.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.freeTrialCta).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.promo}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.CO}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.lang}`));
      await expect(COMM.freeTrialCta).toHaveAttribute('href', new RegExp(`${data.workflow}`));
    });

    await test.step('Validate regular price display', async () => {
      await COMM.price.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.price.innerText()).toContain('£');
      expect(await COMM.price.innerText()).toContain('/yr');
      expect(await COMM.price.locator('.price-recurrence').first().innerText()).not.toBe('');
      expect(await COMM.price.locator('.price-unit-type').first().innerText()).toBe('');
      expect(await COMM.price.locator('.price-tax-inclusivity').first().innerText()).toBe('');
      await expect(COMM.price).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.price).toHaveAttribute('data-display-old-price', 'true');
      await COMM.price.locator('.price').first().waitFor({ state: 'visible', timeout: 10000 });
      await COMM.price.locator('.price-strikethrough').waitFor({ state: 'visible', timeout: 10000 });
    });

    await test.step('Validate optical price display', async () => {
      await COMM.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceOptical.innerText()).toContain('£');
      expect(await COMM.priceOptical.innerText()).toContain('/mo');
      expect(await COMM.priceOptical.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceOptical.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.priceOptical.locator('.price-tax-inclusivity').innerText()).toBe('');
      await expect(COMM.priceOptical).toHaveAttribute('data-promotion-code', data.promo);
    });

    await test.step('Validate strikethrough price display', async () => {
      await COMM.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      expect(await COMM.priceStrikethrough.innerText()).toContain('£');
      expect(await COMM.priceStrikethrough.innerText()).toContain('/yr');
      expect(await COMM.priceStrikethrough.locator('.price-recurrence').innerText()).not.toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-unit-type').innerText()).toBe('');
      expect(await COMM.priceStrikethrough.locator('.price-tax-inclusivity').innerText()).toBe('');
      const priceStyle = await COMM.priceStrikethrough.evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('text-decoration'),
      );
      expect(await priceStyle).toContain('line-through');
      await expect(COMM.priceStrikethrough).toHaveAttribute('data-promotion-code', data.promo);
    });
  });

  test(`${features[10].name}, ${features[10].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[10].path);
    console.info('[Test Page]: ', testPage);
    const { data } = features[10];

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    let regularPrice;

    await test.step('Validate the regular price is displayed if quantity is less than the minimum promotion quantity', async () => {
      await COMM.volumeDiscountWithoutQuantity.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.volumeDiscountWithoutQuantity).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.volumeDiscountWithoutQuantity).toHaveAttribute('data-quantity', '1');
      regularPrice = `${await COMM.volumeDiscountWithoutQuantityInteger.innerText()}.${await COMM.volumeDiscountWithoutQuantityDecimals.innerText()}`;
      expect(regularPrice).not.toBe('');
      await expect(COMM.volumeDiscountWithoutQuantityStrikethrough).not.toBeVisible();
      await expect(COMM.volumeDiscountWithoutQuantityAlternative).not.toBeVisible();
    });

    await test.step('Validate the strikethrough price is the same as the regular price', async () => {
      await COMM.volumeDiscountWithQuantity.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-quantity', '3');
      const priceStrikedThrough = `${await COMM.volumeDiscountWithQuantityStrikeThroughInteger.innerText()}.${await COMM.volumeDiscountWithQuantityStrikeThroughDecimals.innerText()}`;
      expect(priceStrikedThrough).toBe(regularPrice);
    });

    await test.step('Validate the volume discount price is displayed if quantity is greater than the minimum promotion quantity', async () => {
      await COMM.volumeDiscountWithQuantity.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-quantity', '3');
      const volumeDiscountPrice = `${await COMM.volumeDiscountWithQuantityAlternativeInteger.innerText()}.${await COMM.volumeDiscountWithQuantityAlternativeDecimals.innerText()}`;
      expect(regularPrice > volumeDiscountPrice).toBe(true);
    });

    await test.step('Validate the alternative price next to the regular strikethrough price', async () => {
      await COMM.strikethroughPrice.waitFor({ state: 'visible', timeout: 10000 });
      expect(COMM.strikethroughPrice).toBeVisible();
      await COMM.alternativePrice.waitFor({ state: 'visible', timeout: 10000 });
      expect(COMM.alternativePrice).toBeVisible();
      const strikethroughRegularPrice = Number(`${await COMM.strikethroughPriceInteger.innerText()}.${await COMM.strikethroughPriceDecimals.innerText()}`);
      const promoPrice = Number(`${await COMM.alternativePriceInteger.innerText()}.${await COMM.alternativePriceDecimals.innerText()}`);
      expect(promoPrice).not.toBeNull();
      expect(strikethroughRegularPrice).not.toBeNull();
      expect(promoPrice).toBeLessThan(strikethroughRegularPrice);
    });
  });

  test(`${features[11].name}, ${features[11].tags}`, async ({ page, baseURL }) => {
    const testPage = constructTestUrl(baseURL, features[11].path);
    console.info('[Test Page]: ', testPage);
    const { data } = features[11];

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    let regularPrice;
    let regularAnnualPrice;

    await test.step('Validate the regular price and annual price are displayed if quantity is less than the minimum promotion quantity', async () => {
      await COMM.volumeDiscountWithoutQuantity.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.volumeDiscountWithoutQuantity).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.volumeDiscountWithoutQuantity).toHaveAttribute('data-quantity', '1');
      regularPrice = `${await COMM.volumeDiscountWithoutQuantityInteger.innerText()}.${await COMM.volumeDiscountWithoutQuantityDecimals.innerText()}`;
      regularAnnualPrice = `${await COMM.volumeDiscountWithoutQuantityAnnualInteger.innerText()}.${await COMM.volumeDiscountWithoutQuantityAnnualDecimals.innerText()}`;
      expect(regularPrice).not.toBe('');
      expect(regularAnnualPrice).not.toBe('');
      await expect(COMM.volumeDiscountWithoutQuantityStrikethrough).not.toBeVisible();
      await expect(COMM.volumeDiscountWithoutQuantityAlternative).not.toBeVisible();
    });

    await test.step('Validate the strikethrough price is the same as the regular price', async () => {
      await COMM.volumeDiscountWithQuantity.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-quantity', '3');
      const priceStrikedThrough = `${await COMM.volumeDiscountWithQuantityStrikeThroughInteger.innerText()}.${await COMM.volumeDiscountWithQuantityStrikeThroughDecimals.innerText()}`;
      expect(priceStrikedThrough).toBe(regularPrice);
    });

    await test.step('Validate the volume discount price is displayed if quantity is greater than the minimum promotion quantity, and annual price is based on the promo price', async () => {
      await COMM.volumeDiscountWithQuantity.waitFor({ state: 'visible', timeout: 10000 });
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-promotion-code', data.promo);
      await expect(COMM.volumeDiscountWithQuantity).toHaveAttribute('data-quantity', '3');
      const volumeDiscountPrice = `${await COMM.volumeDiscountWithQuantityAlternativeInteger.innerText()}.${await COMM.volumeDiscountWithQuantityAlternativeDecimals.innerText()}`;
      expect(regularPrice > volumeDiscountPrice).toBe(true);
      const volumeDiscountAnnualPrice = `${await COMM.volumeDiscountWithQuantityAnnualInteger.innerText()}.${await COMM.volumeDiscountWithQuantityAnnualDecimals.innerText()}`;
      expect(Number(volumeDiscountAnnualPrice.replace(',', '')) < Number(regularAnnualPrice.replace(',', ''))).toBe(true);
    });
  });
});
