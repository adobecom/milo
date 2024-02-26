import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { assert, stub } from 'sinon';
import { getConfig, setConfig, loadBlock } from '../../../libs/utils/utils.js';
import initFragments from '../../../libs/blocks/fragment/fragment.js';
import { applyPers } from '../../../libs/features/personalization/personalization.js';

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

  it('replaceContent should replace an element with a fragment', async () => {
    await loadManifestAndSetResponse('./mocks/manifestReplace.json');

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

  it('removeContent should remove z-pattern content from the page', async () => {
    await loadManifestAndSetResponse('./mocks/manifestRemove.json');

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(document.querySelector('.z-pattern')).to.be.null;
  });

  it('insertContentAfter should add fragment after target element', async () => {
    await loadManifestAndSetResponse('./mocks/manifestInsertContentAfter.json');

    expect(document.querySelector('a[href="/fragments/insertafter"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('insertContentBefore should add fragment before target element', async () => {
    await loadManifestAndSetResponse('./mocks/manifestInsertContentBefore.json');

    expect(document.querySelector('a[href="/fragments/insertbefore"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/insertbefore"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.parentElement.children[1].className).to.equal('marquee');
  });

  it('replaceFragment should replace a fragment in the document', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

    await loadManifestAndSetResponse('./mocks/manifestReplaceFragment.json');

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

  it('useBlockCode should override a current block with the custom block code provided', async () => {
    await loadManifestAndSetResponse('./mocks/manifestUseBlockCode.json');

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(getConfig().expBlocks).to.deep.equal({ promo: 'http://localhost:2000/test/features/personalization/mocks/promo' });
    const promoBlock = document.querySelector('.promo');
    expect(promoBlock.textContent?.trim()).to.equal('Old Promo Block');
    await loadBlock(promoBlock);
    expect(promoBlock.textContent?.trim()).to.equal('New Promo!');
  });

  it('useBlockCode should be able to use a new type of block', async () => {
    await loadManifestAndSetResponse('./mocks/manifestUseBlockCode2.json');

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(getConfig().expBlocks).to.deep.equal({ myblock: 'http://localhost:2000/test/features/personalization/mocks/myblock' });
    const myBlock = document.querySelector('.myblock');
    expect(myBlock.textContent?.trim()).to.equal('This block does not exist');
    await loadBlock(myBlock);
    expect(myBlock.textContent?.trim()).to.equal('My New Block!');
  });

  it('updateMetadata should be able to add and change metadata', async () => {
    await loadManifestAndSetResponse('./mocks/manifestUpdateMetadata.json');

    const geoMetadata = document.querySelector('meta[name="georouting"]');
    expect(geoMetadata.content).to.equal('off');

    expect(document.querySelector('meta[name="mynewmetadata"]')).to.be.null;
    expect(document.querySelector('meta[property="og:title"]').content).to.equal('milo');
    expect(document.querySelector('meta[property="og:image"]')).to.be.null;

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(geoMetadata.content).to.equal('on');
    expect(document.querySelector('meta[name="mynewmetadata"]').content).to.equal('woot');
    expect(document.querySelector('meta[property="og:title"]').content).to.equal('New Title');
    expect(document.querySelector('meta[property="og:image"]').content).to.equal('https://adobe.com/path/to/image.jpg');
  });

  it('Invalid selector should not fail page render and rest of items', async () => {
    await loadManifestAndSetResponse('./mocks/manifestInvalid.json');

    expect(document.querySelector('.marquee')).to.not.be.null;
    expect(document.querySelector('a[href="/fragments/insertafter2"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const fragment = document.querySelector('a[href="/fragments/insertafter2"]');
    expect(fragment).to.not.be.null;
    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
    // TODO: add check for after3
  });

  it('Can select elements using block-#', async () => {
    await loadManifestAndSetResponse('./mocks/manifestBlockNumber.json');

    expect(document.querySelector('.marquee')).to.not.be.null;
    expect(document.querySelector('a[href="/fragments/replace/marquee/r2c1"]')).to.be.null;
    expect(document.querySelector('a[href="/fragments/replace/marquee-2/r3c2"]')).to.be.null;
    const secondMarquee = document.getElementsByClassName('marquee')[1];
    expect(secondMarquee).to.not.be.null;

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/replace/marquee/r2c1"]');
    expect(fragment).to.not.be.null;
    const replacedCell = document.querySelector('.marquee > div:nth-child(2) > div:nth-child(1)');
    expect(replacedCell.firstChild.firstChild).to.equal(fragment);
    const secondFrag = document.querySelector('a[href="/fragments/replace/marquee-2/r2c2"]');
    expect(secondMarquee.lastElementChild.lastElementChild.firstChild.firstChild)
      .to.equal(secondFrag);
  });

  it('Can select blocks using section and block indexs', async () => {
    await loadManifestAndSetResponse('./mocks/manifestSectionBlock.json');

    expect(document.querySelector('.special-block')).to.not.be.null;
    expect(document.querySelector('.custom-block-2')).to.not.be.null;
    expect(document.querySelector('.custom-block-3')).to.not.be.null;

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(document.querySelector('.special-block')).to.be.null;
    expect(document.querySelector('.custom-block-2')).to.be.null;
    expect(document.querySelector('.custom-block-3')).to.be.null;
  });

  it('scheduled manifest should apply changes if active (bts)', async () => {
    await loadManifestAndSetResponse('./mocks/manifestScheduledActive.json');
    expect(document.querySelector('a[href="/fragments/insertafter3"]')).to.be.null;
    const event = { name: 'bts', start: new Date('2023-11-24T13:00:00+00:00'), end: new Date('2222-11-24T13:00:00+00:00') };
    await applyPers([{ manifestPath: '/promos/bts/manifest.json', disabled: false, event }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter3"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('scheduled manifest should not apply changes if not active (blackfriday)', async () => {
    await loadManifestAndSetResponse('./mocks/manifestScheduledInactive.json');
    expect(document.querySelector('a[href="/fragments/insertafter4"]')).to.be.null;
    const event = { name: 'blackfriday', start: new Date('2022-11-24T13:00:00+00:00'), end: new Date('2022-11-24T13:00:00+00:00') };
    await applyPers([{ manifestPath: '/promos/blackfriday/manifest.json', disabled: true, event }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter4"]');
    expect(fragment).to.be.null;
  });

  it('test or promo manifest', async () => {
    let config = getConfig();
    config.mep = {};
    await loadManifestAndSetResponse('./mocks/manifestTestOrPromo.json');
    config = getConfig();
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(config.mep?.martech).to.be.undefined;
  });

  it('should choose chrome & logged out', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithAmpersand.json');
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|chrome & logged|ampersand');
  });

  it('should choose not firefox', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithNot.json');
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|not firefox|not');
  });

  it('should read and use entitlement data', async () => {
    setConfig(getConfig());
    const config = getConfig();
    config.consumerEntitlements = { 'consumer-defined-entitlement': 'fireflies' };
    config.entitlements = () => Promise.resolve(['indesign-any', 'fireflies', 'after-effects-any']);

    await loadManifestAndSetResponse('./mocks/manifestUseEntitlements.json');
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(getConfig().mep?.martech).to.equal('|fireflies|manifest');
  });

  it('removeContent should tag z-pattern in preview', async () => {
    await loadManifestAndSetResponse('./mocks/manifestRemove.json');
    const config = getConfig();
    config.mep = {
      override: '',
      preview: true,
    };

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/mocks/manifestRemove.json' }]);
    expect(document.querySelector('.z-pattern').dataset.removedManifestId).to.not.be.null;
  });

  it('invalid selector should output error to console', async () => {
    window.console.log = stub();

    await loadManifestAndSetResponse('./mocks/manifestInvalidSelector.json');

    await applyPers([{ manifestPath: '/mocks/manifestRemove.json' }]);

    assert.calledWith(window.console.log, 'Invalid selector: ', '.bad...selector');
    window.console.log.reset();
  });
});
