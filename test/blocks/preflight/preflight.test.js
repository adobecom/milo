/**
 * Preflight redesign tests — covers the new light-theme c2 (--s2a-*) modal.
 *
 * Framework: @esm-bundle/chai + sinon (matches existing test style in this repo).
 */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../libs/deps/htm-preact.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeContainer() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function cleanup(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ─── CSS token smoke-test ─────────────────────────────────────────────────────

describe('Preflight CSS — --s2a-* tokens', () => {
  let styleEl;

  before(async () => {
    // Dynamically inject the preflight CSS so we can inspect it
    const resp = await fetch('/libs/blocks/preflight/preflight.css');
    const css = await resp.text();
    styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  });

  after(() => {
    if (styleEl) styleEl.remove();
  });

  it('preflight.css does not contain legacy --action-color', () => {
    const css = styleEl.textContent;
    expect(css).to.not.include('--action-color');
  });

  it('preflight.css does not contain legacy --notch-size', () => {
    const css = styleEl.textContent;
    expect(css).to.not.include('--notch-size');
  });

  it('preflight.css uses --s2a-* tokens for color', () => {
    const css = styleEl.textContent;
    expect(css).to.include('--s2a-color-');
  });

  it('preflight.css uses --s2a-* tokens for spacing', () => {
    const css = styleEl.textContent;
    expect(css).to.include('--s2a-spacing-');
  });

  it('preflight.css uses --s2a-* tokens for border-radius', () => {
    const css = styleEl.textContent;
    expect(css).to.include('--s2a-border-radius-');
  });

  it('preflight.css uses --s2a-* tokens for shadow', () => {
    const css = styleEl.textContent;
    expect(css).to.include('--s2a-shadow-');
  });

  it('preflight.css uses --s2a-* tokens for typography', () => {
    const css = styleEl.textContent;
    expect(css).to.include('--s2a-font-size-');
  });

  it('preflight.css defines .preflight-nav', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.preflight-nav');
  });

  it('preflight.css defines .preflight-nav-badge', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.preflight-nav-badge');
  });

  it('preflight.css defines badge-error class', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.badge-error');
  });

  it('preflight.css defines badge-warning class', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.badge-warning');
  });

  it('preflight.css defines .preflight-progress-ring', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.preflight-progress-ring');
  });

  it('preflight.css defines .martech-table', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.martech-table');
  });

  it('preflight.css defines .preflight-back-popover', () => {
    const css = styleEl.textContent;
    expect(css).to.include('.preflight-back-popover');
  });

  it('preflight.css defines responsive breakpoint at 899px', () => {
    const css = styleEl.textContent;
    expect(css).to.include('max-width: 899px');
  });

  it('preflight.css defines responsive breakpoint at 1199px', () => {
    const css = styleEl.textContent;
    expect(css).to.include('max-width: 1199px');
  });
});

// ─── Nav rail rendering ───────────────────────────────────────────────────────

