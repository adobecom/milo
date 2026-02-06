import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import experiments from './mocks/preview.js';

document.body.innerHTML = await readFile({ path: './mocks/postPersonalization.html' });
const {
  default: decoratePreviewMode,
  parsePageAndUrl,
} = await import('../../../libs/features/personalization/preview.js');
const { setConfig, updateConfig, MILO_EVENTS, createTag } = await import('../../../libs/utils/utils.js');

const config = {
  miloLibs: 'https://main--milo--adobecom.aem.live/libs',
  codeRoot: 'https://main--homepage--adobecom.aem.live/homepage',
  locale: {
    ietf: 'en-US',
    tk: 'hah7vzn.css',
    prefix: '',
    region: 'us',
    contentRoot: 'https://main--cc--adobecom.aem.page/cc-shared',
  },
  mep: {
    preview: true,
    override: '',
    highlight: true,
    experiments: [],
    targetEnabled: true,
    prefix: '',
    consentState: { performance: true, advertising: true },
  },
  stageDomainsMap: {
    'www.stage.adobe.com': {
      'www.adobe.com': 'origin',
      'business.adobe.com': 'business.stage.adobe.com',
      'helpx.adobe.com': 'helpx.stage.adobe.com',
      'blog.adobe.com': 'blog.stage.adobe.com',
      'developer.adobe.com': 'developer-stage.adobe.com',
      'news.adobe.com': 'news.stage.adobe.com',
      'firefly.adobe.com': 'firefly-stage.corp.adobe.com',
      'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
      'projectneo.adobe.com': 'stg.projectneo.adobe.com',
    },
    '--cc--adobecom.aem.live': {
      'www.adobe.com': 'origin',
      'business.adobe.com': 'business.stage.adobe.com',
      'helpx.adobe.com': 'helpx.stage.adobe.com',
      'blog.adobe.com': 'blog.stage.adobe.com',
      'developer.adobe.com': 'developer-stage.adobe.com',
      'news.adobe.com': 'news.stage.adobe.com',
      'firefly.adobe.com': 'firefly-stage.corp.adobe.com',
      'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
      'projectneo.adobe.com': 'stg.projectneo.adobe.com',
    },
    '--cc--adobecom.aem.page': {
      'www.adobe.com': 'origin',
      'business.adobe.com': 'business.stage.adobe.com',
      'helpx.adobe.com': 'helpx.stage.adobe.com',
      'blog.adobe.com': 'blog.stage.adobe.com',
      'developer.adobe.com': 'developer-stage.adobe.com',
      'news.adobe.com': 'news.stage.adobe.com',
      'firefly.adobe.com': 'firefly-stage.corp.adobe.com',
      'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
      'projectneo.adobe.com': 'stg.projectneo.adobe.com',
    },
  },
  env: { name: 'stage' },
};
setConfig(config);

