import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import getUuid from '../../../libs/utils/getUuid.js';

const {
  buildCaasXdmPayload,
  getBulkPublishLangAttr,
  getCaasIds,
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

describe('caas-payload-core: forced-.html card identity', () => {
  const BACOM = 'business.adobe.com';
  let fetchStub;

  beforeEach(() => {
    // Same reason as the sibling describe above: never depend on live internet.
    fetchStub = stub(window, 'fetch').rejects(new Error('network disabled in test'));
  });

  afterEach(() => {
    fetchStub.restore();
  });

  const dom = () => buildDom([['CardTitle', 'Test card'], ['CardImage', 'https://example.com/img.jpg']]);

  const build = async ({ path, htmlIdentity, floodgatecolor }) => {
    const { caasMetadata } = await buildCaasXdmPayload({
      dom: dom(),
      pageUrl: getProdUrl({ host: BACOM, path }),
      host: BACOM,
      repo: 'bacom',
      htmlIdentity,
      floodgatecolor,
    });
    return caasMetadata;
  };

  it('hashes the .html form while publishing the extensionless url', async () => {
    const md = await build({ path: '/resources/x', htmlIdentity: true });
    expect(md.contentid).to.equal(await getUuid(`${BACOM}/resources/x.html`));
    // The public url and uci must stay extensionless: only identity is forced.
    expect(md.url).to.equal(`https://${BACOM}/resources/x`);
    expect(md.uci).to.equal(`${BACOM}/resources/x`);
  });

  it('produces the same ids whether or not the source path carried .html', async () => {
    const withExt = await build({ path: '/resources/x.html', htmlIdentity: true });
    const withoutExt = await build({ path: '/resources/x', htmlIdentity: true });
    expect(withoutExt.contentid).to.equal(withExt.contentid);
    expect(withoutExt.entityid).to.equal(withExt.entityid);
  });

  it('keeps the legacy ids when the flag is off', async () => {
    const md = await build({ path: '/resources/x', htmlIdentity: false });
    expect(md.contentid).to.equal(await getUuid(`${BACOM}/resources/x`));
  });

  it('applies to every path, with no section carved out', async () => {
    // Sections are scoped out by their own repo's config not setting the flag,
    // never by path here -- otherwise the flag silently does nothing for a
    // section that migrates later and orphans all of its cards.
    const cases = ['/blog/post', '/fr/blog/post', '/blog', '/products/y'];
    // Sequential, not Promise.all: buildCaasXdmPayload is NOT reentrant (it
    // threads module-global config/tag state), as documented at its definition.
    // The concurrent form passes here only incidentally, because contentid is
    // computed from the per-call prodUrl closure and so happens to survive the
    // interleaving -- every other resolved prop would not. This is also the
    // place a future reader looks for the house style on calling it.
    for (const path of cases) {
      // eslint-disable-next-line no-await-in-loop
      const md = await build({ path, htmlIdentity: true });
      // eslint-disable-next-line no-await-in-loop
      expect(md.contentid, path).to.equal(await getUuid(`${BACOM}${path}.html`));
    }
  });

  it('accepts the string flag form config sheets store', async () => {
    const enabled = await build({ path: '/resources/x', htmlIdentity: 'true' });
    expect(enabled.contentid).to.equal(await getUuid(`${BACOM}/resources/x.html`));
    // A sheet cell reading 'false' must not enable the policy.
    const disabled = await build({ path: '/resources/x', htmlIdentity: 'false' });
    expect(disabled.contentid).to.equal(await getUuid(`${BACOM}/resources/x`));
  });

  it('leaves other production hostnames unchanged', async () => {
    const host = 'www.adobe.com';
    const { caasMetadata } = await buildCaasXdmPayload({
      dom: dom(),
      pageUrl: getProdUrl({ host, path: '/resources/x' }),
      host,
      repo: 'milo',
      htmlIdentity: true,
    });
    expect(caasMetadata.contentid).to.equal(await getUuid(`${host}/resources/x`));
  });

  it('applies the forced .html before the floodgate salt', async () => {
    const md = await build({ path: '/resources/x', htmlIdentity: true, floodgatecolor: 'pink' });
    expect(md.entityid).to.equal(await getUuid(`${BACOM}/resources/x.htmlpink`));
    expect(md.entityid).to.not.equal(md.contentid);
  });

  it('getCaasIds reproduces the published identity so removal matches', async () => {
    const published = await build({ path: '/resources/x', htmlIdentity: true });
    const ids = await getCaasIds(`https://${BACOM}/resources/x`, 'default', true);
    expect(ids.contentId).to.equal(published.contentid);
    expect(ids.entityId).to.equal(published.entityid);
  });

  it('getCaasIds leaves the legacy ids alone when the flag is off', async () => {
    const ids = await getCaasIds(`https://${BACOM}/resources/x`, 'default');
    expect(ids.contentId).to.equal(await getUuid(`${BACOM}/resources/x`));
  });

  it('warns when removal omits htmlIdentity for an in-scope url', async () => {
    // Removal is matched by id, so an omitted flag does not throw -- it just
    // computes ids that match no card and leaves the real one live in CaaS
    // forever. A log is the only way that surfaces.
    const log = stub();
    window.lana = { log };
    try {
      await getCaasIds(`https://${BACOM}/resources/x`, 'default');
      expect(log.calledOnce).to.be.true;
      expect(log.firstCall.args[0]).to.contain('without htmlIdentity');
    } finally {
      delete window.lana;
    }
  });

  it('does not warn when htmlIdentity is passed, or when the url is out of scope', async () => {
    const log = stub();
    window.lana = { log };
    try {
      await getCaasIds(`https://${BACOM}/resources/x`, 'default', true);
      await getCaasIds(`https://${BACOM}/resources/x`, 'default', false);
      // Another host is not covered by the policy, so the flag cannot change
      // the answer and the warning would be pure noise.
      await getCaasIds('https://www.adobe.com/resources/x', 'default');
      expect(log.called).to.be.false;
    } finally {
      delete window.lana;
    }
  });
});
