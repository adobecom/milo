export default class BulkPublisherPage {
  constructor(page) {
    this.page = page;

    this.presetSelector = page.locator('#presetSelector');
    this.presetOptions = page.locator('#presetSelector option');
    this.hostInput = page.locator('#host');
    this.repoInput = page.locator('#repo');
    this.ownerInput = page.locator('#owner');
    this.languageFirstCheckbox = page.locator('#languageFirst');
    this.urlsTextarea = page.locator('#urls');
    this.publishButton = page.locator('#bulkpublish');

    this.statusSignedIn = page.locator('.status-signed-in');
    this.statusSignedOut = page.locator('.status-signed-out');
    this.signInLink = page.locator('.status-signed-out a');

    this.successModal = page.locator('.tingle-modal').filter({ hasText: 'Successfully published' });
    this.successModalOk = this.successModal.locator('button:has-text("OK")');

    this.successTable = page.locator('.success-table');
    this.successRows = this.successTable.locator('tbody tr');
  }
}
