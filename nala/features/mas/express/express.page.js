export default class ExpressCard {
  constructor(page, id) {
    this.page = page;
    this.id = id;

    // Find card by fragment ID
    this.fragment = page.locator(`aem-fragment[fragment="${id}"]`);
    this.card = page.locator('merch-card').filter({ has: this.fragment });

    // Badge
    this.badge = this.card.locator('merch-badge');

    // Title
    this.title = this.card.locator('[slot="heading-xs"]');

    // Description
    this.description = this.card.locator('[slot="body-xs"] p').first();

    // Price elements
    this.priceContainer = this.card.locator('[slot="price"]');
    this.price = this.priceContainer.locator('p').first();
    this.priceStrikethrough = this.priceContainer.locator('.price-strikethrough');
    this.priceHeading = this.priceContainer.locator('h2, .heading-l');
    this.priceNote = this.priceContainer.locator('p').nth(1);
    this.priceAdditionalNote = this.priceContainer.locator('p').nth(2);

    // CTA elements
    this.ctaContainer = this.card.locator('[slot="cta"]');
    this.ctaButton = this.ctaContainer.locator('button');
    this.ctaLink = this.ctaContainer.locator('a');

    // Mobile/Tablet accordion
    this.chevronButton = this.card.locator('.chevron-button');

    // Card attributes
    this.gradientBorder = async () => this.card.getAttribute('gradient-border');
    this.variant = async () => this.card.getAttribute('variant');
    this.isExpanded = async () => this.card.getAttribute('data-expanded');
  }

  // Helper method to ensure card is expanded on mobile/tablet
  async ensureExpanded() {
    const viewportWidth = this.page.viewportSize().width;
    if (viewportWidth < 1200) {
      const chevronVisible = await this.chevronButton.isVisible();
      if (chevronVisible) {
        const expanded = await this.isExpanded();
        if (expanded !== 'true') {
          await this.chevronButton.click();
          await this.page.waitForTimeout(300);
        }
      }
    }
  }

  // Helper method to check if element has gradient border
  async hasGradientBorder() {
    const gradientAttr = await this.gradientBorder();
    return gradientAttr === 'true';
  }

  // Helper to get all price paragraphs
  async getAllPriceParagraphs() {
    return this.priceContainer.locator('p').all();
  }
}
