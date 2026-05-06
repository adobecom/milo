import { expect, test } from '@playwright/test';
import WebUtil from '../../libs/webutil.js';
import { features } from './base-card.spec.js';
import BaseCard, { ATTR } from './base-card.page.js';

const miloLibs = process.env.MILO_LIBS || '';

let webUtil;
let baseCard;

test.describe('Milo Base Card Block test suite', () => {
  test.beforeEach(async ({ page }) => {
    webUtil = new WebUtil(page);
    baseCard = new BaseCard(page);
  });

  // Test 0 : all blocks loaded
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Base Card document test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify all base-card blocks are present and loaded', async () => {
      await expect(baseCard.mainBaseCards).toHaveCount(data.expectedCardCount);
      const { dataBlockStatus } = baseCard.attributes.baseCard;
      for (let i = 0; i < data.expectedCardCount; i += 1) {
        await expect(baseCard.mainBaseCards.nth(i)).toHaveAttribute('data-block-status', dataBlockStatus);
      }
    });

    await test.step('step-3: Verify analytics (daa-lh) on each base-card block', async () => {
      await expect(await baseCard.mainBaseCards.nth(0)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 1));
      await expect(await baseCard.mainBaseCards.nth(1)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 1));
      await expect(await baseCard.mainBaseCards.nth(2)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 2));
      await expect(await baseCard.mainBaseCards.nth(3)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 3));
    });
  });

  // Test 1 : full-width
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to Base Card document test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify full-width base-card specs', async () => {
      await expect(await baseCard.fullWidthBaseCard).toBeVisible();
      await expect(baseCard.fullWidthForeground).toBeAttached();
      await expect(baseCard.fullWidthMedia).toBeAttached();

      await expect(baseCard.fullWidthBody).toContainText(data.fullWidthBody);
      await expect(baseCard.fullWidthBaseCard.getByRole('heading', { name: data.fullWidthTitle, exact: true }).first()).toBeVisible();
      await expect(baseCard.fullWidthBaseCard.getByRole('link', { name: data.fullWidthCta }).first()).toBeVisible();
      await expect(await webUtil.verifyAttributes(baseCard.fullWidthParallaxImg, baseCard.attributes[ATTR.fullWidthParallax])).toBeTruthy();
      await expect(await webUtil.verifyAttributes(baseCard.fullWidthIconImg, baseCard.attributes[ATTR.fullWidthIcon])).toBeTruthy();
    });

    await test.step('step-3: Verify analytics attributes on full-width block and CTAs', async () => {
      await expect(await baseCard.fullWidthBaseCard).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 1));
      const link = baseCard.fullWidthBaseCard.getByRole('link', { name: data.fullWidthCta });

      await expect(link).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.fullWidthCta, 1, data.fullWidthTitle));
    });
  });

  // Test 2 : responsive parallax + icon media
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('step-1: Go to Base Card document test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify foreground and media structure', async () => {
      await expect(baseCard.fullWidthForeground).toBeAttached();
      await expect(baseCard.fullWidthMedia).toBeAttached();
      await expect(baseCard.fullWidthParallaxPicture).toBeAttached();
      await expect(baseCard.fullWidthIconImg).toBeAttached();
    });

    await test.step('step-3: Verify parallax image attributes', async () => {
      expect(await webUtil.verifyAttributes(baseCard.fullWidthParallaxImg, baseCard.attributes[ATTR.fullWidthParallax])).toBeTruthy();
    });

    await test.step('step-4: Verify icon image attributes', async () => {
      expect(await webUtil.verifyAttributes(baseCard.fullWidthIconImg, baseCard.attributes[ATTR.fullWidthIcon])).toBeTruthy();
    });
  });

  // Test 3 : three-up
  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Go to Base Card document test page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify three-up section and card count', async () => {
      await expect(await baseCard.threeUpSection).toBeVisible();
      await expect.poll(
        () => baseCard.threeUpSection.getAttribute('daa-lh'),
        { timeout: 10000 },
      ).toBe('s2');
      await expect(baseCard.threeUpCards).toHaveCount(data.threeUpCardCount);
    });

    await test.step('step-3: Verify headings, body copy, and CTAs per card', async () => {
      await expect(baseCard.threeUpCards.nth(0).getByRole('heading', { name: data.firstCardTitle, exact: true })).toBeVisible();
      await expect(baseCard.threeUpCardBody(0)).toContainText(data.firstCardBody);
      await expect(baseCard.threeUpCards.nth(0).getByRole('link', { name: data.firstCardCta })).toBeVisible();

      await expect(baseCard.threeUpCards.nth(1).getByRole('heading', { name: data.secondCardTitle, exact: true })).toBeVisible();
      await expect(baseCard.threeUpCardBody(1)).toContainText(data.secondCardBody);
      await expect(baseCard.threeUpCards.nth(1).getByRole('link', { name: data.secondCardCta })).toBeVisible();

      await expect(baseCard.threeUpCards.nth(2).getByRole('heading', { name: data.thirdCardTitle, exact: true })).toBeVisible();
      await expect(baseCard.threeUpCardBody(2)).toContainText(data.thirdCardBody);
      await expect(baseCard.threeUpCards.nth(2).getByRole('link', { name: data.thirdCardCta })).toBeVisible();
    });

    await test.step('step-4: Verify three-up parallax and icon images', async () => {
      const parallaxAttrs = baseCard.attributes[ATTR.threeUpParallax];
      const iconAttrs = baseCard.attributes[ATTR.threeUpIcon];
      for (let i = 0; i < data.threeUpCardCount; i += 1) {
        const parallaxImg = baseCard.threeUpCardParallaxImg(i);
        const iconImg = baseCard.threeUpCardIconImg(i);
        await expect(await parallaxImg).toBeVisible();
        expect(await webUtil.verifyAttributes(parallaxImg, parallaxAttrs)).toBeTruthy();
        await expect(await iconImg).toBeVisible();
        expect(await webUtil.verifyAttributes(iconImg, iconAttrs)).toBeTruthy();
      }
    });

    await test.step('step-5: Verify analytics attributes on three-up blocks and CTAs', async () => {
      await expect(await baseCard.threeUpCards.nth(0)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 1));
      await expect(await baseCard.threeUpCards.nth(0).getByRole('link', { name: data.firstCardCta })).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.firstCardCta, 1, data.firstCardTitle));

      await expect(await baseCard.threeUpCards.nth(1)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 2));
      await expect(await baseCard.threeUpCards.nth(1).getByRole('link', { name: data.secondCardCta })).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.secondCardCta, 1, data.secondCardTitle));

      await expect(await baseCard.threeUpCards.nth(2)).toHaveAttribute('daa-lh', await webUtil.getBlockDaalh('base-card', 3));
      await expect(await baseCard.threeUpCards.nth(2).getByRole('link', { name: data.thirdCardCta })).toHaveAttribute('daa-ll', await webUtil.getLinkDaall(data.thirdCardCta, 1, data.thirdCardTitle));
    });
  });

  // Test 4 : standalone CTAs
  test(`[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
    const f1 = features[1].data;
    const f3 = features[3].data;

    await test.step('step-1: Go to Base Card document test page', async () => {
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('step-2: Verify standalone CTA href and target', async () => {
      const ctas = baseCard.standaloneCtas;
      const { href } = baseCard.attributes.cta;

      await expect.poll(() => ctas.count(), { timeout: 10000 }).toBeGreaterThan(0);
      const count = await ctas.count();
      for (let i = 0; i < count; i += 1) { await expect(ctas.nth(i)).toHaveAttribute('href', href); }
    });

    await test.step('step-3: Verify analytics (daa-ll) on all standalone CTAs', async () => {
      const checks = [
        [f1.fullWidthCta, 1, f1.fullWidthTitle],
        [f3.firstCardCta, 1, f3.firstCardTitle],
        [f3.secondCardCta, 1, f3.secondCardTitle],
        [f3.thirdCardCta, 1, f3.thirdCardTitle],
      ];

      for (const [linkText, linkIndex, headingText] of checks) {
        const link = baseCard.standaloneCtas.filter({ hasText: linkText }).first();

        await expect.poll(async () => link.getAttribute('daa-ll'), { timeout: 10000 }).toBe(await webUtil.getLinkDaall(linkText, linkIndex, headingText));
      }
    });
  });

  // Test 5 : section metadata
  test(`[Test Id - ${features[5].tcid}] ${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);
    const { data } = features[5];

    await test.step('step-1: Go to Base Card document test page', async () => {
      await page.goto(`${baseURL}${features[5].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${miloLibs}`);
    });

    await test.step('step-2: Verify section metadata copy', async () => {
      await expect(baseCard.firstContainerSectionMetadata).toContainText(data.containerMetadataText);
      await expect(baseCard.threeUpSectionMetadata).toContainText(data.threeUpMetadataText);
    });

    await test.step('step-3: Verify section analytics (daa-lh)', async () => {
      await expect(await baseCard.sectionFullWidth).toHaveAttribute('daa-lh', 's1');
      await expect(await baseCard.threeUpSection).toHaveAttribute('daa-lh', 's2');
    });
  });
});
