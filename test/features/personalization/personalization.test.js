import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { createTag, getConfig, loadBlock, updateConfig } from '../../../libs/utils/utils.js';
import initFragments from '../../../libs/blocks/fragment/fragment.js';
import { applyPers } from '../../../libs/features/personalization/personalization.js';

document.head.innerHTML = await readFile({ path: './mocks/metadata.html' });
document.body.innerHTML = await readFile({ path: './mocks/test1.html' });

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        [type]: () => data,
      });
    }),
  );
};

const noop = () => {};

describe('Functional Test', () => {
  it.skip('replaceContent should replace an element with a fragment', async () => {
    const manifestData = [{ test: true }];
    stubFetch(manifestData);

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    await applyPers(
      // Path doesn't matter as we stub fetch above
      ['/path/to/manifest.json'],
      { createTag, getConfig, updateConfig, loadLink, loadScript: () => {} },
    );

    expect(loadedlinkParams).to.deep.equal({
      url: '/path/to/manifest.json',
      options: { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
    });
  });

  it('insertContentAfter should add fragment after target element', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestInsertContentAfter.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    expect(document.querySelector('a[href="/fragments/insertafter"]')).to.be.null;
    await applyPers(
      // Path doesn't matter as we stub fetch above
      [{ manifestPath: '/path/to/manifest.json' }],
      { createTag, getConfig, updateConfig, loadLink, loadScript: noop },
    );

    expect(loadedlinkParams).to.deep.equal({
      url: '/fragments/insertafter.plain.html',
      options: { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
    });
    const fragment = document.querySelector('a[href="/fragments/insertafter"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.parentElement.firstElementChild.className).to.equal('marquee');
  });

  it('insertContentBefore should add fragment before target element', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestInsertContentBefore.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    expect(document.querySelector('a[href="/fragments/insertbefore"]')).to.be.null;
    await applyPers(
      // Path doesn't matter as we stub fetch above
      [{ manifestPath: '/path/to/manifest.json' }],
      { createTag, getConfig, updateConfig, loadLink, loadScript: noop },
    );

    expect(loadedlinkParams).to.deep.equal({
      url: '/fragments/insertbefore.plain.html',
      options: { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
    });
    const fragment = document.querySelector('a[href="/fragments/insertbefore"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.parentElement.children[1].className).to.equal('marquee');
  });

  it('replaceFragment should replace a fragment in the document', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestReplaceFragment.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('a[href="/fragments/replaceme"]')).to.not.be.null;
    await applyPers(
      // Path doesn't matter as we stub fetch above
      [{ manifestPath: '/path/to/manifest.json' }],
      { createTag, getConfig, updateConfig, loadLink: noop, loadScript: noop },
    );

    const fragmentResp = await readFile({ path: './mocks/fragmentReplaced.plain.html' });
    setFetchResponse(fragmentResp, 'text');

    const replacemeFrag = document.querySelector('a[href="/fragments/replaceme"]');
    await initFragments(replacemeFrag);

    expect(document.querySelector('a[href="/fragments/replaceme"]')).to.be.null;
    expect(document.querySelector('div[data-path="/fragments/fragmentreplaced"]')).to.not.be.null;
  });

  it('useBlockCode should override a current block with the custom block code provided', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestUseBlockCode.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    await applyPers(
      // Path doesn't matter as we stub fetch above
      [{ manifestPath: '/path/to/manifest.json' }],
      { createTag, getConfig, updateConfig, loadLink, loadScript: noop },
    );

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

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    await applyPers(
      // Path doesn't matter as we stub fetch above
      [{ manifestPath: '/path/to/manifest.json' }],
      { createTag, getConfig, updateConfig, loadLink, loadScript: noop },
    );

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

    await applyPers(
      // Path doesn't matter as we stub fetch above
      [{ manifestPath: '/path/to/manifest.json' }],
      { createTag, getConfig, updateConfig, loadLink: noop, loadScript: noop },
    );

    expect(geoMetadata.content).to.equal('on');
    expect(document.querySelector('meta[name="mynewmetadata"]').content).to.equal('woot');
    expect(document.querySelector('meta[property="og:title"]').content).to.equal('New Title');
    expect(document.querySelector('meta[property="og:image"]').content).to.equal('https://adobe.com/path/to/image.jpg');
  });
});
