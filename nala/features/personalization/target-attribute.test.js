// to run the test: npm run nala stage target-attribute.test.js
// original PR request: https://github.com/adobecom/milo/pull/2593

import { expect, test } from '@playwright/test';
import { features } from './target-attribute.spec.js';

const miloLibs = process.env.MILO_LIBS || '';

// Test 0: verify presence of "data-adobe-target-testid" in Target tests, regular page
// target-replacepage should have 1 target attribute, target-otheractions should have 8 target attributes; the others should have 0
test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const defaultURL = `${baseURL}${features[0].data.defaultURL}${miloLibs}`;
  const targetReplacePageURL = `${baseURL}${features[0].data.targetReplacePageURL}${miloLibs}`;
  const replacePageURL = `${baseURL}${features[0].data.replacePageURL}${miloLibs}`;
  const targetOtherActionsURL = `${baseURL}${features[0].data.targetOtherActionsURL}${miloLibs}`;
  const otherActionsURL = `${baseURL}${features[0].data.otherActionsURL}${miloLibs}`;
  const targetAttribute = '[data-adobe-target-testid="myoverride"]';

  await test.step('step-1: verify default test case', async () => {
    console.info(`[Test Page]: ${defaultURL}`);
    await page.goto(defaultURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });

  await test.step('step-2: verify the target-replacepage case', async () => {
    console.info(`[Test Page]: ${targetReplacePageURL}`);
    await page.goto(targetReplacePageURL);
    await expect(page.locator(targetAttribute)).toHaveCount(1);
  });

  await test.step('step-3: verify the replacepage case', async () => {
    console.info(`[Test Page]: ${replacePageURL}`);
    await page.goto(replacePageURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });

  await test.step('step-4: verify target-otheractions case', async () => {
    console.info(`[Test Page]: ${targetOtherActionsURL}`);
    await page.goto(targetOtherActionsURL);
    await expect(page.locator(targetAttribute)).toHaveCount(8);
  });

  await test.step('step-5: verify otheractions case', async () => {
    console.info(`[Test Page]: ${otherActionsURL}`);
    await page.goto(otherActionsURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });
});
