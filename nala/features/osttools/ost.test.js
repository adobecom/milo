import { expect, test } from '@playwright/test';
import { features } from './ost.spec.js';
import OSTPage from './ost.page.js';
import ims from '../../libs/imslogin.js';

let authToken;
let adobeIMS;
let OST;

test.beforeAll(async ({ browser }) => {
  test.slow();
  // Skip tests on github actions and PRs, run only on Jenkins
  if (process.env.GITHUB_ACTIONS) test.skip();

  const page = await browser.newPage();
  await page.goto('https://www.adobe.com/creativecloud/plans.html?mboxDisable=1&adobe_authoring_enabled=true');
  const signinBtn = page.locator('#universal-nav button.profile-comp').first();
  await expect(signinBtn).toBeVisible();
  await signinBtn.click();
  await page.waitForURL('**/auth.services.adobe.com/en_US/index.html**/');
  features[0].url = 'https://www.adobe.com/creativecloud/plans.html?mboxDisable=1&adobe_authoring_enabled=true';
  await ims.fillOutSignInForm(features[0], page);
  await expect(async () => {
    const response = await page.request.get(features[0].url);
    expect(response.status()).toBe(200);
  }).toPass();
  authToken = await page.evaluate(() => adobeIMS.getAccessToken().token);
});

test.beforeEach(async ({ page }) => {
  OST = new OSTPage(page);
});

