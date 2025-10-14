export default class MepButton {
  constructor(page) {
    this.page = page;

    this.mepButton = page.locator('.mep-badge');
    this.highlightCheckbox = page.locator('#mepHighlightCheckbox');
    this.manifest = page.locator('.mep-edit-manifest');
    this.manifestHref = page.locator('.mep-edit-manifest[href$=".json"]');
    this.manifestList = page.locator('.mep-manifest-list');
    this.advancedOptions = page.locator('.mep-toggle-advanced');
    this.newManifestInput = page.locator('.new-manifest');
    this.previewButton = page.locator('a[data-id="preview-button"]');
    this.manifestInput = page.locator('input[name="new-manifest"]');
    this.targetStatus = page.locator('.mep-columns div + div div');
    this.firstManifestType = page.locator('.mep-column').nth(5);
    this.firstManifestDates = page.locator('.mep-column').nth(7);
  }
}