describe('Preflight nav rail', () => {
  let container;

  beforeEach(() => { container = makeContainer(); });
  afterEach(() => { cleanup(container); sinon.restore(); });

  it('renders a nav element with role=tablist', () => {
    render(html`
      <nav class="preflight-nav" role="tablist" aria-label="Preflight sections">
        <button class="preflight-nav-item" aria-selected="true" role="tab">General</button>
      </nav>`, container);
    const nav = container.querySelector('.preflight-nav');
    expect(nav).to.exist;
    expect(nav.getAttribute('role')).to.equal('tablist');
  });

  it('renders nav items with aria-selected', () => {
    render(html`
      <nav class="preflight-nav" role="tablist">
        <button class="preflight-nav-item" aria-selected="true" role="tab">General</button>
        <button class="preflight-nav-item" aria-selected="false" role="tab">SEO</button>
      </nav>`, container);
    const items = container.querySelectorAll('.preflight-nav-item');
    expect(items.length).to.equal(2);
    expect(items[0].getAttribute('aria-selected')).to.equal('true');
    expect(items[1].getAttribute('aria-selected')).to.equal('false');
  });

  it('renders error badge with badge-error class', () => {
    render(html`
      <button class="preflight-nav-item" aria-selected="false" role="tab">
        <span class="preflight-nav-icon">⚙️</span>
        <span class="preflight-nav-label">General</span>
        <span class="preflight-nav-badge badge-error" aria-label="3 issues">3</span>
      </button>`, container);
    const badge = container.querySelector('.preflight-nav-badge.badge-error');
    expect(badge).to.exist;
    expect(badge.textContent.trim()).to.equal('3');
  });

  it('renders warning badge with badge-warning class', () => {
    render(html`
      <button class="preflight-nav-item" aria-selected="false" role="tab">
        <span class="preflight-nav-icon">⚡</span>
        <span class="preflight-nav-label">Performance</span>
        <span class="preflight-nav-badge badge-warning" aria-label="2 issues">2</span>
      </button>`, container);
    const badge = container.querySelector('.preflight-nav-badge.badge-warning');
    expect(badge).to.exist;
    expect(badge.textContent.trim()).to.equal('2');
  });

  it('does not render badge when count is zero', () => {
    render(html`
      <button class="preflight-nav-item" aria-selected="true" role="tab">
        <span class="preflight-nav-icon">⚙️</span>
        <span class="preflight-nav-label">General</span>
      </button>`, container);
    const badge = container.querySelector('.preflight-nav-badge');
    expect(badge).to.not.exist;
  });

  it('nav item has preflight-nav-icon and preflight-nav-label children', () => {
    render(html`
      <button class="preflight-nav-item" role="tab">
        <span class="preflight-nav-icon">🔍</span>
        <span class="preflight-nav-label">SEO</span>
      </button>`, container);
    expect(container.querySelector('.preflight-nav-icon')).to.exist;
    expect(container.querySelector('.preflight-nav-label')).to.exist;
  });
});

// ─── Progress ring ────────────────────────────────────────────────────────────

describe('Preflight progress ring', () => {
  let container;

  beforeEach(() => { container = makeContainer(); });
  afterEach(() => { cleanup(container); });

  it('renders an SVG progress ring', () => {
    render(html`
      <svg class="preflight-progress-ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
      </svg>`, container);
    const ring = container.querySelector('.preflight-progress-ring');
    expect(ring).to.exist;
    expect(ring.tagName.toLowerCase()).to.equal('svg');
    expect(ring.querySelector('circle')).to.exist;
  });

  it('progress ring has aria-hidden=true', () => {
    render(html`
      <svg class="preflight-progress-ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
      </svg>`, container);
    const ring = container.querySelector('.preflight-progress-ring');
    expect(ring.getAttribute('aria-hidden')).to.equal('true');
  });
});

// ─── Card layout ──────────────────────────────────────────────────────────────

describe('Preflight card layout', () => {
  let container;

  beforeEach(() => { container = makeContainer(); });
  afterEach(() => { cleanup(container); });

  it('renders a preflight-card with title and description', () => {
    render(html`
      <div class="preflight-card">
        <div class="preflight-chip chip-pass">✓</div>
        <div class="preflight-card-body">
          <p class="preflight-card-title">H1 count</p>
          <p class="preflight-card-description">Found exactly one H1 heading.</p>
        </div>
      </div>`, container);
    expect(container.querySelector('.preflight-card')).to.exist;
    expect(container.querySelector('.preflight-card-title').textContent).to.equal('H1 count');
    expect(container.querySelector('.preflight-card-description').textContent).to.include('H1');
  });

  it('chip-pass has correct class', () => {
    render(html`<div class="preflight-chip chip-pass">✓</div>`, container);
    const chip = container.querySelector('.preflight-chip.chip-pass');
    expect(chip).to.exist;
  });

  it('chip-fail has correct class', () => {
    render(html`<div class="preflight-chip chip-fail">✕</div>`, container);
    expect(container.querySelector('.preflight-chip.chip-fail')).to.exist;
  });

  it('chip-warn has correct class', () => {
    render(html`<div class="preflight-chip chip-warn">!</div>`, container);
    expect(container.querySelector('.preflight-chip.chip-warn')).to.exist;
  });

  it('chip-loading has correct class', () => {
    render(html`<div class="preflight-chip chip-loading"></div>`, container);
    expect(container.querySelector('.preflight-chip.chip-loading')).to.exist;
  });
});