describe('preview feature', () => {
  beforeEach(() => {
    setConfig(config);
  });
  it('builds with 0 manifests', async () => {
    await decoratePreviewMode();
    const event = new Event(MILO_EVENTS.DEFERRED);
    document.dispatchEvent(event);
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
  });
  it('expand and close panel, expand and close advance, remove button', () => {
    expect(document.querySelector('.mep-preview-overlay > div').className).to.equal('mep-hidden');
    document.querySelector('.mep-badge').click();
    expect(document.querySelector('.mep-preview-overlay > div').className).to.equal('');
    document.querySelector('.mep-badge').click();
    expect(document.querySelector('.mep-preview-overlay > div').className).to.equal('mep-hidden');
    document.querySelector('.mep-close').click();
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(0);
  });
  it('builds with multiple manifests', async () => {
    config.mep.experiments = experiments;
    setConfig(config);
    await decoratePreviewMode();
    expect(document.querySelectorAll('.mep-preview-overlay').length).to.equal(1);
  });
  it('adds highlights', () => {
    expect(document.querySelector('[data-path="/fragments/fragmentreplaced"]').getAttribute('data-manifest-id')).to.equal('selected-example.json');
    expect(document.querySelector('.marquee').getAttribute('data-code-manifest-id')).to.equal('selected-example.json');
    expect(document.querySelector('header').getAttribute('data-manifest-id')).to.equal('selected-example.json');
  });
  it('adjusts highlights for merch cards', () => {
    expect(document.querySelector('merch-card').getAttribute('data-manifest-id')).to.equal('selected-example.json');
  });
  it('preselects form inputs', () => {
    expect(document.querySelector('option[name*="/homepage/fragments/mep/selected-example.json"][value="target-smb"]').getAttribute('selected')).to.equal('');
    expect(document.querySelector('option[name*="/homepage/fragments/mep/default-selected.json"][value="default"]').getAttribute('selected')).to.equal('');
    expect(document.querySelector('input#mepHighlightCheckbox').getAttribute('checked')).to.equal('checked');
  });
  it('updates preview button', () => {
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('---');
    document.querySelector('.new-manifest').value = 'https://main--homepage--adobecom.aem.live/homepage/fragments/mep/new-manifest.json';
    document.querySelector('option[name*="/homepage/fragments/mep/selected-example.json"][value="default"]').closest('select').dispatchEvent(new Event('change'));
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('new-manifest.json');
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('%2Fhomepage%2Ffragments%2Fmep%2Fselected-example.json--target-smb');
    document.querySelector('input#mepHighlightCheckbox').click();
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.not.contain('mepHighlight');
    document.querySelector('input#mepPreviewButtonCheckbox').click();
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('mepButton=off');
    expect(document.querySelector('a[title="Preview above choices"]').getAttribute('href')).to.contain('---');
  });
  it('parse url and page for stage', () => {
    const { url, page } = parsePageAndUrl(config, new URL('https://www.stage.adobe.com/fr/products/photoshop.html'), 'fr');
    expect(url).to.equal('https://www.adobe.com/fr/products/photoshop.html');
    expect(page).to.equal('/products/photoshop.html');
  });
  it('parse url and page for preview', () => {
    const { url, page } = parsePageAndUrl(config, new URL('https://main--cc--adobecom.aem.page/fr/products/photoshop'), 'fr');
    expect(url).to.equal('https://www.adobe.com/fr/products/photoshop.html');
    expect(page).to.equal('/products/photoshop.html');
  });
  it('parse url and page for homepage preview', () => {
    const { url, page } = parsePageAndUrl(config, new URL('https://main--homepage--adobecom.aem.page/fr/homepage/index-loggedout'), 'fr');
    expect(url).to.equal('https://www.adobe.com/fr/');
    expect(page).to.equal('/');
  });
  it('parse url and page for bacom preview', () => {
    config.stageDomainsMap = { 'business.stage.adobe.com': {} };
    const { url, page } = parsePageAndUrl(config, new URL('https://main--bacom--adobecom.aem.page/fr/products/real-time-customer-data-platform/rtcdp'), 'fr');
    expect(url).to.equal('https://business.adobe.com/fr/products/real-time-customer-data-platform/rtcdp.html');
    expect(page).to.equal('/products/real-time-customer-data-platform/rtcdp.html');
  });
  it('parse url and page for prod US', () => {
    config.env.name = 'prod';
    const { url, page } = parsePageAndUrl(config, new URL('https://www.adobe.com/products/photoshop.html'), '');
    expect(url).to.equal('https://www.adobe.com/products/photoshop.html');
    expect(page).to.equal('/products/photoshop.html');
  });
  it('parse url and page for prod non US', () => {
    const { url, page } = parsePageAndUrl(config, new URL('https://www.adobe.com/fr/products/photoshop.html'), 'fr');
    expect(url).to.equal('https://www.adobe.com/fr/products/photoshop.html');
    expect(page).to.equal('/products/photoshop.html');
  });
  it('parse url and page for no stage map', () => {
    config.env.name = 'stage';
    delete config.stageDomainsMap;
    const { url, page } = parsePageAndUrl(config, new URL('https://www.stage.adobe.com/events/2024-10-31.html'), '');
    expect(url).to.equal('https://www.adobe.com/events/2024-10-31.html');
    expect(page).to.equal('/events/2024-10-31.html');
  });
  it('opens manifest', () => {
    document.querySelector('a.mep-edit-manifest').click();
  });
});

