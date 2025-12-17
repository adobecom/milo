import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import {
  getLocale, loadArea, setConfig, updateConfig, getConfig, queryIndexes,
} from '../../../libs/utils/utils.js';
import { getMepLingoContext } from '../../../libs/features/mep/lingo.js';

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
  env: { name: 'stage' }, // Enable preview attributes for MEP Lingo
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
const { default: getFragment, removeMepLingoRow } = await import('../../../libs/blocks/fragment/fragment.js');

// Clear any queryIndexes populated during imports to prevent hanging on unresolved promises
Object.keys(queryIndexes).forEach((key) => delete queryIndexes[key]);

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
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('langFirst', 'on');
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);

    window.lana = { log: stub() };
    Object.keys(queryIndexes).forEach((key) => delete queryIndexes[key]);
    const currentConfig = getConfig();
    const siteId = currentConfig.uniqueSiteId ?? '';
    const defaultQueryIndex = {
      requestResolved: true,
      pathsRequest: Promise.resolve([]),
      domains: [],
    };
    queryIndexes[siteId] = { ...defaultQueryIndex };
    queryIndexes.federal = { ...defaultQueryIndex };
  });

  afterEach(() => {
    window.sessionStorage.clear();
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('langFirst');
    window.history.replaceState({}, '', window.location.pathname + (searchParams.toString() ? `?${searchParams}` : ''));
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

  it('loads ROC inline fragment', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-inline');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-inline-section');
    expect(section.querySelector('[data-path]')).to.exist;
  });

  it('falls back when ROC fails', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-fallback');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-fallback-section');
    const frag = section.querySelector('.fragment');
    expect(frag).to.exist;
  });

  it('falls back inline fragment', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const a = document.querySelector('a.mep-lingo-fallback-inline');
    await getFragment(a);
    const section = document.querySelector('.mep-lingo-fallback-inline-section');
    expect(section.querySelector('[data-path]')).to.exist;
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
  });

  it('uses country mapping when configured', async () => {
    window.sessionStorage.setItem('akamai', 'ng');
    queryIndexes[''] = {
      pathsRequest: Promise.resolve(['/test/blocks/fragment/mocks/ch_de/fragments/mep-lingo-test']),
      requestResolved: true,
    };
    const localeWithAfrica = {
      ...mepLingoLocale,
      regions: {
        ...mepLingoLocale.regions,
        africa_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'en-ZA' },
      },
    };
    const currentConfig = getConfig();
    updateConfig({
      ...currentConfig,
      locale: localeWithAfrica,
      mepLingoCountryToRegion: { africa: ['ng'] },
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
      regions: { ch: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' } },
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
      regions: { ch_en: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'en-CH' } },
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
      regions: { ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' } },
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
      regions: { ch_test: { prefix: '/test/blocks/fragment/mocks/ch_de', ietf: 'de-CH' } },
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

  it('removes mep-lingo block even when fetch fails (line 171)', async () => {
    window.sessionStorage.setItem('akamai', 'ch');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const fetchStub = stub(window, 'fetch').callsFake(() => Promise.resolve(
      new Response(null, { status: 404, statusText: 'Not Found' }),
    ));
    const section = document.createElement('div');
    section.className = 'test-mep-block section';
    section.innerHTML = `
      <div class="mep-lingo">
        <div><div>mep-lingo</div></div>
        <div><div><a href="/test/blocks/fragment/mocks/de/fragments/nonexistent-file" data-mep-lingo="true" data-mep-lingo-block-swap="mep-lingo">Test</a></div></div>
      </div>`;
    document.body.appendChild(section);
    const originalBlock = section.querySelector('.mep-lingo');
    expect(originalBlock).to.exist;
    const a = section.querySelector('a');
    await getFragment(a);
    expect(section.querySelector('.mep-lingo')).to.not.exist;
    fetchStub.restore();
  });

  it('keeps authored content when no regional targeting (lines 156-161)', async () => {
    window.sessionStorage.removeItem('akamai');
    const currentConfig = getConfig();
    updateConfig({ ...currentConfig, locale: mepLingoLocale });
    const section = document.createElement('div');
    section.className = 'test-section section';
    section.innerHTML = `
      <div class="text">
        <div><div><p>Authored content</p></div></div>
        <div><div>mep-lingo</div><div><a href="/test/blocks/fragment/mocks/de/fragments/test" data-mep-lingo="true" data-mep-lingo-block-swap="text">Link</a></div></div>
      </div>`;
    const a = section.querySelector('a');
    const textBlock = section.querySelector('.text');
    document.body.appendChild(section);
    await getFragment(a);
    expect(textBlock.textContent).to.include('Authored content');
    expect(textBlock.textContent).to.not.include('mep-lingo');
  });
});

describe('removeMepLingoRow helper (covers lines 203-206, 208-211 logic)', () => {
  it('removes mep-lingo row from text block (lines 203-206 scenario)', () => {
    const textBlock = document.createElement('div');
    textBlock.className = 'text';
    textBlock.innerHTML = `
      <div><div><p>Original text content</p></div></div>
      <div><div>mep-lingo</div><div><a href="/fragments/swap">Swap</a></div></div>`;
    expect(textBlock.children.length).to.equal(2);
    removeMepLingoRow(textBlock);
    expect(textBlock.children.length).to.equal(1);
    expect(textBlock.textContent).to.include('Original text content');
    expect(textBlock.textContent).to.not.include('mep-lingo');
  });

  it('removes mep-lingo row from section-metadata (lines 208-211 scenario)', () => {
    const metadata = document.createElement('div');
    metadata.className = 'section-metadata';
    metadata.innerHTML = `
      <div><div>style</div><div>center</div></div>
      <div><div>mep-lingo</div><div><a href="/fragments/section">Section</a></div></div>`;
    expect(metadata.children.length).to.equal(2);
    removeMepLingoRow(metadata);
    expect(metadata.children.length).to.equal(1);
    expect(metadata.textContent).to.include('style');
    expect(metadata.textContent).to.not.include('mep-lingo');
  });

  it('removes mep-lingo row from mep-lingo block', () => {
    const mepLingoBlock = document.createElement('div');
    mepLingoBlock.className = 'mep-lingo';
    mepLingoBlock.innerHTML = `
      <div><div>mep-lingo</div></div>
      <div><div><a href="/fragments/test">Test</a></div></div>`;
    expect(mepLingoBlock.children.length).to.equal(2);
    removeMepLingoRow(mepLingoBlock);
    expect(mepLingoBlock.children.length).to.equal(1);
    expect(mepLingoBlock.textContent).to.not.include('mep-lingo');
  });

  it('handles block without mep-lingo row gracefully', () => {
    const textBlock = document.createElement('div');
    textBlock.className = 'text';
    textBlock.innerHTML = `
      <div><div><p>Content</p></div></div>
      <div><div><p>More content</p></div></div>`;
    expect(textBlock.children.length).to.equal(2);
    removeMepLingoRow(textBlock);
    expect(textBlock.children.length).to.equal(2);
  });

  it('handles null/undefined container', () => {
    expect(() => removeMepLingoRow(null)).to.not.throw();
    expect(() => removeMepLingoRow(undefined)).to.not.throw();
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
