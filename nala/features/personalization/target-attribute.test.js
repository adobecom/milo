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

// Test 1: verify presence of "data-adobe-target-testid" in Target tests, inblock gnav
/* expectated amount of target attributes:
target-block: 1
target-gnavfragment: 1
target-gnavchainfragments: 1
target-gnavwithinset: 2
all others: 0
*/
test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
  const targetBlockURL = `${baseURL}${features[1].data.targetBlockURL}${miloLibs}`;
  const targetGnavFragmentURL = `${baseURL}${features[1].data.targetGnavFragmentURL}${miloLibs}`;
  const targetGnavChainFragmentsURL = `${baseURL}${features[1].data.targetGnavChainFragmentsURL}${miloLibs}`;
  const targetGnavWithinset = `${baseURL}${features[1].data.targetGnavWithinset}${miloLibs}`;
  const blockURL = `${baseURL}${features[1].data.blockURL}${miloLibs}`;
  const gnavFragmentsURL = `${baseURL}${features[1].data.gnavFragmentsURL}${miloLibs}`;
  const gnavChainFragmentsURL = `${baseURL}${features[1].data.gnavChainFragmentsURL}${miloLibs}`;
  const gnavWithinsetURL = `${baseURL}${features[1].data.gnavWithinsetURL}${miloLibs}`;
  const updateInGnavFragmentURL = `${baseURL}${features[1].data.updateInGnavFragmentURL}${miloLibs}`;
  const defaultURL = `${baseURL}${features[1].data.defaultURL}${miloLibs}`;

  const targetAttribute = '[data-adobe-target-testid="apples"]';

  await test.step('step-1: verify target-block test case', async () => {
    console.info(`[Test Page]: ${targetBlockURL}`);
    await page.goto(targetBlockURL);
    await expect(page.locator(targetAttribute)).toHaveCount(1);
  });

  await test.step('step-2: verify the target-gnavfragment case', async () => {
    console.info(`[Test Page]: ${targetGnavFragmentURL}`);
    await page.goto(targetGnavFragmentURL);
    await expect(page.locator(targetAttribute)).toHaveCount(1);
  });

  await test.step('step-3: verify the target-gnavchainfragments case', async () => {
    console.info(`[Test Page]: ${targetGnavChainFragmentsURL}`);
    await page.goto(targetGnavChainFragmentsURL);
    await expect(page.locator(targetAttribute)).toHaveCount(1);
  });

  await test.step('step-4: verify the target-gnavwithinset case', async () => {
    console.info(`[Test Page]: ${targetGnavWithinset}`);
    await page.goto(targetGnavWithinset);
    await expect(page.locator(targetAttribute)).toHaveCount(2);
  });

  await test.step('step-5: verify the block case', async () => {
    console.info(`[Test Page]: ${blockURL}`);
    await page.goto(blockURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });
  await test.step('step-6: verify gnavfragment test case', async () => {
    console.info(`[Test Page]: ${gnavFragmentsURL}`);
    await page.goto(gnavFragmentsURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });

  await test.step('step-7: verify the gnavchainfragments case', async () => {
    console.info(`[Test Page]: ${gnavChainFragmentsURL}`);
    await page.goto(gnavChainFragmentsURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });

  await test.step('step-8: verify the gnavwithinset case', async () => {
    console.info(`[Test Page]: ${gnavWithinsetURL}`);
    await page.goto(gnavWithinsetURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });

  await test.step('step-9: verify "update in gnav fragment" case', async () => {
    console.info(`[Test Page]: ${updateInGnavFragmentURL}`);
    await page.goto(updateInGnavFragmentURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });

  await test.step('step-10: verify the default case', async () => {
    console.info(`[Test Page]: ${defaultURL}`);
    await page.goto(defaultURL);
    await expect(page.locator(targetAttribute)).toHaveCount(0);
  });
});
