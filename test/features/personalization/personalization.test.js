import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig, setConfig, loadBlock } from '../../../libs/utils/utils.js';
import initFragments from '../../../libs/blocks/fragment/fragment.js';
import { ENTITLEMENT_MAP } from '../../../libs/features/personalization/entitlements.js';
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

// Modify the entitlement map with custom keys so tests doesn't rely on real data
ENTITLEMENT_MAP['11111111-aaaa-bbbb-6666-cccccccccccc'] = 'my-special-app';
ENTITLEMENT_MAP['22222222-xxxx-bbbb-7777-cccccccccccc'] = 'fireflies';

// Note that the manifestPath doesn't matter as we stub the fetch
describe('Functional Test', () => {
  it('replaceContent should replace an element with a fragment', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestReplace.json' });
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

  it('removeContent should remove z-pattern content from the page', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestRemove.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(document.querySelector('.z-pattern')).to.be.null;
  });

  it('insertContentAfter should add fragment after target element', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestInsertContentAfter.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/insertafter"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('insertContentBefore should add fragment before target element', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestInsertContentBefore.json' });

    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/insertbefore"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    const fragment = document.querySelector('a[href="/fragments/insertbefore"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.parentElement.children[1].className).to.equal('marquee');
  });

  it('replaceFragment should replace a fragment in the document', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

    let manifestJson = await readFile({ path: './mocks/manifestReplaceFragment.json' });
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

  it('useBlockCode should override a current block with the custom block code provided', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestUseBlockCode.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(getConfig().expBlocks).to.deep.equal({ promo: '/test/features/personalization/mocks/newpromo' });
    const promoBlock = document.querySelector('.promo');
    expect(promoBlock.textContent?.trim()).to.equal('Old Promo Block');
    await loadBlock(promoBlock);
    expect(promoBlock.textContent?.trim()).to.equal('New Promo!');
  });

  it('useBlockCode should be able to use a new type of block', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestUseBlockCode2.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);

    expect(getConfig().expBlocks).to.deep.equal({ myblock: '/test/features/personalization/mocks/myblock' });
    const myBlock = document.querySelector('.myblock');
    expect(myBlock.textContent?.trim()).to.equal('This block does not exist');
    await loadBlock(myBlock);
    expect(myBlock.textContent?.trim()).to.equal('My New Block!');
  });

  it('updateMetadata should be able to add and change metadata', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestUpdateMetadata.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

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
    let manifestJson = await readFile({ path: './mocks/manifestInvalid.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('.marquee')).to.not.be.null;
    expect(document.querySelector('a[href="/fragments/insertafter2"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const fragment = document.querySelector('a[href="/fragments/insertafter2"]');
    expect(fragment).to.not.be.null;
    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('scheduled manifest should apply changes if active (bts)', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestScheduledActive.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    expect(document.querySelector('a[href="/fragments/insertafter3"]')).to.be.null;
    const event = { name: 'bts', start: new Date('2023-11-24T13:00:00+00:00'), end: new Date('2222-11-24T13:00:00+00:00') };
    await applyPers([{ manifestPath: '/promos/bts/manifest.json', disabled: false, event }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter3"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('scheduled manifest should not apply changes if not active (blackfriday)', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestScheduledInactive.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    expect(document.querySelector('a[href="/fragments/insertafter4"]')).to.be.null;
    const event = { name: 'blackfriday', start: new Date('2022-11-24T13:00:00+00:00'), end: new Date('2022-11-24T13:00:00+00:00') };
    await applyPers([{ manifestPath: '/promos/blackfriday/manifest.json', disabled: true, event }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter4"]');
    expect(fragment).to.be.null;
  });

  it('test or promo manifest', async () => {
    let config = getConfig();
    config.mep = {};
    let manifestJson = await readFile({ path: './mocks/manifestTestOrPromo.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    config = getConfig();
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(config.mep?.martech).to.be.undefined;
  });

  it('should choose chrome & logged out', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestWithAmpersand.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|chrome & logged|ampersand');
  });

  it('should choose not firefox', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestWithNot.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|not firefox|not');
  });

  it('should read and use entitlement data', async () => {
    setConfig(getConfig());
    const { entitlements } = getConfig();

    entitlements(['some-app', 'fireflies']);
    let manifestJson = await readFile({ path: './mocks/manifestUseEntitlements.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|fireflies|manifest');
  });

  it('removeContent should tag z-pattern in preview', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestRemove.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    const config = getConfig();
    config.mep = {
      override: '',
      preview: true,
    };

    expect(document.querySelector('.z-pattern')).to.not.be.null;
    await applyPers([{ manifestPath: '/mocks/manifestRemove.json' }]);
    expect(document.querySelector('.z-pattern').dataset.removedManifestId).to.not.be.null;
  });
});
