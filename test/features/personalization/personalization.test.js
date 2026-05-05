/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { assert, stub } from 'sinon';
import { getConfig, setConfig } from '../../../libs/utils/utils.js';
import {
  handleFragmentCommand, applyPers, cleanAndSortManifestList, normalizePath,
  init, matchGlob, createContent, combineMepSources, buildVariantInfo, addSectionAnchors,
  isTrustedUrl,
} from '../../../libs/features/personalization/personalization.js';
import mepSettings from './mepSettings.js';
import mepSettingsPreview from './mepPreviewSettings.js';

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
    config.locale = { ietf: 'en-US', prefix: '' };
    config.consumerEntitlements = {
      '11111111-aaaa-bbbb-6666-cccccccccccc': 'my-special-app',
      '22222222-xxxx-bbbb-7777-cccccccccccc': 'fireflies',
    };
  });

  it('Invalid selector should not fail page render and rest of items', async () => {
    await loadManifestAndSetResponse('./mocks/manifestInvalid.json');

    expect(document.querySelector('.marquee')).to.not.be.null;
    expect(document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter2"]')).to.be.null;
    await init(mepSettings);
    const fragment = document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter2"]');
    expect(fragment).to.not.be.null;
    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
    // TODO: add check for after3
  });

  it('Can select elements using block-#', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
    await loadManifestAndSetResponse('./mocks/manifestBlockNumber.json');

    const firstMarquee = document.getElementsByClassName('marquee')[0];
    const secondMarquee = document.getElementsByClassName('marquee')[1];
    expect(firstMarquee).to.not.be.null;
    expect(secondMarquee).to.not.be.null;
    expect(document.querySelector('a[href="/fragments/replace/marquee/r2c1"]')).to.be.null;
    expect(document.querySelector('a[href="/fragments/replace/marquee-2/r3c2"]')).to.be.null;

    await init(mepSettings);

    const fragment = document.querySelector('a[href="/fragments/replace/marquee/r2c1"]');
    const secondFrag = document.querySelector('a[href="/fragments/replace/marquee-2/r2c2"]');
    expect(fragment).to.not.be.null;
    expect(secondFrag).to.not.be.null;

    const firstMarqueeReplacedCell = firstMarquee.querySelector('p > a');
    const secondMarqueeReplacedCell = secondMarquee.querySelector('p > a');
    expect(firstMarqueeReplacedCell.href).to.equal(fragment.href);
    expect(secondMarqueeReplacedCell.href).to.equal(secondFrag.href);
  });

  it('Can select blocks using section and block indexs', async () => {
    await loadManifestAndSetResponse('./mocks/manifestSectionBlock.json');

    expect(document.querySelector('.custom-block-1')).to.not.be.null;
    expect(document.querySelector('.custom-block-2')).to.not.be.null;

    await init(mepSettings);

    expect(document.querySelector('.custom-block-1')).to.be.null;
    expect(document.querySelector('.custom-block-2')).to.be.null;
  });

  it('should not normalize absolute path to a script file, if the file is hosted in DAM', async () => {
    const DAMpath = 'https://www.adobe.com/content/dam/cc/optimization/mwpw-168109/test.js';
    const nonDAMpath = 'https://www.adobe.com/foo/test.js';
    expect(normalizePath(DAMpath)).to.include('https://www.adobe.com');
    expect(normalizePath(nonDAMpath)).to.not.include('https://www.adobe.com');
  });

  it('scheduled manifest should apply changes if active (bts)', async () => {
    const config = getConfig();
    config.mep = {
      handleFragmentCommand,
      preview: false,
      variantOverride: {},
      highlight: false,
      targetEnabled: false,
      experiments: [],
      promises: {},
      consentState: { performance: true, advertising: true },
    };
    const promoMepSettings = [
      {
        manifestPath: '/promos/bts/manifest.json',
        disabled: false,
        event: { name: 'bts', start: new Date('2023-11-24T13:00:00+00:00'), end: new Date('2222-11-24T13:00:00+00:00') },
      },
    ];
    let manifestJson = await readFile({ path: './mocks/manifestScheduledActive.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    expect(document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter3"]')).to.be.null;
    await applyPers({ manifests: promoMepSettings });

    const fragment = document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter3"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('scheduled manifest should not apply changes if not active (blackfriday)', async () => {
    const config = getConfig();
    config.mep = {
      handleFragmentCommand,
      preview: false,
      variantOverride: {},
      highlight: false,
      targetEnabled: false,
      experiments: [],
      promises: {},
    };
    const promoMepSettings = [
      {
        manifestPath: '/promos/blackfriday/manifest.json',
        disabled: true,
        event: { name: 'blackfriday', start: new Date('2022-11-24T13:00:00+00:00'), end: new Date('2022-11-24T13:00:00+00:00') },
      },
    ];
    await loadManifestAndSetResponse('./mocks/manifestScheduledInactive.json');
    expect(document.querySelector('a[href="/fragments/insertafter4"]')).to.be.null;
    await applyPers({ manifests: promoMepSettings });

    const fragment = document.querySelector('a[href="/fragments/insertafter4"]');
    expect(fragment).to.be.null;
  });

  it('disabled manifest should stay disabled even when variantOverride exists for another manifest', async () => {
    const config = getConfig();
    config.mep = {
      handleFragmentCommand,
      preview: false,
      variantOverride: { '/other/manifest.json': 'default' },
      highlight: false,
      targetEnabled: false,
      experiments: [],
      promises: {},
    };
    const promoMepSettings = [
      {
        manifestPath: '/promos/blackfriday/manifest.json',
        disabled: true,
        event: { name: 'blackfriday', start: new Date('2022-11-24T13:00:00+00:00'), end: new Date('2022-11-24T13:00:00+00:00') },
      },
    ];
    await loadManifestAndSetResponse('./mocks/manifestScheduledInactive.json');
    expect(document.querySelector('a[href="/fragments/insertafter4"]')).to.be.null;
    await applyPers({ manifests: promoMepSettings });

    const fragment = document.querySelector('a[href="/fragments/insertafter4"]');
    expect(fragment).to.be.null;
  });

  it('test or promo manifest', async () => {
    let config = getConfig();
    config.mep = {};
    await loadManifestAndSetResponse('./mocks/manifestTestOrPromo.json');
    config = getConfig();
    await init(mepSettings);
    expect(config.mep?.martech).to.be.undefined;
  });

  it('should choose chrome & logged out (using nickname)', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithAmpersand.json');
    await init(mepSettings);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|my nickname|ampersand');
  });

  it('should choose not firefox', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithNot.json');
    await init(mepSettings);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|not firefox|not');
  });

  it('should not error when nickname has multiple colons', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithNicknames.json');
    const tempMepSettings = {
      mepParam: '/path/to/manifest.json--pzn2: param-nickname=double:',
      mepHighlight: false,
      mepButton: false,
      pzn: '/path/to/manifest.json',
      promo: false,
      target: false,
      promises: {},
    };
    await init(tempMepSettings);
    const config = getConfig();
    console.log('test: ', config);
    expect(config.mep?.martech).to.equal('|pzn2|manifest');
  });

  it('should not error when name nickname is empty', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithNicknames.json');
    const tempMepSettings = {
      mepParam: '/path/to/manifest.json--:param-nickname=start',
      mepHighlight: false,
      mepButton: false,
      pzn: '/path/to/manifest.json',
      promo: false,
      target: false,
      promises: {},
    };
    await init(tempMepSettings);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|:param-nickname|manifest');
  });

  it('should show nickname instead of original audience when using nicknames syntax', async () => {
    await loadManifestAndSetResponse('./mocks/manifestWithNicknames.json');
    const tempMepSettings = {
      mepParam: '/path/to/manifest.json--pzn2: param-nickname=true',
      mepHighlight: false,
      mepButton: false,
      pzn: '/path/to/manifest.json',
      promo: false,
      target: false,
      promises: {},
    };
    await init(tempMepSettings);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|pzn2|manifest');
  });

  it('should read and use entitlement data', async () => {
    setConfig(getConfig());
    const config = getConfig();
    config.consumerEntitlements = { 'consumer-defined-entitlement': 'fireflies' };
    config.entitlements = () => Promise.resolve(['indesign-any', 'fireflies', 'after-effects-any']);

    await loadManifestAndSetResponse('./mocks/manifestUseEntitlements.json');
    await init(mepSettings);
    expect(getConfig().mep?.martech).to.equal('|fireflies|manifest');
  });

  it('should resolve variants correctly with entitlements and tags exist', async () => {
    expect(buildVariantInfo(['cc-all-apps-any & desktop'])).to.deep.equal({
      allNames: [
        'cc-all-apps-any',
        'desktop',
      ],
      'cc-all-apps-any & desktop': [
        'cc-all-apps-any & desktop',
      ],
    });
    expect(buildVariantInfo(['desktop & cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'desktop',
        'cc-all-apps-any',
      ],
      'desktop & cc-all-apps-any': [
        'desktop & cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'cc-all-apps-any',
      ],
      'cc-all-apps-any': [
        'cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['phone, cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'phone',
        'cc-all-apps-any',
      ],
      'phone, cc-all-apps-any': [
        'phone',
        'cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['cc-all-apps-any, not desktop'])).to.deep.equal({
      allNames: [
        'cc-all-apps-any',
        'desktop',
      ],
      'cc-all-apps-any, not desktop': [
        'cc-all-apps-any',
        'not desktop',
      ],
    });
    expect(buildVariantInfo(['phone & not cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'phone',
        'cc-all-apps-any',
      ],
      'phone & not cc-all-apps-any': [
        'phone & not cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['not phone & not cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'phone',
        'cc-all-apps-any',
      ],
      'not phone & not cc-all-apps-any': [
        'not phone & not cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['not cc-free & not cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'cc-free',
        'cc-all-apps-any',
      ],
      'not cc-free & not cc-all-apps-any': [
        'not cc-free & not cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['not cc-free, not cc-all-apps-any'])).to.deep.equal({
      allNames: [
        'cc-free',
        'cc-all-apps-any',
      ],
      'not cc-free, not cc-all-apps-any': [
        'not cc-free',
        'not cc-all-apps-any',
      ],
    });
    expect(buildVariantInfo(['not cc-free, not cc-all-apps-any', 'desktop & cc-paid, ios'])).to.deep.equal({
      allNames: [
        'cc-free',
        'cc-all-apps-any',
        'desktop',
        'cc-paid',
        'ios',
      ],
      'not cc-free, not cc-all-apps-any': [
        'not cc-free',
        'not cc-all-apps-any',
      ],
      'desktop & cc-paid, ios': [
        'desktop & cc-paid',
        'ios',
      ],
    });
  });

  it('invalid selector should output error to console in preview mode', async () => {
    window.console.log = stub();
    await loadManifestAndSetResponse('./mocks/manifestInvalidSelector.json');
    await init(mepSettingsPreview);
    assert.calledWith(window.console.log, 'Invalid selector: ');
    window.console.log.reset();
  });

  it('invalid selector should not output error to console if not in preview mode', async () => {
    window.console.log = stub();
    await loadManifestAndSetResponse('./mocks/manifestInvalidSelector.json');
    await init(mepSettings);
    assert.neverCalledWith(window.console.log, 'Invalid selector: ');
    window.console.log.reset();
  });

  it('missing selector should output error to console if in preview mode', async () => {
    window.console.log = stub();
    await loadManifestAndSetResponse('./mocks/manifestEmptyAction.json');
    await init(mepSettingsPreview);
    assert.calledWith(window.console.log, 'Row found with empty action field: ');
    window.console.log.reset();
  });

  it('updateMetadata should be able to add and change metadata', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateMetadata.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    const geoMetadata = document.querySelector('meta[name="georouting"]');
    expect(geoMetadata.content).to.equal('off');

    expect(document.querySelector('meta[name="mynewmetadata"]')).to.be.null;
    expect(document.querySelector('meta[property="og:title"]').content).to.equal('milo');
    expect(document.querySelector('meta[property="og:image"]')).to.be.null;

    await init(mepSettings);

    expect(geoMetadata.content).to.equal('on');
    expect(document.querySelector('meta[name="mynewmetadata"]').content).to.equal('woot');
    expect(document.querySelector('meta[property="og:title"]').content).to.equal('New Title');
    expect(document.querySelector('meta[property="og:image"]').content).to.equal('https://adobe.com/path/to/image.jpg');
  });

  it('updateFramework should create new framework stylesheet link', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    const c1Link = document.createElement('link');
    c1Link.rel = 'stylesheet';
    c1Link.href = `${libsPath}/styles/styles.css`;
    document.head.appendChild(c1Link);
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', '');

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)).to.not.be.null;

    document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)?.remove();
    document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)?.remove();
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', '');
  });

  it('updateFramework should no-op when already on target foundation', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', 'c2');
    const c2Link = document.createElement('link');
    c2Link.rel = 'stylesheet';
    c2Link.href = `${libsPath}/c2/styles/styles.css`;
    document.head.appendChild(c2Link);

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)).to.not.be.null;

    document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)?.remove();
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', '');
  });

  it('updateFramework should no-op when value is undefined', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    const c1Link = document.createElement('link');
    c1Link.rel = 'stylesheet';
    c1Link.href = `${libsPath}/styles/styles.css`;
    document.head.appendChild(c1Link);

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    delete manifestJson.data[0].all;
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)).to.not.be.null;
    document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)?.remove();
  });

  it('updateFramework should no-op when value is empty string', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    const c1Link = document.createElement('link');
    c1Link.rel = 'stylesheet';
    c1Link.href = `${libsPath}/styles/styles.css`;
    document.head.appendChild(c1Link);

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    manifestJson.data[0].all = '';
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)).to.not.be.null;
    document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)?.remove();
  });

  it('updateFramework should no-op for invalid values', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    const c1Link = document.createElement('link');
    c1Link.rel = 'stylesheet';
    c1Link.href = `${libsPath}/styles/styles.css`;
    document.head.appendChild(c1Link);

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    manifestJson.data[0].all = 'banana';
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)).to.not.be.null;
    document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)?.remove();
  });

  it('updateFramework should create C1 stylesheet link when switching from C2', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    const c2Link = document.createElement('link');
    c2Link.rel = 'stylesheet';
    c2Link.href = `${libsPath}/c2/styles/styles.css`;
    document.head.appendChild(c2Link);
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', 'c2');

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    manifestJson.data[0].all = 'c1';
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)).to.not.be.null;

    document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)?.remove();
    document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)?.remove();
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', '');
  });

  it('updateFramework should handle case-insensitive values', async () => {
    const config = getConfig();
    const libsPath = config.miloLibs || config.codeRoot;
    const c1Link = document.createElement('link');
    c1Link.rel = 'stylesheet';
    c1Link.href = `${libsPath}/styles/styles.css`;
    document.head.appendChild(c1Link);
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', '');

    let manifestJson = await readFile({ path: './mocks/actions/manifestUpdateFramework.json' });
    manifestJson = JSON.parse(manifestJson);
    manifestJson.data[0].all = 'C2';
    setFetchResponse(manifestJson);
    await init(mepSettings);

    expect(document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)).to.not.be.null;

    document.head.querySelector(`link[href="${libsPath}/styles/styles.css"]`)?.remove();
    document.head.querySelector(`link[href="${libsPath}/c2/styles/styles.css"]`)?.remove();
    document.querySelector('meta[name="foundation"]')?.setAttribute('content', '');
  });

  it('will add id to the section div', async () => {
    addSectionAnchors(document);
    const sectionWithId = document.querySelector('#marquee-container');
    expect(sectionWithId).to.exist;
  });
});

