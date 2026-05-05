export const ATTR = {
  fullWidthParallax: 'base-card.full-width.parallaxImg',
  fullWidthIcon: 'base-card.full-width.iconImg',
  threeUpParallax: 'base-card.three-up.parallaxImg',
  threeUpIcon: 'base-card.three-up.iconImg',
};

export default class BaseCard {
  constructor(page) {
    this.page = page;

    this.mainBaseCards = page.locator('main .base-card');
    this.fullWidthBaseCard = page.locator('main .base-card.full-width').first();
    this.threeUpSection = page.locator('main .section.base-card-section.three-up');
    this.threeUpCards = this.threeUpSection.locator('.base-card');
    this.standaloneCtas = page.locator('main .base-card a.standalone-link.label');
    this.firstContainerSectionMetadata = page
      .locator('main .section.base-card-section.container.constrained .section-metadata')
      .first();
    this.threeUpSectionMetadata = page.locator(
      'main .section.base-card-section.three-up .section-metadata',
    );
    this.sectionFullWidth = page.locator('main .section.base-card-section.container.constrained').first();

    this.fullWidthForeground = this.fullWidthBaseCard.locator('.foreground').first();
    this.fullWidthBody = this.fullWidthForeground.locator('p.body-md:not(:has(a))').first();

    this.fullWidthMedia = this.fullWidthBaseCard.locator('.media').first();
    this.fullWidthParallaxPicture = this.fullWidthMedia.locator('picture.parallax-scale-down');
    this.fullWidthParallaxImg = this.fullWidthParallaxPicture.locator('img');
    this.fullWidthIconImg = this.fullWidthMedia.locator('picture.icon img');

    this.attributes = {
      baseCard: { dataBlockStatus: 'loaded' },
      cta: {
        href: 'https://business.adobe.com/',
        target: '_blank',
      },
      [ATTR.fullWidthParallax]: {
        loading: 'lazy',
        width: '720',
        height: '360',
      },
      [ATTR.fullWidthIcon]: { loading: 'lazy' },
      [ATTR.threeUpParallax]: {
        loading: 'lazy',
        width: '300',
        height: '133',
      },
      [ATTR.threeUpIcon]: { loading: 'lazy' },
    };
  }

  threeUpCardBody(nth) {
    return this.threeUpCards.nth(nth).locator('.foreground p.body-md:not(:has(a))').first();
  }

  threeUpCardParallaxImg(nth) {
    return this.threeUpCards.nth(nth).locator('.media picture.parallax-scale-down img');
  }

  threeUpCardIconImg(nth) {
    return this.threeUpCards.nth(nth).locator('.media picture.icon img');
  }
}
