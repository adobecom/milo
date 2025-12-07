import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import {
  getLocale, loadArea, setConfig, updateConfig, getConfig, queryIndexes,
} from '../../../libs/utils/utils.js';
import { getMepLingoContext } from '../../../libs/blocks/fragment/fragment.js';

window.lana = { log: stub() };

const decorateArea = (doc) => {
  doc.querySelector('picture.frag-image')?.classList.add('decorated');
};

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  decorateArea,
  locales,
  placeholders: { placeholdercheck: 'hello world' },
  mep: {
    commands: [
      {
        action: 'remove',
        selector: 'aside.large p:nth-child(1):has(picture) #_include-fragments',
        pageFilter: '',
        content: 'true',
        selectorType: 'other',
        manifestId: 'manifest.json',
        targetManifestId: false,
        modifiers: ['include-fragments'],
      },
    ],
  },
};
setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: getFragment } = await import('../../../libs/blocks/fragment/fragment.js');

describe('Fragments', () => {
  let paramsGetStub;

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  it('Loads a fragment', async () => {
    const a = document.querySelector('a');
    await getFragment(a);
    const h1 = document.querySelector('h1');
    expect(h1).to.exist;
    const p = document.querySelector('#placeholdercheck');
    expect(p).to.exist;
    expect(p.innerHTML).to.equal('hello world');
  });

  it('Loads a fragment with cache control', async () => {
    const a = document.querySelector('a.cache');
    await getFragment(a);
    const h1 = document.querySelector('h1.frag-cache');
    expect(h1).to.exist;
  });

  it('Doesnt load a fragment', async () => {
    const a = document.querySelector('a.bad');
    await getFragment(a);
    expect(window.lana.log.args[0][0]).to.equal('Could not get fragment: http://localhost:2000/test/blocks/fragment/mocks/fragments/bad.plain.html');
  });

  it('Doesnt create a malformed fragment', async () => {
    const a = document.querySelector('a.malformed');
    await getFragment(a);
    expect(window.lana.log.args[1][0]).to.equal('Could not make fragment: http://localhost:2000/test/blocks/fragment/mocks/fragments/malform.plain.html');
  });

  it('Doesnt infinitely load circular references', async () => {
    const a = document.querySelector('a.frag-a');
    await getFragment(a);
    expect(document.querySelector('h4')).to.exist;
    expect(window.lana.log.args[2][0]).to.equal('ERROR: Fragment Circular Reference loading http://localhost:2000/test/blocks/fragment/mocks/fragments/frag-a');
  });

  it('Doesnt infinitely load circular reference to itself', async () => {
    const a = document.querySelector('a.self-ref');
    await getFragment(a);
    expect(document.querySelector('h5')).to.exist;
    expect(window.lana.log.args[3][0]).to.equal('ERROR: Fragment Circular Reference loading http://localhost:2000/test/blocks/fragment/mocks/fragments/self-ref');
  });

  it('Inlines fragments inside a block', async () => {
    const marquee = document.querySelector('.marquee-section');
    await loadArea(marquee);
    expect(marquee.querySelector('.fragment')).to.not.exist;
    expect(marquee.innerHTML.includes('This marquee content is pulled from a fragment')).to.be.true;
  });

  it('Does not inline fragments inside a block in DO_NOT_INLINE list', async () => {
    const cols = document.querySelector('.columns-section');
    await loadArea(cols);
    expect(cols.querySelector('.fragment')).to.exist;
    expect(cols.querySelector('.aside').style.background).to.equal('rgb(238, 238, 238)');
    expect(cols.innerHTML.includes('Hello World!!!')).to.be.true;
  });

  it('Makes media relative to fragment', async () => {
    const section = document.querySelector('.default-section');
    await loadArea(section);
    expect(section.querySelector('source[srcset^="http://localhost:2000/test/blocks/fragment/mocks/fragments/media_15"]')).to.exist;
    expect(section.querySelector('img[src^="http://localhost:2000/test/blocks/fragment/mocks/fragments/media_15"]')).to.exist;
  });

  it('"decorated" class added by decorateArea()', async () => {
    const a = document.querySelector('a.frag-image');
    await getFragment(a);
    const pic = document.querySelector('picture.frag-image');
    expect(pic.classList.contains('decorated')).to.be.true;
  });

  it('only valid HTML should exist after resolving the fragments', async () => {
    const { body } = new DOMParser().parseFromString(await readFile({ path: './mocks/body.html' }), 'text/html');
    for (const a of body.querySelectorAll('a[href*="/fragment"]')) await getFragment(a);
    const innerHtml = body.innerHTML;
    // eslint-disable-next-line
    body.innerHTML = body.innerHTML; // after reassignment, the parser guarantees the presence of only valid HTML
    expect(innerHtml).to.equal(body.innerHTML);
  });

  it('should transfer all attributes when replacing a paragraph parent with a div parent', async () => {
    const a = document.querySelector('a.frag-p');
    const { attributes } = a.parentElement;
    await getFragment(a);
    const wrapper = document.querySelector('.frag-p-wrapper');
    for (const attr of attributes) {
      expect(wrapper.getAttribute(attr.name)).to.equal(attr.value);
    }
  });
});