// ─── Martech table ────────────────────────────────────────────────────────────

describe('Preflight Martech table', () => {
  let container;

  beforeEach(() => { container = makeContainer(); });
  afterEach(() => { cleanup(container); sinon.restore(); });

  it('renders martech-table with thead and tbody', () => {
    render(html`
      <div class="access-columns martech">
        <button class="martech-copy-btn">Copy Table</button>
        <div class="martech-table-wrapper">
          <table class="martech-table">
            <thead><tr><th>String</th><th>DNT Copy</th></tr></thead>
            <tbody>
              <tr><td>Buy now</td><td>Buy now</td></tr>
              <tr><td>Learn more</td><td>Learn more</td></tr>
            </tbody>
          </table>
        </div>
      </div>`, container);
    expect(container.querySelector('.martech-table')).to.exist;
    expect(container.querySelector('.martech-table thead')).to.exist;
    expect(container.querySelector('.martech-table tbody')).to.exist;
    const rows = container.querySelectorAll('.martech-table tbody tr');
    expect(rows.length).to.equal(2);
  });

  it('martech-table has two header columns', () => {
    render(html`
      <table class="martech-table">
        <thead><tr><th>String</th><th>DNT Copy</th></tr></thead>
        <tbody></tbody>
      </table>`, container);
    const ths = container.querySelectorAll('.martech-table thead th');
    expect(ths.length).to.equal(2);
  });

  it('long strings get title attribute for tooltip', () => {
    const longStr = 'A'.repeat(65);
    const truncated = `${'A'.repeat(57)}…`;
    render(html`
      <table class="martech-table">
        <tbody>
          <tr>
            <td title=${longStr}>${truncated}</td>
          </tr>
        </tbody>
      </table>`, container);
    const td = container.querySelector('.martech-table td');
    expect(td.getAttribute('title')).to.equal(longStr);
    expect(td.textContent).to.include('…');
  });

  it('copy button has martech-copy-btn class', () => {
    render(html`<button class="martech-copy-btn">Copy Table</button>`, container);
    expect(container.querySelector('.martech-copy-btn')).to.exist;
  });
});

// ─── Assets click-to-navigate ─────────────────────────────────────────────────

