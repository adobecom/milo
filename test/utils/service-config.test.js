import { expect } from '@esm-bundle/chai';
import getServiceConfig, { getSiteOrigin } from '../../libs/utils/service-config.js';

const ORIGIN = 'http://localhost:2000/test/utils/mocks';

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

describe('Service Config', () => {
  before(async () => {
    const { setConfig } = await import('../../libs/utils/utils.js');
    setConfig(config);
    window.hlx = { rum: { isSelected: false } };
  });

  it('Should have a local value', async () => {
    const { glaas } = await getServiceConfig(ORIGIN);
    expect(glaas.clientId).to.equal('local-not-super-secret-client-id');
  });

  it('Should fallbck to stage value', async () => {
    const { sharepoint } = await getServiceConfig(ORIGIN);
    expect(sharepoint.siteId).to.equal('milo-stage');
  });

  it('Should fallbck to prod value', async () => {
    const { sharepoint } = await getServiceConfig(ORIGIN);
    expect(sharepoint.siteId).to.equal('milo-stage');
  });

  describe('getSiteOrigin', () => {
    const originalHref = window.location.href;

    afterEach(() => {
      window.history.pushState({}, '', originalHref);
    });

    it('falls back to the current origin when repo/owner are absent', () => {
      window.history.pushState({}, '', '/test/utils/service-config.test.js');
      expect(getSiteOrigin()).to.equal(window.location.origin);
    });

    it('resolves a valid repo/owner pair to an aem.live origin', () => {
      window.history.pushState({}, '', '/?repo=milo&owner=adobecom');
      expect(getSiteOrigin()).to.equal('https://main--milo--adobecom.aem.live');
    });

    it('falls back to the current origin for hostile repo/owner values (VULN-38270)', () => {
      window.history.pushState({}, '', '/?repo=evil.com&owner=x');
      expect(getSiteOrigin()).to.equal(window.location.origin);
    });
  });
});