describe('MEP Lingo Fragments', () => {
  const mepLingoLocale = {
    prefix: '/test/blocks/fragment/mocks/de',
    region: 'de',
    language: 'de',
    ietf: 'de-DE',
    regions: { ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' } },
  };

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    window.lana = { log: stub() };
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('loads ROC fragment and sets data-mep-lingo-roc', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-frag');
    expect(a).to.exist;
    expect(a.dataset.mepLingo).to.equal('true');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.exist;
  });

  it('loads ROC inline fragment and copies attr to children', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-inline');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-inline-section');
    expect(section.querySelector('[data-mep-lingo-roc]')).to.exist;
  });

  it('falls back when ROC fails and sets data-mep-lingo-fallback', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-fallback');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-fallback-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoFallback).to.exist;
  });

  it('falls back inline fragment and copies fallback attr to children', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-fallback-inline');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-fallback-inline-section');
    expect(section.querySelector('[data-mep-lingo-fallback]')).to.exist;
  });

  it('logs error when both ROC and fallback fail', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-error');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-error-section');
    expect(section.querySelector('.fragment')).to.not.exist;
    expect(window.lana.log.called).to.be.true;
    const logCall = window.lana.log.args.find((args) => args[0].includes('Could not get mep-lingo'));
    expect(logCall).to.exist;
  });

  it('skips mepLingo when no country detected', async () => {
    // No akamai set in sessionStorage
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-no-country');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-no-country-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    // Should load normal fragment without mep-lingo attributes
    expect(frag.dataset.mepLingoRoc).to.not.exist;
    expect(frag.dataset.mepLingoFallback).to.not.exist;
  });

  it('skips mepLingo when locale has no prefix', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: { ietf: 'en-US' } }); // No prefix
    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.not.exist;
  });

  it('skips mepLingo when no matching region', async () => {
    window.sessionStorage.setItem('akamai', 'xx'); // Country not in regions
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.not.exist;
  });

  it('uses country mapping when configured', async () => {
    window.sessionStorage.setItem('akamai', 'at'); // Austria maps to ch
    const currentConfig = getConfig();
    updateConfig({
      ...currentConfig,
      locale: mepLingoLocale,
      mepLingoCountryToRegion: { at: 'ch' }, // Map Austria to Switzerland
    });
    const a = document.querySelector('a.mep-lingo-mapping');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-mapping-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.exist;
  });

  it('handles LCP section (data-idx=0) with mepLingo', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-lcp');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-lcp-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('uses region directly when country matches region key', async () => {
    const localeWithDirectRegion = {
      ...mepLingoLocale,
      regions: {
        ch: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' },
      },
    };
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: localeWithDirectRegion });
    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.exist;
  });

  it('handles locale with empty prefix parts', async () => {
    const localeWithEmptyPrefix = {
      prefix: '',
      region: 'us',
      language: 'en',
      ietf: 'en-US',
      regions: {
        ch_en: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'en-CH' },
      },
    };
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: localeWithEmptyPrefix });
    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('handles langstore prefix with second part', async () => {
    const langstoreLocale = {
      prefix: '/langstore/test',
      region: 'de',
      language: 'de',
      ietf: 'de-DE',
      regions: {
        ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' },
      },
    };
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: langstoreLocale });
    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('handles target-preview prefix with second part', async () => {
    const targetPreviewLocale = {
      prefix: '/target-preview/test',
      region: 'de',
      language: 'de',
      ietf: 'de-DE',
      regions: {
        ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' },
      },
    };
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: targetPreviewLocale });
    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });
});

