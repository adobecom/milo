import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import { getPreflightResults, clearPreflightCache } from '../../../../libs/blocks/preflight/checks/preflightApi.js';

const okResponse = { ok: true, status: 200, json: async () => ({ data: [] }), text: async () => '' };

describe('getPreflightResults', () => {
  let main;

  beforeEach(() => {
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' } });
    main = document.createElement('main');
    document.body.append(main);
  });

  afterEach(() => {
    sinon.restore();
    main.remove();
  });

  it('runs the checks when the exclusions sheet cannot load', async () => {
    sinon.stub(window, 'fetch').callsFake(async (url) => (String(url).includes('preflight-exclusions')
      ? { ok: false, status: 500 }
      : okResponse));
    main.innerHTML = '<div><h1>Draft</h1></div>';

    const results = await getPreflightResults({ useCache: false, merchDelayMs: 0 });

    expect(results.runChecks.structure).to.be.an('array');
  });

  it('an older check that finishes late does not hand its result to a newer check', async () => {
    let holdNextExclusions = false;
    let releaseNewer;
    sinon.stub(window, 'fetch').callsFake(async (url) => {
      if (holdNextExclusions && String(url).includes('preflight-exclusions')) {
        holdNextExclusions = false;
        await new Promise((resolve) => { releaseNewer = resolve; });
      }
      return okResponse;
    });
    main.innerHTML = '<div><h1>One</h1><h1>Two</h1></div>';

    const older = getPreflightResults({ merchDelayMs: 300 });
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    main.innerHTML = '<div><h1>Only one</h1></div>';
    clearPreflightCache();
    holdNextExclusions = true;
    const newer = getPreflightResults({ merchDelayMs: 0 });
    const olderResult = await older;
    releaseNewer();
    const newerResult = await newer;

    expect(newerResult === olderResult).to.equal(false);
  });
});
