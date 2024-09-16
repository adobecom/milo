export default class OSTPage {
  constructor(page) {
    this.page = page;

    this.searchField = page.locator('//input[contains(@data-testid,"search")]');
    this.productList = page.locator('//span[contains(@class,"productName")]');
    this.planType = page.locator(
      '//button/span[contains(@class, "spectrum-Dropdown-label") and (.//ancestor::div/span[contains(text(),"plan type")])]',
    );
    this.offerType = page.locator(
      '//button/span[contains(@class, "spectrum-Dropdown-label") and (.//ancestor::div/span[contains(text(),"offer type")])]',
    );
    this.nextButton = page.locator('//button[contains(@data-testid, "nextButton")]/span');
    this.price = page.locator('//div[@data-type="price"]/span');
    this.priceOptical = page.locator('//div[contains(@data-type, "priceOptical")]/span');
    this.priceStrikethrough = page.locator('//div[contains(@data-type, "priceStrikethrough")]/span');
    this.termCheckbox = page.locator('//input[@value="displayRecurrence"]');
    this.unitCheckbox = page.locator('//input[@value="displayPerUnit"]');
    this.taxlabelCheckbox = page.locator('//input[@value="displayTax"]');
    this.taxInlcusivityCheckbox = page.locator('//input[@value="forceTaxExclusive"]');
    this.oldPrice = page.locator('//input[@value="displayOldPrice"]');
    this.priceUse = page.locator('button:near(h4:text("Price"))').first();
    this.priceOpticalUse = page.locator('button:near(:text("Optical price"))').first();
    this.priceStrikethroughUse = page.locator('button:near(:text("Strikethrough price"))').first();
    this.checkoutTab = page.locator('//div[@data-key="checkout"]');
    this.checkoutLink = page.locator('//a[@data-type="checkoutUrl"]');
    this.workflowMenu = page.locator('button:near(label:text("Workflow"))').first();
    this.promoField = page.locator('//input[contains(@class, "spectrum-Textfield-input")]');
    this.cancelPromo = page.locator('button:right-of(span:text("Promotion:"))').first();
  }
}
