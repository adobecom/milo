import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/preflight-notification.html' });
const { default: showNotification, groupByPriority, hasSettledIssues, isPageSnoozed, snoozePage } = await import('../../libs/utils/preflight-notification.js');
const SNOOZE_KEY = 'milo-preflight-popup-snooze';
const pressEscapeOn = (el) => el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

describe('snooze', () => {
  afterEach(() => localStorage.removeItem(SNOOZE_KEY));

  it('hides the pop-up for that page only, for 24 hours', () => {
    const now = Date.now();
    snoozePage('/a', now);
    expect(isPageSnoozed('/a')).to.be.true;
    expect(isPageSnoozed('/b')).to.be.false;
    snoozePage('/b', now - (25 * 60 * 60 * 1000));
    expect(isPageSnoozed('/b')).to.be.false;
    expect(JSON.parse(localStorage.getItem(SNOOZE_KEY))['/b']).to.equal(now - (25 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000));
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
  });

  it('does not open the pop-up for undecided (limbo) checks alone', async () => {
    expect(await hasSettledIssues({ performance: [{ status: 'limbo' }] })).to.be.false;
    expect(await hasSettledIssues({
      performance: [{ status: 'limbo' }],
      seo: [{ status: 'fail', severity: 'warning' }],
    })).to.be.true;
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
      accessibility: [fail({ checkId: 'accessibility', title: 'Accessibility', severity: 'critical', details: { issuesCount: 5 } })],
      merch: [
        fail({ name: 'M@S Unpublished Fragments', details: { unpublished: [{}, {}] } }),
        fail({ checkId: 'static-prices', title: 'Static prices', details: { prices: [{}] } }),
      ],
    })).to.deep.equal([
      { level: 'Blocker', items: ['Lorem Ipsum', 'M@S Unpublished Fragments (2)', 'Static prices (1)'] },
      { level: 'Critical', items: ['Accessibility (5)'] },
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
      severity: 'critical',
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
      { level: 'Critical', items: ['New A'] },
      { level: 'Major', items: ['Title size'] },
      { level: 'Normal', items: ['New B'] },
    ]);
  });

  it('ranks unpublished fragments as Blocker and unresolved placeholders as Critical, with item counts', () => {
    const content = [
      fail({ checkId: 'unpublished-fragments', title: 'Unpublished fragments', severity: 'critical', details: { items: [{}, {}] } }),
      fail({ checkId: 'unresolved-placeholders', title: 'Unresolved placeholders', severity: 'critical', details: { items: [{}] } }),
    ];
    expect(groupByPriority({ content })).to.deep.equal([
      { level: 'Blocker', items: ['Unpublished fragments (2)'] },
      { level: 'Critical', items: ['Unresolved placeholders (1)'] },
    ]);
  });

  it('lists undecided content checks as Normal without a count, and skips passing ones', () => {
    expect(groupByPriority({
      content: [
        { checkId: 'unpublished-fragments', title: 'Unpublished fragments', status: 'limbo', severity: 'critical', details: { items: [], unchecked: ['/a'] } },
        { checkId: 'unresolved-placeholders', title: 'Unresolved placeholders', status: 'pass', details: { items: [] } },
      ],
    })).to.deep.equal([{ level: 'Normal', items: ['Unpublished fragments'] }]);
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

  it('shows the original small toast instead of the pop-up on a snoozed page', async () => {
    snoozePage();
    await showNotification();
    const overlay = document.querySelector('.milo-preflight-overlay');
    expect(overlay.classList.contains('preflight-popup')).to.be.false;
    expect(overlay.querySelector('[role="dialog"]')).to.be.null;
    expect(overlay.textContent).to.include('Content quality checks are failing');
    expect(overlay.querySelector('.preflight-review-link')).to.exist;
    expect(overlay.querySelector('.notification-close').getAttribute('aria-label')).to.equal('Close');
    overlay.remove();
    localStorage.removeItem(SNOOZE_KEY);
  });

  it('shows a focused dialog with issue levels in order, without scrolling, and closes on its own Escape', async () => {
    const focusSpy = sinon.spy(HTMLElement.prototype, 'focus');
    await showNotification();

    const dialog = document.querySelector('.milo-preflight-overlay.preflight-popup [role="dialog"]');
    expect(dialog).to.exist;
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')).textContent)
      .to.equal('Preflight found issues on this page');
    expect(document.activeElement.textContent).to.equal('Review issues');
    expect(focusSpy.calledWith({ preventScroll: true })).to.be.true;
    focusSpy.restore();
    const levels = [...dialog.querySelectorAll('.notification-group strong')]
      .map((label) => label.textContent);
    const order = ['Blocker:', 'Critical:', 'Major:', 'Normal:'];
    expect(levels).to.deep.equal([...levels].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
    const [firstGroup] = dialog.querySelectorAll('.notification-group');
    expect(firstGroup.classList.contains('is-blocker')).to.be.true;
    expect(firstGroup.textContent).to.include('Navigation');

    expect(isPageSnoozed()).to.be.false;
    dialog.querySelector('.notification-snooze input').checked = true;
    pressEscapeOn(document.body);
    expect(document.querySelector('.milo-preflight-overlay')).to.exist;
    expect(isPageSnoozed()).to.be.false;
    pressEscapeOn(dialog);
    expect(isPageSnoozed()).to.be.true;
    expect(document.querySelector('[role="dialog"]')).to.be.null;
    const toast = document.querySelector('.milo-preflight-overlay');
    expect(toast.classList.contains('preflight-popup')).to.be.false;
    toast.querySelector('.notification-close').click();
    expect(document.querySelector('.milo-preflight-overlay')).to.be.null;
  });
});