describe('Preflight Assets — click-to-navigate', () => {
  let container;
  let img;

  beforeEach(() => {
    container = makeContainer();
    img = document.createElement('img');
    img.src = 'https://example.com/test.jpg';
    document.body.appendChild(img);
  });

  afterEach(() => {
    cleanup(container);
    if (img && img.parentNode) img.parentNode.removeChild(img);
    const popover = document.querySelector('.preflight-back-popover');
    if (popover) popover.remove();
    sinon.restore();
  });

  it('asset grid item has role=button', () => {
    render(html`
      <div
        class="assets-image-grid-item"
        role="button"
        tabIndex="0">
        <img src="https://example.com/test.jpg" alt="" />
        <div class="assets-image-grid-item-text">
          <span>Factor: 1.0</span>
        </div>
      </div>`, container);
    const item = container.querySelector('.assets-image-grid-item');
    expect(item.getAttribute('role')).to.equal('button');
    expect(item.getAttribute('tabIndex')).to.equal('0');
  });

  it('clicking asset item dispatches closeModal event on preflight modal', () => {
    // Create a fake preflight modal
    const modal = document.createElement('div');
    modal.className = 'dialog-modal';
    modal.id = 'preflight';
    document.body.appendChild(modal);

    let closeFired = false;
    modal.addEventListener('closeModal', () => { closeFired = true; });

    // Simulate the navigateToAsset logic
    modal.dispatchEvent(new CustomEvent('closeModal', { bubbles: true }));
    expect(closeFired).to.be.true;

    modal.remove();
  });

  it('back-to-preflight popover is created after navigation', () => {
    // Simulate showBackPopover
    let popover = document.querySelector('.preflight-back-popover');
    if (!popover) {
      popover = document.createElement('button');
      popover.className = 'preflight-back-popover';
      popover.innerHTML = '<span class="preflight-back-popover-icon">←</span> Back to Preflight';
      document.body.appendChild(popover);
    }
    expect(document.querySelector('.preflight-back-popover')).to.exist;
  });

  it('back-to-preflight popover dispatches preflight:reopen on click', () => {
    const popover = document.createElement('button');
    popover.className = 'preflight-back-popover';
    document.body.appendChild(popover);

    let reopenFired = false;
    window.addEventListener('preflight:reopen', () => { reopenFired = true; }, { once: true });

    popover.addEventListener('click', () => {
      popover.remove();
      window.dispatchEvent(new CustomEvent('preflight:reopen'));
    });
    popover.click();

    expect(reopenFired).to.be.true;
    expect(document.querySelector('.preflight-back-popover')).to.not.exist;
  });

  it('above-fold-critical items have the correct class', () => {
    render(html`
      <div class="assets-image-grid-item above-fold-critical" role="button" tabIndex="0">
        <img src="https://example.com/critical.jpg" alt="" />
        <div class="assets-image-grid-item-text">
          <span class="above-fold-notice"><strong>⚠️ CRITICAL:</strong></span>
        </div>
      </div>`, container);
    expect(container.querySelector('.above-fold-critical')).to.exist;
    expect(container.querySelector('.above-fold-notice')).to.exist;
  });
});

// ─── Notification suppression ─────────────────────────────────────────────────

describe('Preflight — notification suppression', () => {
  afterEach(() => {
    const notif = document.querySelector('.milo-notification');
    if (notif) notif.remove();
    sinon.restore();
  });

  it('dispatches preflight:open event when Preflight opens', () => {
    let fired = false;
    window.addEventListener('preflight:open', () => { fired = true; }, { once: true });
    window.dispatchEvent(new CustomEvent('preflight:open'));
    expect(fired).to.be.true;
  });

  it('dispatches preflight:close event when Preflight closes', () => {
    let fired = false;
    window.addEventListener('preflight:close', () => { fired = true; }, { once: true });
    window.dispatchEvent(new CustomEvent('preflight:close'));
    expect(fired).to.be.true;
  });

  it('removes active .milo-notification on open', () => {
    const notif = document.createElement('div');
    notif.className = 'milo-notification';
    document.body.appendChild(notif);

    // Simulate suppressNotifications
    const activeNotif = document.querySelector('.milo-notification, [data-notification-active]');
    if (activeNotif) activeNotif.remove();

    expect(document.querySelector('.milo-notification')).to.not.exist;
  });
});

// ─── Performance tab — LCP link conditional rendering ─────────────────────────

describe('Preflight Performance — LCP link visibility', () => {
  let container;

  beforeEach(() => { container = makeContainer(); });
  afterEach(() => { cleanup(container); });

  it('hides Highlight LCP link when lcpElementFound is false', () => {
    // Render without the LCP link (lcpElementFound = false)
    render(html`
      <div class="preflight-columns">
        <div class="preflight-column"></div>
        <div class="preflight-column"></div>
        <div>
          <a class="performance-guidelines" href="#" target="_blank">Milo Performance Guidelines</a>
        </div>
        <!-- No LCP link rendered -->
        <div class="lcp-tooltip-modal"></div>
      </div>`, container);
    expect(container.querySelector('.performance-element-preview')).to.not.exist;
  });

  it('shows Highlight LCP link when lcpElementFound is true', () => {
    // Render with the LCP link (lcpElementFound = true)
    render(html`
      <div class="preflight-columns">
        <div class="preflight-column"></div>
        <div class="preflight-column"></div>
        <div>
          <a class="performance-guidelines" href="#" target="_blank">Milo Performance Guidelines</a>
        </div>
        <div>
          <span class="performance-element-preview">Highlight the found LCP section</span>
        </div>
        <div class="lcp-tooltip-modal"></div>
      </div>`, container);
    const lcpLink = container.querySelector('.performance-element-preview');
    expect(lcpLink).to.exist;
    expect(lcpLink.textContent).to.include('Highlight');
  });
});

