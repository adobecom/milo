export default class BlockGroup {
  constructor(page) {
    this.page = page;

    // block group types locators
    this.start = this.page.locator('.block-group-start');
    this.end = this.page.locator('.block-group-end');
  }
}
