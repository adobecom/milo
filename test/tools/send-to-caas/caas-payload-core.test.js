import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import getUuid from '../../../libs/utils/getUuid.js';

const {
  buildCaasXdmPayload,
  getBulkPublishLangAttr,
  getProdUrl,
  initBulkPublisherLingoMapping,
} = await import('../../../tools/send-to-caas/caas-payload-core.js');

const buildDom = (metadataRows) => {
  const rows = metadataRows
    .map(([key, val]) => `<div><div>${key}</div><div>${val}</div></div>`)
    .join('');
  const html = `<!DOCTYPE html><html><head></head><body><div class="card-metadata">${rows}</div></body></html>`;
  return new DOMParser().parseFromString(html, 'text/html');
};

describe('caas-payload-core: getProdUrl', () => {
  it('returns a scheme-qualified URL with a normalized leading slash', () => {
    expect(getProdUrl({ host: 'main--site--org.aem.live', path: '/foo' }))
      .to.equal('https://main--site--org.aem.live/foo');
    expect(getProdUrl({ host: 'main--site--org.aem.live', path: 'foo' }))
      .to.equal('https://main--site--org.aem.live/foo');
  });

  it('strips a scheme and trailing slash already present on host', () => {
    expect(getProdUrl({ host: 'https://main--site--org.aem.live/', path: 'foo' }))
      .to.equal('https://main--site--org.aem.live/foo');
  });

  it('appends .html when htmlExt is truthy, including the string form', () => {
    expect(getProdUrl({ host: 'x.com', path: '/foo', htmlExt: true })).to.equal('https://x.com/foo.html');
    expect(getProdUrl({ host: 'x.com', path: '/foo', htmlExt: 'true' })).to.equal('https://x.com/foo.html');
  });

  it('strips a trailing .html when htmlExt is false', () => {
    expect(getProdUrl({ host: 'x.com', path: '/foo.html' })).to.equal('https://x.com/foo');
  });

  it('returns an empty string when host or path is missing', () => {
    expect(getProdUrl({ path: '/foo' })).to.equal('');
    expect(getProdUrl({ host: 'x.com' })).to.equal('');
  });
});

describe('caas-payload-core: buildCaasXdmPayload card identity', () => {
  let fetchStub;

  beforeEach(() => {
    // Stub the tag-taxonomy network fetch so these tests never depend on
    // live internet access; loadCaasTags() falls back to undefined tags,
    // which is exactly what exercises the primarytag-miss crash fix below.
    fetchStub = stub(window, 'fetch').rejects(new Error('network disabled in test'));
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('hashes contentId/entityId from a scheme-less prodUrl, matching the legacy bulk tool\'s convention', async () => {
    const host = 'main--bacom--adobecom.aem.live';
    const path = '/products/x';
    const pageUrl = getProdUrl({ host, path });
    const dom = buildDom([['CardTitle', 'Test card'], ['CardImage', 'https://example.com/img.jpg']]);

    const { caasMetadata } = await buildCaasXdmPayload({ dom, pageUrl, host, repo: 'bacom' });

    // The untouched legacy bulk-publish-to-caas.js tool builds prodUrl as
    // `${host}${pathname}` with no scheme, then hashes that directly.
    const legacyProdUrl = `${host}${path}`;
    expect(caasMetadata.contentid).to.equal(await getUuid(legacyProdUrl));
    expect(caasMetadata.entityid).to.equal(await getUuid(legacyProdUrl));
  });

  it('still resolves the graybox experience ID from the (schemed) pageUrl', async () => {
    const host = 'my-exp.graybox.adobe.com';
    const pageUrl = getProdUrl({ host, path: '/foo' });
    const dom = buildDom([['CardTitle', 'Test card'], ['CardImage', 'https://example.com/img.jpg']]);

    const { caasProps } = await buildCaasXdmPayload({ dom, pageUrl, host, repo: 'bacom' });

    expect(caasProps.gbExperienceID).to.equal('my-exp');
  });

  it('resolves a root-relative bulk-publish image path via the schemed pageUrl origin', async () => {
    const host = 'main--bacom--adobecom.aem.live';
    const pageUrl = getProdUrl({ host, path: '/products/x' });
    const dom = buildDom([
      ['CardTitle', 'Test card'],
      ['CardImage', '<img src="/media_abc.jpg">'],
    ]);

    const { caasMetadata, errors } = await buildCaasXdmPayload({ dom, pageUrl, host, repo: 'bacom' });

    expect(errors).to.deep.equal([]);
    expect(caasMetadata.cardimage).to.equal(`https://${host}/media_abc.jpg`);
  });

  it('does not crash when primarytag has no match in the taxonomy', async () => {
    const host = 'main--bacom--adobecom.aem.live';
    const pageUrl = getProdUrl({ host, path: '/products/x' });
    const dom = buildDom([
      ['CardTitle', 'Test card'],
      ['CardImage', 'https://example.com/img.jpg'],
      ['PrimaryTag', 'totally-made-up-tag-xyz'],
    ]);

    const { caasMetadata, errors } = await buildCaasXdmPayload({ dom, pageUrl, host, repo: 'bacom' });

    expect(errors).to.deep.equal([]);
    expect(caasMetadata.primarytag).to.deep.equal({});
  });
});

describe('caas-payload-core: getBulkPublishLangAttr with a BACOM /ara base-site (autodetect lingo)', () => {
  // Mirrors the real-world bulk-publish scenario: BACOM onboards '/ara' as a
  // base site in lingo-site-mapping.json, and the bulk publisher resolves a
  // page at /ara/... with auto-detect lingo enabled. The resolved language
  // must be the 'ar' CaaS language tag id — NOT the raw 3-letter 'ara' path
  // segment, which has no corresponding caas:language tag in the taxonomy.
  // This exercises caas-payload-core.js's own copy of the lang-first helpers
  // (kept in sync with libs/blocks/caas/utils.js, which has its own test
  // covering the same scenario in test/blocks/caas/utils.test.js).
  const MOCK_MAPPING = {
    'site-query-index-map': { data: [{ uniqueSiteId: 'bacom-site', caasOrigin: 'bacom' }] },
    'site-locales': {
      data: [
        { uniqueSiteId: 'bacom-site', baseSite: '/', regionalSites: '/ca, /au' },
        { uniqueSiteId: 'bacom-site', baseSite: '/ara', regionalSites: '' },
      ],
    },
  };
  let fetchStub;

  beforeEach(() => {
    fetchStub = stub(window, 'fetch').resolves({ ok: true, json: () => Promise.resolve(MOCK_MAPPING) });
    initBulkPublisherLingoMapping();
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('resolves to lang: ar, country: xx (not the raw "ara" path segment)', async () => {
    const result = await getBulkPublishLangAttr({
      prodUrl: 'https://main--bacom--adobecom.aem.live/ara/products/brand-concierge.html',
      repo: 'bacom',
      autoDetectLingo: true,
    });

    expect(result).to.equal('ar-xx');
  });
});
