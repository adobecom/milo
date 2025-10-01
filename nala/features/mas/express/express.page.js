export default class ExpressCard {
  constructor(page, id) {
    this.page = page;
    this.id = id;

    // Find card by fragment ID
    this.fragment = page.locator(`aem-fragment[fragment="${id}"]`);
    this.card = page.locator('merch-card').filter({ has: this.fragment });

    // Badge
    this.badge = this.card.locator('[slot="badge"] merch-badge').or(this.card.locator('merch-badge'));

    // Title with mnemonic support
    this.title = this.card.locator('[slot="heading-xs"]');
    this.titleMnemonic = this.title.locator('mas-mnemonic');

    // Short Description (full-pricing-express specific)
    this.shortDescription = this.card.locator('[slot="short-description"]');
    this.shortDescriptionText = this.shortDescription.locator('p').first();

    // Description - handles both variants
    // simplified-pricing-express uses [slot="body-xs"]
    // full-pricing-express uses [slot="body-s"]
    this.description = this.card.locator('[slot="body-xs"], [slot="body-s"]');
    this.descriptionText = this.description.locator('p').first();

    // Full-pricing-express specific elements
    this.topFeaturesLabel = this.description.locator('p').first();
    this.firstDividerWrapper = this.description.locator('hr').first();
    this.firstDivider = this.firstDividerWrapper;
    this.includesText = this.description.locator('p:has-text("Includes")');
    this.featureParagraphs = this.description.locator('p');
    this.secondDividerWrapper = this.description.locator('hr').last();
    this.secondDivider = this.secondDividerWrapper;
    this.buttonContainer = this.description;
    this.compareLink = this.description.locator('a:has-text("Compare all features")');

    // Price elements
    this.priceContainer = this.card.locator('[slot="price"]');
    this.price = this.priceContainer.locator('p').first();
    this.mainPrice = this.priceContainer.locator('span[is="inline-price"]').first();
    this.priceStrikethrough = this.priceContainer.locator('.price-strikethrough');
    this.priceHeading = this.priceContainer.locator('h2, .heading-l');
    this.priceNote = this.priceContainer.locator('p').nth(1);
    this.priceAdditionalNote = this.priceContainer.locator('p').nth(2);

    // CTA elements
    this.ctaContainer = this.card.locator('[slot="cta"]');
    this.ctaButton = this.ctaContainer.locator('button[is="checkout-button"], button');
    this.ctaLink = this.ctaContainer.locator('a');

    // Mobile/Tablet accordion (simplified-pricing-express specific)
    this.chevronButton = this.card.locator('.chevron-button');

    // Card attributes
    this.gradientBorder = async () => this.card.getAttribute('gradient-border');
    this.borderColor = async () => this.card.getAttribute('border-color');
    this.variant = async () => this.card.getAttribute('variant');
    this.isExpanded = async () => this.card.getAttribute('data-expanded');
  }

  // Helper method to ensure card is expanded on mobile/tablet (simplified-pricing-express)
  async ensureExpanded() {
    const viewportWidth = this.page.viewportSize().width;
    if (viewportWidth < 1200) {
      const chevronVisible = await this.chevronButton.isVisible().catch(() => false);
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

  // Helper to get all feature list items (full-pricing-express)
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

  // Helper to check if dividers are visible (full-pricing-express)
  async areDividersVisible() {
    try {
      const firstVisible = await this.firstDivider.isVisible();
      const secondVisible = await this.secondDivider.isVisible();
      return { first: firstVisible, second: secondVisible };
    } catch {
      return { first: false, second: false };
    }
  }

  // Helper to check mobile view
  async checkMobileView() {
    const viewportWidth = this.page.viewportSize().width;
    const variant = await this.variant();

    if (viewportWidth <= 1024) {
      if (variant === 'full-pricing-express') {
        // Check dividers and button visibility in body-s
        const dividers = await this.description.locator('hr').all();
        const visibleDividers = [];

        for (const divider of dividers) {
          if (await divider.isVisible().catch(() => false)) {
            visibleDividers.push(divider);
          }
        }

        const buttonVisible = await this.compareLink.isVisible().catch(() => false);

        return {
          isMobile: true,
          visibleDividerCount: visibleDividers.length,
          buttonVisible,
        };
      }

      // simplified-pricing-express mobile check
      return { isMobile: true };
    }

    return { isMobile: false };
  }

  // Helper to verify alignment (for desktop view)
  async checkAlignment() {
    const viewportWidth = this.page.viewportSize().width;
    const variant = await this.variant();

    if ((variant === 'full-pricing-express' && viewportWidth >= 1025)
        || (variant === 'simplified-pricing-express' && viewportWidth >= 1200)) {
      const descriptionElement = await this.description.elementHandle();
      if (!descriptionElement) return null;

      const styles = await this.page.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          flexDirection: computed.flexDirection,
          minHeight: computed.minHeight,
        };
      }, descriptionElement);

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
