export default class MasCCDPage {
  constructor(page) {
    this.page = page;

    this.price = page.locator('span[data-template="price"]');
    this.priceStrikethrough = page.locator('span[data-template="strikethrough"]');
    this.merchCard = page.locator('merch-card');
    this.suggestedCard = page.locator('merch-card[variant="ccd-suggested"]');
    this.suggestedCardTitle = this.page.locator('h3[slot="heading-xs"]');
    this.suggestedCardIcon = page.locator('merch-icon');
    this.suggestedCardEyebrow = page.locator('h4[slot="detail-s"]');
    this.suggestedCardDescription = page.locator('div[slot="body-xs"] p').first();
    this.suggestedCardLegalLink = page.locator('div[slot="body-xs"] p > a');
    this.suggestedCardPrice = page.locator('p[slot="price"]');
    this.suggestedCardCTA = page.locator('div[slot="cta"] a[is="checkout-link"]');
    this.sliceCard = page.locator('merch-card[variant="ccd-slice"]');
    this.sliceCardWide = page.locator('merch-card[variant="ccd-slice"][size="wide"]');

    // ASIDE PROPS:
    this.suggestedCssProp = {
      light: {
        'background-color': 'rgb(248, 248, 248)',
        'border-bottom-color': 'rgb(230, 230, 230)',
        'border-left-color': 'rgb(230, 230, 230)',
        'border-right-color': 'rgb(230, 230, 230)',
        'border-top-color': 'rgb(230, 230, 230)',
      },
      dark: {
        'background-color': 'rgb(34, 34, 34)',
        'border-bottom-color': 'rgb(70, 70, 70)',
        'border-left-color': 'rgb(70, 70, 70)',
        'border-right-color': 'rgb(70, 70, 70)',
        'border-top-color': 'rgb(70, 70, 70)',
      },
      icon: {
        width: '40px',
        height: '40px',
      },
      title: {
        light: {
          color: 'rgb(34, 34, 34)',
          'font-size': '16px',
          'font-weight': '700',
        },
        dark: {
          color: 'rgb(248, 248, 248)',
          'font-size': '16px',
          'font-weight': '700',
        },
      },
      eyebrow: {
        light: {
          color: 'rgb(109, 109, 109)',
          'font-size': '11px',
          'font-weight': '700',
        },
        dark: {
          color: 'rgb(248, 248, 248)',
          'font-size': '11px',
          'font-weight': '700',
        },
      },
      description: {
        light: {
          color: 'rgb(70, 70, 70)',
          'font-size': '14px',
          'font-weight': '400',
        },
        dark: {
          color: 'rgb(248, 248, 248)',
          'font-size': '14px',
          'font-weight': '400',
        },
      },
      legalLink: {
        color: 'rgb(20, 122, 243)',
        'font-size': '12px',
        'font-weight': '400',
      },
      price: {
        light: {
          color: 'rgb(34, 34, 34)',
          'font-size': '14px',
          'font-weight': '400',
        },
        dark: {
          color: 'rgb(248, 248, 248)',
          'font-size': '14px',
          'font-weight': '400',
        },
      },
      strikethroughPrice: {
        light: {
          color: 'rgb(109, 109, 109)',
          'font-size': '14px',
          'font-weight': '400',
          'text-decoration-line': 'line-through',
          'text-decoration-color': 'rgb(109, 109, 109)',
        },
        dark: {
          color: 'rgb(109, 109, 109)',
          'font-size': '14px',
          'font-weight': '400',
          'text-decoration-line': 'line-through',
          'text-decoration-color': 'rgb(109, 109, 109)',
        },
      },
      cta: {
        light: {
          color: 'rgb(70, 70, 70)',
          'font-size': '14px',
          'font-weight': '700',
        },
        dark: {
          color: 'rgb(230, 230, 230)',
          'font-size': '14px',
          'font-weight': '700',
        },
      },
    };
  }

  async getSuggestedCard(id) {
    return this.suggestedCard.filter({ has: this.page.locator(`aem-fragment[fragment="${id}"]`) });
  }

  async getSuggestedCardTitle(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardTitle);
  }

  async getSuggestedCardIcon(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardIcon);
  }

  async getSuggestedCardEyebrow(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardEyebrow);
  }

  async getSuggestedCardDescription(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardDescription);
  }

  async getSuggestedCardLegalLink(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardLegalLink);
  }

  async getSuggestedCardPrice(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardPrice);
  }

  async getSuggestedCardPriceStrikethrough(id) {
    const card = await this.getSuggestedCardPrice(id);
    return card.locator(this.priceStrikethrough);
  }

  async getSuggestedCardCTA(id) {
    const card = await this.getSuggestedCard(id);
    return card.locator(this.suggestedCardCTA);
  }
}
