import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../libs/utils/utils.js';

// The module reads the sidekick once on import, so the fixture must exist first.
document.body.innerHTML = await readFile({ path: './mocks/preflight-notification.html' });
const { default: showNotification, groupByPriority, hasSettledIssues, isPageSnoozed, snoozePage } = await import('../../libs/utils/preflight-notification.js');
const SNOOZE_KEY = 'milo-preflight-popup-snooze';

describe('snooze', () => {
  afterEach(() => localStorage.removeItem(SNOOZE_KEY));

  it('hides the pop-up for that page only, for 24 hours', () => {
    const now = Date.now();
    snoozePage('/a', now);
    expect(isPageSnoozed('/a')).to.be.true;
    expect(isPageSnoozed('/b')).to.be.false;
    snoozePage('/b', now - (25 * 60 * 60 * 1000));
    expect(isPageSnoozed('/b')).to.be.false;
  });

  it('drops expired pages when saving, and survives bad storage data', () => {
    localStorage.setItem(SNOOZE_KEY, JSON.stringify({ '/old': Date.now() - 1 }));
    snoozePage('/new');
    expect(Object.keys(JSON.parse(localStorage.getItem(SNOOZE_KEY)))).to.deep.equal(['/new']);
    localStorage.setItem(SNOOZE_KEY, '{not json');
    expect(isPageSnoozed('/new')).to.be.false;
  });
});

describe('hasSettledIssues', () => {
  const never = new Promise(() => {});

  it('opens the pop-up for warnings too, not only critical issues', async () => {
    expect(await hasSettledIssues({ seo: [{ status: 'fail', severity: 'warning' }] })).to.be.true;
    expect(await hasSettledIssues({ performance: [{ status: 'limbo' }] })).to.be.true;
  });

  it('counts finished async SEO checks, including ones that threw', async () => {
    expect(await hasSettledIssues({ seo: [Promise.resolve({ status: 'fail', severity: 'critical' })] })).to.be.true;
    expect(await hasSettledIssues({ seo: [Promise.reject(new Error('down'))] })).to.be.true;
  });

  it('does not wait on a pending link check or flag a clean page', async () => {
    expect(await hasSettledIssues({ seo: [{ status: 'pass' }, never] })).to.be.false;
    expect(await hasSettledIssues()).to.be.false;
  });
});

describe('groupByPriority', () => {
  const fail = (extra) => ({ status: 'fail', ...extra });

  it('lists failing checks per level, Blocker to Normal, with counts for aggregates', () => {
    expect(groupByPriority({
      performance: [fail({ checkId: 'icons', title: 'Icons' }), fail({ checkId: 'lcp-element', title: 'LCP' })],
      seo: [fail({ checkId: 'lorem-ipsum', title: 'Lorem Ipsum' }), { checkId: 'canonical', status: 'pass' }],
      structure: [{ id: 'footer', title: 'Footer', status: 'limbo' }],
      accessibility: [fail({ checkId: 'accessibility', title: 'Accessibility', details: { issuesCount: 5 } })],
      merch: [
        fail({ name: 'M@S Unpublished Fragments', details: { unpublished: [{}, {}] } }),
        fail({ checkId: 'static-prices', title: 'Static prices', details: { prices: [{}] } }),
      ],
    })).to.deep.equal([
      { level: 'Blocker', items: ['Lorem Ipsum', 'M@S Unpublished Fragments (2)'] },
      { level: 'Critical', items: ['Static prices (1)', 'Accessibility (5)'] },
      { level: 'Major', items: ['LCP'] },
      { level: 'Normal', items: ['Footer', 'Icons'] },
    ]);
  });

  it('never ranks an undecided (limbo) check above Normal, like the panel shows it', () => {
    const linkServiceDown = { checkId: 'broken-links', title: 'Links', status: 'limbo', severity: 'critical' };
    expect(groupByPriority({ seo: [linkServiceDown] }))
      .to.deep.equal([{ level: 'Normal', items: ['Links'] }]);
  });

  it('ranks asset dimensions above the fold as Critical and below it as Normal', () => {
    const assets = [{
      title: 'Asset Dimensions',
      status: 'pass',
      details: { criticalAssetFailures: [{}, {}], warningAssetFailures: [{}] },
    }];
    expect(groupByPriority({ assets })).to.deep.equal([
      { level: 'Critical', items: ['Asset Dimensions above the fold (2)'] },
      { level: 'Normal', items: ['Asset Dimensions below the fold (1)'] },
    ]);
  });

  it('falls back to severity for unmapped checks and maps ASO ids', () => {
    expect(groupByPriority({
      seo: [fail({ id: 'title', title: 'Title size' }), fail({ id: 'links', title: 'Links' })],
      structure: [
        fail({ id: 'new-critical', title: 'New A', severity: 'critical' }),
        fail({ id: 'new-warning', title: 'New B', severity: 'warning' }),
      ],
    })).to.deep.equal([
      { level: 'Blocker', items: ['Links'] },
      { level: 'Critical', items: ['New A', 'Title size'] },
      { level: 'Normal', items: ['New B'] },
    ]);
  });

  it('ignores passing checks and accessibility runs that could not count issues', () => {
    expect(groupByPriority({
      accessibility: [{ checkId: 'accessibility', status: 'limbo', details: { issuesCount: null } }],
      merch: [{ name: 'M@S Unpublished Fragments', status: 'pass' }],
      seo: [{ checkId: 'title-size', status: 'pass' }],
    })).to.deep.equal([]);
    expect(groupByPriority()).to.deep.equal([]);
  });
});

describe('preview pop-up', function previewPopupSuite() {
  // The first Preflight run waits out the M@S hydration delay (3s).
  this.timeout(10000);

  before(() => {
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' }, footerReady: true });
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
      text: async () => '',
    });
  });

  after(() => {
    sinon.restore();
    document.querySelector('.milo-preflight-overlay')?.remove();
    localStorage.removeItem(SNOOZE_KEY);
  });

  it('shows a focused alert dialog with issue levels in order and closes on Escape', async () => {
    await showNotification();

    const dialog = document.querySelector('.milo-preflight-overlay.preflight-popup [role="alertdialog"]');
    expect(dialog).to.exist;
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')).textContent)
      .to.equal('Preflight found issues on this page');
    expect(document.activeElement.textContent).to.equal('Review issues');
    const levels = [...dialog.querySelectorAll('.notification-group strong')]
      .map((label) => label.textContent);
    expect(levels.length).to.be.greaterThan(0);
    expect(levels).to.deep.equal(['Blocker:', 'Critical:', 'Major:', 'Normal:'].filter((l) => levels.includes(l)));
    const [firstGroup] = dialog.querySelectorAll('.notification-group');
    // The fixture has no header or footer, so a Blocker leads.
    expect(firstGroup.classList.contains('is-blocker')).to.be.true;
    expect(firstGroup.textContent).to.include('Navigation');
    dialog.querySelectorAll('.notification-group').forEach((group) => {
      expect(group.textContent).to.match(/^\w+: \S/);
    });

    expect(isPageSnoozed()).to.be.false;
    dialog.querySelector('.notification-snooze input').checked = true;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.milo-preflight-overlay')).to.be.null;
    expect(isPageSnoozed()).to.be.true;
  });
});
