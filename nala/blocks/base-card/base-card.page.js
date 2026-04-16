export const ATTR = {
  fullWidthMobileParallax: 'base-card.full-width.mobile.parallaxImg',
  fullWidthTabletParallax: 'base-card.full-width.tablet.parallaxImg',
  fullWidthDesktopParallax: 'base-card.full-width.desktop.parallaxImg',
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

    this.fullWidthMobileRow = this.fullWidthBaseCard.locator('[data-viewport="mobile"]');
    this.fullWidthTabletRow = this.fullWidthBaseCard.locator('[data-viewport="tablet"]');
    this.fullWidthDesktopRow = this.fullWidthBaseCard.locator('[data-viewport="desktop"]');

    this.fullWidthMobileForeground = this.fullWidthMobileRow.locator(
      '.foreground[data-valign="middle"]',
    );

    this.fullWidthBody = this.fullWidthMobileForeground.locator('p.body-md:not(:has(a))').first();

    this.fullWidthMobileMedia = this.fullWidthMobileRow.locator('.media');
    this.fullWidthMobileMediaParallaxPicture = this.fullWidthMobileMedia.locator(
      'picture.parallax-scale-down',
    );
    this.fullWidthMobileParallaxImg = this.fullWidthMobileMediaParallaxPicture.locator('img');
    this.fullWidthMobileMediaIconImg = this.fullWidthMobileMedia.locator('picture.icon img');

    this.fullWidthTabletMedia = this.fullWidthTabletRow.locator('.media');
    this.fullWidthTabletParallaxImg = this.fullWidthTabletMedia.locator(
      'picture.parallax-scale-down img',
    );
    this.fullWidthTabletMediaIconImg = this.fullWidthTabletMedia.locator('picture.icon img');

    this.fullWidthDesktopMedia = this.fullWidthDesktopRow.locator('.media');
    this.fullWidthDesktopParallaxImg = this.fullWidthDesktopMedia.locator(
      'picture.parallax-scale-down img',
    );
    this.fullWidthDesktopMediaIconImg = this.fullWidthDesktopMedia.locator('picture.icon img');

    this.attributes = {
      baseCard: { dataBlockStatus: 'loaded' },
      cta: {
        href: 'https://business.adobe.com/',
        target: '_blank',
      },
      [ATTR.fullWidthMobileParallax]: {
        loading: 'eager',
        fetchpriority: 'high',
        width: '720',
        height: '360',
      },
      [ATTR.fullWidthTabletParallax]: {
        loading: 'lazy',
        width: '720',
        height: '360',
      },
      [ATTR.fullWidthDesktopParallax]: {
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
