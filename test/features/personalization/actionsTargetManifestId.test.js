import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { init, handleFragmentCommand } from '../../../libs/features/personalization/personalization.js';
import mepSettings from './mepTargetSettings.js';

document.head.innerHTML = await readFile({ path: './mocks/metadata.html' });
document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

// Add custom keys so tests doesn't rely on real data
const config = getConfig();
config.env = { name: 'prod' };

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('replace action', () => {
  it('with a CSS Selector, it should replace an element with a fragment', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestReplace.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });

  it('with a fragment selector, it should replace a fragment in the document', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

    let manifestJson = await readFile({ path: './mocks/actions/manifestReplace.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });
});

describe('insertAfter action', async () => {
  it('insertContentAfter should add fragment after target content and fragment', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestInsertAfter.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });
});

describe('insertBefore action', async () => {
  it('insertContentBefore should add fragment before target content and fragment', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestInsertBefore.json' });

    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });
});

describe('prependToSection action', async () => {
  it('appendToSection should add fragment to beginning of section', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestPrependToSection.json' });

    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/test/features/personalization/mocks/fragments/prependToSection"]')).to.be.null;
    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });
});

describe('appendToSection action', async () => {
  it('appendToSection should add fragment to end of section', async () => {
    config.mep = { handleFragmentCommand };
    let manifestJson = await readFile({ path: './mocks/actions/manifestAppendToSection.json' });

    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });
});

describe('useBlockCode action', async () => {
  it('useBlockCode should override a current block with the custom block code provided', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestUseBlockCode.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.experiments[0].selectedVariant.useblockcode[0].targetManifestId).to.equal('manifest.json');
  });

  it('useBlockCode should be able to use a new type of block', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestUseBlockCode2.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.experiments[0].selectedVariant.useblockcode[0].targetManifestId).to.equal('manifest.json');
  });
});

describe('custom actions', async () => {
  it('should not add custom configuration if not needed', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestReplace.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await init(mepSettings);
    expect(getConfig().mep.commands[0].targetManifestId).to.equal('manifest.json');
  });

  it('should add a custom action configuration', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestCustomAction.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await init(mepSettings);
    expect(getConfig().mep.inBlock['my-block'].commands[0].targetManifestId).to.equal('manifest.json');
    expect(getConfig().mep.inBlock['my-block'].commands[1].targetManifestId).to.equal('manifest.json');
    expect(getConfig().mep.inBlock['my-block'].fragments['/fragments/sub-menu'].targetManifestId).to.equal('manifest.json');
    expect(getConfig().mep.inBlock['my-block'].fragments['/fragments/new-sub-menu'].targetManifestId).to.equal('manifest.json');
  });
});
