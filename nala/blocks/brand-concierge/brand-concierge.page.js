export default class BrandConciergeBlock {
  constructor(page) {
    this.page = page;

    // Core block container
    this.block = this.page.locator('.brand-concierge').first();

    // Block variants
    this.brandConciergeHero = this.page.locator('.brand-concierge.hero');
    this.brandConciergeSticky = this.page.locator('.brand-concierge.sticky');

    // Input field (may be hidden on mobile for sticky variant)
    this.inputField = this.block.locator('textarea, input[type="text"]');

    // Suggested prompts (pill buttons)
    this.promptButtons = this.block.locator('button, a[role="button"]');

    // Page-level content elements
    this.pageHeadings = this.page.locator('h1, h2, h3');
    this.pageBody = this.page.locator('p');
  }
}
