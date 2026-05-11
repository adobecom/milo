import { expect } from '@esm-bundle/chai';
import sinon, { stub, restore } from 'sinon';
import { appendHreflangLinks } from '../../../libs/features/hreflang/hreflang.js';

const DE_LOCATION = { origin: 'https://www.adobe.com', pathname: '/de/products/test' };
const DE_UNKNOWN_LOCATION = { origin: 'https://www.adobe.com', pathname: '/de/unknown/page' };

const LOCALES = ['de', 'fr', 'jp'];
const SITEMAP_TEMPLATE = '/{locale}/assets/sitemap.xml';
const SITEMAP_ORIGIN = 'https://www.adobe.com';

const MOCK_MAP = {
  'https://www.adobe.com/de/products/test.html': [
    { hreflang: 'en', href: 'https://www.adobe.com/products/test.html' },
    { hreflang: 'fr', href: 'https://www.adobe.com/fr/products/test.html' },
  ],
  'https://www.adobe.com/de/': [
    { hreflang: 'en', href: 'https://www.adobe.com/' },
  ],
};

function buildMockXml(map) {
  const urls = Object.entries(map).map(([loc, links]) => `
    <url>
      <loc>${loc}</loc>
      ${links.map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${l.href}"/>`).join('')}
    </url>
  `).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset>${urls}</urlset>`;
}

function setUserAgentMeta(agents = 'Googlebot') {
  let meta = document.querySelector('meta[name="hreflinksuseragents"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'hreflinksuseragents');
    document.head.append(meta);
  }
  meta.setAttribute('content', agents);
}

function removeUserAgentMeta() {
  document.querySelector('meta[name="hreflinksuseragents"]')?.remove();
}

function removeInjectedLinks() {
  document.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove());
}

function mockFetch(xmlBody, ok = true) {
  return stub(window, 'fetch').resolves({
    ok,
    text: () => Promise.resolve(xmlBody),
  });
}

const BASE_CONFIG = {
  locales: LOCALES,
  sitemapTemplate: SITEMAP_TEMPLATE,
  sitemapOrigin: SITEMAP_ORIGIN,
  location: DE_LOCATION,
};

describe('appendHreflangLinks', () => {
  let fetchStub;

  beforeEach(() => {
    sessionStorage.clear();
    removeUserAgentMeta();
    removeInjectedLinks();
    fetchStub?.restore();
    if (!document.head.querySelector('title')) {
      const title = document.createElement('title');
      document.head.append(title);
    }
  });

  afterEach(() => {
    restore();
  });

  it('returns template as-is and logs when sitemapTemplate has no {locale} placeholder', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));

    await appendHreflangLinks({ ...BASE_CONFIG, sitemapTemplate: '/sitemap.xml' });

    expect(fetchStub.calledWith('https://www.adobe.com/sitemap.xml', sinon.match.any)).to.be.true;
  });

  it('does nothing when hreflinksuseragents meta is absent', async () => {
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));
    await appendHreflangLinks(BASE_CONFIG);
    expect(fetchStub.called).to.be.false;
  });

  it('does nothing when user agent is not in allowed list', async () => {
    setUserAgentMeta('SomeOtherBot');
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));
    await appendHreflangLinks(BASE_CONFIG);
    expect(fetchStub.called).to.be.false;
  });

  it('fetches sitemap and injects hreflang links for matching page', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));

    await appendHreflangLinks(BASE_CONFIG);

    const links = document.querySelectorAll('link[rel="alternate"]');
    expect(links).to.have.length(2);
    expect(links[0].getAttribute('hreflang')).to.equal('en');
    expect(links[1].getAttribute('hreflang')).to.equal('fr');
  });

  it('uses sessionStorage cache on second call, skipping fetch', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));

    await appendHreflangLinks(BASE_CONFIG);
    removeInjectedLinks();
    await appendHreflangLinks(BASE_CONFIG);

    expect(fetchStub.callCount).to.equal(1);
    expect(document.querySelectorAll('link[rel="alternate"]')).to.have.length(2);
  });

  it('does not inject links when page not found in sitemap', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));

    await appendHreflangLinks({ ...BASE_CONFIG, location: DE_UNKNOWN_LOCATION });

    expect(document.querySelectorAll('link[rel="alternate"]')).to.have.length(0);
  });

  it('handles failed fetch gracefully', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    fetchStub = mockFetch('', false);

    await appendHreflangLinks(BASE_CONFIG);

    expect(document.querySelectorAll('link[rel="alternate"]')).to.have.length(0);
  });

  it('handles fetch timeout gracefully', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    stub(window, 'fetch').rejects(new DOMException('The user aborted a request.', 'AbortError'));

    await appendHreflangLinks(BASE_CONFIG);

    expect(document.querySelectorAll('link[rel="alternate"]')).to.have.length(0);
  });

  it('handles sessionStorage quota exceeded gracefully', async () => {
    setUserAgentMeta(window.navigator.userAgent);
    fetchStub = mockFetch(buildMockXml(MOCK_MAP));
    stub(sessionStorage, 'setItem').throws(new DOMException('QuotaExceededError'));

    await appendHreflangLinks(BASE_CONFIG);

    expect(document.querySelectorAll('link[rel="alternate"]')).to.have.length(2);
  });
});
