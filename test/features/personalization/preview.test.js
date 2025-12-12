import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import experiments from './mocks/preview.js';

document.body.innerHTML = await readFile({ path: './mocks/postPersonalization.html' });
const {
  default: decoratePreviewMode,
  parsePageAndUrl,
  getUpstreamUrl,
  getDownstreamUrls,
  checkPageExists,
  updateUpstreamPageElement,
  updateDownstreamPagesElement,
} = await import('../../../libs/features/personalization/preview.js');
const { setConfig, updateConfig, MILO_EVENTS, createTag } = await import('../../../libs/utils/utils.js');

const config = {
  miloLibs: 'https://main--milo--adobecom.hlx.live/libs',
  codeRoot: 'https://main--homepage--adobecom.hlx.live/homepage',
  locale: {
    ietf: 'en-US',
    tk: 'hah7vzn.css',
    prefix: '',
    region: 'us',
    contentRoot: 'https://main--cc--adobecom.hlx.page/cc-shared',
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
    '--cc--adobecom.hlx.live': {
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
    '--cc--adobecom.hlx.page': {
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
    document.querySelector('.new-manifest').value = 'https://main--homepage--adobecom.hlx.live/homepage/fragments/mep/new-manifest.json';
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
    const { url, page } = parsePageAndUrl(config, new URL('https://main--homepage--adobecom.hlx.page/fr/homepage/index-loggedout'), 'fr');
    expect(url).to.equal('https://www.adobe.com/fr/');
    expect(page).to.equal('/');
  });
  it('parse url and page for bacom preview', () => {
    config.stageDomainsMap = { 'business.stage.adobe.com': {} };
    const { url, page } = parsePageAndUrl(config, new URL('https://main--bacom--adobecom.hlx.page/fr/products/real-time-customer-data-platform/rtcdp'), 'fr');
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

describe('MEP Lingo upstream/downstream URLs', () => {
  describe('getUpstreamUrl', () => {
    it('returns null when locale.base is undefined', () => {
      const testConfig = { locale: { prefix: '/fr' } };
      expect(getUpstreamUrl(testConfig)).to.be.null;
    });

    it('returns upstream URL with empty base (US)', () => {
      const testConfig = {
        locale: {
          prefix: '/ch_de',
          base: '',
        },
      };
      const result = getUpstreamUrl(testConfig);
      expect(result).to.include(window.location.origin);
      expect(result).to.not.include('/ch_de');
    });

    it('returns upstream URL with non-empty base', () => {
      const testConfig = {
        locale: {
          prefix: '/ch_de',
          base: 'de',
        },
      };
      const result = getUpstreamUrl(testConfig);
      expect(result).to.include('/de');
    });

    it('handles locale with no prefix', () => {
      const testConfig = {
        locale: {
          prefix: '',
          base: 'fr',
        },
      };
      const result = getUpstreamUrl(testConfig);
      expect(result).to.include('/fr');
    });

    it('replaces prefix when pathname starts with currentPrefix', () => {
      const testConfig = {
        locale: {
          prefix: '/ch_de',
          base: 'de',
        },
      };
      const mockLocation = {
        pathname: '/ch_de/products/photoshop',
        origin: 'https://example.com',
      };
      const result = getUpstreamUrl(testConfig, mockLocation);
      expect(result).to.equal('https://example.com/de/products/photoshop');
    });

    it('replaces prefix with empty base (US upstream)', () => {
      const testConfig = {
        locale: {
          prefix: '/ca',
          base: '',
        },
      };
      const mockLocation = {
        pathname: '/ca/products/photoshop',
        origin: 'https://example.com',
      };
      const result = getUpstreamUrl(testConfig, mockLocation);
      expect(result).to.equal('https://example.com/products/photoshop');
    });
  });

  describe('getDownstreamUrls', () => {
    it('returns empty array when no regions', () => {
      const testConfig = { locale: {} };
      expect(getDownstreamUrls(testConfig)).to.deep.equal([]);
    });

    it('returns empty array when regions is empty object', () => {
      const testConfig = { locale: { regions: {} } };
      expect(getDownstreamUrls(testConfig)).to.deep.equal([]);
    });

    it('returns downstream URLs for each region', () => {
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: {
            ch_de: { prefix: '/ch_de' },
            at_de: { prefix: '/at_de' },
          },
        },
      };
      const result = getDownstreamUrls(testConfig);
      expect(result).to.have.length(2);
      expect(result[0].regionKey).to.equal('ch_de');
      expect(result[0].url).to.include('/ch_de');
      expect(result[1].regionKey).to.equal('at_de');
      expect(result[1].url).to.include('/at_de');
    });

    it('handles base locale with no prefix', () => {
      const testConfig = {
        locale: {
          prefix: '',
          regions: { ca_en: { prefix: '/ca' } },
        },
      };
      const result = getDownstreamUrls(testConfig);
      expect(result).to.have.length(1);
      expect(result[0].regionKey).to.equal('ca_en');
      expect(result[0].url).to.include('/ca');
    });

    it('uses regionKey as prefix when region.prefix is not defined', () => {
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: { ch_de: {} },
        },
      };
      const result = getDownstreamUrls(testConfig);
      expect(result).to.have.length(1);
      expect(result[0].url).to.include('/ch_de');
    });

    it('replaces prefix when pathname starts with currentPrefix', () => {
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: {
            ch_de: { prefix: '/ch_de' },
            at_de: { prefix: '/at_de' },
          },
        },
      };
      const mockLocation = {
        pathname: '/de/products/photoshop',
        origin: 'https://example.com',
      };
      const result = getDownstreamUrls(testConfig, mockLocation);
      expect(result).to.have.length(2);
      expect(result[0].url).to.equal('https://example.com/ch_de/products/photoshop');
      expect(result[1].url).to.equal('https://example.com/at_de/products/photoshop');
    });

    it('replaces US prefix (empty) with region prefix', () => {
      const testConfig = {
        locale: {
          prefix: '',
          regions: { ca_en: { prefix: '/ca' } },
        },
      };
      const mockLocation = {
        pathname: '/products/photoshop',
        origin: 'https://example.com',
      };
      const result = getDownstreamUrls(testConfig, mockLocation);
      expect(result).to.have.length(1);
      expect(result[0].url).to.equal('https://example.com/ca/products/photoshop');
    });
  });

  describe('checkPageExists', () => {
    let fetchStub;

    afterEach(() => {
      if (fetchStub) fetchStub.restore();
    });

    it('returns true for 200 response', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const result = await checkPageExists('https://example.com/page');
      expect(result).to.be.true;
    });

    it('returns false for 404 response', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 404 });
      const result = await checkPageExists('https://example.com/page');
      expect(result).to.be.false;
    });

    it('returns true for 401 when treatAuthAsExists is true', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 401 });
      const result = await checkPageExists('https://example.com/page', true);
      expect(result).to.be.true;
    });

    it('returns true for 403 when treatAuthAsExists is true', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 403 });
      const result = await checkPageExists('https://example.com/page', true);
      expect(result).to.be.true;
    });

    it('returns null for 401 when treatAuthAsExists is false', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 401 });
      const result = await checkPageExists('https://example.com/page', false);
      expect(result).to.be.null;
    });

    it('returns null for 500 response', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 500 });
      const result = await checkPageExists('https://example.com/page');
      expect(result).to.be.null;
    });

    it('returns null on network error', async () => {
      fetchStub = sinon.stub(window, 'fetch').rejects(new Error('Network error'));
      const result = await checkPageExists('https://example.com/page');
      expect(result).to.be.null;
    });
  });

  describe('updateUpstreamPageElement', () => {
    let fetchStub;
    let testElement;

    beforeEach(() => {
      testElement = createTag('div', { id: 'testUpstream' });
      testElement.textContent = 'Checking...';
      document.body.appendChild(testElement);
    });

    afterEach(() => {
      if (fetchStub) fetchStub.restore();
      testElement.remove();
    });

    it('shows None when no upstream URL', async () => {
      const testConfig = { locale: { prefix: '/fr' } }; // no base = no upstream
      await updateUpstreamPageElement('testUpstream', testConfig);
      expect(testElement.textContent).to.equal('None');
    });

    it('shows link when upstream page exists', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const testConfig = { locale: { prefix: '/ch_de', base: 'de' } };
      await updateUpstreamPageElement('testUpstream', testConfig);
      const link = testElement.querySelector('a');
      expect(link).to.exist;
      expect(link.textContent).to.equal('de');
      expect(link.getAttribute('target')).to.equal('_blank');
    });

    it('shows US when base is empty string', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const testConfig = { locale: { prefix: '/ca', base: '' } };
      await updateUpstreamPageElement('testUpstream', testConfig);
      const link = testElement.querySelector('a');
      expect(link.textContent).to.equal('US');
    });

    it('shows None when upstream page returns 404', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 404 });
      const testConfig = { locale: { prefix: '/ch_de', base: 'de' } };
      await updateUpstreamPageElement('testUpstream', testConfig);
      expect(testElement.textContent).to.equal('None');
    });

    it('shows Unable to verify on network error', async () => {
      fetchStub = sinon.stub(window, 'fetch').rejects(new Error('Network error'));
      const testConfig = { locale: { prefix: '/ch_de', base: 'de' } };
      await updateUpstreamPageElement('testUpstream', testConfig);
      expect(testElement.textContent).to.equal('Unable to verify');
    });

    it('returns early if element not found', async () => {
      await updateUpstreamPageElement('nonexistent', { locale: { base: 'de' } });
      // No error thrown = success
    });
  });

  describe('updateDownstreamPagesElement', () => {
    let fetchStub;
    let testElement;

    beforeEach(() => {
      testElement = createTag('div', { id: 'testDownstream' });
      testElement.textContent = 'Checking...';
      document.body.appendChild(testElement);
    });

    afterEach(() => {
      if (fetchStub) fetchStub.restore();
      testElement.remove();
    });

    it('shows None when no regions', async () => {
      const testConfig = { locale: { prefix: '/de' } };
      await updateDownstreamPagesElement('testDownstream', testConfig);
      expect(testElement.textContent).to.equal('None');
    });

    it('shows None when no downstream pages exist', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 404 });
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: { ch_de: { prefix: '/ch_de' } },
        },
      };
      await updateDownstreamPagesElement('testDownstream', testConfig);
      expect(testElement.textContent).to.equal('None');
    });

    it('shows single link when one downstream page exists', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: { ch_de: { prefix: '/ch_de' } },
        },
      };
      await updateDownstreamPagesElement('testDownstream', testConfig);
      const link = testElement.querySelector('a');
      expect(link).to.exist;
      expect(link.textContent).to.equal('ch_de');
      expect(testElement.querySelector('.mep-downstream-toggle')).to.be.null;
    });

    it('shows expandable list when multiple downstream pages exist', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: {
            ch_de: { prefix: '/ch_de' },
            at_de: { prefix: '/at_de' },
          },
        },
      };
      await updateDownstreamPagesElement('testDownstream', testConfig);
      const links = testElement.querySelectorAll('a');
      expect(links.length).to.be.at.least(1);
      const toggle = testElement.querySelector('.mep-downstream-toggle');
      expect(toggle).to.exist;
      expect(toggle.textContent).to.include('+');
    });

    it('toggle expands and collapses more container', async () => {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const testConfig = {
        locale: {
          prefix: '/de',
          regions: {
            ch_de: { prefix: '/ch_de' },
            at_de: { prefix: '/at_de' },
          },
        },
      };
      await updateDownstreamPagesElement('testDownstream', testConfig);
      const toggle = testElement.querySelector('.mep-downstream-toggle');
      const moreContainer = testElement.querySelector('.mep-downstream-more');
      expect(moreContainer.style.display).to.equal('none');
      toggle.click();
      expect(moreContainer.style.display).to.equal('block');
      toggle.click();
      expect(moreContainer.style.display).to.equal('none');
    });

    it('returns early if element not found', async () => {
      await updateDownstreamPagesElement('nonexistent', { locale: { regions: {} } });
      // No error thrown = success
    });
  });
});

describe('MEP Lingo region select with lingo param', () => {
  let originalSearch;
  let fetchStub;

  before(() => {
    originalSearch = window.location.search;
  });

  beforeEach(() => {
    // Add lingo=on to URL
    const url = new URL(window.location.href);
    url.searchParams.set('lingo', 'on');
    window.history.pushState({}, '', url.toString());

    // Stub fetch for page existence checks
    fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
  });

  afterEach(() => {
    const url = new URL(window.location.href);
    url.search = originalSearch;
    window.history.pushState({}, '', url.toString());

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

  beforeEach(async () => {
    windowOpenStub = sinon.stub(window, 'open');
    setConfig(config);
    await decoratePreviewMode();
  });

  afterEach(() => {
    windowOpenStub.restore();
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
