import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
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

  it('deduplicates by normalized origin and environment', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: () => Promise.resolve({
        configs: {
          data: [
            { key: 'prod.service.url', value: 'prod' },
            { key: 'stage.service.url', value: 'stage' },
          ],
        },
      }),
    });
    const origin = 'https://config.example/';

    const [first, second] = await Promise.all([
      getServiceConfig(origin, 'prod'),
      getServiceConfig('https://config.example', 'prod'),
    ]);
    expect(fetchStub.calledOnce).to.be.true;
    expect(first.service.url).to.equal('prod');
    expect(second).to.equal(first);

    const stage = await getServiceConfig(origin, 'stage');
    expect(fetchStub.calledTwice).to.be.true;
    expect(stage.service.url).to.equal('stage');
    fetchStub.restore();
  });

  it('caches failed config responses for the same origin and environment', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false });
    const origin = 'https://missing-config.example';
    const [first, second] = await Promise.all([
      getServiceConfig(origin, 'prod'),
      getServiceConfig(origin, 'prod'),
    ]);

    expect(fetchStub.calledOnce).to.be.true;
    expect(first.error).to.equal('Could not fetch .milo/config.');
    expect(second).to.equal(first);
    fetchStub.restore();
  });
});
