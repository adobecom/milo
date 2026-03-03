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
    this.targetStatus = page.locator(
      '.mep-section-data span:has-text("Target Integration") + span, '
      + '.mep-columns:has-text("Target Integration") .mep-column:nth-child(2) > div:nth-child(1)',
    );
    const firstManifestSection = page.locator('.mep-manifest-list:not(.mmm-list) .mep-section').first();
    this.firstManifestType = firstManifestSection.locator(
      '.mep-section-data, .mep-columns:first-of-type .mep-column:nth-child(2)',
    );
    this.firstManifestDates = page.locator('.mep-column').nth(7);
  }
}