describe('matchGlob function', () => {
  it('should match page', async () => {
    const result = matchGlob('/products/special-offers', '/products/special-offers');
    expect(result).to.be.true;
  });

  it('should match page with HTML extension', async () => {
    const result = matchGlob('/products/special-offers', '/products/special-offers.html');
    expect(result).to.be.true;
  });

  it('should not match child page', async () => {
    const result = matchGlob('/products/special-offers', '/products/special-offers/free-download');
    expect(result).to.be.false;
  });

  it('should match child page', async () => {
    const result = matchGlob('/products/special-offers**', '/products/special-offers/free-download');
    expect(result).to.be.true;
  });

  it('should hide the wrapping <p> for the delayed modal anchor', async () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    parent.appendChild(el);
    const wrapper = await createContent(
      el,
      {
        content: '/fragments/promos/path-to-promo/#modal-hash:delay=1',
        manifestId: 'manifest',
        targetManifestId: '',
        action: 'insertAfter',
        modifiers: [],
      },
    );
    expect(wrapper.tagName).to.equal('P');
    expect(wrapper.classList.contains('hide-block')).to.be.true;
  });
});

describe('MEP Utils', () => {
  describe('combineMepSources', async () => {
    it('yields an empty list when everything is undefined', async () => {
      const manifests = await combineMepSources(undefined, undefined, undefined, undefined);
      expect(manifests.length).to.equal(0);
    });
    it('combines promos and personalization', async () => {
      document.head.innerHTML = await readFile({ path: '../../utils/mocks/mep/head-promo.html' });
      const promos = { manifestnames: 'pre-black-friday-global,black-friday-global' };
      const manifests = await combineMepSources('/pers/manifest.json', undefined, promos, undefined);
      expect(manifests.length).to.equal(3);
      expect(manifests[0].manifestPath).to.equal('/pers/manifest.json');
      expect(manifests[1].manifestPath).to.equal('/pre-black-friday.json');
      expect(manifests[2].manifestPath).to.equal('/black-friday.json');
    });
    it('combines promos and personalization and mep param', async () => {
      document.head.innerHTML = await readFile({ path: '../../utils/mocks/mep/head-promo.html' });
      const promos = { manifestnames: 'pre-black-friday-global,black-friday-global' };
      const manifests = await combineMepSources(
        '/pers/manifest.json',
        undefined,
        promos,
        '/pers/manifest.json--var1---/mep-param/manifest1.json--all---/mep-param/manifest2.json--all',
      );
      expect(manifests.length).to.equal(5);
      expect(manifests[0].manifestPath).to.equal('/pers/manifest.json');
      expect(manifests[1].manifestPath).to.equal('/pre-black-friday.json');
      expect(manifests[2].manifestPath).to.equal('/black-friday.json');
      expect(manifests[3].manifestPath).to.equal('/mep-param/manifest1.json');
      expect(manifests[4].manifestPath).to.equal('/mep-param/manifest2.json');
    });
    it('blocks absolute manifest URLs from mep param', async () => {
      const manifests = await combineMepSources(
        undefined,
        undefined,
        undefined,
        'https://attacker.com/manifest.json--all---https://evil.github.io/manifest--all',
      );
      expect(manifests.length).to.equal(0);
    });
    it('blocks trusted absolute manifest URLs from mep param', async () => {
      const manifests = await combineMepSources(
        undefined,
        undefined,
        undefined,
        'https://www.adobe.com/manifest.json--all',
      );
      expect(manifests.length).to.equal(0);
    });
    it('blocks protocol-relative manifest URLs from mep param', async () => {
      const manifests = await combineMepSources(
        undefined,
        undefined,
        undefined,
        '//evil.com/manifest.json--all',
      );
      expect(manifests.length).to.equal(0);
    });
    it('allows relative path manifest URLs from mep param', async () => {
      const manifests = await combineMepSources(
        undefined,
        undefined,
        undefined,
        '/path/manifest.json--all',
      );
      expect(manifests.length).to.equal(1);
    });
    it('allows federal manifest via mep param alongside repo manifests', async () => {
      const manifests = await combineMepSources(
        undefined,
        undefined,
        undefined,
        '/homepage/fragments/tests/site-redesign.json--target-var1---/federal/tests/mep/ace1151/ace1151-gnav-and-banners.json--all',
      );
      expect(manifests.length).to.equal(2);
      expect(manifests[0].manifestPath).to.equal('/homepage/fragments/tests/site-redesign.json');
      expect(manifests[1].manifestPath).to.equal('/federal/tests/mep/ace1151/ace1151-gnav-and-banners.json');
    });
  });
  describe('isTrustedUrl', () => {
    it('allows relative paths', () => {
      expect(isTrustedUrl('/path/to/script.js')).to.be.true;
      expect(isTrustedUrl('/content/dam/cc/test.js')).to.be.true;
    });
    it('allows trusted Adobe domains', () => {
      expect(isTrustedUrl('https://www.adobe.com/content/dam/cc/test.js')).to.be.true;
      expect(isTrustedUrl('https://main--milo--adobecom.aem.page/script.js')).to.be.true;
      expect(isTrustedUrl('https://main--milo--adobecom.aem.live/script.js')).to.be.true;
      expect(isTrustedUrl('https://main--milo--adobecom.hlx.page/script.js')).to.be.true;
      expect(isTrustedUrl('https://main--milo--adobecom.hlx.live/script.js')).to.be.true;
    });
    it('blocks untrusted external URLs', () => {
      expect(isTrustedUrl('https://attacker.com/script.js')).to.be.false;
      expect(isTrustedUrl('https://evil.github.io/script.js')).to.be.false;
      expect(isTrustedUrl('https://attacker.com/content/dam/fake.js')).to.be.false;
    });
    it('blocks non-adobecom aem/hlx domains', () => {
      expect(isTrustedUrl('https://evil--project--inc.aem.page/manifest.json')).to.be.false;
      expect(isTrustedUrl('https://evil--project--inc.hlx.live/script.js')).to.be.false;
      expect(isTrustedUrl('https://evildomainadobecom.hlx.page/script.js')).to.be.false;
    });
    it('blocks non-https protocols', () => {
      expect(isTrustedUrl('http://www.adobe.com/script.js')).to.be.false;
      expect(isTrustedUrl('data:text/javascript,alert(1)')).to.be.false;
    });
    it('blocks null/empty values', () => {
      expect(isTrustedUrl(null)).to.be.false;
      expect(isTrustedUrl(undefined)).to.be.false;
      expect(isTrustedUrl('')).to.be.false;
    });
    it('blocks protocol-relative URLs', () => {
      expect(isTrustedUrl('//evil.com/script.js')).to.be.false;
    });
  });
  describe('cleanAndSortManifestList', async () => {
    it('chooses server manifest over target manifest if same manifest path', async () => {
      const config = { env: { name: 'stage' } };
      let manifests = await readFile({ path: './mocks/manifestLists/two-manifests-one-from-target.json' });
      manifests = JSON.parse(manifests);
      manifests[0].manifestPath = 'same path';
      manifests[1].manifestPath = 'same path';
      const response = cleanAndSortManifestList(manifests, config);
      const result = response.find((manifest) => manifest.source.length > 1);
      expect(result).to.be.not.null;
      expect(result.selectedVariant.commands[0].action).to.equal('appendtosection');
    });
    it('chooses target manifest over server manifest if same manifest path and in production and selected audience is "target-*"', async () => {
      const config = { env: { name: 'prod' } };
      let manifests = await readFile({ path: './mocks/manifestLists/two-manifests-one-from-target.json' });
      manifests = JSON.parse(manifests);
      manifests[0].manifestPath = 'same path';
      manifests[1].manifestPath = 'same path';
      const response = cleanAndSortManifestList(manifests, config);
      const result = response.find((manifest) => manifest.source.length > 1);
      expect(result).to.be.not.null;
      expect(result.selectedVariant.commands[0].action).to.equal('append');
    });
  });
  describe('handleTwpButtons', async () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/personalization-twp.html' });
      await loadManifestAndSetResponse('./mocks/manifest-remove-twp.json');
    });
    it('should remove TWP buttons if TWP buttons are present', async () => {
      let allLinks = document.querySelectorAll('a');
      let ftLinks = [...allLinks].filter((link) => link.innerHTML.toLowerCase().match(/free.trial/));
      expect(ftLinks.length).to.not.equal(0);

      await init(mepSettings);

      allLinks = document.querySelectorAll('a');
      ftLinks = [...allLinks].filter((link) => link.innerHTML.toLowerCase().match(/free.trial/));
      expect(ftLinks.length).to.equal(0);
    });
  });
});

