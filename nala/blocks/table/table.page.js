/* eslint-disable no-return-await */
export default class Table {
  constructor(page, nth = 0) {
    this.page = page;
    // tabel locators
    this.table = this.page.locator('.table').nth(nth);
    this.highlightTable = this.page.locator('.table.highlight').nth(nth);
    this.stickyTable = this.page.locator('.table.sticky').nth(nth);
    this.collapseStickyTable = this.page.locator('.table.highlight.collapse.sticky').nth(nth);
    this.merchTable = this.page.locator('.table.merch').nth(nth);
    this.merchHighlightStickyTable = this.page.locator('.table.merch.highlight.sticky').nth(nth);

    this.highlightRow = this.table.locator('.row-highlight');
    this.headingRow = this.table.locator('.row-heading');
    this.stickyRow = this.table.locator('.row-heading');

    this.headingRowColumns = this.headingRow.locator('.col');
    this.rows = this.table.locator('.row');
    this.sectionRows = this.table.locator('.section-row');
  }

  async getHighlightRowColumnTitle(colIndex) {
    return await this.highlightRow.locator('.col-highlight').nth(colIndex);
  }

  async getHeaderColumnTitle(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.tracking-header');
  }

  async getHeaderColumnPricing(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.pricing');
  }

  async getHeaderColumnImg(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('img');
  }

  async getHeaderColumnAdditionalText(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('p').nth(3);
  }

  async getHeaderColumnOutlineButton(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.con-button.outline');
  }

  async getHeaderColumnBlueButton(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.con-button.blue');
  }

  async getSectionRowTitle(index) {
    const sectionRow = await this.table.locator('.section-row').nth(index);
    return sectionRow.locator('.section-row-title');
  }

  async getSectionRowMerchContent(index) {
    const sectionRow = await this.table.locator('.section-row').nth(index);
    return sectionRow.locator('.col-merch-content').nth(0);
  }

  async getSectionRowMerchContentImg(index) {
    const sectionRow = await this.table.locator('.section-row').nth(index);
    return sectionRow.locator('.col-merch-content img');
  }

  async getSectionRowCell(rowIndex, colIndex) {
    const sectionRow = await this.table.locator('.section-row').nth(rowIndex);
    return sectionRow.locator(`.col-${colIndex}`);
  }
}