describe('MEP Lingo with Query Index', () => {
  const mepLingoLocale = {
    prefix: '/test/blocks/fragment/mocks/de',
    region: 'de',
    language: 'de',
    ietf: 'de-DE',
    regions: {
      ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' },
    },
  };

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    window.lana = { log: stub() };
    // Clear any existing query indexes
    Object.keys(queryIndexes).forEach((key) => delete queryIndexes[key]);
  });

  afterEach(() => {
    window.sessionStorage.clear();
    Object.keys(queryIndexes).forEach((key) => delete queryIndexes[key]);
  });

  it('uses fetchMepLingoThenFallback when query index has matching path', async () => {
    // Mock query index with ROC path
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/mep-lingo-test']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.exist;
  });

  it('uses fallback when query index available but path not in index', async () => {
    // Mock query index without the ROC path
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/some/other/path']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    // Should use fallback since ROC path not in index
    expect(frag.dataset.mepLingoFallback).to.exist;
  });

  it('handles LCP with checkImmediate and resolved index', async () => {
    // Mock query index for LCP (data-idx="0")
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/mep-lingo-test']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-lcp');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-lcp-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('handles LCP with unresolved index', async () => {
    // Mock query index that is not yet resolved
    queryIndexes.test = {
      requestResolved: false,
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/mep-lingo-test']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-lcp');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-lcp-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('handles query index with no matching paths', async () => {
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve([]),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('removes block swap parent when mepLingo disabled', async () => {
    // Create isolated test element
    const container = document.createElement('div');
    container.className = 'test-block-swap-section section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div class="block-swap-parent">
        <p><a class="test-block-swap" href="/test/blocks/fragment/mocks/de/fragments/mep-lingo-test" data-mep-lingo-block-fragment="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    // No akamai = mepLingoEnabled false, but isBlockSwap true
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = container.querySelector('a.test-block-swap');
    const parent = a.parentElement;

    await getFragment(a);

    // Parent should be removed (line 303)
    expect(container.contains(parent)).to.be.false;

    container.remove();
  });

  it('handles fetchMepLingoThenFallback when ROC fails', async () => {
    // Mock query index with path that matches but file doesn't exist
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/nonexistent-roc']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: {
      ...mepLingoLocale,
      regions: {
        ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' },
      },
    } });

    // Create element pointing to nonexistent ROC but existing fallback
    const container = document.createElement('div');
    container.className = 'test-fallback-section section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div>
        <p><a class="test-fallback" href="/test/blocks/fragment/mocks/de/fragments/mep-lingo-test" data-mep-lingo="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a.test-fallback');
    await getFragment(a);

    const frag = container.querySelector('.fragment');
    expect(frag).to.exist;

    container.remove();
  });

  it('handles block swap with mepLingo enabled and ROC success', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    // Create isolated block swap element with mepLingo enabled
    const container = document.createElement('div');
    container.className = 'test-block-swap-enabled section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div class="block-swap-parent-enabled">
        <p><a class="test-block-swap-enabled" href="/test/blocks/fragment/mocks/de/fragments/mep-lingo-test" data-mep-lingo="true" data-mep-lingo-block-fragment="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a.test-block-swap-enabled');
    await getFragment(a);

    // Fragment should be loaded via ROC path
    const frag = container.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoRoc).to.exist;

    container.remove();
  });

  it('handles block swap with mepLingo enabled but ROC fails', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    // Create element pointing to nonexistent ROC
    const container = document.createElement('div');
    container.className = 'test-block-swap-fail section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div class="block-swap-parent-fail">
        <p><a class="test-block-swap-fail" href="/test/blocks/fragment/mocks/de/fragments/nonexistent" data-mep-lingo="true" data-mep-lingo-block-fragment="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a.test-block-swap-fail');
    const parent = a.parentElement;

    await getFragment(a);

    // Parent should be removed since ROC failed
    expect(container.contains(parent)).to.be.false;

    container.remove();
  });

  it('handles block swap with section metadata', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    // Create element with mepLingoSectionMetadata
    const container = document.createElement('div');
    container.className = 'test-section-metadata section';
    container.dataset.idx = '99';
    container.style.background = 'red';
    container.innerHTML = `
      <div class="other-child">Other content</div>
      <div class="swap-parent">
        <p><a class="test-section-metadata" href="/test/blocks/fragment/mocks/de/fragments/mep-lingo-test" data-mep-lingo="true" data-mep-lingo-block-fragment="true" data-mep-lingo-section-metadata="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a.test-section-metadata');
    await getFragment(a);

    // Section style should be cleared and other children removed
    expect(container.style.background).to.equal('');
    expect(container.querySelector('.other-child')).to.not.exist;

    container.remove();
  });

  it('triggers fetchMepLingoThenFallback fallback path when ROC fails', async () => {
    // Mock query index with ROC path that will fail
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/fallback-only']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-fallback');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-fallback-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
    expect(frag.dataset.mepLingoFallback).to.exist;
  });

  it('handles checkImmediate with resolved index but no matching paths', async () => {
    // Mock query index that is resolved but has no matching paths for LCP
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/some/unrelated/path']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-lcp');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-lcp-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('handles query index error in catch block', async () => {
    // Mock query index that throws an error
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.reject(new Error('Test error')),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    const a = document.querySelector('a.mep-lingo-frag');
    await getFragment(a);

    const section = document.querySelector('.mep-lingo-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('removes original block when removeOriginalBlock and originalBlockId set', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    // Create original block to be removed
    const originalBlock = document.createElement('div');
    originalBlock.dataset.mepLingoOriginalBlock = 'test-block-123';
    originalBlock.className = 'original-block-to-remove';
    document.body.appendChild(originalBlock);

    // Create fragment link with removeOriginalBlock attributes
    const container = document.createElement('div');
    container.className = 'test-remove-original section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div>
        <p><a class="test-remove-original" href="/test/blocks/fragment/mocks/de/fragments/mep-lingo-test" data-mep-lingo="true" data-mep-lingo-block-fragment="true" data-original-block-id="test-block-123">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a.test-remove-original');
    await getFragment(a);

    // Original block should be removed
    expect(document.querySelector('.original-block-to-remove')).to.not.exist;

    container.remove();
  });

  it('handles langstore prefix without second part', async () => {
    const langstoreNoSecond = {
      prefix: '/langstore',
      region: 'us',
      language: 'en',
      ietf: 'en-US',
      regions: {
        ch_en: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'en-CH' },
      },
    };
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: langstoreNoSecond });

    const container = document.createElement('div');
    container.className = 'test-langstore section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div>
        <p><a href="/test/blocks/fragment/mocks/de/fragments/mep-lingo-test" data-mep-lingo="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a');
    await getFragment(a);

    expect(container.querySelector('.fragment')).to.exist;
    container.remove();
  });

  it('returns empty when both ROC and fallback fail in fetchMepLingoThenFallback', async () => {
    // Mock query index with path that will trigger fetchMepLingoThenFallback
    queryIndexes.test = {
      requestResolved: true,
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/both-fail']),
    };

    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });

    // Create element where BOTH ROC and fallback paths don't exist
    const container = document.createElement('div');
    container.className = 'test-both-fail section';
    container.dataset.idx = '99';
    container.innerHTML = `
      <div>
        <p><a href="/test/blocks/fragment/mocks/de/fragments/both-fail" data-mep-lingo="true">Test</a></p>
      </div>
    `;
    document.body.appendChild(container);

    const a = container.querySelector('a');
    await getFragment(a);

    // Should log error and not create fragment
    expect(container.querySelector('.fragment')).to.not.exist;
    expect(window.lana.log.called).to.be.true;

    container.remove();
  });
});

describe('getMepLingoContext with realistic prefixes', () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('correctly parses locale code from simple prefix like /de', () => {
    const realisticLocale = {
      prefix: '/de',
      region: 'de',
      language: 'de',
      ietf: 'de-DE',
      regions: { ch_de: { prefix: '/ch_de', ietf: 'de-CH' } },
    };

    window.sessionStorage.setItem('akamai', 'ch');

    const context = getMepLingoContext(realisticLocale);

    expect(context.localeCode).to.equal('de');
    expect(context.country).to.equal('ch');
    expect(context.regionKey).to.equal('ch_de');
    expect(context.matchingRegion).to.exist;
    expect(context.matchingRegion.prefix).to.equal('/ch_de');
  });

  it('correctly parses locale code from /fr prefix', () => {
    const realisticLocale = {
      prefix: '/fr',
      region: 'fr',
      language: 'fr',
      ietf: 'fr-FR',
      regions: { lu_fr: { prefix: '/lu_fr', ietf: 'fr-LU', region: 'lu' } },
    };

    window.sessionStorage.setItem('akamai', 'lu');

    const context = getMepLingoContext(realisticLocale);

    expect(context.localeCode).to.equal('fr');
    expect(context.country).to.equal('lu');
    expect(context.regionKey).to.equal('lu_fr');
    expect(context.matchingRegion).to.exist;
  });

  it('handles langstore prefix correctly', () => {
    const langstoreLocale = {
      prefix: '/langstore/de',
      region: 'de',
      language: 'de',
      ietf: 'de-DE',
      regions: { ch_de: { prefix: '/ch_de', ietf: 'de-CH' } },
    };

    window.sessionStorage.setItem('akamai', 'ch');

    const context = getMepLingoContext(langstoreLocale);

    expect(context.localeCode).to.equal('de');
    expect(context.regionKey).to.equal('ch_de');
    expect(context.matchingRegion).to.exist;
  });

  it('returns null values when no prefix', () => {
    const noPrefix = { region: 'us', language: 'en' };

    const context = getMepLingoContext(noPrefix);

    expect(context.country).to.be.null;
    expect(context.localeCode).to.be.null;
    expect(context.regionKey).to.be.null;
    expect(context.matchingRegion).to.be.null;
  });

  it('returns no matching region when country does not match any region', () => {
    const realisticLocale = {
      prefix: '/de',
      region: 'de',
      language: 'de',
      ietf: 'de-DE',
      regions: { ch_de: { prefix: '/ch_de', ietf: 'de-CH' } },
    };

    window.sessionStorage.setItem('akamai', 'fr'); // France, not in de regions

    const context = getMepLingoContext(realisticLocale);

    expect(context.localeCode).to.equal('de');
    expect(context.country).to.equal('fr');
    expect(context.matchingRegion).to.be.undefined;
  });
});
