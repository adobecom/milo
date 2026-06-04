export default class Quote {
  constructor(page, nth = 0) {
    this.page = page;
    // quote  locators
    this.quote = this.page.locator('.quote').nth(nth);
    this.quoteImage = this.quote.locator('.quote-image');
    this.quoteCopy = this.quote.locator('p.quote-copy');
    this.quoteFigCaption = this.quote.locator('p.figcaption');
    this.quoteFigCaptionCite = this.quote.locator('cite p');
    this.sectionDark = this.page.locator('.section.dark');

    // quote blocks css
    this.cssProperties = {
      quote: {
        'text-align': 'center',
        margin: /^0px.*/,
      },

      'quote-contained': {
        'text-align': 'center',
        margin: /^0px.*/,
      },

      'quote-align-right': {
        'text-align': 'right',
        margin: /^0px.*/,
      },

      'quote-copy': {
        'font-size': '24px',
        'font-weight': 'bold',
      },

      'quote-inline-figure': {
        display: 'flex',
        'align-content': 'center',
        flex: '1 0 40%',
        margin: '0px',
        'justify-content': 'center',
      },

      'quote-inline-image': {
        height: '200px',
        'max-height': '200px',
      },

      figcaption: {
        'font-size': '16px',
        'font-weight': 'bold',
      },
    };

    // quote blocks attributes
    this.attProperties = {
      quote: { class: 'quote con-block' },
      'quote-contained': { class: 'quote contained con-block' },
      'quote-inline': { class: 'quote inline contained con-block' },
      'quote-borders': { class: 'quote borders contained con-block' },
      'quote-align-right': { class: 'quote contained align-right con-block' },
      'quote-xl-spacing': { class: 'quote contained xl-spacing con-block' },
      'section-dark': { style: 'background: rgb(102, 102, 102);' },
    };
  }
}
