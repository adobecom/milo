import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, MILO_EVENTS } from '../../../libs/utils/utils.js';
import showDraftStatus, { summarize } from '../../../libs/features/preflight/draft-status.js';
import { waitFor } from '../../helpers/waitfor.js';

const tabs = (...counts) => Object.fromEntries(counts.map((count, idx) => [idx, count]));

describe('summarize', () => {
  it('reports issues and warnings as a failure', () => {
    expect(summarize(tabs({ errors: 2, warnings: 1 }, { errors: 1, warnings: 0 })))
      .to.deep.equal({ status: 'fail', text: 'Preflight found 3 issues, 1 warning' });
  });

  it('reports warnings only as a warning', () => {
    expect(summarize(tabs({ errors: 0, warnings: 1 }, { errors: 0, warnings: 0 })))
      .to.deep.equal({ status: 'warn', text: 'Preflight found 1 warning' });
  });

  it('reports a pass when nothing fails', () => {
    expect(summarize(tabs({ errors: 0, warnings: 0 })))
      .to.deep.equal({ status: 'pass', text: 'Preflight: no issues' });
  });
});

describe('showDraftStatus', () => {
  const bar = () => document.documentElement.querySelector(':scope > .draft-status');
  const result = () => waitFor(() => bar().dataset.status !== 'checking', 5000, 50);
  const settle = () => new Promise((resolve) => { setTimeout(resolve, 100); });
  const rerender = () => document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  let main;

  before(() => {
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' } });
    sinon.stub(window, 'fetch').resolves({ ok: true, status: 200, json: async () => ({ data: [] }), text: async () => '' });
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
    await settle();
    expect(window.fetch.callCount).to.equal(checksBefore);
    expect(bar().dataset.status).to.not.equal('checking');
  });

  it('re-checks when the draft content changes, keeping the last result visible', async () => {
    const checksBefore = window.fetch.callCount;
    main.querySelector('p').textContent = 'Edited paragraph';
    rerender();
    expect(bar().dataset.status).to.not.equal('checking');
    await waitFor(() => window.fetch.callCount > checksBefore, 2000, 20);
  });

  it('opens the report outside the body so it survives edits, and closes it', async () => {
    bar().querySelector('.preflight-review-link').click();
    await waitFor(() => document.documentElement.querySelector(':scope > #preflight'), 5000, 50);
    const dialog = document.getElementById('preflight');
    expect(dialog.nextElementSibling.classList.contains('modal-curtain')).to.equal(true);
    dialog.querySelector('.dialog-close').click();
    await waitFor(() => !document.querySelector('#preflight, .modal-curtain'), 2000, 50);
  });

  it('stops checking once closed', async () => {
    bar().querySelector('.notification-close').click();
    await settle();
    const checksBefore = window.fetch.callCount;
    main.querySelector('p').textContent = 'Edited after closing';
    rerender();
    await settle();
    expect(bar()).to.equal(null);
    expect(window.fetch.callCount).to.equal(checksBefore);
  });
});
