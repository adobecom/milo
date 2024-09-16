export default class Columns {
  constructor(page, nth = 0) {
    this.page = page;
    // columns  locators
    this.column = this.page.locator('.columns').nth(nth);
    this.rows = this.column.locator('.row');
    this.columns = this.column.locator('.col');

    // columns blocks css
    this.cssProperties = {
      '.columns > .row': {
        display: 'grid',
        gap: /^32px.*/,
        'margin-bottom': '16px',
        'grid-template-columns': /^(\d+(?:\.\d+)?px\s?)+$/,
      },

      '.columns.contained': {
        'max-width': /^\d{2}/,
        margin: /^0px.*/,
      },

      '.columns.contained.middle': { 'align-items': 'center' },

      '.columns.table': { 'font-size': '14px' },

      '.columns.table > .row:first-child': {
        'text-transform': 'uppercase',
        'font-size': '11px',
        'font-weight': '700',
        'letter-spacing': '1px',
      },

      '.columns.table > .row': {
        'margin-bottom': '0px',
        padding: /^16px.*/,
        'grid-template-columns': /^(\d+(?:\.\d+)?px\s?)+$/,
        'border-bottom': /^1px.*/,
        'align-items': 'center',
      },
    };

    // columns blocks attributes
    this.attProperties = {
      columns: { class: 'columns' },
      'columns-contained': { class: 'columns contained' },
      'columns-contained-middle': { class: 'columns contained middle' },
      'columns-table': { class: 'columns columns-table' },
      'columns-contained-table': { class: 'columns contained columns-table' },
    };
  }
}
