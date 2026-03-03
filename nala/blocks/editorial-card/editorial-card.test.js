import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './editorial-card.spec.js';
import EditorialCardBlock from './editorial-card.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let webUtil;
let editorialCard;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Editorial Card Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    editorialCard = new EditorialCardBlock(page);
  });

  // Editorial Card Tall Media Checks:
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    console.info(`[Test Page]: ${baseURL}${features[0].path}`);

    await test.step('Navigate to page with Editorial Card block', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}${miloLibs}`);
    });

    await test.step('step-2: Verify Editorial Card block specs', async () => {
      await expect(editorialCard.EditorialCard).toBeVisible();
      await expect(await editorialCard.cardLockup).toBeVisible();
      await expect(await editorialCard.cardLockupImg).toHaveCount(2);
      await expect(await editorialCard.cardLockupLabel).toContainText(data.lockupLabelText);
      await expect(await editorialCard.detailM).toContainText(data.detailText);
      await expect(await editorialCard.headingM).toContainText(data.h3Text);
      await expect(await editorialCard.bodyM).toContainText(data.bodyText);
      await expect(await editorialCard.link).toContainText(data.linkText);
      await expect(await editorialCard.blueButton).toContainText(data.blueButtonText);
      await expect(await editorialCard.mediaBtn).toBeVisible();

      expect(await webUtil.verifyAttributes(editorialCard.cardMedia, editorialCard.attributes['editorialCard.media-area.mobile'].cardImg1)).toBeTruthy();
      expect(await webUtil.verifyAttributes(editorialCard.cardMedia, editorialCard.attributes['editorialCard.media-area.tablet'].cardImg1)).toBeTruthy();
      expect(await webUtil.verifyAttributes(editorialCard.cardMedia, editorialCard.attributes['editorialCard.media-area.desktop'].cardImg1)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await editorialCard.EditorialCard).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('editorial-card', 1));
      await expect(await editorialCard.link).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 2, data.h3Text));
      await expect(await editorialCard.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 3, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Editorial Card block', async () => {
      await runAccessibilityTest({ page, testScope: editorialCard.EditorialCard });
    });
  });

  // Editorial Card Open Media Checks:
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const { data } = features[1];
    console.info(`[Test Page]: ${baseURL}${features[1].path}`);

    await test.step('Navigate to page with Editorial Card block', async () => {
      await page.goto(`${baseURL}${features[1].path}${features[1].browserParams}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${features[1].browserParams}${miloLibs}`);
    });

    await test.step('step-2: Verify Editorial Card block specs', async () => {
      await expect(editorialCard.EditorialCard).toBeVisible();

      await expect(await editorialCard.cardLockup).toBeVisible();
      await expect(await editorialCard.cardLockupImg).toHaveCount(1);
      await expect(await editorialCard.detailM).toContainText(data.detailText);
      await expect(await editorialCard.headingM).toContainText(data.h3Text);
      await expect(await editorialCard.bodyM).toContainText(data.bodyText);
      await expect(await editorialCard.link).toContainText(data.linkText);
      await expect(await editorialCard.blueButton).toContainText(data.blueButtonText);
      await expect(await editorialCard.linkBtn).toContainText(data.linkBtnText);

      expect(await webUtil.verifyAttributes(editorialCard.mediaMobile, editorialCard.attributes['editorialCard.media-area.mobile'].cardImg2)).toBeTruthy();
      expect(await webUtil.verifyAttributes(editorialCard.mediaTablet, editorialCard.attributes['editorialCard.media-area.tablet'].cardImg2)).toBeTruthy();
      expect(await webUtil.verifyAttributes(editorialCard.mediaDesktop, editorialCard.attributes['editorialCard.media-area.desktop'].cardImg2)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await editorialCard.EditorialCard).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('editorial-card', 1));
      await expect(await editorialCard.link).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 4, data.h3Text));
      await expect(await editorialCard.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 5, data.h3Text));
      await expect(await editorialCard.linkBtn).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkBtnText, 6, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Editorial Card block', async () => {
      await runAccessibilityTest({ page, testScope: editorialCard.EditorialCard });
    });
  });

  // Editorial Card S-lockup Media Checks:
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const { data } = features[2];
    console.info(`[Test Page]: ${baseURL}${features[2].path}`);

    await test.step('Navigate to page with Editorial Card block', async () => {
      await page.goto(`${baseURL}${features[2].path}${features[2].browserParams}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${features[2].browserParams}${miloLibs}`);
    });

    await test.step('step-2: Verify Editorial Card block specs', async () => {
      await expect(editorialCard.EditorialCard).toBeVisible();

      await expect(await editorialCard.cardLockup).toBeVisible();
      await expect(await editorialCard.cardLockupImg).toHaveCount(2);
      await expect(await editorialCard.cardLockupLabel).toContainText(data.lockupLabelText);
      await expect(await editorialCard.cardLockupDevice).toContainText(data.lockupDeviceText);
      await expect(await editorialCard.detailM).toContainText(data.detailText);
      await expect(await editorialCard.headingM).toContainText(data.h3Text);
      await expect(await editorialCard.bodyMslockup).toContainText(data.bodyText);
      await expect(await editorialCard.linkSlockup).toContainText(data.linkText);
      await expect(await editorialCard.blueButton).toContainText(data.blueButtonText);
      await expect(await editorialCard.linkBtn).toContainText(data.linkBtnText);
      await expect(await editorialCard.divider).toBeVisible();

      expect(await webUtil.verifyAttributes(editorialCard.mediaMobile, editorialCard.attributes['editorialCard.media-area.mobile'].cardImg2)).toBeTruthy();
      expect(await webUtil.verifyAttributes(editorialCard.mediaTablet, editorialCard.attributes['editorialCard.media-area.tablet'].cardImg2)).toBeTruthy();
      expect(await webUtil.verifyAttributes(editorialCard.mediaDesktop, editorialCard.attributes['editorialCard.media-area.desktop'].cardImg2)).toBeTruthy();
    });

    await test.step('step-3: Verify analytic attributes', async () => {
      await expect(await editorialCard.EditorialCard).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('editorial-card', 1));
      await expect(await editorialCard.linkSlockup).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkText, 4, data.h3Text));
      await expect(await editorialCard.blueButton).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.blueButtonText, 5, data.h3Text));
      await expect(await editorialCard.linkBtn).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.linkBtnText, 6, data.h3Text));
    });

    await test.step('step-4: Verify the accessibility test on the Editorial Card block', async () => {
      await runAccessibilityTest({ page, testScope: editorialCard.EditorialCard });
    });
  });
});