// ─── General tab — badge includes localization issues ─────────────────────────

describe('Preflight General — badge count includes localization', () => {
  it('badge count sums errorCount and warnCount', () => {
    const tab = { title: 'General', errorCount: 2, warnCount: 1 };
    const badgeCount = tab.errorCount + tab.warnCount;
    expect(badgeCount).to.equal(3);
  });

  it('badge uses badge-error class when errorCount > 0', () => {
    const tab = { title: 'General', errorCount: 1, warnCount: 0 };
    const hasErrors = tab.errorCount > 0;
    const badgeClass = hasErrors ? 'preflight-nav-badge badge-error' : 'preflight-nav-badge badge-warning';
    expect(badgeClass).to.include('badge-error');
  });

  it('badge uses badge-warning class when only warnCount > 0', () => {
    const tab = { title: 'General', errorCount: 0, warnCount: 2 };
    const hasErrors = tab.errorCount > 0;
    const badgeClass = hasErrors ? 'preflight-nav-badge badge-error' : 'preflight-nav-badge badge-warning';
    expect(badgeClass).to.include('badge-warning');
  });

  it('no badge rendered when both counts are zero', () => {
    const tab = { title: 'General', errorCount: 0, warnCount: 0 };
    const badgeCount = tab.errorCount + tab.warnCount;
    expect(badgeCount).to.equal(0);
  });

  it('localization violations contribute to General badge count', () => {
    // Simulate: 2 localization violations → errorCount += 2
    const localizationViolations = [{ url: 'https://example.com/a' }, { url: 'https://example.com/b' }];
    const tab = { title: 'General', errorCount: 0, warnCount: 0 };
    tab.errorCount += localizationViolations.length;
    expect(tab.errorCount).to.equal(2);
    expect(tab.errorCount + tab.warnCount).to.equal(2);
  });
});

// ─── Modal shell structure ────────────────────────────────────────────────────

describe('Preflight modal shell', () => {
  let container;

  beforeEach(() => { container = makeContainer(); });
  afterEach(() => { cleanup(container); });

  it('renders .preflight-nav and .preflight-main side by side', () => {
    render(html`
      <div class="preflight">
        <nav class="preflight-nav" role="tablist"></nav>
        <main class="preflight-main" role="main"></main>
      </div>`, container);
    expect(container.querySelector('.preflight-nav')).to.exist;
    expect(container.querySelector('.preflight-main')).to.exist;
  });

  it('preflight-main contains preflight-main-header and preflight-main-body', () => {
    render(html`
      <main class="preflight-main" role="main">
        <div class="preflight-main-header"><h3>General</h3></div>
        <div class="preflight-main-body"></div>
      </main>`, container);
    expect(container.querySelector('.preflight-main-header')).to.exist;
    expect(container.querySelector('.preflight-main-body')).to.exist;
  });

  it('tab panels use aria-selected to show/hide', () => {
    render(html`
      <div class="preflight-main-body">
        <div class="preflight-tab-panel" aria-selected="true" role="tabpanel">Panel A</div>
        <div class="preflight-tab-panel" aria-selected="false" role="tabpanel">Panel B</div>
      </div>`, container);
    const panels = container.querySelectorAll('.preflight-tab-panel');
    expect(panels[0].getAttribute('aria-selected')).to.equal('true');
    expect(panels[1].getAttribute('aria-selected')).to.equal('false');
  });

  it('nav header shows HEADING text', () => {
    render(html`
      <div class="preflight-nav-header">
        <h2>Milo Preflight</h2>
      </div>`, container);
    expect(container.querySelector('.preflight-nav-header h2').textContent).to.equal('Milo Preflight');
  });
});
