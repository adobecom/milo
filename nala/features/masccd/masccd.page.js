export default class MasCCDPage {
  constructor(page) {
    this.page = page;

    this.price = page.locator('span[data-template="price"]');
    this.priceStrikethrough = page.locator('span[data-template="strikethrough"]');
    this.cardIcon = page.locator('merch-icon');
    this.cardBadge = page.locator('.ccd-slice-badge');
    // suggested cards
    this.suggestedCard = page.locator('merch-card[variant="ccd-suggested"]');
    this.suggestedCardTitle = this.page.locator('h3[slot="heading-xs"]');
    this.suggestedCardEyebrow = page.locator('h4[slot="detail-s"]');
    this.suggestedCardDescription = page.locator('div[slot="body-xs"] p').first();
    this.suggestedCardLegalLink = page.locator('div[slot="body-xs"] p > a');
    this.suggestedCardPrice = page.locator('p[slot="price"]');
    this.suggestedCardCTA = page.locator('div[slot="cta"] > sp-button');
    this.suggestedCardCTALink = page.locator('div[slot="cta"] a[is="checkout-link"]');
    // slice cards
    this.sliceCard = page.locator('merch-card[variant="ccd-slice"]');
    this.sliceCardWide = page.locator('merch-card[variant="ccd-slice"][size="wide"]');
    this.sliceCardImage = page.locator('div[slot="image"] img');
    this.sliceCardDescription = page.locator('div[slot="body-s"] p > strong').first();
    this.sliceCardLegalLink = page.locator('div[slot="body-s"] p > a');
    this.sliceCardCTA = page.locator('div[slot="footer"] > sp-button');
    this.sliceCardCTALink = page.locator('div[slot="footer"] a[is="checkout-link"]');

    // Suggested card properties:
    this.suggestedCssProp = {
      light: {
        'background-color': 'rgb(248, 248, 248)',
        'border-bottom-color': 'rgb(230, 230, 230)',
        'border-left-color': 'rgb(230, 230, 230)',
        'border-right-color': 'rgb(230, 230, 230)',
        'border-top-color': 'rgb(230, 230, 230)',
        'color-scheme': 'light',
        width: '305px',
        'min-height': '205px', // change to height when loading fonts is fixed
      },
      dark: {
        'background-color': 'rgb(34, 34, 34)',
        'border-bottom-color': 'rgb(70, 70, 70)',
        'border-left-color': 'rgb(70, 70, 70)',
        'border-right-color': 'rgb(70, 70, 70)',
        'border-top-color': 'rgb(70, 70, 70)',
        'color-scheme': 'dark',
        width: '305px',
        'min-height': '205px', // change to height when loading fonts is fixed
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
          // 'color': 'rgb(248, 248, 248)', // page not consistent with figma
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
          // 'color': 'rgb(248, 248, 248)', // page not consistent with figma
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
        color: 'rgb(20, 122, 243)', // dark mode not consistent with figma
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
          // 'color': 'rgb(248, 248, 248)',  // page not consistent with figma
          'font-size': '14px',
          'font-weight': '400',
        },
      },
      strikethroughPrice: {
        color: 'rgb(109, 109, 109)',
        'font-size': '14px',
        'font-weight': '400',
        'text-decoration-line': 'line-through',
        'text-decoration-color': 'rgb(109, 109, 109)',
      },
      cta: {
        light: {
          // 'color': 'rgb(70, 70, 70)', // page not consistent with figma
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
    // Slice card properties:
    this.sliceCssProp = {
      singleSize: {
        width: '322px',
        height: '154px',
      },
      doubleSize: {
        width: '600px',
        height: '154px',
      },
      light: {
        'background-color': 'rgb(248, 248, 248)',
        'border-bottom-color': 'rgb(230, 230, 230)',
        'border-left-color': 'rgb(230, 230, 230)',
        'border-right-color': 'rgb(230, 230, 230)',
        'border-top-color': 'rgb(230, 230, 230)',
        'color-scheme': 'light',
      },
      dark: {
        'background-color': 'rgb(34, 34, 34)',
        'border-bottom-color': 'rgb(70, 70, 70)',
        'border-left-color': 'rgb(70, 70, 70)',
        'border-right-color': 'rgb(70, 70, 70)',
        'border-top-color': 'rgb(70, 70, 70)',
        'color-scheme': 'dark',
      },
      icon: {
        width: '30px',
        height: '30px',
      },
      badge: {
        'background-color': 'rgb(248, 217, 4)',
        'font-size': '12px',
        'font-weight': '400',
        // 'height': '24px', // page does not match figma
      },
      description: {
        light: {
          color: 'rgb(34, 34, 34)',
          'font-size': '14px',
          'font-weight': '700', // fix in the code to be 700 and not strong
        },
        dark: {
          color: 'rgb(248, 248, 248)',
          'font-size': '14px',
          'font-weight': '700',
        },
      },
      legalLink: {
        light: {
          color: 'rgb(34, 34, 34)',
          'font-size': '12px',
          'font-weight': '400',
        },
        dark: {
          // 'color': 'rgb(248, 248, 248)', // page does not match figma
          'font-size': '12px',
          'font-weight': '400',
        },
      },
      price: {
        light: {
          color: 'rgb(34, 34, 34)',
          'font-size': '14px',
          'font-weight': '700',
        },
        dark: {
          color: 'rgb(248, 248, 248)',
          'font-size': '14px',
          'font-weight': '700',
        },
      },
      strikethroughPrice: {
        color: 'rgb(109, 109, 109)',
        'font-size': '14px',
        'font-weight': '400',
        'text-decoration-line': 'line-through',
        'text-decoration-color': 'rgb(109, 109, 109)',
      },
      cta: {
        light: {
          'background-color': 'rgb(2, 101, 220)',
          color: 'rgb(255, 255, 255)',
          'font-size': '12px',
          'font-weight': '700',
        },
        dark: {
          'background-color': 'rgb(3, 103, 224)',
          color: 'rgb(255, 255, 255)',
          'font-size': '12px',
          'font-weight': '700',
        },
      },
    };
  }

  async getCard(id, cardType) {
    const cardVariant = {
      suggested: this.suggestedCard,
      slice: this.sliceCard,
      'slice-wide': this.sliceCardWide,
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
      title: this.suggestedCardTitle,
      icon: this.cardIcon,
      eyebrow: this.suggestedCardEyebrow,
      badge: this.cardBadge,
      description: {
        suggested: this.suggestedCardDescription,
        slice: this.sliceCardDescription,
        'slice-wide': this.sliceCardDescription,
      },
      legalLink: {
        suggested: this.suggestedCardLegalLink,
        slice: this.sliceCardLegalLink,
        'slice-wide': this.sliceCardLegalLink,
      },
      price: {
        suggested: this.suggestedCardPrice,
        slice: this.price,
        'slice-wide': this.price,
      },
      priceStrikethrough: this.priceStrikethrough,
      cta: {
        suggested: this.suggestedCardCTA,
        slice: this.sliceCardCTA,
        'slice-wide': this.sliceCardCTA,
      },
      ctaLink: {
        suggested: this.suggestedCardCTALink,
        slice: this.sliceCardCTALink,
        'slice-wide': this.sliceCardCTALink,
      },
      image: this.sliceCardImage,
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
    if (cardType !== 'suggested') {
      throw new Error(`Invalid card type: ${cardType}. This card tyoe does not have a title.`);
    }
    return this.getCardField(id, cardType, 'title');
  }

  async getCardIcon(id, cardType) {
    return this.getCardField(id, cardType, 'icon');
  }

  async getCardEyebrow(id, cardType) {
    if (cardType !== 'suggested') {
      throw new Error(`Invalid card type: ${cardType}. This card tyoe does not have a n eyebrow.`);
    }
    return this.getCardField(id, cardType, 'eyebrow');
  }

  async getCardBadge(id, cardType) {
    if (cardType === 'suggested') {
      throw new Error('Invalid card type. "suggested" card does not have a badge.');
    }
    return this.getCardField(id, cardType, 'badge');
  }

  async getCardDescription(id, cardType) {
    return this.getCardField(id, cardType, 'description');
  }

  async getCardLegalLink(id, cardType) {
    return this.getCardField(id, cardType, 'legalLink');
  }

  async getCardPrice(id, cardType) {
    return this.getCardField(id, cardType, 'price');
  }

  async getCardPriceStrikethrough(id, cardType) {
    let card;
    switch (cardType) {
      case 'suggested':
        card = await this.getCardPrice(id, cardType);
        break;
      case 'slice':
      case 'slice-wide':
        card = await this.getCard(id, cardType);
        break;
      default:
        throw new Error(`Invalid card type: ${cardType}`);
    }
    return card.locator(this.priceStrikethrough);
  }

  async getCardCTA(id, cardType) {
    return this.getCardField(id, cardType, 'cta');
  }

  async getCardCTALink(id, cardType) {
    return this.getCardField(id, cardType, 'ctaLink');
  }

  async getCardImage(id, cardType) {
    if (cardType === 'suggested') {
      throw new Error('Invalid card type. "suggested" card does not have an image slot.');
    }
    return this.getCardField(id, cardType, 'image');
  }
}
