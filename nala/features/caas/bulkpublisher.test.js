import { expect, test } from '@playwright/test';
import { features } from './bulkpublisher.spec.js';
import BulkPublisherPage from './bulkpublisher.page.js';
import ims from '../../libs/imslogin.js';

const miloLibs = process.env.MILO_LIBS || '';
const verifyChimera = process.env.CAAS_CHIMERA_VERIFY === 'true';

const matchesExpectedValue = (value, expected) => {
  if (!value || !expected) return false;
  const normalized = String(value).toLowerCase();
  const target = String(expected).toLowerCase();
  return normalized === target
    || normalized.endsWith(`/${target}`)
    || normalized.endsWith(`-${target}`);
};

const hasExpectedMetadata = (data, expected) => {
  if (!data) return false;
  if (Array.isArray(data)) {
    return data.some((item) => hasExpectedMetadata(item, expected));
  }
  if (typeof data === 'object') {
    const { origin } = data;
    const lang = data.lang ?? data.language;
    const { country } = data;

    if (
      matchesExpectedValue(origin, expected.origin)
      && matchesExpectedValue(lang, expected.lang)
      && matchesExpectedValue(country, expected.country)
    ) return true;

    return Object.values(data).some((value) => hasExpectedMetadata(value, expected));
  }
  return false;
};

let bulkPublisher;

test.describe('CaaS Bulk Publisher test suite', () => {
  test.beforeEach(async ({ page }) => {
    bulkPublisher = new BulkPublisherPage(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    test.slow();
    const { data } = features[0];
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;

    await test.step('Open Bulk Publisher tool', async () => {
      console.info(`[Test Page]: ${testPage}`);
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(testPage);
    });

    await test.step('Sign in with IMS if needed', async () => {
      await page.waitForFunction(() => window.adobeIMS && typeof window.adobeIMS.getAccessToken === 'function');
      const hasToken = await page.evaluate(() => !!window.adobeIMS.getAccessToken()?.token);
      if (!hasToken) {
        // Use EMAIL_COLLECTION credentials as fallback - the default
        // IMS_EMAIL account may not exist on the Adobe IMS domain.
        const origEmail = process.env.IMS_EMAIL;
        const origPass = process.env.IMS_PASS;
        if (process.env.EMAIL_COLLECTION_IMS_MAIL) {
          process.env.IMS_EMAIL = process.env.EMAIL_COLLECTION_IMS_MAIL;
          process.env.IMS_PASS = process.env.EMAIL_COLLECTION_IMS_PASS;
        }
        try {
          await Promise.all([
            page.waitForURL('**/auth.services.adobe.com/**'),
            page.evaluate(() => window.adobeIMS.signIn()),
          ]);
          await ims.fillOutSignInForm({ url: testPage }, page);
          await page.waitForLoadState('domcontentloaded');
        } finally {
          process.env.IMS_EMAIL = origEmail;
          process.env.IMS_PASS = origPass;
        }
      }
    });
    await test.step('Select Adobe Business (bacom) preset', async () => {
      await bulkPublisher.presetSelector.waitFor({ state: 'visible', timeout: 20000 });
      const presetOption = bulkPublisher.presetOptions
        .filter({ hasText: new RegExp(`\\(${data.presetId}\\)`, 'i') });
      await expect(presetOption).toHaveCount(1, { timeout: 20000 });
      const presetValue = await presetOption.first().getAttribute('value');
      expect(presetValue, 'Expected a preset option value for bacom').toBeTruthy();

      await bulkPublisher.presetSelector.selectOption(presetValue);
      await expect(bulkPublisher.hostInput).toHaveValue(data.expectedHost);
      await expect(bulkPublisher.repoInput).toHaveValue(data.expectedRepo);
      await expect(bulkPublisher.ownerInput).toHaveValue(data.expectedOwner);
    });

    await test.step('Enter URL and enable Language First Localization', async () => {
      await bulkPublisher.urlsTextarea.fill(data.publishUrl);
      await bulkPublisher.languageFirstCheckbox.setChecked(true, { force: true });
      await expect(bulkPublisher.languageFirstCheckbox).toBeChecked();
    });

    await test.step('Publish and verify success dialog', async () => {
      await bulkPublisher.publishButton.click();
      await expect(bulkPublisher.successModal).toBeVisible({ timeout: 60000 });
      await expect(bulkPublisher.successModal).toContainText('Successfully published 1 pages');
      await bulkPublisher.successModalOk.click();
    });

    await test.step('Verify status table shows URL as OK', async () => {
      await expect(bulkPublisher.successTable).toBeVisible({ timeout: 20000 });
      const successRow = bulkPublisher.successRows.filter({ hasText: data.publishUrl });
      await expect(successRow).toBeVisible();
      await expect(successRow.locator('td.ok')).toHaveText(data.expectedStatus);
    });

    if (verifyChimera) {
      await test.step('Verify Chimera response metadata', async () => {
        const successRow = bulkPublisher.successRows.filter({ hasText: data.publishUrl });
        const chimeraLink = await successRow.locator('td.entityid a').getAttribute('href');
        expect(chimeraLink, 'Expected Chimera link in Entity_ID column').toBeTruthy();

        const response = await page.request.get(chimeraLink, { timeout: 20000 });
        expect(response.ok(), 'Chimera endpoint should return OK response').toBeTruthy();
        const json = await response.json();

        expect(
          hasExpectedMetadata(json, {
            country: data.expectedCountry,
            lang: data.expectedLang,
            origin: data.expectedOrigin,
          }),
          'Expected language-first metadata in Chimera response',
        ).toBeTruthy();
      });
    }
  });
});
