import { expect } from '@playwright/test';

const DA_LIVE_URL = 'https://da.live';
const FG_PATH = '/app/adobecom/milo/tools/floodgate';
const DA_ADMIN = 'https://admin.da.live';

export default class FloodgatePage {
  constructor(page) {
    this.page = page;
  }

  // --- Navigation & Frame ---

  static getUrl(ref = '') {
    const params = ref ? `?ref=${ref}` : '';
    return `${DA_LIVE_URL}${FG_PATH}${params}`;
  }

  async navigate(ref = '') {
    await this.page.goto(FloodgatePage.getUrl(ref));
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissPopup();
    await this.initFrame();
  }

  async dismissPopup() {
    const continueBtn = this.page.locator('.disclaimer sl-button[name="continue"]');
    try {
      await continueBtn.click({ timeout: 8000 });
    } catch {
      // No popup
    }
  }

  async initFrame() {
    // da.live loads tools in an iframe
    await this.page.locator('iframe').waitFor({ state: 'attached', timeout: 30000 });
    this.frame = this.page.frameLocator('iframe');
    this.initLocators(this.frame);
  }

  initLocators(root) {
    // milo-floodgate is a LitElement with shadow DOM
    this.component = root.locator('milo-floodgate');

    // Top-level UI
    this.title = this.component.locator('h1');
    this.subtitle = this.component.locator('h3');

    // Form controls
    this.pathsTextarea = this.component.locator('textarea[name="paths"]');
    this.actionSelect = this.component.locator('.action-select');
    this.colorSelect = this.component.locator('.color-select');

    // Buttons
    this.findButton = this.component.locator('button.accent').filter({ hasText: /Find Files|Finding/ });
    this.clearButton = this.component.locator('.clear-button');

    // Repo info
    this.repoInfo = this.component.locator('.repo-info');
    this.sourceRepo = this.repoInfo.locator('p').filter({ hasText: 'Source' }).locator('span');
    this.fgRepo = this.repoInfo.locator('p').filter({ hasText: 'Floodgate' }).locator('span');

    // Validation
    this.pathCount = this.component.locator('.path-count');
    this.errorMessage = this.component.locator('.error-message');
    this.accessInfoMessage = this.component.locator('.access-info-message');
    this.invalidPathsHint = this.component.locator('.invalid-paths-hint');

    // Toggles
    this.previewAfterCopy = this.component.locator('#previewAfterCopy');
    this.publishAfterPromote = this.component.locator('#publish');

    // Tab UI (workflow progress)
    this.tabNav = this.component.locator('.tab-nav');
    this.workflowShell = this.component.locator('.workflow-shell');
    this.tabs = this.component.locator('.tabs');

    // Find step
    this.findStep = this.component.locator('.tab-step[data-id="find"]');
    this.fileList = this.findStep.locator('.url-checklist li');
    this.notFoundList = this.findStep.locator('.not-found-list li');

    // Action buttons within find step (Copy/Promote/Delete)
    this.copyButton = this.component.locator('button.accent').filter({ hasText: 'Copy' });
    this.promoteButton = this.component.locator('button.accent').filter({ hasText: 'Promote' });
    this.deleteButton = this.component.locator('button.accent').filter({ hasText: 'Delete' });
    this.cancelButton = this.component.locator('button').filter({ hasText: 'Cancel' });

    // Badges — rendered as .detail-card with h3 title + p value
    // In-progress steps have specific classes like .detail-card-success, .detail-card-total
    this.badges = this.component.locator('.detail-card');
    this.successBadge = this.component.locator('.detail-card-success p');
    this.totalBadge = this.component.locator('.detail-card-total p');
    this.remainingBadge = this.component.locator('.detail-card-remaining p');

    // Error/detail lists
    this.detailLists = this.component.locator('.detail-lists');
    this.errorDetails = this.component.locator('details');

    // Confirm Dialog
    this.dialogOverlay = this.component.locator('.dialog-overlay');
    this.dialogBox = this.component.locator('.dialog-box');
    this.dialogMessage = this.dialogBox.locator('p');
    this.dialogCancelBtn = this.dialogBox.locator('button.accent').filter({ hasText: 'Cancel' });
    this.dialogContinueBtn = this.dialogBox.locator('button').filter({ hasText: /Continue|Delete/ });

    // Done step
    this.doneStep = this.component.locator('.tab-step[data-id="done"]');
    this.doneBanner = this.doneStep.locator('.done-banner p');
    this.doneCards = this.doneStep.locator('.done-cards .detail-card');
    this.retryButton = this.component.locator('button').filter({ hasText: 'Retry' });
    this.startOverButton = this.component.locator('button').filter({ hasText: 'Start Over' });

    // Promote ignore
    this.promoteIgnoreCheckbox = this.component.locator('#promoteIgnore');
    this.promoteIgnoreTextarea = this.component.locator('textarea[name="promote-ignore-paths"]');
  }

