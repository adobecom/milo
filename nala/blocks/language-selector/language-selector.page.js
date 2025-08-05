export default class LanguageSelector {
  constructor(page) {
    this.page = page;

    this.globalFooter = page.locator('.global-footer');
    this.languageSelector = page.locator('.feds-regionPicker');
    this.languageDropdown = page.locator('.language-dropdown');
    this.searchLanguage = page.locator('.search-container');
    this.selectedLanguageName = page.locator('.language-item.selected .language-name');
    this.languageItems = page.locator('.language-item');
    this.headingXL = page.locator('.heading-xl');
    this.bodyM = page.locator('.body-m');
    this.blueButton = page.locator('.con-button.blue');
    this.outlineButton = page.locator('.con-button.outline');
    this.marqueeSmallLight = page.locator('.marquee.small.light');
  }

  // open RegionPicker dropdown
  async openRegionPicker() {
    await this.languageSelector.click();
  }

  // close oneTrust banner
  async closeOneTrustBanner() {
    try {
      const acceptButton = await this.page.waitForSelector('#onetrust-accept-btn-handler', {
        timeout: 2000,
        state: 'visible',
      });

      if (acceptButton) await acceptButton.click();
    } catch (error) {
      'Button not visible';
    }
  }
}
