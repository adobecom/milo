export default class ReadingTimeBlock {
  constructor(page) {
    this.page = page;

    this.readingTime = this.page.locator('.reading-time.content');
    this.media = this.page.locator('.media');
    this.foregroundImage = this.page.locator('.container.foreground .media-row .image');
    this.image = this.page.locator('.media-row .image img');
    this.marquee = this.page.locator('.marquee.small.light');

    this.detailM = this.page.locator('.detail-m');
    this.headingXL = this.page.locator('.heading-xl');
    this.bodyM = this.page.locator('.body-m');
    this.outlineButtonL = this.page.locator('.con-button.outline.button-l');
    this.blueButtonL = this.page.locator('.con-button.blue.button-l');
    this.assetImage = this.page.locator('.asset.image img');

    this.attributes = {
      'foreground.image': {
        foregroundImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '400',
          height: '300',
        },
      },
      'asset.image': {
        assetImg: {
          loading: 'eager',
          fetchpriority: 'high',
          width: '600',
          height: '300',
        },
      },
    };
  }

  async getReadingText() {
    return this.readingTime.innerText();
  }

  async getContentText() {
    return this.page.locator('body').innerText();
  }
}
