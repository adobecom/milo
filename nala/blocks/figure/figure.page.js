export default class Figure {
  constructor(page) {
    this.page = page;
    // figure block locators
    this.figure = this.page.locator('figure');
    this.image = this.figure.locator('picture img');
    this.figCaption = this.figure.locator('figcaption .caption');
  }
}
