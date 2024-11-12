export default class CatalogMarquee {
  constructor(page) {
    this.page = page;
    this.catalogMarquee = page.locator('.catalog-marquee');

    // Background
    this.background = this.catalogMarquee.locator('.background');
    this.backgroundImage = this.background.locator('img').nth(2);

    // Foreground
    this.foreground = this.catalogMarquee.locator('.foreground.container');
    this.text = this.foreground.locator('.text');
    this.textH2 = this.text.locator('h2');
    this.bodyM = this.text.locator('.body-m');

    // Mnemonic list
    this.mnemonicsList = this.text.locator('.mnemonic-list').nth(0);
    this.mnemonics = this.mnemonicsList.locator('.product-list');
    this.mnemonicItems = this.mnemonics.locator('.product-item');
    this.mnemonicsHeading = this.mnemonics.locator('.product-item strong').nth(0);

    this.acrobatText = this.mnemonics.locator('.product-item strong').nth(1);
    this.photoshopText = this.mnemonics.locator('.product-item strong').nth(2);
    this.premiereProText = this.mnemonics.locator('.product-item strong').nth(3);
    this.illustratorText = this.mnemonics.locator('.product-item strong').nth(4);
    this.expressText = this.mnemonics.locator('.product-item strong').nth(5);

    this.acrobatImg = this.mnemonics.locator('.product-item img').nth(0);
    this.photoshopImg = this.mnemonics.locator('.product-item img').nth(1);
    this.premiereProImg = this.mnemonics.locator('.product-item img').nth(2);
    this.illustratorImg = this.mnemonics.locator('.product-item img').nth(3);
    this.expressImg = this.mnemonics.locator('.product-item img').nth(4);

    // Business features
    this.businessFeaturesList = this.text.locator('.mnemonic-list').nth(1);
    this.businessFeatures = this.businessFeaturesList.locator('.product-list');
    this.businessItems = this.businessFeatures.locator('.product-item');
    this.businessFeaturessHeading = this.businessFeatures.locator('.product-item strong').nth(0);

    this.dashboardText = this.businessFeatures.locator('.product-item strong').nth(1);
    this.feedbackText = this.businessFeatures.locator('.product-item strong').nth(2);
    this.filesText = this.businessFeatures.locator('.product-item strong').nth(3);
    this.assetsText = this.businessFeatures.locator('.product-item strong').nth(4);

    this.dashboardImg = this.businessFeatures.locator('.product-item img').nth(0);
    this.feedbackImg = this.businessFeatures.locator('.product-item img').nth(1);
    this.filesImg = this.businessFeatures.locator('.product-item img').nth(2);
    this.assetsImg = this.businessFeatures.locator('.product-item img').nth(3);

    // Action area
    this.actionArea = this.text.locator('.action-area');
    this.outlineButtonL = this.actionArea.locator('.con-button.outline.button-l');
    this.blueButtonL = this.actionArea.locator('.con-button.blue.button-l');

    this.attributes = {
      backgroundImg: {
        loading: 'lazy',
        width: '750',
        height: '141',
      },
      acrobatImg: { alt: 'Acrobat Pro Product Icon' },
      photoshopImg: { alt: 'Photoshop Product Icon' },
      premiereProImg: { alt: 'Premiere Pro Product Iconn' },
      illustratorImg: { alt: 'Illustrator Product Icon' },
      expressImg: { alt: 'Express Product Icon' },
      checkmarkImg: { alt: 'Checkmark icon' },
    };
  }
}
