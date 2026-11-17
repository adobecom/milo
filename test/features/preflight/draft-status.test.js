import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, MILO_EVENTS } from '../../../libs/utils/utils.js';
import showDraftStatus, { summarize, RECHECK_DEBOUNCE_MS } from '../../../libs/features/preflight/draft-status.js';
import { waitFor } from '../../helpers/waitfor.js';

describe('summarize', () => {
  it('reports issues and warnings as a failure', () => {
    expect(summarize({ General: { errors: 2, warnings: 1 }, SEO: { errors: 1, warnings: 0 } }))
      .to.deep.equal({ status: 'fail', text: 'Preflight found 3 issues, 1 warning' });
  });

  it('reports warnings only as a warning', () => {
    expect(summarize({ General: { errors: 0, warnings: 1 }, SEO: { errors: 0, warnings: 0 } }))
      .to.deep.equal({ status: 'warn', text: 'Preflight found 1 warning' });
  });

  it('reports a pass when nothing fails', () => {
    expect(summarize({ General: { errors: 0, warnings: 0 } }))
      .to.deep.equal({ status: 'pass', text: 'Preflight: no issues' });
  });
});

describe('showDraftStatus', () => {
  const bar = () => document.documentElement.querySelector(':scope > .draft-status');
  const result = () => waitFor(() => bar().dataset.status !== 'checking', 5000, 50);
  const settle = () => new Promise((resolve) => { setTimeout(resolve, 100); });
  const pastDebounce = () => new Promise((resolve) => {
    setTimeout(resolve, RECHECK_DEBOUNCE_MS + 200);
  });
  const rerender = () => document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  const issueCount = () => Number(bar().textContent.match(/(\d+) issues?/)?.[1] ?? 0);
  const checksRun = () => window.fetch.getCalls()
    .filter(({ args }) => String(args[0]).includes('preflight-exclusions')).length;
  const respond = async (url) => (String(url).includes('/.milo/config.json')
    ? { ok: false, status: 404 }
    : { ok: true, status: 200, json: async () => ({ data: [] }), text: async () => '' });
  let main;
  const replaceBody = (edit) => {
    const draft = main.cloneNode(true);
    edit(draft);
    document.body.innerHTML = draft.outerHTML;
    main = document.querySelector('main');
  };

  before(() => {
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' }, footerReady: true });
    sinon.stub(window, 'fetch').callsFake(respond);
    main = document.createElement('main');
    main.innerHTML = '<div><h1>Draft</h1><p>First paragraph</p></div>';
    document.body.append(main);
  });

  after(() => {
    sinon.restore();
    bar()?.remove();
    main.remove();
  });

  it('shows the Preflight result once, outside the body DA replaces', async () => {
    showDraftStatus();
    showDraftStatus();
    expect(document.documentElement.querySelectorAll(':scope > .draft-status').length).to.equal(1);
    expect(document.body.contains(bar())).to.equal(false);
    await result();
    expect(bar().querySelector('[role=status]').textContent).to.match(/^Preflight( found \d+ (issue|warning)|: no issues)/);
  });

  it('ignores re-renders that only move the DA cursor', async () => {
    await settle();
    const checksBefore = window.fetch.callCount;
    main.querySelector('p').insertAdjacentHTML('afterbegin', '<span id="da-cursor-position"></span>');
    rerender();
    await pastDebounce();
    expect(window.fetch.callCount).to.equal(checksBefore);
    expect(bar().dataset.status).to.not.equal('checking');
  });

  it('ignores a DA body replacement that only moves the cursor', async function test() {
    this.timeout(10000);
    await settle();
    const checksBefore = window.fetch.callCount;
    replaceBody((draft) => {
      draft.querySelector('#da-cursor-position')?.remove();
      draft.querySelector('p').append(Object.assign(document.createElement('span'), { id: 'da-cursor-position' }));
    });
    rerender();
    await pastDebounce();
    expect(window.fetch.callCount).to.equal(checksBefore);
  });

  it('re-checks when a DA body replacement changes the content', async function test() {
    this.timeout(15000);
    const issuesBefore = issueCount();
    replaceBody((draft) => { draft.querySelector('p').textContent = 'Lorem ipsum dolor sit amet'; });
    rerender();
    await waitFor(() => issueCount() === issuesBefore + 1, 8000, 50);

    replaceBody((draft) => { draft.querySelector('p').textContent = 'First paragraph'; });
    rerender();
    await waitFor(() => issueCount() === issuesBefore, 8000, 50);
  });

  it('re-checks when the draft content changes, keeping the last result visible', async function test() {
    this.timeout(10000);
    const issuesBefore = issueCount();
    main.querySelector('p').textContent = 'Lorem ipsum dolor sit amet';
    rerender();
    expect(bar().dataset.status).to.not.equal('checking');
    await waitFor(() => issueCount() === issuesBefore + 1, 5000, 50);
  });

  it('re-checks edits to an image that holds the DA cursor', async function test() {
    this.timeout(10000);
    const runsBeforeAdd = checksRun();
    main.querySelector('p').insertAdjacentHTML('afterend', '<img id="da-cursor-position" alt="">');
    rerender();
    await waitFor(() => checksRun() > runsBeforeAdd, 5000, 20);
    await settle();
    const runsBefore = checksRun();
    main.querySelector('img').alt = 'Team photo';
    rerender();
    await waitFor(() => checksRun() > runsBefore, 5000, 20);
  });

  it('runs one check for a burst of edits', async function test() {
    this.timeout(10000);
    await settle();
    const runsBefore = checksRun();
    ['One', 'Two', 'Three'].forEach((text) => {
      main.querySelector('p').textContent = text;
      rerender();
    });
    await pastDebounce();
    await settle();
    expect(checksRun()).to.equal(runsBefore + 1);
  });

  it('runs its own accessibility test for an edit made while an older check runs', async function test() {
    this.timeout(15000);
    await settle();
    let releaseFirstRun;
    const axeRun = sinon.stub(window.axe, 'run').callsFake(async () => {
      if (axeRun.callCount === 1) await new Promise((resolve) => { releaseFirstRun = resolve; });
      return { violations: [] };
    });
    main.querySelector('p').textContent = 'Older draft';
    rerender();
    await waitFor(() => axeRun.callCount === 1, 5000, 20);
    main.querySelector('p').textContent = 'Newer draft';
    rerender();
    await pastDebounce();
    releaseFirstRun();

    await waitFor(() => axeRun.callCount === 2, 8000, 50);
    axeRun.restore();
  });

  it('shows an error and logs it when the checks cannot run', async function test() {
    this.timeout(10000);
    window.lana = { log: sinon.stub() };
    window.fetch.callsFake(async (url) => (String(url).includes('preflight-exclusions')
      ? { ok: true, json: async () => ({ data: 'not-a-list' }) }
      : respond(url)));
    main.querySelector('p').textContent = 'Checks will fail';
    rerender();
    await waitFor(() => bar().dataset.status === 'error', 5000, 50);
    expect(window.lana.log.calledWith(sinon.match('Preflight draft status failed'), { tags: 'preflight' }))
      .to.equal(true);
    window.fetch.callsFake(respond);
    delete window.lana;
  });

  it('retries the same content after a failed run', async function test() {
    this.timeout(10000);
    window.lana = { log: sinon.stub() };
    window.fetch.callsFake(async (url) => (String(url).includes('preflight-exclusions')
      ? { ok: true, json: async () => ({ data: 'not-a-list' }) }
      : respond(url)));
    main.querySelector('p').textContent = 'Fails once';
    rerender();
    await waitFor(() => window.lana.log.called, 5000, 20);
    expect(bar().dataset.status).to.equal('error');
    window.fetch.callsFake(respond);
    rerender();
    await waitFor(() => bar().dataset.status !== 'error', 5000, 50);
    delete window.lana;
  });

  it('re-checks when body is the area loaded', async function test() {
    this.timeout(10000);
    const issuesBefore = issueCount();
    main.querySelector('p').textContent = 'Lorem ipsum dolor sit amet';
    document.body.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    await waitFor(() => issueCount() === issuesBefore + 1, 5000, 50);
    main.querySelector('p').textContent = 'First paragraph';
    rerender();
    await waitFor(() => issueCount() === issuesBefore, 5000, 50);
  });

  it('re-checks when only main is loaded, but not for a fragment inside it', async function test() {
    this.timeout(10000);
    await settle();
    const issuesBefore = issueCount();
    const checksBefore = window.fetch.callCount;
    main.querySelector('p').textContent = 'Lorem ipsum dolor sit amet';
    main.querySelector('div').dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    await pastDebounce();
    await settle();
    expect(window.fetch.callCount).to.equal(checksBefore);

    main.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    await waitFor(() => issueCount() === issuesBefore + 1, 5000, 50);
    main.querySelector('p').textContent = 'First paragraph';
    rerender();
    await waitFor(() => issueCount() === issuesBefore, 5000, 50);
  });

  it('opens one report outside the body so it survives edits, and closes it', async () => {
    const review = bar().querySelector('.preflight-review-link');
    review.click();
    review.click();
    await waitFor(() => document.documentElement.querySelector(':scope > #preflight'), 5000, 50);
    await settle();
    expect(document.querySelectorAll('#preflight, .modal-curtain').length).to.equal(2);
    const dialog = document.getElementById('preflight');
    expect(dialog.nextElementSibling.classList.contains('modal-curtain')).to.equal(true);
    dialog.querySelector('.dialog-close').click();
    await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
  });

  it('unmounts a report once a fresh one replaces it', async function test() {
    this.timeout(20000);
    const report = () => document.querySelector('#preflight .preflight');
    bar().querySelector('.preflight-review-link').click();
    await waitFor(report, 5000, 50);
    const oldReport = report();
    main.querySelector('p').textContent = 'Edited with the report open';
    rerender();
    await waitFor(() => report() !== oldReport, 8000, 50);

    report().querySelector('#tab-2').click();
    await settle();

    expect(oldReport.querySelector('#tab-2')?.getAttribute('aria-selected')).to.not.equal('true');
    report().querySelector('#tab-1').click();
    document.querySelector('#preflight .dialog-close').click();
    await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
  });

  it('refreshes the General inventory and alt-text audit of the open report', async function test() {
    this.timeout(20000);
    const report = () => document.querySelector('#preflight .preflight');
    bar().querySelector('.preflight-review-link').click();
    await waitFor(report, 5000, 50);
    const oldReport = report();
    main.querySelector('p').insertAdjacentHTML('afterend', '<a href="/review-test-new-link">New</a><img src="/review-test-alt.png" alt="">');
    rerender();
    await waitFor(() => report() !== oldReport, 8000, 50);
    await waitFor(() => report()?.textContent.includes('/review-test-new-link'), 5000, 50);
    await waitFor(() => report()?.querySelector('img[src$="review-test-alt.png"]'), 5000, 50);

    document.querySelector('#preflight .dialog-close').click();
    await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
    main.querySelectorAll('a[href="/review-test-new-link"], img[alt=""]').forEach((el) => el.remove());
  });

  it('shows the current draft when the report is reopened after an edit', async function test() {
    this.timeout(20000);
    const report = () => document.querySelector('#preflight .preflight');
    const closeReport = async () => {
      document.querySelector('#preflight .dialog-close').click();
      await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
    };
    bar().querySelector('.preflight-review-link').click();
    await waitFor(report, 5000, 50);
    await settle();
    await closeReport();

    const issuesBefore = issueCount();
    main.querySelector('p').insertAdjacentHTML('afterend', '<p>Lorem ipsum dolor sit amet</p><a href="/review-test-new-link">New</a>');
    rerender();
    await waitFor(() => issueCount() > issuesBefore, 8000, 50);
    bar().querySelector('.preflight-review-link').click();
    await waitFor(() => report()?.textContent.includes('/review-test-new-link'), 5000, 50);
    await closeReport();
    main.querySelectorAll('p + p, a[href="/review-test-new-link"]').forEach((el) => el.remove());
  });

  it('opens one report when Review is clicked again while it loads', async function test() {
    this.timeout(10000);
    setConfig({ codeRoot: '/test/features/preflight/mocks', georouting: { enabled: 'off' }, footerReady: true });
    const heldReports = [];
    window.holdReport = () => new Promise((resolve) => { heldReports.push(resolve); });
    const review = bar().querySelector('.preflight-review-link');
    review.click();
    await waitFor(() => heldReports.length, 5000, 20);
    review.click();
    await new Promise((resolve) => { setTimeout(resolve, 500); });
    heldReports.forEach((release) => release());
    await waitFor(() => document.querySelector('#preflight'), 5000, 20);
    await settle();

    expect(document.querySelectorAll('#preflight').length).to.equal(1);
    delete window.holdReport;
    document.querySelector('#preflight .dialog-close').click();
    await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' }, footerReady: true });
  });

  it('unmounts the new report when the open one is closed during a refresh', async function test() {
    this.timeout(15000);
    setConfig({ codeRoot: '/test/features/preflight/mocks', georouting: { enabled: 'off' }, footerReady: true });
    window.unmountedReports = [];
    bar().querySelector('.preflight-review-link').click();
    await waitFor(() => document.querySelector('#preflight .preflight'), 5000, 20);
    const closedReport = document.querySelector('#preflight .preflight');
    const heldReports = [];
    window.holdReport = () => new Promise((resolve) => { heldReports.push(resolve); });
    main.querySelector('p').textContent = 'Edited, then the report is closed';
    rerender();
    await waitFor(() => heldReports.length, 8000, 20);
    document.querySelector('#preflight .dialog-close').click();
    await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
    heldReports.forEach((release) => release());
    await waitFor(() => window.unmountedReports.length, 2000, 20);
    expect(window.unmountedReports).to.have.length(1);
    expect(window.unmountedReports[0] === closedReport).to.equal(false);

    delete window.holdReport;
    delete window.unmountedReports;
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' }, footerReady: true });
  });

  it('stops checking once closed, even for an edit still waiting to be checked', async () => {
    main.querySelector('p').textContent = 'Edited as it closes';
    rerender();
    bar().querySelector('.notification-close').click();
    const checksBefore = window.fetch.callCount;
    rerender();
    await pastDebounce();
    expect(bar()).to.equal(null);
    expect(window.fetch.callCount).to.equal(checksBefore);
  });
});
