import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig, loadBlock } from '../../../libs/utils/utils.js';
import initFragments from '../../../libs/blocks/fragment/fragment.js';
import { applyPers } from '../../../libs/features/personalization/personalization.js';

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

    expect(document.querySelector('#features-of-milo-experimentation-platform')).to.not.be.null;
    expect(document.querySelector('.how-to')).to.not.be.null;
    const parentEl = document.querySelector('#features-of-milo-experimentation-platform')?.parentElement;

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(document.querySelector('#features-of-milo-experimentation-platform')).to.be.null;
    expect(parentEl.firstElementChild.firstElementChild.href)
      .to.equal('http://localhost:2000/fragments/milo-replace-content-chrome-howto-h2');
    // .how-to should not be changed as it is targeted to firefox
    expect(document.querySelector('.how-to')).to.not.be.null;
  });

  it('with a fragment selector, it should replace a fragment in the document', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

    let manifestJson = await readFile({ path: './mocks/actions/manifestReplace.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/replaceme"]')).to.exist;
    expect(document.querySelector('a[href="/fragments/inline-replaceme#_inline"]')).to.exist;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragmentResp = await readFile({ path: './mocks/fragmentReplaced.plain.html' });
    const inlineFragmentResp = await readFile({ path: './mocks/inlineFragReplaced.plain.html' });

    window.fetch = stub();
    window.fetch.withArgs('http://localhost:2000/fragments/fragmentreplaced.plain.html')
      .returns(getFetchPromise(fragmentResp, 'text'));
    window.fetch.withArgs('http://localhost:2000/fragments/inline-fragmentreplaced.plain.html')
      .returns(getFetchPromise(inlineFragmentResp, 'text'));

    const replacemeFrag = document.querySelector('a[href="/fragments/replaceme"]');
    await initFragments(replacemeFrag);
    expect(document.querySelector('a[href="/fragments/replaceme"]')).to.be.null;
    expect(document.querySelector('div[data-path="/fragments/fragmentreplaced"]')).to.exist;

    const inlineReplacemeFrag = document.querySelector('a[href="/fragments/inline-replaceme#_inline"]');
    await initFragments(inlineReplacemeFrag);
    expect(document.querySelector('a[href="/fragments/inline-replaceme#_inline"]')).to.be.null;
    expect(document.querySelector('.inlinefragmentreplaced')).to.exist;
  });
});

describe('insertAfter action', async () => {
  it('insertContentAfter should add fragment after target element', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestInsertAfter.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/insertafter"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });
});

describe('insertBefore action', async () => {
  it('insertContentBefore should add fragment before target element', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestInsertBefore.json' });

    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/insertbefore"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/insertbefore"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.parentElement.children[1].className).to.equal('marquee');
  });
});

describe('remove action', () => {
  it('removeContent should remove z-pattern content from the page', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestRemove.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(document.querySelector('.z-pattern')).to.be.null;
  });

  it('removeContent should tag z-pattern in preview', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

    let manifestJson = await readFile({ path: './mocks/actions/manifestRemove.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    const config = getConfig();
    config.mep = {
      override: '',
      preview: true,
    };

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/mocks/manifestRemove.json' }]);
    expect(document.querySelector('.z-pattern')).to.not.be.null;
    expect(document.querySelector('.z-pattern').dataset.removedManifestId).to.not.be.null;
  });
});

describe('useBlockCode action', async () => {
  it('useBlockCode should override a current block with the custom block code provided', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestUseBlockCode.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(getConfig().expBlocks).to.deep.equal({ promo: 'http://localhost:2000/test/features/personalization/mocks/promo' });
    const promoBlock = document.querySelector('.promo');
    expect(promoBlock.textContent?.trim()).to.equal('Old Promo Block');
    await loadBlock(promoBlock);
    expect(promoBlock.textContent?.trim()).to.equal('New Promo!');
  });

  it('useBlockCode should be able to use a new type of block', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestUseBlockCode2.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(getConfig().expBlocks).to.deep.equal({ myblock: 'http://localhost:2000/test/features/personalization/mocks/myblock' });
    const myBlock = document.querySelector('.myblock');
    expect(myBlock.textContent?.trim()).to.equal('This block does not exist');
    await loadBlock(myBlock);
    expect(myBlock.textContent?.trim()).to.equal('My New Block!');
  });
});