test.describe('OST page test suite', () => {
  // Verify OST search by offer ID
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}`);

    const testPage = `${baseURL}${features[0].path}${features[0].browserParams}${authToken}`;
    const { data } = features[0];

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
      await page.waitForTimeout(2000);
    });

    await test.step('Validate search results', async () => {
      await OST.productList.first().waitFor({ state: 'visible', timeout: 10000 });
      const skus = OST.productList;
      expect(await skus.count()).toBeLessThanOrEqual(2);
      expect(await skus.nth(0).innerText()).toContain(data.productName);
      expect(await skus.nth(1).innerText()).toContain(data.productNameShort);
    });
  });

  // Verify OST offer entitlements
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}`);

    const testPage = `${baseURL}${features[1].path}${features[1].browserParams}${authToken}`;
    const { data } = features[1];

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
      await page.waitForTimeout(2000);
    });

    await test.step('Validate entitlements', async () => {
      await OST.planType.waitFor({ state: 'visible', timeout: 10000 });
      await OST.offerType.waitFor({ state: 'visible', timeout: 10000 });
      expect(await OST.planType.innerText()).toContain(data.planType);
      expect(await OST.offerType.innerText()).toContain(data.offerType);
    });
  });

  // Verify OST offer price options display
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}`);

    const testPage = `${baseURL}${features[2].path}${features[2].browserParams}${authToken}`;
    const { data } = features[2];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate Offer regular price option', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });

      expect(await OST.price.innerText()).toContain(data.price);
      expect(await OST.price.innerText()).toContain(data.term);
      expect(await OST.price.innerText()).toContain(data.unit);
      expect(await OST.price.innerText()).not.toContain(data.taxLabel);

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('milo.adobe.com/tools/ost');
      expect(await clipboardText).toContain('type=price');
    });

    await test.step('Validate Offer optical price option', async () => {
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });

      expect(await OST.priceOptical.innerText()).toContain(data.opticalPrice);
      expect(await OST.priceOptical.innerText()).toContain(data.opticalTerm);
      expect(await OST.priceOptical.innerText()).toContain(data.unit);
      expect(await OST.priceOptical.innerText()).not.toContain(data.taxLabel);

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('milo.adobe.com/tools/ost');
      expect(await clipboardText).toContain('type=priceOptical');
    });

    await test.step('Validate Offer strikethrough price option', async () => {
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });

      expect(await OST.priceStrikethrough.innerText()).toContain(data.price);
      expect(await OST.priceStrikethrough.innerText()).toContain(data.term);
      expect(await OST.priceStrikethrough.innerText()).toContain(data.unit);
      expect(await OST.priceStrikethrough.innerText()).not.toContain(data.taxLabel);

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('milo.adobe.com/tools/ost');
      expect(await clipboardText).toContain('type=priceStrikethrough');
    });
  });

  // Verify OST enebalement for price term text
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}`);

    const testPage = `${baseURL}${features[3].path}${features[3].browserParams}${authToken}`;
    const { data } = features[3];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate term enablement', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });

      expect(await OST.price.innerText()).toContain(data.term);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=price');
      expect(await clipboardText).not.toContain('term=');

      expect(await OST.priceOptical.innerText()).toContain(data.opticalTerm);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceOptical');
      expect(await clipboardText).not.toContain('term=');

      expect(await OST.priceStrikethrough.innerText()).toContain(data.term);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceStrikethrough');
      expect(await clipboardText).not.toContain('term=');

      // Check term checkbox
      await OST.termCheckbox.click();

      expect(await OST.price.innerText()).not.toContain(data.term);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('term=false');

      expect(await OST.priceOptical.innerText()).not.toContain(data.opticalTerm);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('term=false');

      expect(await OST.priceStrikethrough.innerText()).not.toContain(data.term);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('term=false');

      // Uncheck term checkbox
      await OST.termCheckbox.click();

      expect(await OST.price.innerText()).toContain(data.term);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('term=');

      expect(await OST.priceOptical.innerText()).toContain(data.opticalTerm);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('term=');

      expect(await OST.priceStrikethrough.innerText()).toContain(data.term);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('term=');
    });
  });

  // Verify OST enebalement for price unit text
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}`);

    const testPage = `${baseURL}${features[4].path}${features[4].browserParams}${authToken}`;
    const { data } = features[4];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate unit enablement', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });

      expect(await OST.price.innerText()).toContain(data.unit);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=price');
      expect(await clipboardText).not.toContain('seat=');

      expect(await OST.priceOptical.innerText()).toContain(data.unit);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceOptical');
      expect(await clipboardText).not.toContain('seat=');

      expect(await OST.priceStrikethrough.innerText()).toContain(data.unit);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceStrikethrough');
      expect(await clipboardText).not.toContain('seat=');

      // Check unit checkbox
      await OST.unitCheckbox.click();

      expect(await OST.price.innerText()).not.toContain(data.unit);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('seat=false');

      expect(await OST.priceOptical.innerText()).not.toContain(data.unit);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('seat=false');

      expect(await OST.priceStrikethrough.innerText()).not.toContain(data.unit);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('seat=false');

      // Uncheck unit checkbox
      await OST.unitCheckbox.click();

      expect(await OST.price.innerText()).toContain(data.unit);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('seat=');

      expect(await OST.priceOptical.innerText()).toContain(data.unit);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('seat=');

      expect(await OST.priceStrikethrough.innerText()).toContain(data.unit);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('seat=');
    });
  });

  // Verify OST enebalement for price tax label
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[5].path}`);

    const testPage = `${baseURL}${features[5].path}${features[5].browserParams}${authToken}`;
    const { data } = features[5];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate tax label enablement', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });

      expect(await OST.price.innerText()).not.toContain(data.taxLabel);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=price');
      expect(await clipboardText).not.toContain('tax=');

      expect(await OST.priceOptical.innerText()).not.toContain(data.taxLabel);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceOptical');
      expect(await clipboardText).not.toContain('tax=');

      expect(await OST.priceStrikethrough.innerText()).not.toContain(data.taxLabel);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceStrikethrough');
      expect(await clipboardText).not.toContain('tax=');

      // Check tax label checkbox
      await OST.taxlabelCheckbox.click();

      expect(await OST.price.innerText()).toContain(data.taxLabel);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('tax=true');

      expect(await OST.priceOptical.innerText()).toContain(data.taxLabel);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('tax=true');

      expect(await OST.priceStrikethrough.innerText()).toContain(data.taxLabel);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('tax=true');

      // Uncheck tax label checkbox
      await OST.taxlabelCheckbox.click();

      expect(await OST.price.innerText()).not.toContain(data.taxLabel);
      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('tax=');

      expect(await OST.priceOptical.innerText()).not.toContain(data.taxLabel);
      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('tax=');

      expect(await OST.priceStrikethrough.innerText()).not.toContain(data.taxLabel);
      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('tax=');
    });
  });

  // Verify OST enebalement for tax inclusivity in the price
  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[6].path}`);

    const testPage = `${baseURL}${features[6].path}${features[6].browserParams}${authToken}`;
    const { data } = features[6];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate tax inclusivity enablement', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=price');
      expect(await clipboardText).not.toContain('exclusive=');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceOptical');
      expect(await clipboardText).not.toContain('exclusive=');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceStrikethrough');
      expect(await clipboardText).not.toContain('exclusive=');

      // Check tax label checkbox
      await OST.taxInlcusivityCheckbox.click();

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('exclusive=true');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('exclusive=true');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('exclusive=true');

      // Uncheck tax label checkbox
      await OST.taxInlcusivityCheckbox.click();

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('exclusive=');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('exclusive=');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('exclusive=');
    });
  });

  // Verify OST offer price promo
  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[7].path}`);

    const testPage = `${baseURL}${features[7].path}${features[7].browserParams}${authToken}`;
    const { data } = features[7];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate price with promo option', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.promoField.waitFor({ state: 'visible', timeout: 10000 });
      await OST.cancelPromo.waitFor({ state: 'visible', timeout: 10000 });

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('promo=');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('promo=');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('promo=');

      // Add promo
      await OST.promoField.fill(data.promo);

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain(`promo=${data.promo}`);

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain(`promo=${data.promo}`);

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain(`promo=${data.promo}`);

      // Cancel promo
      await OST.cancelPromo.click();

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('promo=');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('promo=');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('promo=');
    });
  });

  // Verify OST checkout link generation
  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[8].path}`);

    const testPage = `${baseURL}${features[7].path}${features[8].browserParams}${authToken}`;
    const { data } = features[8];

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Go to Checkout link tab', async () => {
      await OST.checkoutTab.waitFor({ state: 'visible', timeout: 10000 });
      await OST.checkoutTab.click();
    });

    await test.step('Validate Checkout Link', async () => {
      await OST.checkoutLink.waitFor({ state: 'visible', timeout: 10000 });
      await OST.promoField.waitFor({ state: 'visible', timeout: 10000 });
      await OST.workflowMenu.waitFor({ state: 'visible', timeout: 10000 });

      await expect(OST.checkoutLink).toHaveAttribute('href', new RegExp(`${data.offerID}`));
      await expect(OST.checkoutLink).toHaveAttribute('href', new RegExp(`${data.workflowStep_1}`));
      await expect(OST.checkoutLink).not.toHaveAttribute('href', /apc=/);

      // Add promo
      await OST.promoField.fill(data.promo);
      await expect(OST.checkoutLink).toHaveAttribute('href', new RegExp(`${data.promo}`));

      // Change Forkflow step
      await OST.workflowMenu.click();
      await page.locator(`div[data-key="${data.workflowStep_2}"]`).waitFor({ state: 'visible', timeout: 10000 });
      await page.locator(`div[data-key="${data.workflowStep_2}"]`).click();
      await expect(OST.checkoutLink).toHaveAttribute('href', new RegExp(`${data.workflowStep_2}`));
    });
  });

  // Verify OST enebalement for old price in the promo price
  test(`${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[9].path}`);

    const testPage = `${baseURL}${features[9].path}${features[9].browserParams}${authToken}`;
    const { data } = features[9];

    let clipboardText;

    await test.step('Open Offer Selector Tool', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Enter Offer ID in the search field', async () => {
      await OST.searchField.fill(data.offerID);
    });

    await test.step('Click Next button in OST', async () => {
      await OST.nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await OST.nextButton.click();
    });

    await test.step('Validate tax inclusivity enablement', async () => {
      await OST.price.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOptical.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethrough.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceOpticalUse.waitFor({ state: 'visible', timeout: 10000 });
      await OST.priceStrikethroughUse.waitFor({ state: 'visible', timeout: 10000 });

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=price');
      expect(await clipboardText).not.toContain('old=');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceOptical');
      expect(await clipboardText).not.toContain('old=');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('type=priceStrikethrough');
      expect(await clipboardText).not.toContain('old=');

      // Check tax label checkbox
      await OST.oldPrice.click();

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('old=true');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('old=true');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).toContain('old=true');

      // Uncheck tax label checkbox
      await OST.oldPrice.click();

      await OST.priceUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('old=');

      await OST.priceOpticalUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('old=');

      await OST.priceStrikethroughUse.click();
      clipboardText = await page.evaluate('navigator.clipboard.readText()');
      expect(await clipboardText).not.toContain('old=');
    });
  });
});
