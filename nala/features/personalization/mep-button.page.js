export default class MepButton {
  constructor(page) {
    this.page = page;

    this.mepButton = page.locator('.mep-badge');
    this.highlightCheckbox = page.locator('#mepHighlightCheckbox');
    this.manifest = page.locator('.mep-edit-manifest');
    this.manifestHref = page.locator('.mep-edit-manifest[href$=".json"]');
    this.manifestList = page.locator('.mep-manifest-list');
  }
}
