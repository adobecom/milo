export default class MasCCDPage {
  constructor(page) {
    this.page = page;

    this.price = page.locator('span[data-template="price"]');
    this.priceStrikethrough = page.locator('span[data-template="strikethrough"]');
    this.merchCard = page.locator('merch-card');
    this.suggestedCard = page.locator('merch-card[variant="ccd-suggested"]');
    this.suggestedCardTitle = this.page.locator('h3[slot="heading-xs"]');
    this.suggestedCardIcon = page.locator('merch-icon');
    this.suggestedCardEyebrow = page.locator('h4[slot="detail-s"]');
    this.suggestedCardDescription = page.locator('div[slot="body-xs"] p').first();
    this.suggestedCardLegalLink = page.locator('div[slot="body-xs"] p > a');
    this.suggestedCardPrice = page.locator('p[slot="price"]');
    this.suggestedCardCTA = page.locator('div[slot="cta"] a[is="checkout-link"]');
    this.sliceCard = page.locator('merch-card[variant="ccd-slice"]');
    this.sliceCardWide = page.locator('merch-card[variant="ccd-slice"][size="wide"]');
  }
}
