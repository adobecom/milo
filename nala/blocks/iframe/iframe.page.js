/* eslint-disable import/no-import-module-exports */

export default class Iframe {
  constructor(page) {
    this.page = page;

    // IFRAME ELEMENTS:
    this.miloIframeContainer = page.locator('.milo-iframe');
    this.iframeContainer = this.miloIframeContainer.locator('iframe');

    // IFRAME PROPS:
    this.props = {};
  }
}