describe('analyticifseen', () => {
  let observerCallback;
  let observeStub;
  let unobserveStub;
  let originalIO;

  before(() => {
    originalIO = window.IntersectionObserver;
    observeStub = stub();
    unobserveStub = stub();
    window.IntersectionObserver = function MockIO(callback) {
      observerCallback = callback;
      this.observe = observeStub;
      this.unobserve = unobserveStub;
    };
  });

  afterEach(() => {
    observeStub.resetHistory();
    unobserveStub.resetHistory();
    delete window._satellite;
  });

  after(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should set up IntersectionObserver on target elements', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
    await loadManifestAndSetResponse('./mocks/manifestAnalyticIfSeen.json');
    await init(mepSettings);
    expect(observeStub.called).to.be.true;
  });

  it('should fire analytics and unobserve when element is intersecting', () => {
    window._satellite = { track: stub() };
    observerCallback([{ isIntersecting: true }]);
    expect(window._satellite.track.calledOnce).to.be.true;
    const [eventName, payload] = window._satellite.track.firstCall.args;
    expect(eventName).to.equal('event');
    expect(payload.xdm.web.webInteraction.name).to.equal('my-marquee-tracking was seen');
    expect(unobserveStub.calledOnce).to.be.true;
  });

  it('should not fire analytics when element is not intersecting', () => {
    window._satellite = { track: stub() };
    observerCallback([{ isIntersecting: false }]);
    expect(window._satellite.track.called).to.be.false;
  });

  it('should defer analytics to alloy_sendEvent when _satellite is unavailable', () => {
    window.dispatchEvent(new Event('alloy_sendEvent'));

    observerCallback([{ isIntersecting: true }]);
    window._satellite = { track: stub() };
    window.dispatchEvent(new Event('alloy_sendEvent'));
    expect(window._satellite.track.calledOnce).to.be.true;
    const [, payload] = window._satellite.track.firstCall.args;
    expect(payload.xdm.web.webInteraction.name).to.equal('my-marquee-tracking was seen');
  });
});
