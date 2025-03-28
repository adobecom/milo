import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './three-in-one.spec.js';
import ThreeInOne from './three-in-one.page.js';

const miloLibs = process.env.MILO_LIBS || '';
let webUtil;

test.describe('ThreeInOne Block test suite', () => {
  test.beforeEach(async ({ page, browserName }) => {
    webUtil = new WebUtil(page);
    if (browserName === 'chromium') {
      await page.setExtraHTTPHeaders({ 'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"' });
    }
  });

  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const threeInOne = new ThreeInOne(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);

    await test.step('Navigate to page with ThreeInOne CTAs', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('Validate if CTAs URLs have proper params', async () => {
      await expect(await threeInOne.ctaWithCsParam).toBeVisible();
      await expect(await threeInOne.ctaWithMsParam).toBeVisible();
      expect(await webUtil.verifyAttributes(threeInOne.ctaWithCsParam, { href: 'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=phsp_direct_indirect_team&cli=mini_plans&ctx=if&co=US&lang=en&af=uc_new_user_iframe%2Cuc_new_system_close&cs=t' })).toBeTruthy();
      expect(await webUtil.verifyAttributes(threeInOne.ctaWithMsParam, { href: 'https://commerce.adobe.com/store/segmentation?ms=e&ot=BASE&pa=PA-1176&cli=mini_plans&ctx=if&co=US&lang=en&af=uc_new_user_iframe%2Cuc_new_system_close' })).toBeTruthy();
    });
  });
});
