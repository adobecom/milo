export default class BrandConciergeBlock {
  constructor(page) {
    this.page = page;

    // Core block container
    this.block = this.page.locator('.brand-concierge').first();

    // Block variants
    this.brandConciergeHero = this.page.locator('.brand-concierge.hero');

    // Floating button elements
    this.floatingButton = this.page.locator('.bc-floating-button').first();
    this.floatingButtonContainer = this.page.locator('.bc-floating-button-container').first();
    this.floatingButtonInput = this.page.locator('.bc-floating-input').first();
    this.floatingButtonHidden = this.page.locator('.bc-floating-button.floating-hidden');
    this.floatingButtonVisible = this.page.locator('.bc-floating-button.floating-show');

    // Modal elements
    this.modal = this.page.locator('#brand-concierge-modal');
    this.modalMount = this.page.locator('#brand-concierge-mount');
    this.modalInputContainer = this.modalMount.locator('.input-container').first();
    this.modalDisclaimer = this.modalMount.locator('.disclaimer-message').first();
    this.modalPromptButtons = this.modalMount.locator('button');

    // Input field (may be hidden on mobile for sticky variant)
    this.inputField = this.block.locator('textarea, input[type="text"]');

    // Suggested prompts (pill buttons)
    this.promptButtons = this.block.locator('button, a[role="button"]');

    // Page-level content elements
    this.pageHeadings = this.page.locator('h1, h2, h3');
    this.pageBody = this.page.locator('p');
  }
}
