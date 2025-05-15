import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { combineMepSources, getManifestConfig } from '../../../libs/features/personalization/personalization.js';

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

describe('personalization-roc functionality', () => {
  before(() => {
    const config = getConfig();
    config.env = { name: 'prod' };
    config.locale = { ietf: 'en-US', prefix: '' };
  });

  it('should accept personalization-roc manifests', async () => {
    const persEnabled = 'path1, path2';
    const rocPersEnabled = 'rocPath1';
    const promoEnabled = null;
    const mepParam = null;

    const result = await combineMepSources(persEnabled, promoEnabled, mepParam, rocPersEnabled);

    expect(result).to.deep.include.members([
      { manifestPath: 'path1', source: ['pzn'] },
      { manifestPath: 'path2', source: ['pzn'] },
      { manifestPath: 'rocpath1', source: ['pzn-roc'] },
    ]);
  });

  it('should handle empty rocPersEnabled gracefully', async () => {
    const persEnabled = 'path1, path2';
    const rocPersEnabled = null;
    const promoEnabled = null;
    const mepParam = null;

    const result = await combineMepSources(persEnabled, promoEnabled, mepParam, rocPersEnabled);

    expect(result).to.deep.include.members([
      { manifestPath: 'path1', source: ['pzn'] },
      { manifestPath: 'path2', source: ['pzn'] },
    ]);
  });

  it('should correctly prioritize execution order for pzn-roc manifests', async () => {
    const info = {
      manifestPath: '/path/to/manifest.json',
      source: [
        'pzn-roc',
      ],
    };
    const config = getConfig();
    config.mep = {};
    await loadManifestAndSetResponse('./mocks/manifestRoc.json');
    const manifestConfig = await getManifestConfig(info);
    expect(manifestConfig.executionOrder).to.equal('2-0');
  });
});
