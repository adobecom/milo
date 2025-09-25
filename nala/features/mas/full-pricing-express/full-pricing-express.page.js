export default class FullPricingExpressCard {
  constructor(page, id) {
    this.page = page;
    this.id = id;

    // Find card by fragment ID
    this.fragment = page.locator(`aem-fragment[fragment="${id}"]`);
    this.card = page.locator('merch-card').filter({ has: this.fragment });

    // Badge
    this.badge = this.card.locator('[slot="badge"] merch-badge');

    // Title with mnemonic support
    this.title = this.card.locator('[slot="heading-xs"]');
    this.titleMnemonic = this.title.locator('mas-mnemonic');

    // Short Description (main description)
    this.shortDescription = this.card.locator('[slot="short-description"]');
    this.shortDescriptionText = this.shortDescription.locator('p').first();

    // Body/Description (Top features section)
    this.description = this.card.locator('[slot="body-s"]');
    this.descriptionText = this.description.locator('p').first();

    // Price elements
    this.priceContainer = this.card.locator('[slot="price"]');
    this.price = this.priceContainer.locator('p').first();
    this.mainPrice = this.priceContainer.locator('span[is="inline-price"]').first();
    this.priceStrikethrough = this.priceContainer.locator('.price-strikethrough');
    this.priceNote = this.priceContainer.locator('p').nth(1);
    this.priceAdditionalNote = this.priceContainer.locator('p').nth(2);

    this.description2 = this.card.locator('[slot="body-s"]');
    this.topFeaturesLabel = this.description.locator('p').first();
    this.firstDividerWrapper = this.description.locator('hr').first();
    this.firstDivider = this.firstDividerWrapper;
    // After the first divider, the includes text is the next p element
    this.includesText = this.description.locator('p:has-text("Includes")');
    this.featureParagraphs = this.description.locator('p');
    this.secondDividerWrapper = this.description.locator('hr').last();
    this.secondDivider = this.secondDividerWrapper;
    this.buttonContainer = this.description;
    this.compareLink = this.description.locator('a:has-text("Compare all features")');

    // CTA elements
    this.ctaContainer = this.card.locator('[slot="cta"]');
    this.ctaButton = this.ctaContainer.locator('button[is="checkout-button"]');

    // Card attributes
    this.gradientBorder = async () => this.card.getAttribute('gradient-border');
    this.borderColor = async () => this.card.getAttribute('border-color');
    this.variant = async () => this.card.getAttribute('variant');
  }

  // Helper method to check if element has gradient border
  async hasGradientBorder() {
    const gradientAttr = await this.gradientBorder();
    return gradientAttr === 'true';
  }

  // Helper to get all feature list items
  async getFeaturesList() {
    const paragraphs = await this.featureParagraphs.all();
    const features = [];

    for (const p of paragraphs) {
      const text = await p.textContent();
      // Skip empty paragraphs, dividers, and special sections
      if (text
          && !text.includes('Top features')
          && !text.includes('Compare all features')
          && text.trim() !== '') {
        features.push(text.trim());
      }
    }

    return features;
  }

  // Helper to check if dividers are visible
  async areDividersVisible() {
    const firstVisible = await this.firstDivider.isVisible();
    const secondVisible = await this.secondDivider.isVisible();
    return { first: firstVisible, second: secondVisible };
  }

  // Helper to check mobile view
  async checkMobileView() {
    const viewportWidth = this.page.viewportSize().width;

    if (viewportWidth < 768) {
      // On mobile, check dividers and button visibility in body-s
      const dividers = await this.description.locator('hr').all();
      const visibleDividers = [];

      for (const divider of dividers) {
        if (await divider.isVisible()) {
          visibleDividers.push(divider);
        }
      }

      const buttonVisible = await this.compareLink.isVisible();

      return {
        isMobile: true,
        visibleDividerCount: visibleDividers.length,
        buttonVisible,
      };
    }

    return { isMobile: false };
  }

  // Helper to verify alignment (for desktop view)
  async checkAlignment() {
    const viewportWidth = this.page.viewportSize().width;

    if (viewportWidth >= 768) {
      // Check if description2 is using flexbox
      const description2Element = await this.description2.elementHandle();
      const styles = await this.page.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          flexDirection: computed.flexDirection,
          minHeight: computed.minHeight,
        };
      }, description2Element);

      return {
        isFlexContainer: styles.display === 'flex',
        flexDirection: styles.flexDirection,
        hasMinHeight: styles.minHeight !== '0px' && styles.minHeight !== '',
      };
    }

    return null;
  }

  // Helper to check if card has mnemonic icon
  async hasMnemonicIcon() {
    try {
      const count = await this.titleMnemonic.count();
      return count > 0;
    } catch {
      return false;
    }
  }
}
