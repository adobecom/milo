export default class MasAcom {
  constructor(page) {
    this.page = page;
    this.price = page.locator('span[data-template="price"]');
    this.priceStrikethrough = page.locator('span[data-template="strikethrough"]');
    this.cardIcon = page.locator('merch-icon');

    // Plans individual card properties:
    this.cssProp = {
      card: {
        'background-color': 'rgb(255, 255, 255)',
        // 'max-width': '378px',
      },
      icon: {
        width: '41.5px',
        height: '40px',
      },
      badge: {
        // 'background-color': 'rgb(255, 204, 0)', // set when configurable
        color: 'rgb(0, 0, 0)',
        // 'height': '26px',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '21px',
        'padding-top': '2px',
        'padding-bottom': '3px',
        'padding-left': '10px',
        'padding-right': '10px',
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '0px',
        'border-top-left-radius': '4px',
        'border-top-right-radius': '0px',
      },
      title: {
        color: 'rgb(44, 44, 44)',
        'font-size': '18px',
        'font-weight': '700',
        'line-height': '22.5px',
      },
      price: {
        color: 'rgb(44, 44, 44)',
        'font-size': '24px',
        'font-weight': '700',
        'line-height': '30px',
      },
      strikethroughPrice: {
        color: 'rgb(44, 44, 44)',
        'font-size': '14px',
        'font-weight': '700',
        'line-height': '21px',
        'text-decoration-color': 'rgb(44, 44, 44)',
        'text-decoration-line': 'line-through',
      },
      promoText: {
        color: 'rgb(0, 122, 77)',
        'font-size': '14px',
        'font-weight': '700',
        'line-height': '21px',
      },
      description: {
        color: 'rgb(44, 44, 44)',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '21px',
      },
      legalLink: {
        color: 'rgb(39, 77, 234)',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '21px',
        'text-decoration-line': 'underline',
        'text-decoration-style': 'solid',
      },
      callout: {
        'background-color': 'rgb(217, 217, 217)',
        color: 'rgb(0, 0, 0)',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '21px',
      },
      stockCheckbox: {
        text: {
          color: 'rgb(34, 34, 34)',
          'font-size': '12px',
          'font-weight': '400',
          'line-height': '12px',
        },
        checkbox: {
          'border-color': 'rgb(109, 109, 109)',
          'border-radius': '2px',
          width: '12px',
          height: '12px',
        },
      },
      secureTransaction: {
        color: 'rgb(80, 80, 80)',
        'font-size': '12px',
        'font-weight': '400',
        'line-height': '12px',
      },
      cta: {
        'background-color': 'rgb(59, 99, 251)',
        color: 'rgb(255, 255, 255)',
        'font-size': '15px',
        'font-weight': '700',
        'line-height': '19px',
      },
    };
  }

  getCard(id) {
    return this.page.locator(`merch-card:has(aem-fragment[fragment="${id}"])`);
  }

  getCardIcon(id) {
    const card = this.getCard(id);
    return card.locator('merch-icon');
  }

  getCardBadge(id) {
    const card = this.getCard(id);
    return card.locator('merch-badge');
  }

  getCardTitle(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="heading-xs"]');
  }

  getCardPromoText(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="promo-text"]');
  }

  getCardPrice(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="heading-m"]');
  }

  getCardStrikethroughPrice(id) {
    const card = this.getCard(id);
    return card.locator('p[slot="heading-m"] span.price-strikethrough');
  }

  getCardDescription(id) {
    const card = this.getCard(id);
    return card.locator('div[slot="body-xs"] p');
  }

  getSeeAllPlansLink(id) {
    return this.getCardDescription(id).locator('a.modal-Link');
  }

  getCardCTA(id) {
    const card = this.getCard(id);
    return card.locator('div[slot="footer"] > a[is="checkout-link"]');
  }

  getStockCheckbox(id) {
    return this.getCard(id).locator('[id="stock-checkbox"]');
  }

  getStockCheckboxIcon(id) {
    return this.getCard(id).locator('[id="stock-checkbox"] > span');
  }

  getCardSecureTransaction(id) {
    return this.getCard(id).locator('.secure-transaction-label');
  }

  getCardCallout(id) {
    return this.getCard(id).locator('div[slot="callout-content"] > p');
  }
}
