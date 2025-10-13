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
    // volume discount locators
    this.volumeDiscountWithoutQuantity = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"]');
    this.volumeDiscountWithoutQuantityInteger = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price:not(.price-annual) > span.price-integer');
    this.volumeDiscountWithoutQuantityAnnualInteger = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price.price-annual > span.price-integer');
    this.volumeDiscountWithoutQuantityDecimals = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price:not(.price-annual) > span.price-decimals');
    this.volumeDiscountWithoutQuantityAnnualDecimals = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price.price-annual > span.price-decimals');
    this.volumeDiscountWithoutQuantityStrikethrough = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price-strikethrough');
    this.volumeDiscountWithoutQuantityAlternative = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price-alternative');
    this.volumeDiscountWithoutQuantityAnnual = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="1"] > span.price-annual');

    this.volumeDiscountWithQuantity = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"]');
    this.volumeDiscountWithQuantityStrikeThroughInteger = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"] span.price-strikethrough > span.price-integer');
    this.volumeDiscountWithQuantityStrikeThroughDecimals = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"] span.price-strikethrough > span.price-decimals');
    this.volumeDiscountWithQuantityAlternativeInteger = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"] span.price-alternative > span.price-integer');
    this.volumeDiscountWithQuantityAlternativeDecimals = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"] span.price-alternative > span.price-decimals');
    this.volumeDiscountWithQuantityAnnualInteger = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"] span.price-annual > span.price-integer');
    this.volumeDiscountWithQuantityAnnualDecimals = page.locator('span[is="inline-price"][data-promotion-code="TDARCH_3LIC_7PT5"][data-quantity="3"] span.price-annual > span.price-decimals');

    this.strikethroughPrice = page.locator('span[is="inline-price"][data-wcs-osi="msg4m1782IVpeTz8mHd_P_0GG3OSG7XS932oW-7EGuM"] span.price-strikethrough');
    this.strikethroughPriceInteger = page.locator('span[is="inline-price"][data-wcs-osi="msg4m1782IVpeTz8mHd_P_0GG3OSG7XS932oW-7EGuM"] span.price-strikethrough > span.price-integer');
    this.strikethroughPriceDecimals = page.locator('span[is="inline-price"][data-wcs-osi="msg4m1782IVpeTz8mHd_P_0GG3OSG7XS932oW-7EGuM"] span.price-strikethrough > span.price-decimals');
    this.alternativePrice = page.locator('span[is="inline-price"][data-promotion-code="CMFFPO25AEA"] span.price-alternative');
    this.alternativePriceInteger = page.locator('span[is="inline-price"][data-promotion-code="CMFFPO25AEA"] span.price-alternative > span.price-integer');
    this.alternativePriceDecimals = page.locator('span[is="inline-price"][data-promotion-code="CMFFPO25AEA"] span.price-alternative > span.price-decimals');
  }
}
