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
    this.floatingButtonHidden = this.page.locator('.bc-floating-button.bc-floating-hidden');
    this.floatingButtonVisible = this.page.locator('.bc-floating-button.bc-floating-show');

    // Modal elements
    this.modal = this.page.locator('#brand-concierge-side');
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

    // Marquee (multi-image hero) variant
    this.marquee = this.page.locator('.brand-concierge.marquee').first();
    this.marqueeDark = this.page.locator('.brand-concierge.marquee.dark');
    this.marqueeLight = this.page.locator('.brand-concierge.marquee.light');
    this.marqueeEyebrow = this.block.locator('.bc-header-eyebrow').first();
    this.marqueeHeadline = this.block.locator('.bc-header-title').first();
    this.marqueeSubheadline = this.block.locator('.bc-header-subtitle').first();
    this.marqueeLegal = this.block.locator('.bc-legal').first();
    this.marqueeImages = this.block.locator('picture');
    this.marqueeChips = this.block.locator('.prompt-card-button');
    this.marqueeTextarea = this.block.locator('.bc-input-field textarea').first();
    this.marqueeSendButton = this.block.locator('.input-field-button').first();

    // Modal close/dismiss elements
    this.modalCloseButton = this.page.locator('#brand-concierge-side .dialog-close');
    this.modalCurtain = this.page.locator('.modal-curtain');

    // Floating-input variant bar
    this.floatingInputBar = this.page.locator('.brand-concierge.floating-input');
    this.floatingInputDark = this.page.locator('.brand-concierge.floating-input.dark');
    this.floatingInputPromptPills = this.page.locator('.brand-concierge.floating-input .prompt-card-button');
    this.floatingInputContainer = this.page.locator('.brand-concierge.floating-input .bc-input-field-container');
    this.floatingInputTextarea = this.page.locator('.brand-concierge.floating-input textarea');
    this.inputSubmitButton = this.block.locator('.input-field-button');

    this.floatingInputInnerBar = this.page.locator('.bc-floating-input.bc-floating-element');
    this.floatingInputInnerBarPills = this.page.locator('.bc-floating-input.bc-floating-element .prompt-card-button');
    this.floatingInputSubmitButton = this.page.locator('.bc-floating-input.bc-floating-element .input-field-button');
    this.floatingInputBarTextarea = this.page.locator('.bc-floating-input.bc-floating-element textarea');
    this.floatingInputBarContainer = this.page.locator('.bc-floating-input.bc-floating-element .bc-input-field-container');

    // Web client script loader (used for pre-load + ?webclient= tests)
    // Matches base/prod/stage URLs for BC agent main.js
    this.webClientScript = this.page.locator(
      'script[src*="adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js"], '
      + 'script[src*="experience-platform-brand-concierge-web-agent/static-assets/main.js"]',
    );
  }
}
