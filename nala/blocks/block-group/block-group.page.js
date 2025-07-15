export default class BlockGroup {
  constructor(page) {
    this.page = page;

    this.start = this.page.locator('.block-group-start');
    this.end = this.page.locator('.block-group-end');
  }
}
