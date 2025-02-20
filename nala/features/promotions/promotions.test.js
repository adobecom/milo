import { expect, test } from '@playwright/test';
import { features } from './promotions.spec.js';
import PromoPage from './promotions.page.js';

const miloLibs = process.env.MILO_LIBS || '';

let PROMO;
test.beforeEach(async ({ page, baseURL }) => {
  PROMO = new PromoPage(page);
  const skipOn = ['bacom', 'business'];

  skipOn.some((skip) => {
    if (baseURL.includes(skip)) test.skip(true, `Skipping the promo tests for ${baseURL}`);
    return null;
  });
});

test.describe('Promotions feature test suite', () => {
  // @Promo-insert - Validate promo insert text after marquee and before text component
  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[0].path}${miloLibs}`;
    const { data } = features[0];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);

      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);
    });

    await test.step('Validate content insert after marquee', async () => {
      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);
    });

    await test.step('Validate content insert before text component', async () => {
      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeText);
    });
  });

  // @Promo-replace - Validate promo replaces marquee and text component
  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[1].path}${miloLibs}`;
    const { data } = features[1];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content is not visible', async () => {
      await expect(await PROMO.marqueeDefault).not.toBeVisible();
      await expect(await PROMO.textDefault).not.toBeVisible();
    });

    await test.step('Validate marque replace', async () => {
      await expect(await PROMO.marqueeReplace).toBeVisible();
      await expect(await PROMO.marqueeReplace).toContainText(data.textReplaceMarquee);
    });

    await test.step('Validate text component replace', async () => {
      await expect(await PROMO.textReplace).toBeVisible();
      await expect(await PROMO.textReplace).toContainText(data.textReplace);
    });
  });

  // @Promo-remove - Validate promo removes text component
  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[2].path}${miloLibs}`;
    const { data } = features[2];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify only default test page marquee is visible', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);
      await expect(await PROMO.textDefault).not.toBeVisible();
    });

    await test.step('Validate text component removed', async () => {
      await expect(await PROMO.textBlock).not.toBeVisible();
    });
  });

  // @Promo-two-manifests - Validate 2 active manifests on the page
  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[3].path}${miloLibs}`;
    const { data } = features[3];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content is not visible', async () => {
      await expect(await PROMO.marqueeDefault).not.toBeVisible();
      await expect(await PROMO.textDefault).not.toBeVisible();
    });

    await test.step('Validate marque replace', async () => {
      await expect(await PROMO.marqueeReplace).toBeVisible();
      await expect(await PROMO.marqueeReplace).toContainText(data.textReplaceMarquee);
    });

    await test.step('Validate text component replace', async () => {
      await expect(await PROMO.textReplace).toBeVisible();
      await expect(await PROMO.textReplace).toContainText(data.textReplace);
    });

    await test.step('Validate content insert after marquee', async () => {
      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);
    });

    await test.step('Validate content insert before text component', async () => {
      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeText);
    });
  });

  // @Promo-replace-fragment - Validate fragment marquee replace
  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[4].path}${miloLibs}`;
    const { data } = features[4];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content is not visible', async () => {
      await expect(await PROMO.marqueeFragment).not.toBeVisible();
    });

    await test.step('Validate marque promo replace', async () => {
      await expect(await PROMO.marqueeReplace).toBeVisible();
      await expect(await PROMO.marqueeReplace).toContainText(data.textReplaceMarquee);
    });
  });

  // @Promo-future - Validate active promo scheduled in the future
  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[5].path}${miloLibs}`;
    const { data } = features[5];
    const previewPage = `${baseURL}${features[5].path}${'?mep='}${data.mepPath}&${miloLibs}`;
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate manifest is on served on the page but inactive', async () => {
      await PROMO.mepMenuOpen.click();
      await expect(await PROMO.mepManifestList).toBeVisible();
      await expect(await PROMO.mepManifestList).toContainText(data.status1);
      await expect(await PROMO.mepManifestList).toContainText(data.status2);
      await expect(await PROMO.mepManifestList).toContainText(data.manifestFile);
    });

    await test.step('Verify default test page content', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);

      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);
    });

    await test.step('Validate no future insert on the page', async () => {
      await expect(await PROMO.textInsertFuture).not.toBeVisible();
    });

    await test.step('Navigate to the page with applied future promo and validate content', async () => {
      await page.goto(previewPage);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(previewPage);
      console.info(`[Promo preview Page]: ${previewPage}`);

      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);

      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);

      await expect(await PROMO.textInsertFuture).toBeVisible();
      await expect(await PROMO.textInsertFuture).toContainText(data.textFuture);
    });
  });

  // @Promo-with-personalization - Validate promo together with personalization and target OFF
  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[6].path}${miloLibs}`;
    const { data } = features[6];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify only default test page marquee is visible', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);
      await expect(await PROMO.textDefault).not.toBeVisible();
    });

    await test.step('Validate content insert after marquee', async () => {
      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);
    });

    await test.step('Validate content insert before text component', async () => {
      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeText);
    });
  });

  // @Promo-with-personalization-and-target - Validate promo together with personalization and target ON
  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL, browserName }) => {
    test.skip(browserName === 'chromium', 'Skipping test for Chromium browser');

    const testPage = `${baseURL}${features[7].path}${miloLibs}`;
    const { data } = features[7];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify only default test page marquee is visible', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);
      await expect(await PROMO.textDefault).not.toBeVisible();
    });

    await test.step('Validate content insert after marquee', async () => {
      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);
    });

    await test.step('Validate content insert before text component', async () => {
      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeText);
    });
  });

  // @Promo-preview - Validate preview functionality
  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[8].path}${miloLibs}`;
    const { data } = features[8];
    let previewPage;
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Validate all manifests are served and active on the page', async () => {
      await PROMO.mepMenuOpen.click();
      await expect(await PROMO.mepManifestList).toBeVisible();
      await expect(await PROMO.mepManifestList).not.toContainText(data.inactiveStatus);
      await expect(await PROMO.mepManifestList).toContainText(data.manifestInsertFile);
      await expect(await PROMO.mepManifestList).toContainText(data.manifestReplaceFile);
    });

    await test.step('Verify promo page content', async () => {
      await expect(await PROMO.marqueeDefault).not.toBeVisible();
      await expect(await PROMO.textDefault).not.toBeVisible();

      await expect(await PROMO.marqueeReplace).toBeVisible();
      await expect(await PROMO.marqueeReplace).toContainText(data.textReplaceMarquee);

      await expect(await PROMO.textReplace).toBeVisible();
      await expect(await PROMO.textReplace).toContainText(data.textReplace);

      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);

      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeText);
    });

    await test.step('Disable insert manifest and preview', async () => {
      await PROMO.mepSelectInsert.selectOption('Default (control)');
      await PROMO.mepPreviewButton.click();

      await page.waitForLoadState('domcontentloaded');
      previewPage = decodeURIComponent(page.url());
      console.info(`[Preview Page]: ${previewPage}`);
      expect(previewPage).toContain(data.mepInsertOff);
      expect(previewPage).toContain(data.mepReplaceOn);

      await expect(await PROMO.marqueeDefault).not.toBeVisible();
      await expect(await PROMO.textDefault).not.toBeVisible();

      await expect(await PROMO.textInsertAfterMarquee).not.toBeVisible();
      await expect(await PROMO.textInsertBeforeText).not.toBeVisible();

      await expect(await PROMO.marqueeReplace).toBeVisible();
      await expect(await PROMO.marqueeReplace).toContainText(data.textReplaceMarquee);

      await expect(await PROMO.textReplace).toBeVisible();
      await expect(await PROMO.textReplace).toContainText(data.textReplace);
    });

    await test.step('Enable insert and disable replace manifest and preview', async () => {
      await PROMO.mepMenuOpen.click();
      await PROMO.mepSelectInsert.selectOption('all');
      await PROMO.mepSelectReplace.selectOption('Default (control)');
      await PROMO.mepPreviewButton.click();

      await page.waitForLoadState('domcontentloaded');
      previewPage = decodeURIComponent(page.url());
      console.info(`[Preview Page]: ${previewPage}`);
      expect(previewPage).toContain(data.mepInsertOn);
      expect(previewPage).toContain(data.mepReplaceOff);

      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);
      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);

      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);

      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeText);

      await expect(await PROMO.marqueeReplace).not.toBeVisible();
      await expect(await PROMO.textReplace).not.toBeVisible();
    });

    await test.step('Desable all manifests and preview', async () => {
      await PROMO.mepMenuOpen.click();
      await PROMO.mepSelectInsert.selectOption('Default (control)');
      await PROMO.mepSelectReplace.selectOption('Default (control)');
      await PROMO.mepPreviewButton.click();

      await page.waitForLoadState('domcontentloaded');
      previewPage = decodeURIComponent(page.url());
      console.info(`[Preview Page]: ${previewPage}`);
      expect(previewPage).toContain(data.mepInsertOff);
      expect(previewPage).toContain(data.mepReplaceOff);

      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);
      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);

      await expect(await PROMO.textInsertAfterMarquee).not.toBeVisible();
      await expect(await PROMO.textInsertBeforeText).not.toBeVisible();
      await expect(await PROMO.marqueeReplace).not.toBeVisible();
      await expect(await PROMO.textReplace).not.toBeVisible();
    });
  });

  // @Promo-page-filter-insert - Validate promo page filter with insert action
  test(`${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[9].path}${miloLibs}`;
    const { data } = features[9];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);

      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);
    });

    await test.step('Validate content insert after marquee', async () => {
      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);
    });

    await test.step('Validate other promo filter actions are not applied', async () => {
      await expect(await PROMO.textInsertBeforeCommon).not.toBeVisible();
      await expect(await PROMO.marqueeReplace).not.toBeVisible();
    });
  });

  // @Promo-page-filter-replace - Validate promo page filter with replace action
  test(`${features[10].name},${features[10].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[10].path}${miloLibs}`;
    const { data } = features[10];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default content', async () => {
      await expect(await PROMO.marqueeDefault).not.toBeVisible();
      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);
    });

    await test.step('Validate marque replace', async () => {
      await expect(await PROMO.marqueeReplace).toBeVisible();
      await expect(await PROMO.marqueeReplace).toContainText(data.textReplaceMarquee);
    });

    await test.step('Validate other promo filter actions are not applied', async () => {
      await expect(await PROMO.textInsertBeforeCommon).not.toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).not.toBeVisible();
    });
  });

  // @Promo-page-filter-geo - Validate promo page filter in default, de and fr locales
  test(`${features[11].name},${features[11].tags}`, async ({ page, baseURL }) => {
    let testPage = `${baseURL}${features[11].path}${miloLibs}`;
    const { data } = features[11];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.marqueeDefault).toContainText(data.textMarquee);

      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textDefault).toContainText(data.textDefault);
    });

    await test.step('Validate content insert before text', async () => {
      await expect(await PROMO.textInsertBeforeCommon).toBeVisible();
      await expect(await PROMO.textInsertBeforeCommon).toContainText(data.textBeforeText);
    });

    await test.step('Validate other promo filter actions are not applied', async () => {
      await expect(await PROMO.textInsertAfterMarquee).not.toBeVisible();
      await expect(await PROMO.marqueeReplace).not.toBeVisible();
    });

    await test.step('Go to the test page in DE locale', async () => {
      testPage = `${baseURL}${data.CO_DE}${features[11].path}${miloLibs}`;
      console.info('[Test Page][DE]: ', testPage);
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify page filter on DE page', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textInsertBeforeCommonDE).toBeVisible();
      await expect(await PROMO.textInsertBeforeCommonDE).toContainText(data.textBeforeTextDE);
      await expect(await PROMO.textInsertAfterMarquee).not.toBeVisible();
      await expect(await PROMO.marqueeReplace).not.toBeVisible();
    });

    await test.step('Go to the test page in FR locale', async () => {
      testPage = `${baseURL}${data.CO_FR}${features[11].path}${miloLibs}`;
      console.info('[Test Page][FR]: ', testPage);
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify page filter on FR page', async () => {
      await expect(await PROMO.marqueeDefault).toBeVisible();
      await expect(await PROMO.textDefault).toBeVisible();
      await expect(await PROMO.textInsertBeforeCommonFR).toBeVisible();
      await expect(await PROMO.textInsertBeforeCommonFR).toContainText(data.textBeforeTextFR);
      await expect(await PROMO.textInsertAfterMarquee).not.toBeVisible();
      await expect(await PROMO.marqueeReplace).not.toBeVisible();
    });
  });

  // @Promo-remove-fragment - Validate fragment marquee remove
  test(`${features[12].name},${features[12].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[12].path}${miloLibs}`;
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content is not visible', async () => {
      await expect(await PROMO.marqueeFragment).not.toBeVisible();
    });
  });

  // @Promo-fragment-insert - Validate promo insert text after and before fragment
  test(`${features[13].name},${features[13].tags}`, async ({ page, baseURL }) => {
    const testPage = `${baseURL}${features[13].path}${miloLibs}`;
    const { data } = features[13];
    console.info('[Test Page]: ', testPage);

    await test.step('Go to the test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify default test page content', async () => {
      await expect(await PROMO.marqueeFragment).toBeVisible();
      await expect(await PROMO.marqueeFragment).toContainText(data.textMarquee);
    });

    await test.step('Validate content insert after marquee', async () => {
      await expect(await PROMO.textInsertAfterMarquee).toBeVisible();
      await expect(await PROMO.textInsertAfterMarquee).toContainText(data.textAfterMarquee);
    });

    await test.step('Validate content insert before text component', async () => {
      await expect(await PROMO.textInsertBeforeText).toBeVisible();
      await expect(await PROMO.textInsertBeforeText).toContainText(data.textBeforeMarquee);
    });
  });
});
