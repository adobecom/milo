export default class Media {
  constructor(page, nth = 0) {
    this.page = page;
    // media types
    this.media = page.locator('.media').nth(nth);
    this.mediaSmall = page.locator('.media.small');
    this.mediaLargeDark = page.locator('.media.large');

    // media details
    this.detailM = this.media.locator('.detail-m');
    this.detailL = this.media.locator('.detail-l');

    // media headings
    this.headingXS = this.media.locator('.heading-xs');
    this.headingM = this.media.locator('.heading-m');
    this.headingXL = this.media.locator('.heading-xl');

    // media body area
    this.bodyS = this.media.locator('.body-s').nth(0);
    this.bodyM = this.media.locator('.body-m').nth(0);
    this.bodyXL = this.media.locator('.body-xl').nth(0);
    this.bodyTextM = this.media.locator('p:nth-of-type(2)');
    this.bodyTextS = this.media.locator('p:nth-of-type(2)');

    // media actions area
    this.actionArea = this.media.locator('.action-area');
    this.outlineButton = this.media.locator('.con-button.outline');
    this.blueButton = this.media.locator('.con-button.blue');

    // media image
    this.mediaImage = this.media.locator('.image');
    this.mediaImg = this.mediaImage.locator('img');

    // background video
    this.backgroundVideo = this.media.locator('div video');
    this.backgroundVideoDesktop = this.media.locator('div .desktop-only video');

    // media attributes
    this.attributes = {
      'media.small': {
        image: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '400',
          height: '300',
        },
      },
      'media.large': {
        image: {
          loading: 'lazy',
          width: '700',
          height: '525',
        },
      },
      'backgroundVideo.inline': {
        playsinline: '',
        autoplay: '',
        loop: '',
        muted: '',
      },
      'backgroundVideo.loopOnce': {
        playsinline: '',
        autoplay: '',
        muted: '',
      },
      'backgroundVideo.controls': {
        controls: '',
        autoplay: '',
        loop: '',
        muted: '',
      },
      analytics: {
        'media.daa-lh': { 'daa-lh': /b[1-9]|media|default|default/ },
        'section.daa-lh': { 'daa-lh': /s[1-9]/ },
        'content.daa-lh': { 'daa-lh': /b[1-9]|content|default|default/ },
      },
    };
  }
}
