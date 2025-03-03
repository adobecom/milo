export default class MasAcom {
  constructor(page) {
    this.page = page;
    this.price = page.locator('span[data-template="price"]');
    this.priceStrikethrough = page.locator('span[data-template="strikethrough"]');
    this.cardIcon = page.locator('merch-icon');
  }

  getCard(id) {
    return this.page.locator(`merch-card:has(aem-fragment[fragment="${id}"])`);
  }

  getCardIcon(id) {
    const card = this.getCard(id);
    return card.locator('merch-icon');
  }

  getCardTitle(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="heading-xs"]');
  }

  getCardPromoText(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="promo-text"]');
  }

  getCardPrice(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="heading-m"]');
  }

  getCardDescription(id) {
    const card = this.getCard(id);
    return card.locator('div[slot="body-xs"] p');
  }

  getSeeAllPlansLink(id) {
    return this.getCardDescription(id).locator('a.modal-Link');
  }

  getCardCTA(id) {
    const card = this.getCard(id);
    return card.locator('div[slot="footer"] > a[is="checkout-link"]');
  }

  getStockCheckbox(id) {
    return this.getCard(id).locator('[id="stock-checkbox"]');
  }
}
