// Forge page object — locators and interaction helpers for the forge SPA.
// The app root is `#root`; all forge elements carry `pf-` prefixed class names.

export default class ForgePage {
  constructor(page) {
    this.page = page;

    // ── Landing panel (InputPanel — "doors" view) ────────────────────────────
    this.entryTitle = page.locator('.pf-entry-title');
    this.urlDoor = page.locator('[aria-label="Adobify a live page"]');
    this.figmaDoor = page.locator('[aria-label="Build my design from a Figma frame"]');

    // ── Focused input view (after a door is opened) ──────────────────────────
    this.focusCard = page.locator('.pf-focus-card');
    this.urlInput = page.getByLabel('Page URL');
    this.figmaInput = page.getByLabel('Figma frame URL');
    // CTA: "Reimagine this page" (URL door) or "Build my page" (Figma door)
    this.generateBtn = page.locator('.pf-btn-primary.pf-entry-cta');
    this.backBtn = page.locator('.pf-back-btn');
    this.formError = page.locator('.pf-form-error');

    // ── Active session view ──────────────────────────────────────────────────
    this.activeSession = page.locator('.pf-active-session');
    // Generating card (shown while the session runs — contains progress bar + status)
    this.generatingCard = page.locator('.pf-gen2');
    // Progress bar inside the generating card
    this.progressBar = page.locator('.pf-gen2-prog');

    // ── Result states ────────────────────────────────────────────────────────
    // Gate state: generation done, deploy not yet triggered
    this.verdictGate = page.locator('.pf-verdict--gate');
    // Live state: deployed successfully to DA Authoring
    this.verdictLive = page.locator('.pf-verdict--live');
    // "Send to Authoring" button — single (Figma/conformance flow)
    this.deployBtn = page.locator('.pf-btn-primary.pf-btn-publish');
    // "Send to Authoring" buttons — one per direction card (Reimagine/URL flow)
    this.reimagineSendBtns = page.locator('.pf-rv-send');
    this.resultCard = page.locator('.pf-result2');

    // ── Sidebar history ──────────────────────────────────────────────────────
    this.sidebar = page.locator('aside');
  }

  // Seed localStorage before the app boots.
  // repoPath: any non-empty string bypasses the ConnectConsumer modal on deploy.
  // Both repoPath AND consumerPreviewUrl must be set to skip the ConnectConsumer modal.
  // serverUrl: overrides the default http://localhost:8080 (used in real mode).
  async seedDemoConfig({
    repoPath = '/tmp/demo-repo',
    consumerPreviewUrl = 'http://localhost:3000',
    serverUrl = '',
  } = {}) {
    await this.page.addInitScript(({ rp, cpu, su }) => {
      try {
        const stored = JSON.parse(localStorage.getItem('forge.config') || '{}');
        const next = { ...stored, repoPath: rp, consumerPreviewUrl: cpu };
        if (su) next.serverUrl = su;
        localStorage.setItem('forge.config', JSON.stringify(next));
      } catch { /* quota / restricted */ }
    }, { rp: repoPath, cpu: consumerPreviewUrl, su: serverUrl });
  }

  async openUrlDoor() {
    await this.urlDoor.click();
    await this.focusCard.waitFor({ state: 'visible' });
  }

  async openFigmaDoor() {
    await this.figmaDoor.click();
    await this.focusCard.waitFor({ state: 'visible' });
  }

  // Wait for demo generation to reach the gate state (done, not yet deployed).
  // The demo run takes ~13s; default timeout is 30s.
  async waitForGate(timeout = 30 * 1000) {
    await this.generatingCard.waitFor({ state: 'visible', timeout: 10 * 1000 });
    await this.verdictGate.waitFor({ state: 'visible', timeout });
  }

  // Click the primary "Send to Authoring" button (Figma/conformance flow).
  async sendToAuthoring(timeout = 20 * 1000) {
    await this.deployBtn.click();
    await this.verdictLive.waitFor({ state: 'visible', timeout });
  }

  // Click the first Reimagine variant's "Send to Authoring" (URL/reimagine flow).
  async sendReimaginedVariant(timeout = 20 * 1000) {
    await this.reimagineSendBtns.first().click();
    await this.verdictLive.waitFor({ state: 'visible', timeout });
  }
}