  // --- Actions ---

  async selectOperation(op) {
    // op: 'fgCopy' | 'fgPromote' | 'fgDelete'
    await this.actionSelect.selectOption(op);
    await this.page.waitForTimeout(300);
  }

  async selectColor(color) {
    await this.colorSelect.selectOption(color);
    await this.page.waitForTimeout(300);
  }

  async enterPaths(paths) {
    const text = Array.isArray(paths) ? paths.join('\n') : paths;
    await this.pathsTextarea.fill(text);
    // trigger input event for debounced validation
    await this.pathsTextarea.dispatchEvent('input');
    // Wait for debounced access eval (300ms) + config load
    await this.page.waitForTimeout(1000);
  }

  async clickFind() {
    await this.findButton.click();
  }

  async clickCopy() {
    await this.copyButton.click();
  }

  async clickPromote() {
    await this.promoteButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickClear() {
    await this.clearButton.click();
  }

  async confirmDialog() {
    await this.dialogContinueBtn.click();
  }

  async cancelDialog() {
    await this.dialogCancelBtn.click();
  }

  async clickRetry() {
    await this.retryButton.click();
  }

  async clickStartOver() {
    await this.startOverButton.click();
  }

  async togglePreviewAfterCopy(checked = true) {
    const current = await this.previewAfterCopy.isChecked();
    if (current !== checked) {
      await this.previewAfterCopy.click();
    }
  }

  async togglePublishAfterPromote(checked = true) {
    const current = await this.publishAfterPromote.isChecked();
    if (current !== checked) {
      await this.publishAfterPromote.click();
    }
  }

  // --- Waits ---

  async waitForFindComplete(timeout = 60000) {
    // Wait for Find step to show file list or action button
    await expect(this.findStep).toBeVisible({ timeout });
    // Wait for find button to not say "Finding..."
    await expect(this.findButton).not.toContainText('Finding', { timeout });
  }

  async waitForDone(timeout = 120000) {
    await expect(this.doneStep).toBeVisible({ timeout });
  }

  async waitForDialog(timeout = 10000) {
    await expect(this.dialogOverlay).toBeVisible({ timeout });
  }

  // --- Assertions ---

  async getPathCount() {
    const text = await this.pathCount.textContent();
    return parseInt(text, 10);
  }

  async getSuccessCount() {
    // Prefer the Done banner ("X files processed ...") — most reliable after waitForDone()
    try {
      await this.doneBanner.waitFor({ state: 'visible', timeout: 30000 });
      const bannerText = await this.doneBanner.textContent();
      const m = bannerText && bannerText.match(/(\d+)\s+files?\s+processed/i);
      if (m) return parseInt(m[1], 10);
    } catch { /* fall through */ }

    // Fallback: read first done card's <p> text (format: "N<span>/total</span>")
    try {
      const firstCard = this.doneCards.first();
      await firstCard.waitFor({ state: 'visible', timeout: 10000 });
      const cardText = await firstCard.locator('p').first().textContent();
      const m = cardText && cardText.match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    } catch { /* fall through */ }

    return 0;
  }

  async isStartEnabled() {
    const disabled = await this.findButton.getAttribute('disabled');
    return disabled === null;
  }

  // --- DA API Verification ---

  async getDaToken() {
    // Extract IMS access token from da.live localStorage (populated by storageState)
    return this.page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('adobeid_ims_access_token')) {
          try {
            const v = JSON.parse(localStorage.getItem(key));
            return v.tokenValue || v.token;
          } catch { return localStorage.getItem(key); }
        }
      }
      return null;
    });
  }

  async checkFileExists(path, token) {
    const url = `${DA_ADMIN}/source${path}`;
    const response = await this.page.request.head(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.status() === 200;
  }

  async getFileContent(path, token) {
    const url = `${DA_ADMIN}/source${path}`;
    const response = await this.page.request.get(url, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status() !== 200) return null;
    return response.text();
  }

  async getFileBytes(path, token) {
    const url = `${DA_ADMIN}/source${path}`;
    const response = await this.page.request.get(url, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status() !== 200) return null;
    return response.body();
  }

  async deleteFile(path, token) {
    const url = `${DA_ADMIN}/source${path}`;
    const response = await this.page.request.delete(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.status();
  }

  /**
   * Compare source file content to FG copy, normalizing expected URL rewrites.
   * The floodgate Copy step rewrites `main--{repo}--{org}` to `main--{repo}-fg-{color}--{org}`
   * in HTML content. To verify round-trip integrity, we reverse that rewrite on FG
   * content and compare with source.
   *
   * @param {string} sourcePath DA source path (e.g. /adobecom/da-events/drafts/.../page.html)
   * @param {string} fgPath DA FG path (e.g. /adobecom/da-events-fg-pink/drafts/.../page.html)
   * @param {object} opts { org, repo, color } used to build the URL rewrite pattern
   * @returns {Promise<{identical: boolean, sourceLength: number, fgLength: number,
   *           diffLines?: Array, reason?: string}>}
   */
  async compareSourceVsFg(sourcePath, fgPath, opts) {
    const token = await this.getDaToken();
    const sourceContent = await this.getFileContent(sourcePath, token);
    const fgContent = await this.getFileContent(fgPath, token);

    if (!sourceContent) return { identical: false, reason: `Source missing: ${sourcePath}` };
    if (!fgContent) return { identical: false, reason: `FG missing: ${fgPath}` };

    // Reverse the floodgate URL rewrite: fg-{color} back to original
    const { org = 'adobecom', repo = 'da-events', color = 'pink' } = opts || {};
    const fgHost = `--${repo}-fg-${color}--${org}`;
    const srcHost = `--${repo}--${org}`;
    const normalizedFg = fgContent.split(fgHost).join(srcHost);

    const identical = normalizedFg === sourceContent;
    const result = {
      identical,
      sourceLength: sourceContent.length,
      fgLength: fgContent.length,
      normalizedFgLength: normalizedFg.length,
    };

    if (!identical) {
      // Collect up to first 5 differing lines for debug
      const srcLines = sourceContent.split('\n');
      const fgLines = normalizedFg.split('\n');
      const diffs = [];
      const max = Math.max(srcLines.length, fgLines.length);
      for (let i = 0; i < max && diffs.length < 5; i += 1) {
        if (srcLines[i] !== fgLines[i]) {
          diffs.push({
            line: i + 1,
            source: (srcLines[i] || '').substring(0, 200),
            fg: (fgLines[i] || '').substring(0, 200),
          });
        }
      }
      result.diffLines = diffs;
    }

    return result;
  }

  /**
   * Ensure an FG file exists by copying source -> FG via DA admin API.
   * Use to stabilize delete tests when earlier tests may have removed the target.
   * @param {string} sourcePath e.g. /adobecom/da-events/drafts/nala-fg-test/test1-single-block.html
   * @param {string} fgPath e.g. /adobecom/da-events-fg-pink/drafts/nala-fg-test/test1-single-block.html
   * @param {string} token DA bearer token
   */
  async ensureFileInFg(sourcePath, fgPath, token) {
    // Already exists? Done.
    if (await this.checkFileExists(fgPath, token)) return;

    // Fetch source content
    const src = await this.page.request.get(`${DA_ADMIN}/source${sourcePath}`, { headers: { Authorization: `Bearer ${token}` } });
    if (src.status() !== 200) return;

    const isHtml = sourcePath.endsWith('.html');
    const isJson = sourcePath.endsWith('.json');

    if (isHtml || isJson) {
      // Create version first (required for editable files)
      await this.page.request.post(`${DA_ADMIN}/versionsource${fgPath}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: JSON.stringify({ label: 'Nala test restore' }),
      });
    }

    const content = isHtml || isJson ? await src.text() : await src.body();
    let mimeType = 'application/octet-stream';
    if (isHtml) mimeType = 'text/html';
    else if (isJson) mimeType = 'application/json';
    await this.page.request.post(`${DA_ADMIN}/source${fgPath}`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        data: {
          name: 'data',
          mimeType,
          buffer: Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf-8'),
        },
      },
    });
  }
}
