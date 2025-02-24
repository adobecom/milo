export default class Marquee {
  constructor(page, nth = 0) {
    this.page = page;
    // marquee types locators
    this.marquee = page.locator('.marquee').nth(nth);
    this.marqueeLight = page.locator('.marquee.light');
    this.marqueeLightXxlButton = page.locator('.marquee.light.xxl-button');
    this.marqueeSmall = page.locator('.marquee.small');
    this.marqueeSmallLight = page.locator('.marquee.small.light');
    this.marqueeDark = page.locator('.marquee.dark');
    this.marqueeSmallDark = page.locator('.marquee.small.dark');
    this.marqueeLarge = page.locator('.marquee.large');
    this.marqueeLargeLight = page.locator('.marquee.large.light');
    this.marqueeLargeDark = page.locator('.marquee.large.dark');
    this.marqueeLargeStandardDark = page.locator('.marquee.large.standard.dark');
    this.marqueeLargeCompactDark = page.locator('.marquee.large.compact.dark');
    this.marqueeQuiet = page.locator('.marquee.quiet');
    this.marqueeInline = page.locator('.marquee');
    this.marqueeSplitSmall = page.locator('.marquee.split.small');
    this.marqueeSplitLarge = page.locator('.marquee.split.large');
    this.marqueeSplitLargeLight = page.locator('.marquee.split.one-third.large.light');
    this.marqueeSplitOneThirdLargeLight = page.locator('.marquee.split.one-third.large.light');
    this.marqueeSplitOneThird = page.locator('.marquee.split.one-third');
    this.marqueeSplitOneThirdSmallLight = page.locator('.marquee.split.one-third.small.light');

    // marque section(s) locators
    // marquee details
    this.detailM = this.marquee.locator('.detail-m');
    this.detailL = this.marquee.locator('.detail-l');
    this.brandImage = this.marquee.locator('.detail-m');

    // marquee headings
    this.headingXL = this.marquee.locator('.heading-xl').nth(0);
    this.headingXXL = this.marquee.locator('.heading-xxl');

    // marquee body area
    this.bodyM = this.marquee.locator('.body-m');
    this.bodyXL = this.marquee.locator('.body-xl').nth(0);

    // marquee actions area
    this.actionArea = this.marquee.locator('.action-area');
    this.outlineButton = this.marquee.locator('.con-button.outline');
    this.outlineButtonS = this.marquee.locator('.con-button.outline.button-s');
    this.outlineButtonM = this.marquee.locator('.con-button.outline.button-m');
    this.outlineButtonL = this.marquee.locator('.con-button.outline.button-l');
    this.outlineButtonXL = this.marquee.locator('.con-button.outline.button-xl');

    this.blueButton = this.marquee.locator('.con-button.blue');
    this.blueButtonL = this.marquee.locator('.con-button.blue.button-l');
    this.blueButtonXL = this.marquee.locator('.con-button.blue.button-xl');
    this.filledBlueButton = this.marquee.locator('.con-button.blue');
    this.filledButtonM = this.marquee.locator('.con-button.blue.button-s');
    this.filledButtonM = this.marquee.locator('.con-button.blue.button-m');
    this.filledButtonL = this.marquee.locator('.con-button.blue.button-l');
    this.filledButtonXL = this.marquee.locator('.con-button.blue.button-xl');

    this.actionLink1 = this.marquee.locator('a').nth(0);
    this.actionLink2 = this.marquee.locator('a').nth(1);
    this.actionLink3 = this.marquee.locator('a').nth(2);

    this.supplementalText = this.marquee.locator('.supplemental-text');
    // background images
    this.background = this.marquee.locator('.background');
    this.backgroundImage = this.marquee.locator('div.background img');
    this.backgroundImageMobile = this.marquee.locator('div .background .mobile-only img');
    this.backgroundImageTablet = this.marquee.locator('div.background .tablet-only img');
    this.backgroundImageDesktop = this.marquee.locator('div.background .desktop-only img');

    // background video
    this.backgroundVideo = this.marquee.locator('div video');
    this.backgroundVideoDesktop = this.marquee.locator('div .desktop-only video');

    // foreground images
    this.foreground = this.marquee.locator('.foreground');
    this.foregroundImage = this.marquee.locator('div.foreground img');
    this.iconImage = this.foreground.locator('.icon-area img');

    // media images
    this.mediaImage = this.marquee.locator('div.asset img');
    this.foregroundAssetImage = this.marquee.locator('div.asset img');

    // marquee attributes
    this.attributes = {
      'marquee.light': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '1369',
          height: '685',
        },
      },
      'marquee.small': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '375',
        },
      },
      'marquee.small.light': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '375',
        },
      },
      'marquee.large': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '375',
        },
      },
      'marquee.large.light': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '375',
          style: 'object-position: left center;',
        },
      },
      'marquee.split.small': { style: /^background:\s+rgb\(0, 0, 0\)$/ },
      'marquee.split.large': {
        iconImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '49',
          height: '48',
        },
        mediaImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '720',
          height: '520',
        },
      },
      'marquee.split.one-third-large': {
        style: /^background:\s+rgb\(249, 249, 249\)$/,
        iconImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '200',
          height: '80',
        },
        mediaImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '720',
          height: '520',
        },
      },
      'marquee.split.one-third': {
        style: /^background:\s+rgb\(0, 0, 0\)$/,
        iconImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '65',
          height: '64',
        },
        mediaImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '720',
          height: '520',
        },
      },
      backgroundMobileImg: {
        loading: 'eager',
        fetchpriority: 'high',
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
    };
  }
}
