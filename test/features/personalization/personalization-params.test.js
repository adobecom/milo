import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { init } from '../../../libs/features/personalization/personalization.js';
import spoofParams from './spoofParams.js';
import mepSettings from './mepSettings.js';

document.head.innerHTML = await readFile({ path: './mocks/metadata.html' });
document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

async function loadManifestAndSetResponse(manifestPath) {
  let manifestJson = await readFile({ path: manifestPath });
  manifestJson = JSON.parse(manifestJson);
  setFetchResponse(manifestJson);
}

// Note that the manifestPath doesn't matter as we stub the fetch
describe('Functional Test', () => {
  before(() => {
    // Add custom keys so tests doesn't rely on real data
    const config = getConfig();
    config.env = { name: 'prod' };
    config.consumerEntitlements = {
      '11111111-aaaa-bbbb-6666-cccccccccccc': 'my-special-app',
      '22222222-xxxx-bbbb-7777-cccccccccccc': 'fireflies',
    };
  });

  it('should override to param-newoffer=123', async () => {
    spoofParams({ newoffer: '123' });
    const config = getConfig();
    await loadManifestAndSetResponse('./mocks/actions/manifestAppendToSection.json');
    setTimeout(async () => {
      await init(mepSettings);
      expect(config.mep.experiments[0].selectedVariantName).to.equal('param-newoffer=123');
    }, 100);
  });
});
