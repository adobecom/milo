export default class HowTo {
  constructor(page, nth = 0) {
    this.page = page;
    // how-to  locators
    this.howTo = page.locator('.how-to').nth(nth);
    this.foreground = this.howTo.locator('.foreground');
    this.howToLarge = this.page.locator('.how-to.large-image').nth(nth);
    this.howToSeo = this.page.locator('.how-to.seo').nth(nth);
    this.heading = this.howTo.locator('.how-to-heading');
    this.headingL = this.howTo.locator('.how-to-heading .heading-l');
    this.image = this.howTo.locator('.how-to-media');
    this.list = this.howTo.locator('li');
    this.largeImage = page.locator('.how-to-media img');

    // howto contents css
    this.cssProperties = {
      '.how-to': {
        'font-size': '20px',
        'line-height': '30px',
      },
      '.how-to .foreground': {
        padding: '80px 0px',
        'max-width': /%$/,
        display: 'grid',
      },
      'how-to-media': {
        'align-self': 'center',
        'justify-self': 'center',
        'min-height': '100%',
      },
      'how-to-heading': {
        'grid-area': 'heading',
        'row-gap': '16px',
        display: 'grid',
      },
      'heading-l': {
        'font-size': '28px',
        'line-height': '35px',
      },
      'how-to-large': {
        padding: '80px 24px',
        'max-width': '700px',
      },
      'how-to-large-image': {
        display: 'block',
        'grid-template-areas': 'none',
      },
      'how-to-seo': {
        display: 'block',
        'grid-template-areas': 'none',
      },
    };

    // howto contents attributes
    this.attProperties = {
      'how-to-large-image': {
        width: '600',
        height: '300',
      },
    };
  }
}
