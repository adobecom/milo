/* eslint-disable import/no-import-module-exports */

export default class ThreeInOne {
  constructor(page) {
    this.page = page;
    this.ctaWithCsParam = page.locator('[data-modal-id="miniplans-buy-photoshop"]');
    this.ctaWithMsParam = page.locator('[data-modal-id="crm-buy-ai-assistant-acrobat"]');
    this.props = {};
  }
}
