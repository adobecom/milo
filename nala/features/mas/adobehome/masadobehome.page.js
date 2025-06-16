export default class AdobeHomePage {
  constructor(page) {
    this.page = page;

    // Direct locators for widget elements
    this.widgetCardTriple = page.locator('merch-card[variant="ah-try-buy-widget"][size="triple"]');
    this.widgetCardDouble = page.locator('merch-card[variant="ah-try-buy-widget"][size="double"]');
    this.widgetCardSingle = page.locator('merch-card[variant="ah-try-buy-widget"][size="single"]');

    // Direct locators for widget fields
    this.title = page.locator('[slot="heading-xxxs"]');
    this.description = page.locator('[slot="body-xxs"]');
    this.price = page.locator('[slot="price"]');
    this.cta = page.locator('[slot="cta"] sp-button');
    this.image = page.locator('div[slot="image"] img');

    // CSS properties for validation
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
          'min-width': '239px',
          'max-width': '239px',
          height: '206px',
        },
        double: {
          'min-width': '206px',
          'max-width': '206px',
          height: '206px',
        },
        triple: {
          'min-width': '444px',
          'max-width': '444px',
          height: '206px',
        },
      },
      typography: {
        title: {
          'font-size': '16px',
          'line-height': '20px',
          'font-weight': '700',
          // eslint-disable-next-line quote-props
          'color': 'var(--merch-card-ah-try-buy-widget-text-color)',
        },
        price: {
          'font-size': 'var(--merch-card-price-font-size)',
          'line-height': 'var(--merch-card-price-line-height)',
          'font-style': 'var(--merch-card-price-font-style)',
          color: 'var(--merch-card-price-color)',
        },
      },
    };
  }

  // Get widget by ID and size
  async getWidget(id, size) {
    // First locate the fragment
    const fragmentLocator = this.page.locator(`aem-fragment[fragment="${id}"]`);

    // Wait for the fragment to be attached with a reasonable timeout
    await fragmentLocator.waitFor({ state: 'attached', timeout: 10000 })
      .catch((e) => console.log(`Warning: Fragment ${id} not found: ${e.message}`));

    // Get the parent merch-card
    const widget = this.page.locator(`merch-card[variant="ah-try-buy-widget"][size="${size}"]`)
      .filter({ has: fragmentLocator });

    return widget;
  }

  // Get a specific field from a widget
  async getWidgetField(id, size, fieldName) {
    const widget = await this.getWidget(id, size);

    // Simple field mapping similar to MasCCDPage
    const fields = {
      title: '[slot="heading-xxxs"]',
      description: '[slot="body-xxs"]',
      price: '[slot="price"]',
      cta: '[slot="cta"] sp-button',
    };

    const selector = fields[fieldName];
    if (!selector) {
      throw new Error(`Invalid field name: ${fieldName}`);
    }

    return widget.locator(selector);
  }

  // Get widget attribute
  async getWidgetAttribute(id, size, attribute) {
    const widget = await this.getWidget(id, size);
    return widget.getAttribute(attribute);
  }
}
