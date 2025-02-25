export default class AdobeHomePage {
  constructor(page) {
    this.page = page;

    this.widgetCardTriple = page.locator('merch-card[variant="ah-try-buy-widget"][size="triple"]');
    this.widgetCardDouble = page.locator('merch-card[variant="ah-try-buy-widget"][size="double"]');
    this.widgetCardSingle = page.locator('merch-card[variant="ah-try-buy-widget"][size="single"]');

    this.title = page.locator('[slot="heading-xxxs"]');
    this.description = page.locator('[slot="body-xxs"]');
    this.price = page.locator('[slot="price"]');
    this.cta = page.locator('[slot="cta"] sp-button');
    this.image = page.locator('div[slot="image"] img');

    this.widgetCssProp = {
      base: {
        light: {
          'background-color': 'rgb(248, 248, 248)',
          'border-color': 'rgb(230, 230, 230)',
          '--merch-card-ah-try-buy-widget-text-color': 'rgb(19, 19, 19)',
        },
        dark: {
          'background-color': 'rgb(27, 27, 27)',
          'border-color': 'rgb(57, 57, 57)',
          '--merch-card-ah-try-buy-widget-text-color': 'rgb(242, 242, 242)',
        },
      },
      sizes: {
        single: {
          'min-width': '132px',
          'max-width': '132px',
          height: '206px',
        },
        double: {
          'min-width': '214px',
          'max-width': '214px',
          height: '206px',
        },
        triple: {
          'min-width': '460px',
          'max-width': '460px',
          height: '230px',
        },
      },
      typography: {
        title: {
          'font-size': '16px',
          'line-height': '20px',
          'font-weight': '700',
          color: 'var(--merch-card-ah-try-buy-widget-text-color)',
        },
        price: {
          'font-size': '14px',
          'line-height': '17px',
          'font-style': 'italic',
          color: 'var(--merch-card-ah-try-buy-widget-text-color)',
        },
      },
      badge: {
        'background-color': 'rgb(248, 217, 4)',
        color: 'rgb(34, 34, 34)',
        'font-size': '12px',
        'border-radius': '4px',
      },
    };
  }

  async getCard(id, cardType) {
    const cardVariant = {
      'ah-try-buy-widget-single': this.widgetCardTriple,
      'ah-try-buy-widget-double': this.widgetCardDouble,
      'ah-try-buy-widget-triple': this.widgetCardSingle,
    };

    const card = cardVariant[cardType];
    if (!card) {
      throw new Error(`Invalid card type: ${cardType}`);
    }

    return card.filter({ has: this.page.locator(`aem-fragment[fragment="${id}"]`) });
  }

  // General method for retrieving the locator for each card's field
  async getCardField(id, cardType, fieldName) {
    const card = await this.getCard(id, cardType);

    const fields = {
      title: {
        'ah-try-buy-widget-single': this.description,
        'ah-try-buy-widget-double': this.description,
        'ah-try-buy-widget-triple': this.description,
      },
      icon: this.cardIcon,
      description: {
        'ah-try-buy-widget-single': this.description,
        'ah-try-buy-widget-double': this.description,
        'ah-try-buy-widget-triple': this.description,
      },
      legalLink: {
        'ah-try-buy-widget-single': this.legalLink,
        'ah-try-buy-widget-double': this.legalLink,
        'ah-try-buy-widget-triple': this.legalLink,
      },
      uptLink: {
        'ah-try-buy-widget-single': this.uptLink,
        'ah-try-buy-widget-double': this.uptLink,
        'ah-try-buy-widget-triple': this.uptLink,
      },
      price: {
        'ah-try-buy-widget-single': this.price,
        'ah-try-buy-widget-double': this.price,
        'ah-try-buy-widget-triple': this.price,
      },
      cta: {
        'ah-try-buy-widget-single': this.cta,
        'ah-try-buy-widget-double': this.cta,
        'ah-try-buy-widget-triple': this.cta,
      },
      ctaLink: {
        'ah-try-buy-widget-single': this.ctaLink,
        'ah-try-buy-widget-double': this.ctaLink,
        'ah-try-buy-widget-triple': this.ctaLink,
      },
      image: this.widgetCardSingle,
    };

    const fieldLocator = fields[fieldName];
    if (!fieldLocator) {
      throw new Error(`Invalid field name: ${fieldName}`);
    }

    if (fieldLocator[cardType]) {
      return card.locator(fieldLocator[cardType]);
    }

    return card.locator(fieldLocator);
  }

  async getCardTitle(id, cardType) {
    return this.getCardField(id, cardType, 'title');
  }

  async getCardIcon(id, cardType) {
    return this.getCardField(id, cardType, 'icon');
  }

  async getCardDescription(id, cardType) {
    return this.getCardField(id, cardType, 'description');
  }

  async getCardLegalLink(id, cardType) {
    return this.getCardField(id, cardType, 'legalLink');
  }

  async getCardUptLink(id, cardType) {
    return this.getCardField(id, cardType, 'uptLink');
  }

  async getCardPrice(id, cardType) {
    return this.getCardField(id, cardType, 'price');
  }

  async getCardCTA(id, cardType) {
    return this.getCardField(id, cardType, 'cta');
  }

  async getCardCTALink(id, cardType) {
    return this.getCardField(id, cardType, 'ctaLink');
  }

  async getCardImage(id, cardType) {
    if (cardType === 'ah-try-buy-widget-single') {
      throw new Error('Invalid card type. "ah-try-buy-widget-single" card does not have an image slot.');
    }
    return this.getCardField(id, cardType, 'image');
  }
}
