import { expect, test } from '@playwright/test';
import { features } from './marketo.spec.js';
import MarketoBlock from './marketo.page.js';

let marketoBlock;
const miloLibs = process.env.MILO_LIBS || '';

test.describe('Marketo block test suite', () => {
  test.beforeAll(async ({ browserName }) => {
    if (browserName === 'chromium' && process.env.CI) test.skip('TODO: debug why this is failing on github actions');

    if (process.env.CI) test.setTimeout(1000 * 60 * 3); // 3 minutes
  });

  test.beforeEach(async ({ page }) => {
    marketoBlock = new MarketoBlock(page);
  });

  features[0].path.forEach((path) => {
    test(`0: @marketo full template (redirect), ${features[0].tags}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block full template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitFullTemplateForm();
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await marketoBlock.submitButton.waitFor({ state: 'detached' });
          const redirectedUrl = await page.url();
          await expect(redirectedUrl).toContain('?submissionid');
        }).toPass();
      });
    });
  });

  features[1].path.forEach((path) => {
    test(`1: @marketo full template (redirect) with company type, ${features[1].tags}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block full template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitFullTemplateForm('Digital commerce');
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await marketoBlock.submitButton.waitFor({ state: 'detached' });
          const redirectedUrl = await page.url();
          await expect(redirectedUrl).toContain('?submissionid');
        }).toPass();
      });
    });
  });

  features[2].path.forEach((path) => {
    test(`2: @marketo expanded template (redirect), ${features[2].tags}}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block expanded template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitExpandedTemplateForm();
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await marketoBlock.submitButton.waitFor({ state: 'detached' });
          const redirectedUrl = await page.url();
          await expect(redirectedUrl).toContain('?submissionid');
        }).toPass();
      });
    });
  });

  features[3].path.forEach((path) => {
    test(`3: @marketo essential template (redirect), ${features[3].tags}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block essential template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitEssentialTemplateForm();
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await marketoBlock.submitButton.waitFor({ state: 'detached' });
          const redirectedUrl = await page.url();
          await expect(redirectedUrl).toContain('?submissionid');
        }).toPass();
      });
    });
  });

  features[4].path.forEach((path) => {
    test(`4: @marketo full template (message), ${features[4].tags}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block full template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitFullTemplateForm();
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await expect(marketoBlock.message).toBeAttached();
          await expect(page.url()).toBe(testPage);
        }).toPass();
      });
    });
  });

  features[5].path.forEach((path) => {
    test(`5: @marketo full template (message) with company type, ${features[5].tags}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block full template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitFullTemplateForm('Digital commerce');
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await expect(marketoBlock.message).toBeAttached();
          await expect(page.url()).toBe(testPage);
        }).toPass();
      });
    });
  });

  features[6].path.forEach((path) => {
    test(`6: @marketo expanded (message) template, ${features[6].tags}}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block expanded template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitExpandedTemplateForm();
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await expect(marketoBlock.message).toBeAttached();
          await expect(page.url()).toBe(testPage);
        }).toPass();
      });
    });
  });

  features[7].path.forEach((path) => {
    test(`7: @marketo essential (message) template, ${features[7].tags}, path: ${path}`, async ({
      page,
      baseURL,
    }) => {
      const testPage = `${baseURL}${path}${miloLibs}`.toLowerCase();
      console.info(`[Test Page]: ${testPage}`);

      await test.step('step-1: Go to the Marketo block essential template test page', async () => {
        await page.goto(testPage);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.url()).toBe(testPage);
        await expect(marketoBlock.email).toBeVisible({ timeout: 10000 });
      });

      await test.step('step-2: check the input field placeholders', async () => {
        await marketoBlock.checkInputPlaceholders();
      });

      await test.step('step-3: Submit the form with valid inputs', async () => {
        await marketoBlock.submitEssentialTemplateForm();
      });

      await test.step('step-4: Verify the form submission redirect', async () => {
        await expect(async () => {
          await expect(marketoBlock.message).toBeAttached();
          await expect(page.url()).toBe(testPage);
        }).toPass();
      });
    });
  });
});
