import { expect, test } from '@playwright/test';
import { features } from './comparison-table.spec.js';
import ComparisonTableBlock from './comparison-table.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let table;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Comparison Table block feature test suite', () => {
  test.beforeEach(async ({ page }) => {
    table = new ComparisonTableBlock(page);
  });

  // Test 0 : Comparison Table block
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Comparison Table block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      await expect(await table.table).toBeVisible();
      await expect(await table.tableSection).toHaveCount(data.tableSectionCount);
      await expect(await table.tableRows).toHaveCount(data.rowsCount);
      await expect(await table.tableHeader).toHaveCount(data.headerColCount);

      await table.verifyTableSubHeaders(data);
      await table.verifyTableSection(data.firstSection);
      await table.verifyTableSection(data.firstSection);
    });

    await test.step('step-3: Verify sticky header', async () => {
      await table.table.scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 800);
      await expect(table.stickyHeader).toBeVisible({ timeout: 30000 });
      await expect(await table.stickyHeader).toHaveCSS('position', 'sticky');
      await expect(await table.stickyHeader).toHaveCSS('top', '64px');
    });

    await test.step('step-4: Verify the accessibility test on the Comparison Table block', async () => {
      await runAccessibilityTest({ page, testScope: table.table });
    });
  });

  // Test 1 : Comparison Table - static header
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to Comparison Table - static header test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      await expect(await table.table).toBeVisible();
      await expect(await table.tableSection).toHaveCount(data.tableSectionCount);
      await expect(await table.tableRows).toHaveCount(data.rowsCount);
      await expect(await table.tableHeader).toHaveCount(data.headerColCount);

      await table.verifyTableSubHeaders(data);
      await table.verifyTableSection(data.firstSection);
      await table.verifyTableSection(data.secondSection);
    });

    await test.step('step-3: Verify the accessibility test on the Comparison Table - static header block', async () => {
      await runAccessibilityTest({ page, testScope: table.table });
    });
  });

  // Test 2 : Comparison Table - dark mode
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to Comparison Table - dark test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      await expect(await table.table).toBeVisible();
      await expect(await table.tableSection).toHaveCount(data.tableSectionCount);
      await expect(await table.tableRows).toHaveCount(data.rowsCount);
      await expect(await table.tableHeader).toHaveCount(data.headerColCount);

      await table.verifyTableSubHeaders(data);
      await table.verifyTableSection(data.firstSection);
      await table.verifyTableSection(data.secondSection);
    });

    await test.step('step-3: Verify sticky header btn', async () => {
      await table.table.scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 800);
      await expect(table.stickyHeader).toBeVisible({ timeout: 30000 });
      await expect(await table.stickyHeader).toHaveCSS('position', 'sticky');
      await expect(await table.stickyHeader).toHaveCSS('top', '64px');
      await table.verifyStickyHeaderButtons();
    });

    await test.step('step-4: Verify the accessibility test on the Comparison Table - dark block', async () => {
      await runAccessibilityTest({ page, testScope: table.table });
    });
  });
});
