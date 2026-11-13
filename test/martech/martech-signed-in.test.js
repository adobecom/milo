/* eslint-disable no-underscore-dangle */
import { expect } from 'chai';
import sinon from 'sinon';
import { enablePersonalizationV2, setConfig } from '../../libs/utils/utils.js';

const { default: init } = await import('../../libs/martech/martech.js');

const AMCV = 'AMCV_9E1005A551ED61CA0A490D45%40AdobeOrg';
const LAUNCH = 'https://www.adobe.com/marketingtech/main.standard.qa.min.js';

describe('martech init for a signed-in visitor', () => {
  let metas = [];

  before(() => {
    setConfig({ locales: { '': { ietf: 'en-US' } }, miloLibs: '/libs' });
    document.head.insertAdjacentHTML('beforeend', `<script src="${LAUNCH}" type="javascript/blocked" data-loaded="true"></script>`);
    window._satellite = { track: sinon.stub() };
    sinon.stub(window.performance, 'getEntriesByType').returns([{ serverTiming: [{ name: 'sis', description: '1' }] }]);
    document.cookie = `${AMCV}=${encodeURIComponent('MCMID|111')}; path=/`;
    metas = ['personalization-v2', 'personalization-v2-signed-in'].map((name) => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', 'on');
      document.head.appendChild(meta);
      return meta;
    });
  });

  after(() => {
    sinon.restore();
    metas.forEach((meta) => meta.remove());
    document.head.querySelector(`script[src="${LAUNCH}"]`)?.remove();
    document.cookie = `${AMCV}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    localStorage.removeItem('milo-signed-in-ecid');
    delete window._satellite;
    delete window.marketingtech;
  });

  it('uses v2 on later page views once Adobe has had time to link the ECID', async () => {
    await init();
    expect(enablePersonalizationV2()).to.be.false;

    window.dispatchEvent(new CustomEvent('alloy_sendEvent', { detail: {} }));
    expect(enablePersonalizationV2()).to.be.false;

    sinon.useFakeTimers({ now: Date.now() + 2 * 60 * 1000, toFake: ['Date'] });
    expect(enablePersonalizationV2()).to.be.true;
  });
});
