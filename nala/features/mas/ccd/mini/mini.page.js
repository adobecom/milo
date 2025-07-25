export default class MiniCard {
  constructor(page) {
    this.page = page;
  }

  getCard(fragmentId) {
    return this.page.locator('merch-card').filter({ has: this.page.locator(`aem-fragment[fragment="${fragmentId}"]`) });
  }
}
