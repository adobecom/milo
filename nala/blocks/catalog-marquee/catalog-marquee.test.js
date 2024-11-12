import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './catalog-marquee.spec.js';
import CatalogMarqueeBlock from './catalog-marquee.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let webUtil;
let catalogMarquee;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo catalog marquee block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    catalogMarquee = new CatalogMarqueeBlock(page);
  });

  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to catalog marquee block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify catalog marquee specs', async () => {
      await expect(await catalogMarquee.catalogMarquee).toBeVisible();
      await expect(await catalogMarquee.foreground).toBeVisible();
      await expect(await catalogMarquee.textH2).toContainText(data.h2Text);
      await expect(await catalogMarquee.bodyM).toContainText(data.bodyText);

      await expect(await catalogMarquee.mnemonicsHeading).toContainText(data.mnemonics.heading);
      await expect(await catalogMarquee.mnemonicItems).toHaveCount(data.mnemonics.count);
      await expect(await catalogMarquee.acrobatText).toContainText(data.mnemonics.acrobat);
      await expect(await catalogMarquee.photoshopText).toContainText(data.mnemonics.photoshop);
      await expect(await catalogMarquee.premiereProText).toContainText(data.mnemonics.premierePro);
      await expect(await catalogMarquee.illustratorText).toContainText(data.mnemonics.illustrator);
      await expect(await catalogMarquee.expressText).toContainText(data.mnemonics.express);

      await expect(await catalogMarquee.acrobatImg).toBeVisible();
      await expect(await catalogMarquee.photoshopImg).toBeVisible();
      await expect(await catalogMarquee.premiereProImg).toBeVisible();
      await expect(await catalogMarquee.illustratorImg).toBeVisible();
      await expect(await catalogMarquee.expressImg).toBeVisible();

      await expect(await catalogMarquee.businessFeaturessHeading).toContainText(data.businessFeatures.heading);
      await expect(await catalogMarquee.businessItems).toHaveCount(data.businessFeatures.count);
      await expect(await catalogMarquee.dashboardText).toContainText(data.businessFeatures.dashboard);
      await expect(await catalogMarquee.feedbackText).toContainText(data.businessFeatures.feedback);
      await expect(await catalogMarquee.filesText).toContainText(data.businessFeatures.files);
      await expect(await catalogMarquee.assetsText).toContainText(data.businessFeatures.assets);

      await expect(await catalogMarquee.dashboardImg).toBeVisible();
      await expect(await catalogMarquee.feedbackImg).toBeVisible();
      await expect(await catalogMarquee.filesImg).toBeVisible();
      await expect(await catalogMarquee.assetsImg).toBeVisible();

      await expect(await catalogMarquee.outlineButtonL).toContainText(data.outlineButtonText);
      await expect(await catalogMarquee.blueButtonL).toContainText(data.blueButtonText);
      expect(await webUtil.verifyAttributes(catalogMarquee.backgroundImage, catalogMarquee.attributes.backgroundImg)).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes', async () => {
      await expect(await catalogMarquee.catalogMarquee).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('catalog-marquee', 1));
      await expect(await catalogMarquee.outlineButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.outlineButtonText, 1, data.h2Text));
      await expect(await catalogMarquee.blueButtonL).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 2, data.h2Text));
    });

    await test.step('step-4: Verify the accessibility test on the marquee block', async () => {
      await runAccessibilityTest({ page, testScope: catalogMarquee.catalogMarquee });
    });
  });
});
