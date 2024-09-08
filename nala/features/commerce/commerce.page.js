export default class CommercePage {
  constructor(page) {
    this.page = page;

    this.price = page.locator('//span[@data-template="price"]');
    this.priceOptical = page.locator('//span[@data-template="optical"]');
    this.priceStrikethrough = page.locator('//span[@data-template="strikethrough"]');
    this.buyNowCta = page.locator('//a[contains(@daa-ll, "Buy now")]');
    this.freeTrialCta = page.locator('//a[contains(@daa-ll, "Free trial")]');
    this.merchCard = page.locator('merch-card');
    // universal nav login account type
    this.loginType = page.locator('div.feds-profile > div > div > ul > li:nth-child(5) > button');
    // entitlement block locators
    this.ccAllAppsCTA = page.locator('//*[contains(@daa-ll,"CC All Apps")]');
    this.photoshopBuyCTA = page.locator('//*[contains(@daa-ll,"Buy now-1--Photoshop")]');
    this.photoshopFreeCTA = page.locator('//*[contains(@daa-ll,"Free trial-2--Photoshop")]');
    this.switchModalIframe = page.locator('#switch-modal > div > iframe');
  }
}
