import { expect } from 'playwright/test';

export default class Brick {
  constructor(page) {
    this.page = page;

    this.brick = page.locator('.brick.dark.split.row.media-right');
    this.brick = page.locator('.brick');
    this.brickButtonFill = page.locator(
      '.brick.rounded-corners.button-fill.dark.grid-span-4',
    );
    this.brickClickable = page.locator(
      '.brick.dark.click.rounded-corners.grid-span-4',
    );
    this.brickDefaultHeading = page.locator(
      '.brick.light.rounded-corners.split.row.media-right.grid-full-width',
    );
    this.brickHeadingS = page.locator(
      '.brick.light.rounded-corners.grid-span-4',
    );
    this.brickHeadingM = page.locator(
      '.brick.dark.rounded-corners.grid-span-4',
    );
    this.brickHeadingL = page.locator(
      '.brick.click.rounded-corners.dark.grid-span-4',
    );
    this.brickHeadingXXL = page.locator('.brick.rounded-corners.center.light');
    this.brickSplit = page.locator('.brick.split');
    this.brickSupplemental = page.locator(
      '.brick.rounded-corners.dark.grid-span-4',
    );
    this.brickImageCenter = page.locator('.brick.rounded-corners.button-fill');
    this.brickImageRight = page.locator('.brick.dark.button-fill');
    this.brickImageLeft = page.locator('.brick.rounded-corners');
    this.brickText = page.locator('.brick-text');
    this.brickGrid = page.locator('.section.masonry-layout');

    // brick corners
    this.brickRoundedCornersM = this.page.locator(
      '.brick.light.m-rounded-corners.grid-span-4',
    );
    this.brickSquareCorners = this.page.locator('.brick.light.grid-span-4');

    // brick icon area
    this.iconAreaImg = page.locator('.icon-area img');
    this.iconAreaText = page.locator('.icon-area text');

    // brick headings
    this.headingS = this.brick.locator('.heading-s');
    this.headingM = this.brick.locator('.heading-m');
    this.headingL = this.brick.locator('.heading-l');
    this.headingXL = this.brick.locator('.heading-xl');
    this.headingXXL = this.brick.locator('.heading-xxl');

    // brick action area
    this.actionArea = this.brick.locator('.action-area');
    this.outlineButtonL = this.brick.locator('.con-button.outline.button-l');
    this.whiteButtonL = this.brick.locator('.con-button.button-l.fill');
    this.blueButtonL = this.brick.locator('.con-button.blue.button-l');

    // foreground
    this.brickBodyM = this.brick.locator('.body-m');
    this.brickBodyXS = this.brick.locator('.body-xs.supplemental-text');
    this.iconArea = this.brick.locator('.icon-area');
    this.iconImage = this.brick.locator('.icon-area img');
    this.splitForegroundImage = this.brick.locator(
      '.foreground .brick-media img',
    );
    this.brickTextDetailL = page.locator('.detail-l');

    // background images
    this.backgroundImage = this.brick.locator('div.background img');
    this.splitBackgroundImage = this.brick.locator(
      '.background .tablet-only.desktop-only img',
    );
    this.backgroundMobile = this.brick.locator('.background .mobile-only img');
    this.backgroundTablet = this.brick.locator('.background .tablet-only img');
    this.backgroundDesktop = this.brick.locator(
      '.background .desktop-only img',
    );

    this.brickMediaImg = this.brick.locator('.brick-media img');
    this.brickMedia = this.brick.locator('.brick-media');
    this.videoContainer = this.brick.locator('.video-container');
    this.pausePlayWrapper = this.brick.locator('.pause-play-wrapper');

    // section
    this.sectionMetadata = page.locator('.section-metadata');
    this.sectionXXLspacing = this.page.locator('.section.xxl-spacing');
    this.sectionBackgroundImage = this.page.locator(
      'div.section picture.section-background img',
    );
    this.heading = this.page.locator('.heading-xl');
    this.bodyM = this.page.locator('.heading-xl + .body-m');

    // attributes
    this.attributes = {
      'brick.background.mobile': {
        backgroundImg: {
          width: '750',
          height: '375',
          style: 'object-fit: cover; object-position: right top;',
        },
      },
      'brick.background.tablet': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '375',
          style: 'object-fit: cover; object-position: right top;',
        },
      },
      'brick.background.desktop': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '375',
          style: 'object-fit: cover; object-position: right top;',
        },
      },
      'brick.icon.area': {
        iconImg: {
          loading: 'lazy',
          width: '154',
          height: '150',
        },
      },
      'brick.fill.icon': {
        iconImg: {
          loading: 'eager',
          width: '154',
          height: '150',
          fetchpriority: 'high',
        },
      },
      'brick.media': {
        img: {
          loading: 'lazy',
          width: '600',
          height: '300',
        },
      },

      'brick.button-fill': { iconImg: { loading: 'lazy' } },
      'brick.video-container': {
        playsinline: '',
        autoplay: '',
        muted: '',
      },
      'brick.headingS': { blockStyle: { borderRadius: '16px' } },
      'brick.headingM': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '1125',
          style: 'object-position: center bottom;',
        },
        blockStyle: { borderRadius: '16px' },
      },
      'brick.headingL': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '450',
          style: 'object-fit: contain; object-position: center bottom;',
        },
        blockStyle: { borderRadius: '16px' },
      },
      'brick.headingXXL': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '240',
          style: 'object-fit: cover; object-position: center center;',
        },
        blockStyle: { borderRadius: '16px' },
      },
      'section.headingS': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '240',
        },
      },
      'brick.M.rounded.corners': { blockStyle: { borderRadius: '8px' } },
      'brick.square.corners': {
        blockStyle: { borderRadius: '0px' },
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '500',
          height: '160',
        },
      },
      'brick.split.background': {
        blockStyle: { borderRadius: '16px' },
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '364',
          style: 'object-position: right center;',
        },
      },
      'brick.split.foreground': {
        blockStyle: { borderRadius: '16px' },
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '727',
        },
      },
      'brick.supplemental': {
        blockStyle: { borderRadius: '16px' },
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '450',
          style: 'object-fit: contain; object-position: right bottom;',
        },
      },
      'brick.center.background.mobile': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '608',
          height: '900',
          style: 'object-fit: contain; object-position: center bottom;',
        },
      },
      'brick.center.background.tablet': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '780',
          style: 'object-fit: contain; object-position: center bottom;',
        },
      },
      'brick.center.background.desktop': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '780',
          style: 'object-fit: contain; object-position: center bottom;',
        },
      },
      'brick.right.background.mobile': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '750',
          height: '780',
          style: 'object-fit: contain; object-position: right bottom;',
        },
      },
      'brick.right.background.tablet': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '780',
          style: 'object-fit: contain; object-position: right bottom;',
        },
      },
      'brick.right.background.desktop': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '450',
          style: 'object-fit: contain; object-position: right bottom;',
        },
      },
      'brick.left.background.mobile': {
        backgroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '608',
          height: '900',
          style: 'object-fit: contain; object-position: left bottom;',
        },
      },
      'brick.left.background.tablet': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '780',
          style: 'object-fit: contain; object-position: left bottom;',
        },
      },
      'brick.left.background.desktop': {
        backgroundImg: {
          loading: 'lazy',
          width: '750',
          height: '780',
          style: 'object-fit: contain; object-position: left bottom;',
        },
      },
    };
  }

  // close georouting wrapper
  async closeGeoroutingWrapper() {
    try {
      const closeButton = await this.page.waitForSelector('.dialog-close', {
        timeout: 2000,
        state: 'visible',
      });

      if (closeButton) {
        await closeButton.click();
      }
    } catch (error) {
      'Button not visible';
    }
  }

  // return all bricks
  async getAllBricks() {
    return this.brickGrid.locator('[daa-lh$="|brick"]');
  }

  // get a specific brick locator
  getBrick(i) {
    const brick = this.brick.nth(i);
    return {
      headingXL: brick.locator('.heading-xl'),
      brickBodyM: brick.locator('.body-m'),
      outlineButtonL: brick.locator('.con-button.outline.button-l'),
      blueButtonL: brick.locator('.con-button.blue.button-l'),
      iconImage: brick.locator('.icon-area img'),
      backgroundMobile: brick.locator('.background .mobile-only img'),
      backgroundTablet: brick.locator('.background .tablet-only img'),
      backgroundDesktop: brick.locator('.background .desktop-only img'),
      brickMediaImg: brick.locator('.brick-media img'),
    };
  }

  async getSectionMetadata() {
    return this.page.locator('.section-metadata');
  }

  async checkSectionMetadataTexts() {
    const texts = [
      'Full width',
      'Span 6, span 6',
      'Span 4, span 8',
      'Span 8, span 4',
      'Span 4, span 4, span 4',
    ];

    for (const text of texts) {
      await expect(this.sectionMetadata).toContainText(text);
    }
  }
}
