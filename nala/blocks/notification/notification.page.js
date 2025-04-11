export default class Notification {
  constructor(page, nth = 0) {
    this.page = page;
    // notification  locators
    this.notification = this.page.locator('.notification').nth(nth);
    this.headingM = this.notification.locator('.heading-m');
    this.detailM = this.notification.locator('.detail-m');
    this.bodyM = this.notification.locator('.body-m').nth(nth);

    // actions area
    this.actionArea = this.notification.locator('.action-area');
    this.outlineButton = this.notification.locator('.con-button.outline');
    this.outlineButtonS = this.notification.locator('.con-button.outline.button-s');
    this.blueButton = this.notification.locator('.con-button.blue');
    this.blueButtonL = this.notification.locator('.con-button.blue.button-l');
    this.blueButtonXL = this.notification.locator('.con-button.blue.button-xl');

    // background images
    this.background = this.notification.locator('.background');
    this.backgroundImage = this.notification.locator('div.background img');

    // foreground images
    this.foreground = this.notification.locator('.foreground');
    this.foregroundImage = this.notification.locator('div.foreground img');
    this.iconImage = this.foreground.locator('.icon-area img');
  }
}
