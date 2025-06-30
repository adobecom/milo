export default class Mnemonic {
  constructor(page) {
    this.page = page;

    this.mnemonicList = page.locator('.mnemonic-list');
    this.productItems = page.locator('.product-item');
    this.productItemsImg = page.locator('.product-item img');
  }
}