describe('MEP Lingo region select with lingo param', () => {
  let fetchStub;
  let lingoMeta;

  beforeEach(() => {
    // Use meta tag instead of URL param because PAGE_URL is captured at module load time
    lingoMeta = document.createElement('meta');
    lingoMeta.setAttribute('name', 'langfirst');
    lingoMeta.setAttribute('content', 'on');
    document.head.appendChild(lingoMeta);

    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
  });

  afterEach(() => {
    if (lingoMeta) lingoMeta.remove();
    if (fetchStub) fetchStub.restore();

    document.querySelectorAll('.mep-preview-overlay').forEach((el) => el.remove());
  });

  it('creates MEP Lingo section with region dropdown when lingo is active', async () => {
    const lingoConfig = {
      ...config,
      mep: {
        ...config.mep,
        akamaiCode: 'de',
        consentState: { performance: true, advertising: true },
      },
      locale: {
        ...config.locale,
        prefix: '/de',
        base: '',
        regions: {
          ch_de: { prefix: '/ch_de' },
          at_de: { prefix: '/at_de' },
        },
      },
    };
    updateConfig(lingoConfig);
    await decoratePreviewMode();

    const popups = document.querySelectorAll('.mep-popup');
    const popup = popups[popups.length - 1];
    expect(popup).to.exist;

    const lingoSection = popup?.querySelector('.mep-lingo-section');
    expect(lingoSection).to.exist;

    const regionSelect = popup?.querySelector('select[id^="mepLingoRegionSelect"]');
    expect(regionSelect).to.exist;
  });

  it('sets akamaiLocale param when region is selected', async () => {
    const lingoConfig = {
      ...config,
      mep: {
        ...config.mep,
        akamaiCode: 'de',
        consentState: { performance: true, advertising: true },
      },
      locale: {
        ...config.locale,
        prefix: '/de',
        base: '',
        regions: {
          ch_de: { prefix: '/ch_de' },
          at_de: { prefix: '/at_de' },
        },
      },
    };
    updateConfig(lingoConfig);
    await decoratePreviewMode();

    const popups = document.querySelectorAll('.mep-popup');
    const popup = popups[popups.length - 1];
    const regionSelect = popup?.querySelector('select[id^="mepLingoRegionSelect"]');
    expect(regionSelect).to.exist;

    regionSelect.value = 'ch';
    regionSelect.dispatchEvent(new Event('change'));

    const previewLink = popup.querySelector('a[title="Preview above choices"]');
    expect(previewLink.getAttribute('href')).to.include('akamaiLocale=ch');
  });

  it('removes akamaiLocale param when no region is selected', async () => {
    const lingoConfig = {
      ...config,
      mep: {
        ...config.mep,
        akamaiCode: 'de',
        consentState: { performance: true, advertising: true },
      },
      locale: {
        ...config.locale,
        prefix: '/de',
        base: '',
        regions: { ch_de: { prefix: '/ch_de' } },
      },
    };
    updateConfig(lingoConfig);
    await decoratePreviewMode();

    const popups = document.querySelectorAll('.mep-popup');
    const popup = popups[popups.length - 1];
    const regionSelect = popup?.querySelector('select[id^="mepLingoRegionSelect"]');
    expect(regionSelect).to.exist;

    regionSelect.value = 'ch';
    regionSelect.dispatchEvent(new Event('change'));

    regionSelect.value = '';
    regionSelect.dispatchEvent(new Event('change'));

    const previewLink = popup.querySelector('a[title="Preview above choices"]');
    expect(previewLink.getAttribute('href')).to.not.include('akamaiLocale');
  });
});

describe('Lingo fragment click handlers', () => {
  let windowOpenStub;
  let testFragment;
  let getComputedStyleStub;

  beforeEach(async () => {
    windowOpenStub = sinon.stub(window, 'open');
    // Mock getComputedStyle to return badge styles
    const originalGetComputedStyle = window.getComputedStyle;
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((element, pseudoElt) => {
      if (pseudoElt === '::before') {
        return {
          display: 'block',
          content: '"test badge"',
          width: '400px',
        };
      }
      return originalGetComputedStyle(element, pseudoElt);
    });
    setConfig(config);
    await decoratePreviewMode();
  });

  afterEach(() => {
    windowOpenStub.restore();
    getComputedStyleStub.restore();
    delete document.body.dataset.mepHighlight;
    if (testFragment) {
      testFragment.remove();
      testFragment = null;
    }
  });

  it('opens fragment path when clicking in badge area of mep-lingo-roc element', async () => {
    testFragment = createTag('div', {
      'data-mep-lingo-roc': 'roc: /lu_fr/fragments/test',
      'data-path': '/fr/fragments/test',
    });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called, 'window.open should have been called').to.be.true;
  });

  it('opens fragment path when clicking in badge area of mep-lingo-fallback element', async () => {
    testFragment = createTag('div', {
      'data-mep-lingo-fallback': 'fallback: /fr/fragments/test',
      'data-path': '/fr/fragments/fallback',
    });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 200,
      clientY: 20,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called, 'window.open should have been called').to.be.true;
  });

  it('opens fragment path when clicking on data-manifest-id element with data-path', async () => {
    testFragment = createTag('div', {
      'data-manifest-id': 'test-manifest',
      'data-path': '/fragments/manifest-test',
    });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 15,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called, 'window.open should have been called').to.be.true;
  });

  it('does not open when click is outside badge area (too far right)', async () => {
    testFragment = createTag('div', {
      'data-mep-lingo-roc': 'roc: /lu_fr/fragments/test',
      'data-path': '/fr/fragments/test',
    });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 450,
      clientY: 10,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called).to.be.false;
  });

  it('does not open when click is outside badge area (too far down)', async () => {
    testFragment = createTag('div', {
      'data-mep-lingo-roc': 'roc: /lu_fr/fragments/test',
      'data-path': '/fr/fragments/test',
    });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 50,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called).to.be.false;
  });

  it('does not open when element has no data-path', async () => {
    testFragment = createTag('div', { 'data-mep-lingo-roc': 'roc: /lu_fr/fragments/test' });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called).to.be.false;
  });

  it('does not trigger for elements without lingo attributes', async () => {
    testFragment = createTag('div', { 'data-path': '/fr/fragments/test' });
    document.body.appendChild(testFragment);

    testFragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 10,
    });
    testFragment.dispatchEvent(clickEvent);

    expect(windowOpenStub.called).to.be.false;
  });
});
