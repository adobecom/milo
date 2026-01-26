import { expect } from '@esm-bundle/chai';
import getServiceConfig from '../../libs/utils/service-config.js';

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
});
