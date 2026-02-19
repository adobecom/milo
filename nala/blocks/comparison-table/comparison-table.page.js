/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
import { expect } from '@playwright/test';

export default class ComparisonTableBlock {
  constructor(page) {
    this.page = page;

    this.table = page.locator('.comparison-table');
    this.tableSection = this.table.locator('.table-container');
    this.tableRows = this.table.locator('.table-row');
    this.tableHeader = this.table.locator('.header-item');
    this.tableSubHeader = this.table.locator('.sub-header-item-container');
    this.stickyHeader = this.table.locator('.header-content.sticky');
  }

  headerColumn(colIndex) {
    return this.table.locator(`.header-item[data-column-index="${colIndex}"]`);
  }

  subHeaderContainers(column) {
    return {
      title: column.locator('.sub-header-item-container').nth(0),
      headingPricing: column.locator('.sub-header-item-container').nth(1),
      actions: column.locator('.sub-header-item-container').nth(2),
    };
  }

  sectionHeader(title) {
    return this.table.locator('.table-column-header', { hasText: title });
  }

  sectionToggleBtn(sectionHeader) {
    return sectionHeader.locator('button').first();
  }

  sectionBody(sectionHeader) {
    return sectionHeader.locator(
      'xpath=following::div[contains(@class,"table-body")][1]',
    );
  }

  sectionRowsFromBody(tableBody) {
    return tableBody.locator(
      '.table-row[role="row"]:not(.accessibility-header-row)',
    );
  }

  row(rows, rowIndex) {
    return rows.nth(rowIndex);
  }

  rowHeader(row) {
    return row.locator('.table-row-header');
  }

  cell(row, colIndex) {
    return row.locator(`.table-cell[data-column-index="${colIndex}"]`);
  }

  async verifyTableSubHeaders(data) {
    for (const sh of (data?.subHeaders || [])) {
      const {
        colIndex,
        visibility = true,
        titleText,
        heading,
        pricingText,
        buttons,
        imageVisible,
        descriptionText,
        descriptionLinkText,
      } = sh;

      const column = this.headerColumn(colIndex);

      if (!visibility) {
        await expect(column).toBeHidden();
        continue;
      }

      await expect(column).toBeVisible();

      const { title, headingPricing, actions } = this.subHeaderContainers(column);

      // title
      if (titleText) {
        await expect(title.locator('h2, h3, h4, h5, h6').first()).toHaveText(titleText);
      }

      // image
      if (imageVisible) {
        await expect(title.locator('picture img')).toBeVisible();
      }

      // heading + pricing
      if (heading) {
        await expect(headingPricing.locator('p').nth(0)).toHaveText(heading);
      }
      if (pricingText) {
        await expect(headingPricing.locator('p').nth(1)).toHaveText(pricingText);
      }

      // description + link
      if (descriptionText !== undefined) {
        await expect(actions.locator('p.description')).toContainText(descriptionText);
      }
      if (descriptionLinkText) {
        const link = actions.locator('p.description a', { hasText: descriptionLinkText });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href');
      }

      // buttons
      if (buttons?.length) {
        for (const { text, type } of buttons) {
          const btn = actions.locator('a.con-button', { hasText: text });
          await expect(btn).toBeVisible();

          if (type) {
            await expect(btn).toHaveClass(new RegExp(`\\b${type}\\b`));
          }

          await expect(btn).toHaveAttribute('href');
        }
      }
    }
  }

  async verifyTableSection(data) {
    const sectionHeader = this.sectionHeader(data.sectionTitle);
    const toggleBtn = this.sectionToggleBtn(sectionHeader);

    // expand if requested
    if (data.expand) {
      await toggleBtn.click();
    }

    // expected expanded
    const expectedExpanded = data.expectedExpanded ?? 'true';
    await expect(toggleBtn).toHaveAttribute('aria-expanded', expectedExpanded);

    const tableBody = this.sectionBody(sectionHeader);

    // collapsed state
    if (expectedExpanded === 'false') {
      await expect(tableBody).toHaveClass(/hide/);
      return;
    }

    // rows in this section only
    const rows = this.sectionRowsFromBody(tableBody);

    for (const rowData of data.rows) {
      const {
        rowIndex,
        rowHeaderText,
        rowHeaderTooltipText,
        linkText,
        cells,
      } = rowData;

      const row = this.row(rows, rowIndex);
      const header = this.rowHeader(row);

      // header text
      if (rowHeaderText) {
        await expect(header).toContainText(rowHeaderText);
      }

      // header tooltip
      if (rowHeaderTooltipText) {
        const headerTooltip = header.locator('.milo-tooltip');
        await expect(headerTooltip).toBeVisible();
        await expect(headerTooltip).toHaveAttribute('data-tooltip', rowHeaderTooltipText);
        await headerTooltip.hover();
      }

      // header link
      if (linkText) {
        const link = header.locator('a');
        await expect(link).toContainText(linkText);
        await expect(link).toHaveAttribute('href');
      }

      // cells
      for (const cellData of cells) {
        const cellLocator = this.cell(row, cellData.colIndex);

        if (cellData.text !== undefined) {
          await expect(cellLocator).toContainText(cellData.text);
        }

        if (cellData.description) {
          await expect(cellLocator).toContainText(cellData.description);
        }

        if (cellData.checkmark) {
          await expect(cellLocator.locator('.icon-milo-checkmark')).toBeVisible();

          if (cellData.checkmark === 'green') {
            await expect(cellLocator).toHaveClass(/primary-cell/);
          }
          if (cellData.checkmark === 'default') {
            await expect(cellLocator).not.toHaveClass(/primary-cell/);
          }
        }

        if (cellData.expectClose) {
          await expect(cellLocator.locator('.icon-milo-close')).toBeVisible();
        }

        if (cellData.tooltipText) {
          const tooltip = cellLocator.locator('.milo-tooltip');
          await expect(tooltip).toBeVisible();
          await expect(tooltip).toHaveAttribute('data-tooltip', cellData.tooltipText);
          await tooltip.hover();
        }
      }
    }
  }

  async verifyStickyHeaderButtons() {
    const buttons = this.stickyHeader.locator('a.con-button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);

      await expect(btn).toHaveCSS('background-color', 'rgb(44, 44, 44)');
      await expect(btn).toHaveCSS('color', 'rgb(255, 255, 255)');
    }
  }
}
