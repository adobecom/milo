export default class ActionItem {
  constructor(page, nth = 0) {
    this.page = page;

    this.actionItem = this.page.locator('.action-item').nth(nth);
    this.small = this.page.locator('.action-item.small').nth(nth);
    this.medium = this.page.locator('.action-item.medium').nth(nth);
    this.large = this.page.locator('.action-item.large').nth(nth);
    this.center = this.page.locator('.action-item.center').nth(nth);
    this.rounded = this.page.locator('.action-item.rounded').nth(nth);
    this.actionItemFloat = this.page.locator('.action-item.float-button').nth(nth);
    this.floatButton = this.page.locator('.action-item.float-button > div > div> p > a');
    this.libraryContainerStart = this.page.locator('.library-container-start').nth(nth);
    this.libraryContainerEnd = this.page.locator('.library-container-end').nth(nth);
    this.actionScroller = this.page.locator('.action-scroller').nth(nth);
    this.scroller = this.page.locator('.scroller  ').nth(nth);
    this.scrollerActionItems = this.scroller.locator('.action-item');

    this.navigationPrevious = this.actionScroller.locator('.nav-grad.previous');
    this.navigationNext = this.actionScroller.locator('.nav-grad.next');
    this.nextButton = this.navigationNext.locator('.nav-button.next-button');
    this.previousButton = this.navigationPrevious.locator('.nav-button.previous-button');

    this.scrollerActionItems = this.scroller.locator('.action-item');

    this.mainImage = this.actionItem.locator('.main-image').nth(nth);
    this.mainImageDark = this.actionItem.locator('.main-image.dark').nth(nth);
    this.image = this.mainImage.locator('img').nth(0);
    this.bodyText = this.actionItem.locator('p').nth(1);
    this.bodyTextLink = this.actionItem.locator('a').nth(0);
    this.floatOutlineButton = this.mainImage.locator('a');
  }
}
