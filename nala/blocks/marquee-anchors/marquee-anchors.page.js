export default class MarqueeAnchors {
  constructor(page, nth = 0) {
    this.page = page;

    // marquee anchor variants locators
    this.marqueeAnchors = page.locator('.marquee-anchors').nth(nth);
    this.marqueeAnchorsTransparent = page.locator('.marquee-anchors').nth(nth);

    // marquee details
    this.detailM = this.marqueeAnchors.locator('.detail-m');
    this.detailL = this.marqueeAnchors.locator('.detail-l');

    // marquee headings
    this.headingL = this.marqueeAnchors.locator('.heading-l').nth(0);

    // marquee body area
    this.bodyM = this.marqueeAnchors.locator('.body-m').nth(0);

    // marquee actions area
    this.actionArea = this.marqueeAnchors.locator('.action-area');
    this.outlineButton = this.marqueeAnchors.locator('.con-button.outline');
    this.blueButton = this.marqueeAnchors.locator('.con-button.blue');
    this.supplementalText = this.marqueeAnchors.locator('.supplemental-text');
    this.foregroundImage = this.marqueeAnchors.locator('.supplemental-text img');
    // marquee anchor link
    this.anchorHeader = this.marqueeAnchors.locator('.links-header');
    this.anchorFooter = this.marqueeAnchors.locator('.links-footer');

    this.anchorLinks = this.marqueeAnchors.locator('.anchor-link');
    this.anchorLink = {
      howTo: {
        link: this.anchorLinks.nth(0),
        linkHeader: this.anchorLinks.nth(0).locator('#anchor-how-to'),
        linkText: this.anchorLinks.nth(0).locator('#anchor-how-to p').nth(0),
        icon: this.anchorLinks.nth(0).locator('img.icon-milo'),
      },
      text: {
        link: this.anchorLinks.nth(1),
        linkHeader: this.anchorLinks.locator('#anchor-text'),
        linkText: this.anchorLinks.locator('#anchor-text p').nth(0),
        icon: this.anchorLinks.nth(1).locator('img.icon-milo'),
      },
      media: {
        link: this.anchorLinks.nth(2),
        linkHeader: this.anchorLinks.locator('#anchor-media'),
        linkText: this.anchorLinks.locator('#anchor-media p').nth(0),
        icon: this.anchorLinks.nth(2).locator('img.icon-milo'),
      },
      linkToAdobe: {
        link: this.anchorLinks.nth(3),
        linkHeader: this.anchorLinks.locator('h4#anchor-link-to-adobe'),
        linkText: this.anchorLinks.locator('#anchor-link-to-adobe p').nth(0),
        icon: this.anchorLinks.nth(3).locator('img.icon-milo'),
      },
    };
  }
}
