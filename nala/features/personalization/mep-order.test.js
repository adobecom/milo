// to run this test:
// npm run nala stage tag=meporder mode=headed

import { expect, test } from '@playwright/test';
import { features } from './mep-order.spec.js';
import AsideBlock from '../../blocks/aside/aside.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
  const heroMarqueeH1 = page.locator('h1');
  const aside = new AsideBlock(page);
  const URL = `${baseURL}${features[0].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);

  await page.goto(URL);
  await expect(heroMarqueeH1).toHaveText('replaced by PZN manifest');
  await expect(aside.h2TitleXLarge.nth(0)).toHaveText('replaced by Promo manifest');
  await expect(aside.h2TitleXLarge.nth(1)).toHaveText('replaced by Test manifest');
});

test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
  const heroMarqueeH1 = page.locator('h1');
  const aside = new AsideBlock(page);
  const URL = `${baseURL}${features[1].path}${miloLibs}`;
  console.info(`[Test Page]: ${URL}`);

  await page.goto(URL);
  await expect(heroMarqueeH1).toHaveText('replaced by FIRST manifest');
  await expect(aside.h2TitleXLarge.nth(0)).toHaveText('replaced by NORMAL manifest');
  await expect(aside.h2TitleXLarge.nth(1)).toHaveText('replaced by LAST manifest');
});
