import WebUtil from '../../../libs/webutil.js';

export default class AdobeHomePage {
  constructor(page) {
    this.page = page;

    // AH Try Buy Widget elements
    this.widget = page.locator('ah-try-buy-widget');
    this.title = page.locator('h3[slot="heading-xxxs"]');
    this.description = page.locator('div[slot="body-xxs"]');
    this.price = page.locator('p[slot="price"]');
    this.cta = page.locator('div[slot="cta"] > sp-button');
    this.background = page.locator('div[slot="image"] img');
    this.badge = page.locator('.merch-badge');

    // CSS properties for verification
    this.widgetCssProp = {
      light: {
        'background-color': 'rgb(248, 248, 248)',
        'border-color': 'rgb(230, 230, 230)',
        '--merch-card-custom-background-color': 'var(--spectrum-gray-50)',
        '--merch-card-custom-border-color': 'var(--spectrum-gray-200)',
      },
      dark: {
        'background-color': 'rgb(27, 27, 27)',
        'border-color': 'rgb(57, 57, 57)',
        '--merch-card-custom-background-color': 'var(--spectrum-gray-900)',
        '--merch-card-custom-border-color': 'var(--spectrum-gray-700)',
      },
      sizes: {
        single: { width: '132px', height: '206px' },
        double: { width: '214px', height: '206px' },
        triple: { width: '460px', height: '230px' },
      },
      typography: {
        title: {
          'font-size': '16px',
          'line-height': '20px',
          'font-weight': '700',
        },
        price: {
          'font-size': '14px',
          'line-height': '17px',
          'font-style': 'italic',
        }
      }
    };
  }

  async getWidget(id) {
    return this.widget.filter({
      has: this.page.locator(`aem-fragment[fragment="${id}"]`)
    });
  }

  async getWidgetField(id, fieldName) {
    const widget = await this.getWidget(id);

    const fields = {
      title: this.title,
      description: this.description,
      price: this.price,
      cta: this.cta,
      background: this.background,
      badge: this.badge,
    };

    return widget.locator(fields[fieldName]);
  }
}
