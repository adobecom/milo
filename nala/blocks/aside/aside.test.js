import { expect, test } from '@playwright/test';
import { features } from './aside.spec.js';
import AsideBlock from './aside.page.js';

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Aside Block test suite', () => {
  // Aside Small Checks:
  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[0].path}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${features[0].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSmall).toBeVisible();
      await expect(Aside.icon).toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h2TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.textLink).toBeVisible();
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideSmall.evaluate(
        (e) => window.getComputedStyle(e).getPropertyValue('background-color'),
      );
      expect(bgdColor).toBe(Aside.props.background.lightGrey1);
    });
  });

  // Aside Medium Checks:
  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[1].path}${features[1].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${features[1].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideMedium).toBeVisible();
      await expect(Aside.icon).toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideMedium.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.lightGrey1);
    });
  });

  // Aside Large Checks:
  test(`${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${features[2].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideLarge).toBeVisible();
      await expect(Aside.icon).toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).not.toBeVisible();
      await expect(Aside.linkTextCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideLarge.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.lightGrey1);
    });
  });

  // Aside Split Small Dark Checks:
  test(`${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[3].path}${features[3].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${features[3].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSplitSmallDark).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideSplitSmallDark.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.black);
    });
  });

  // Aside Split Small Half Dark Checks:
  test(`${features[4].name}, ${features[4].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[4].path}${features[4].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${features[4].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSplitSmallHalfDark).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideSplitSmallHalfDark.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.black);
    });
  });

  // Aside Split Medium Checks:
  test(`${features[5].name}, ${features[5].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[5].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[5].path}${features[5].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[5].path}${features[5].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSplitMedium).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideSplitMedium.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.lightGrey3);
    });
  });

  // Aside Split Medium Half Checks:
  test(`${features[6].name}, ${features[6].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[6].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[6].path}${features[6].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[6].path}${features[6].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSplitMedidumHalf).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideSplitMedidumHalf.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.lightGrey3);
    });
  });

  // Aside Split Large Checks:
  test(`${features[7].name}, ${features[7].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[7].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[7].path}${features[7].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[7].path}${features[7].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSplitLarge).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // !Note: Aside Split Large doesn't have default background!
    });
  });

  // Aside Split Large Half Dark Checks:
  test(`${features[8].name}, ${features[8].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[8].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[8].path}${features[8].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[8].path}${features[8].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideSplitLargeHalfDark).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).toBeVisible();
      await expect(Aside.h3TitleXLarge).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideSplitLargeHalfDark.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.black);
    });
  });

  // Aside Inline Checks:
  test(`${features[9].name}, ${features[9].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[9].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[9].path}${features[9].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[9].path}${features[9].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideInline).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h3TitleSmall).toBeVisible();
      await expect(Aside.textFieldMedium).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideInline.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.lightGrey2);
    });
  });

  // Aside Inline Dark Checks:
  test(`${features[10].name}, ${features[10].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[10].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[10].path}${features[10].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[10].path}${features[10].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideInline).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h3TitleSmall).toBeVisible();
      await expect(Aside.textFieldMedium).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      await expect(Aside.linkTextCta).not.toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideInline.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.black);
    });
  });

  // Aside Notification Extra Small Dark:
  test(`${features[11].name}, ${features[11].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[11].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[11].path}${features[11].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[11].path}${features[11].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideNotifExtraSmallDark).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.noImage).toBeVisible();
      await expect(Aside.actionArea).not.toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h2TitleSmall).not.toBeVisible();
      await expect(Aside.h2TitleXLarge).not.toBeVisible();
      await expect(Aside.h3TitleSmall).not.toBeVisible();
      await expect(Aside.h3TitleXLarge).not.toBeVisible();
      await expect(Aside.textFieldSmall).not.toBeVisible();
      await expect(Aside.textFieldMedium).not.toBeVisible();
      await expect(Aside.textFieldLarge).not.toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.linkTextCta.first()).toBeVisible();
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).not.toBeVisible();
      expect(await Aside.actionLinks.count()).toEqual(2);
      // Check Aside block background:
      const bgdColor = await Aside.asideNotifExtraSmallDark.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.black);
    });
  });

  // Aside Notification Small:
  test(`${features[12].name}, ${features[12].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[12].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[12].path}${features[12].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[12].path}${features[12].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideNotifSmall).toBeVisible();
      await expect(Aside.icon).toBeVisible();
      await expect(Aside.image).not.toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h2TitleSmall).not.toBeVisible();
      await expect(Aside.h2TitleXLarge).not.toBeVisible();
      await expect(Aside.h3TitleSmall).not.toBeVisible();
      await expect(Aside.h3TitleXLarge).not.toBeVisible();
      await expect(Aside.textFieldMedium).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.textLink).toBeVisible();
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideNotifSmall.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.darkGrey);
    });
  });

  // Aside Notification Medium:
  test(`${features[13].name}, ${features[13].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[13].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[13].path}${features[13].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[13].path}${features[13].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideNotifMedium).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h3TitleSmall).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.linkTextCta).toBeVisible();
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideNotifMedium.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.darkGrey);
    });
  });

  // Aside Notification Medium Center:
  test(`${features[14].name}, ${features[14].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[14].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[14].path}${features[14].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[14].path}${features[14].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideNotifMedium).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).not.toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h3TitleSmall).toBeVisible();
      await expect(Aside.textFieldSmall).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.linkTextCta).toBeVisible();
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideNotifMedium.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.darkGrey);
    });
  });

  // Aside Notification Large:
  test(`${features[15].name}, ${features[15].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[15].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[15].path}${features[15].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[15].path}${features[15].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideNotifLarge).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h3TitleLarge).toBeVisible();
      await expect(Aside.textFieldMedium).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.linkTextCta).toBeVisible();
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideNotifLarge.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.darkGrey);
    });
  });

  // Aside Notification Large Center:
  test(`${features[16].name}, ${features[16].tags}`, async ({ page, baseURL }) => {
    const Aside = new AsideBlock(page);
    console.info(`[Test Page]: ${baseURL}${features[16].path}${miloLibs}`);

    await test.step('Navigate to page with Aside block', async () => {
      await page.goto(`${baseURL}${features[16].path}${features[16].browserParams}&${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[16].path}${features[16].browserParams}&${miloLibs}`);
    });

    await test.step('Validate Aside block content', async () => {
      await expect(Aside.asideNotifLargeCenter).toBeVisible();
      await expect(Aside.icon).not.toBeVisible();
      await expect(Aside.image).not.toBeVisible();
      await expect(Aside.actionArea).toBeVisible();
      await expect(Aside.detailLabel).not.toBeVisible();
      await expect(Aside.h3TitleLarge).toBeVisible();
      await expect(Aside.textFieldMedium).toBeVisible();
      // Check Aside block buttons:
      await expect(Aside.linkTextCta).toBeVisible();
      await expect(Aside.blueButtonCta).not.toBeVisible();
      await expect(Aside.blackButtonCta).toBeVisible();
      expect(await Aside.actionButtons.count()).toEqual(1);
      // Check Aside block background:
      const bgdColor = await Aside.asideNotifLargeCenter.evaluate((e) => window.getComputedStyle(e).getPropertyValue('background-color'));
      expect(bgdColor).toBe(Aside.props.background.darkGrey);
    });
  });
});
