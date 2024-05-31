import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import initFragments from '../../../libs/blocks/fragment/fragment.js';
import { applyPers, handleFragmentCommand } from '../../../libs/features/personalization/personalization.js';
import spoofParams from './spoofParams.js';

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

// Note that the manifestPath doesn't matter as we stub the fetch
describe('Functional Test', () => {
  before(() => {
    // Add custom keys so tests doesn't rely on real data
    const config = getConfig();
    config.env = { name: 'prod' };
    config.mep = { handleFragmentCommand };
  });

  it('replaceContent should replace an element with a fragment', async () => {
    let manifestJson = await readFile({ path: './mocks/deprecatedActions/manifestReplaceContent.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('#features-of-milo-experimentation-platform')).to.not.be.null;
    expect(document.querySelector('.how-to')).to.not.be.null;
    const parentEl = document.querySelector('#features-of-milo-experimentation-platform')?.parentElement;

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(document.querySelector('#features-of-milo-experimentation-platform')).to.be.null;
    expect(parentEl.firstElementChild.firstElementChild.href)
      .to.equal('http://localhost:2000/test/features/personalization/mocks/fragments/milo-replace-content-chrome-howto-h2');
    // .how-to should not be changed as it is targeted to firefox
    expect(document.querySelector('.how-to')).to.not.be.null;
  });

  it('removeContent should remove z-pattern content from the page', async () => {
    let manifestJson = await readFile({ path: './mocks/deprecatedActions/manifestRemoveContent.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(document.querySelector('.z-pattern')).to.be.null;
  });

  it('insertContentAfter should add fragment after target element', async () => {
    let manifestJson = await readFile({ path: './mocks/deprecatedActions/manifestInsertContentAfter.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/insertafter"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('insertContentBefore should add fragment before target element', async () => {
    let manifestJson = await readFile({ path: './mocks/deprecatedActions/manifestInsertContentBefore.json' });

    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/insertbefore"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertbefore"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.parentElement.children[1].className).to.equal('marquee');
  });

  it('replaceFragment should replace a fragment in the document', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

    let manifestJson = await readFile({ path: './mocks/deprecatedActions/manifestReplaceFragment.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/replaceme"]')).to.exist;
    expect(document.querySelector('a[href="/fragments/inline-replaceme#_inline"]')).to.exist;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragmentResp = await readFile({ path: './mocks/fragments/fragmentReplaced.plain.html' });
    const inlineFragmentResp = await readFile({ path: './mocks/fragments/inlineFragReplaced.plain.html' });

    window.fetch = stub();
    window.fetch.withArgs('http://localhost:2000/test/features/personalization/mocks/fragments/fragmentReplaced.plain.html')
      .returns(getFetchPromise(fragmentResp, 'text'));
    window.fetch.withArgs('http://localhost:2000/test/features/personalization/mocks/fragments/inlineFragReplaced.plain.html')
      .returns(getFetchPromise(inlineFragmentResp, 'text'));

    const replacemeFrag = document.querySelector('a[href="/fragments/replaceme"]');
    await initFragments(replacemeFrag);
    expect(document.querySelector('a[href="/fragments/replaceme"]')).to.be.null;
    expect(document.querySelector('div[data-path="/test/features/personalization/mocks/fragments/fragmentReplaced"]')).to.exist;

    const inlineReplacemeFrag = document.querySelector('a[href="/fragments/inline-replaceme#_inline"]');
    await initFragments(inlineReplacemeFrag);
    expect(document.querySelector('a[href="/fragments/inline-replaceme#_inline"]')).to.be.null;
    expect(document.querySelector('.inlinefragmentreplaced')).to.exist;
  });

  it('removeContent should tag but not remove content in preview', async () => {
    spoofParams({ mep: '' });
    setTimeout(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

      let manifestJson = await readFile({ path: './mocks/deprecatedActions/manifestRemoveContent.json' });
      manifestJson = JSON.parse(manifestJson);
      setFetchResponse(manifestJson);

      expect(document.querySelector('.z-pattern')).to.not.be.null;
      await applyPers([{ manifestPath: '/mocks/manifestRemove.json' }]);
      expect(document.querySelector('.z-pattern')).to.not.be.null;
      expect(document.querySelector('.z-pattern').dataset.removedManifestId).to.not.be.null;

      const removeMeFrag = document.querySelector('a[href="/fragments/removeme"]');
      await initFragments(removeMeFrag);
      expect(document.querySelector('a[href="/fragments/removeme"]')).to.not.be.null;
      expect(document.querySelector('a[href="/fragments/removeme"]').dataset.removedManifestId).to.not.be.null;
    }, 100);
  });
});
