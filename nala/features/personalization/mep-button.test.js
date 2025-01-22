// to run the test: npm run nala stage mep-button.test.js

import { expect, test } from '@playwright/test';
import { features } from './mep-button.spec.js';

const miloLibs = process.env.MILO_LIBS || '';
const mepButtonLoc = '.mep-badge';

// Test 0: the href of the pencil icon in the MEP Button should have a link which ends in .json (a mep manifest)"
test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const pencilIconHrefLoc = '.mep-edit-manifest[href$=".json"]'; // pencil icon with href that ends in .json
  const defaultURL = `${baseURL}${features[0].data.defaultURL}${miloLibs}`;
  console.info(`[Test Page]: ${defaultURL}`);
  await page.goto(defaultURL);
  await page.locator(mepButtonLoc).click();
  await expect(page.locator(pencilIconHrefLoc)).toHaveCount(1);
});
