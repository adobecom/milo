/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import localization from '../../../../libs/blocks/preflight/checks/localization.js';

// runChecks memoizes for the modal session, so the whole suite shares one run.
describe('preflight checks localization', () => {
  let container;
  let result;
  let runA;

  before(async () => {
    container = document.createElement('div');
    container.innerHTML = `
      <a href="/preflight-loc-ok">ok 200</a>
      <a href="/preflight-loc-404">broken</a>
      <a href="/preflight-loc-404">broken duplicate</a>
      <a href="/preflight-loc-404b">broken 2</a>
      <a href="#section">in-page anchor</a>
      <a href="/#top">home hash</a>
      <a href="/preflight-loc-headfail">head fails, get ok</a>
    `;
    document.body.append(container);

    sinon.stub(window, 'fetch').callsFake((url, opts = {}) => {
      const u = String(url);
      const method = opts.method || 'GET';
      if (u.includes('preflight-loc-headfail')) {
        return method === 'HEAD'
          ? Promise.reject(new Error('no head'))
          : Promise.resolve({ ok: true, status: 200 });
      }
      if (u.includes('preflight-loc-404')) return Promise.resolve({ ok: false, status: 404 });
      return Promise.resolve({ ok: true, status: 200 });
    });

    runA = localization.runChecks({ area: container });
    [result] = await runA;
  });

  after(() => {
    sinon.restore();
    container.remove();
  });

  it('returns a single link-localization check result', () => {
    expect(result.id).to.equal('link-localization');
    expect(result.title).to.equal('Links');
  });

  it('flags broken links and de-duplicates repeated hrefs', () => {
    const urls = result.details.violations.map((v) => v.url);
    expect(urls.filter((u) => u.endsWith('/preflight-loc-404')).length).to.equal(1);
    expect(urls.some((u) => u.endsWith('/preflight-loc-404b'))).to.be.true;
  });

  it('does not flag valid links or in-page anchors', () => {
    const urls = result.details.violations.map((v) => v.url);
    expect(urls.some((u) => u.includes('/preflight-loc-ok'))).to.be.false;
    expect(urls.some((u) => u.includes('/preflight-loc-headfail'))).to.be.false;
    expect(urls.some((u) => u.includes('#section'))).to.be.false;
  });

  it('reports FAIL status with a pluralized description', () => {
    expect(result.status).to.equal('fail');
    expect(result.description).to.match(/\d+ links/);
  });

  it('memoizes the run for the modal session', () => {
    expect(localization.runChecks({ area: container })).to.equal(runA);
  });
});
