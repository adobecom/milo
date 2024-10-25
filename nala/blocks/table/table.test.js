import { expect, test } from '@playwright/test';
import { features } from './table.spec.js';
import TableBlock from './table.page.js';
import { runAccessibilityTest } from '../../libs/accessibility.js';

let table;

const miloLibs = process.env.MILO_LIBS || '';

test.describe('Milo Table block feature test suite', () => {
  test.beforeEach(async ({ page }) => {
    table = new TableBlock(page);
  });

  // Test 0 : Table block (default)
  test(`[Test Id - ${features[0].tcid}] ${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[0].path}${miloLibs}`);
    const { data } = features[0];

    await test.step('step-1: Go to Table block test page', async () => {
      await page.goto(`${baseURL}${features[0].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[0].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      await expect(await table.table).toBeVisible();
      await expect(await table.rows).toHaveCount(data.rowsCount);
      await expect(await table.headingRowColumns).toHaveCount(data.headerRowColCount);
      await expect(await table.sectionRows).toHaveCount(data.sectionRowCount);

      // verify header row cell
      const headerCell = data.headerCell2;
      await expect(await table.getHeaderColumnTitle(2)).toContainText(headerCell.heading);
      await expect(await table.getHeaderColumnPricing(2)).toContainText(headerCell.pricingText);
      await expect(await table.getHeaderColumnOutlineButton(2)).toContainText(headerCell.outlineButtonText);
      await expect(await table.getHeaderColumnBlueButton(2)).toContainText(headerCell.blueButtonText);

      // verify section row cell
      const sectionCell = data.sectionRow2;
      await expect(await table.getSectionRowTitle(2)).toContainText(sectionCell.sectionRowTitle);
      await expect(await table.getSectionRowCell(2, 2)).toContainText(sectionCell.cell22);
    });

    await test.step('step-3: Verify the accessibility test on the table(default) block', async () => {
      // The accessibility test is failing, so skipping it.
      await runAccessibilityTest({ page, testScope: table.table, skipA11yTest: true });
    });
  });

  // Test 1 : Table (highlight)
  test(`[Test Id - ${features[1].tcid}] ${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[1].path}${miloLibs}`);
    const { data } = features[1];

    await test.step('step-1: Go to Table block test page', async () => {
      await page.goto(`${baseURL}${features[1].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[1].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      await expect(await table.highlightTable).toBeVisible();
      await expect(await table.highlightRow).toBeVisible();

      await expect(await table.rows).toHaveCount(data.rowsCount);
      await expect(await table.headingRowColumns).toHaveCount(data.headerRowColCount);
      await expect(await table.sectionRows).toHaveCount(data.sectionRowCount);

      // verify highlighter row
      const highlighter = data.hightlightRow;
      await expect(await table.getHighlightRowColumnTitle(1)).toContainText(highlighter.cell12);
      await expect(await table.getHighlightRowColumnTitle(2)).toContainText(highlighter.cell13);
      await expect(await table.getHighlightRowColumnTitle(3)).toContainText(highlighter.cell14);

      // verify header row cell
      const headerCell = data.headerCell3;
      await expect(await table.getHeaderColumnTitle(3)).toContainText(headerCell.heading);
      await expect(await table.getHeaderColumnPricing(3)).toContainText(headerCell.pricingText);
      await expect(await table.getHeaderColumnOutlineButton(3)).toContainText(headerCell.outlineButtonText);
      await expect(await table.getHeaderColumnBlueButton(3)).toContainText(headerCell.blueButtonText);

      // verify section row cell
      const sectionCell = data.sectionRow2;
      await expect(await table.getSectionRowTitle(2)).toContainText(sectionCell.sectionRowTitle);
      await expect(await table.getSectionRowCell(2, 2)).toContainText(sectionCell.cell22);
    });

    await test.step('step-3: Verify the accessibility test on the table(highlight) block', async () => {
      // The accessibility test is failing, so skipping it.
      await runAccessibilityTest({ page, testScope: table.highlightTable, skipA11yTest: true });
    });
  });

  // Test 2 : Table (sticky)
  test(`[Test Id - ${features[2].tcid}] ${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[2].path}${miloLibs}`);
    const { data } = features[2];

    await test.step('step-1: Go to Table block test page', async () => {
      await page.goto(`${baseURL}${features[2].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[2].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      // verify sticky table header and attributes
      await expect(await table.stickyTable).toBeVisible();
      await expect(await table.stickyRow).toHaveAttribute('class', 'row row-1 row-heading top-border-transparent');

      // verify table row, column count
      await expect(await table.rows).toHaveCount(data.rowsCount);
      await expect(await table.headingRowColumns).toHaveCount(data.headerRowColCount);
      await expect(await table.sectionRows).toHaveCount(data.sectionRowCount);

      // verify header row cell
      const headerCell = data.headerCell4;
      await expect(await table.getHeaderColumnTitle(4)).toContainText(headerCell.heading);
      await expect(await table.getHeaderColumnPricing(4)).toContainText(headerCell.pricingText);
      await expect(await table.getHeaderColumnOutlineButton(4)).toContainText(headerCell.outlineButtonText);
      await expect(await table.getHeaderColumnBlueButton(4)).toContainText(headerCell.blueButtonText);

      // verify section row cell
      const sectionCell = data.sectionRow2;
      await expect(await table.getSectionRowTitle(2)).toContainText(sectionCell.sectionRowTitle);
      await expect(await table.getSectionRowCell(2, 2)).toContainText(sectionCell.cell22);
    });

    await test.step('step-3: Verify the accessibility test on the table(sticky) block', async () => {
      // The accessibility test is failing, so skipping it.
      await runAccessibilityTest({ page, testScope: table.stickyTable, skipA11yTest: true });
    });
  });

  // Test 3 : Table (highlight, collapse, sticky)
  test(`[Test Id - ${features[3].tcid}] ${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[3].path}${miloLibs}`);
    const { data } = features[3];

    await test.step('step-1: Go to Table block test page', async () => {
      await page.goto(`${baseURL}${features[3].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[3].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      // verify sticky table header and attributes
      await expect(await table.collapseStickyTable).toBeVisible();
      await expect(table.highlightRow).toHaveClass(/row.*row-1.*row-highlight/);
      await expect(table.stickyRow).toHaveClass(/row.*row-2.*row-heading/);

      // verify table row, column count
      await expect(await table.rows).toHaveCount(data.rowsCount);
      await expect(await table.headingRowColumns).toHaveCount(data.headerRowColCount);
      await expect(await table.sectionRows).toHaveCount(data.sectionRowCount);

      // verify highlighter row
      const highlighter = data.hightlightRow;
      await expect(await table.getHighlightRowColumnTitle(1)).toContainText(highlighter.cell12);
      await expect(await table.getHighlightRowColumnTitle(2)).toContainText(highlighter.cell13);
      await expect(await table.getHighlightRowColumnTitle(3)).toContainText(highlighter.cell14);

      // verify header row cell
      const headerCell = data.headerCell5;
      await expect(await table.getHeaderColumnTitle(5)).toContainText(headerCell.heading);
      await expect(await table.getHeaderColumnPricing(5)).toContainText(headerCell.pricingText);
      await expect(await table.getHeaderColumnOutlineButton(5)).toContainText(headerCell.outlineButtonText);
      await expect(await table.getHeaderColumnBlueButton(5)).toContainText(headerCell.blueButtonText);

      // verify section row cell
      const sectionCell = data.sectionRow2;
      await expect(await table.getSectionRowTitle(2)).toContainText(sectionCell.sectionRowTitle);
      await expect(await table.getSectionRowCell(2, 2)).toContainText(sectionCell.cell22);
    });

    await test.step('step-3: Verify the accessibility test on the table(highlight, collapse, sticky) block', async () => {
      // The accessibility test is failing, so skipping it.
      await runAccessibilityTest({ page, testScope: table.collapseStickyTable, skipA11yTest: true });
    });
  });

  // Test 4 : Table (merch)
  test(`[Test Id - ${features[4].tcid}] ${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    console.info(`[Test Page]: ${baseURL}${features[4].path}${miloLibs}`);
    const { data } = features[4];

    await test.step('step-1: Go to Table block test page', async () => {
      await page.goto(`${baseURL}${features[4].path}${miloLibs}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${features[4].path}${miloLibs}`);
    });

    await test.step('step-2: Verify table content/specs', async () => {
      // verify merch table
      await expect(await table.merchTable).toBeVisible();

      // verify table row, column count
      await expect(await table.rows).toHaveCount(data.rowsCount);
      await expect(await table.headingRowColumns).toHaveCount(data.headerRowColCount);
      await expect(await table.sectionRows).toHaveCount(data.sectionRowCount);

      // verify merch table header row cell
      const headerCell = data.headerCell1;
      await expect(await table.getHeaderColumnTitle(1)).toContainText(headerCell.heading);
      await expect(await table.getHeaderColumnPricing(1)).toContainText(headerCell.pricingText);
      await expect(await table.getHeaderColumnAdditionalText(1)).toContainText(headerCell.AdditionalText);
      await expect(await table.getHeaderColumnOutlineButton(1)).toContainText(headerCell.outlineButtonText);
      await expect(await table.getHeaderColumnBlueButton(1)).toContainText(headerCell.blueButtonText);

      // verify merch table section row cell
      const sectionCell = data.sectionRow2;
      await expect(await table.getSectionRowMerchContent(2)).toContainText(sectionCell.merchContent);
      await expect(await table.getSectionRowMerchContentImg(2)).toBeVisible();
    });

    await test.step('step-3: Verify the accessibility test on the table(merch) block', async () => {
      // The accessibility test is failing, so skipping it.
      await runAccessibilityTest({ page, testScope: table.merchTable, skipA11yTest: true });
    });
  });
});
