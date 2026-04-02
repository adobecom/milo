export default class IconBlockA11y {
  constructor(page) {
    this.page = page;

    // The section containing the logo icon-blocks (six-up with no header)
    this.logoSection = this.page.locator('.section[tabindex="0"][aria-label]').first();
    this.iconBlocks = this.logoSection.locator('.icon-block');
    this.iconImages = this.logoSection.locator('.icon-block img[alt]');
  }
}
