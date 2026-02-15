export default class EditorialCardBlock {
  constructor(page) {
    this.page = page;

    this.EditorialCard = this.page.locator('.editorial-card');

    // editorial card Lockup
    this.cardLockup = this.EditorialCard.locator('.lockup-area');
    this.cardLockupImg = this.EditorialCard.locator('.lockup-area img');
    this.cardLockupLabel = this.EditorialCard.locator('.lockup-label');
    this.cardLockupDevice = this.EditorialCard.locator('.device');

    // editorial card Image
    this.cardMedia = this.EditorialCard.locator('.media-area img');
    this.mediaMobile = this.EditorialCard.locator('.mobile-only img');
    this.mediaTablet = this.EditorialCard.locator('.tablet-only img');
    this.mediaDesktop = this.EditorialCard.locator('.desktop-only img');
    this.mediaBtn = this.EditorialCard.locator('.modal.consonant-play-btn');

    // editorial card details
    this.detailM = this.EditorialCard.locator('.detail-m');

    // editorial card headings
    this.headingXS = this.EditorialCard.locator('.heading-xs');
    this.headingS = this.EditorialCard.locator('.heading-s');
    this.headingM = this.EditorialCard.locator('.heading-m');
    this.headingL = this.EditorialCard.locator('.heading-l');

    // editorial card body
    this.bodyXS = this.EditorialCard.locator('p.body-xs');
    this.bodyS = this.EditorialCard.locator('p.body-s');
    this.bodyM = this.EditorialCard.locator('p.body-m');
    this.bodyMslockup = this.EditorialCard.locator('div.body-m>p.body-m>>nth=1');
    this.bodyL = this.EditorialCard.locator('p.body-l');

    // editorial card link
    this.link = this.EditorialCard.locator('p.body-m a');
    this.linkSlockup = this.EditorialCard.locator('div.body-m>p.body-m>>nth=1>>a');

    // editorial card action area
    this.divider = this.EditorialCard.locator('.card-footer.has-divider');
    this.blueButton = this.EditorialCard.locator('.con-button.blue');
    this.linkBtn = this.EditorialCard.locator('.action-area a>>nth=1');

    // attributes
    this.attributes = {
      'editorialCard.media-area.mobile': {
        cardImg1: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '288',
          height: '177',
        },
        cardImg2: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '480',
          height: '296',
        },
      },
      'editorialCard.media-area.tablet': {
        cardImg1: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '288',
          height: '177',
        },
        cardImg2: {
          loading: 'lazy',
          width: '480',
          height: '296',
        },
      },
      'editorialCard.media-area.desktop': {
        cardImg1: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '288',
          height: '177',
        },
        cardImg2: {
          loading: 'lazy',
          width: '480',
          height: '296',
        },
      },
    };
  }
}
