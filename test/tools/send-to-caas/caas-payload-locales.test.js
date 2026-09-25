import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig as setMiloConfig } from '../../../libs/utils/utils.js';

// Verifies the bulk-publish paths (which run embedded in a live Milo page on
// the SAME site as the pages being published -- bulk-publish and bulk-publish-v2
// are both registered C1_BLOCKS) get the SITE's real configured locale subset
// for CTA-locale-injection, not the full ~200-entry global LOCALES table --
// i.e. parity with libs/blocks/caas/utils.js's own pageConfigHelper().locales-
// driven behavior.
//
// send-utils.js reads getMiloConfig().locales at ITS OWN module-eval time (same
// timing assumption libs/blocks/caas/utils.js's pageConfigHelper().locales read
// always had) -- in real usage this is always after Milo's scripts.js has
// already called setConfig() with the site's locales, since blocks/tools are
// only ever loaded post-bootstrap. To reproduce that ordering per scenario here
// (rather than relying on this file's own static top-level import, which would
// only capture whatever locales happened to be set first), each test sets the
// Milo config THEN dynamically imports a cache-busted send-utils.js so its
// setConfig({ locales }) call captures that scenario's value.
describe('bulk publisher: real site locales gate CTA-locale-injection (not the full global table)', () => {
  const PAGE_HTML = `
    <!DOCTYPE html><html lang="en"><head>
      <meta name="caaslocaleinject" content="true">
    </head><body>
      <main>
        <img src="https://example.com/img/card.jpg" alt="card alt">
        <div class="card-metadata">
          <div><div>title</div><div>Test</div></div>
          <div><div>cta1url</div><div>https://business.adobe.com/products/foo</div></div>
          <div><div>tags</div><div>caas:content-type/article</div></div>
          <div><div>primaryTag</div><div>caas:content-type/article</div></div>
        </div>
      </main>
    </body></html>`;

  // A root ('') locale is required by libs/utils/utils.js's own getLocale/
  // hydrateLocale whenever setConfig({ locales }) is called (mirrors every
  // real site's own locales table, which always has a root entry).
  const SITE_LOCALES_FR = { '': { ietf: 'en-US' }, fr: { ietf: 'fr-FR' } };

  let fetchStub;
  let uid = 0;
  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.callsFake(async () => new Response('not found', { status: 404 }));
  });
  afterEach(() => fetchStub.restore());

  // Bumps the module URL's query string so each scenario gets a FRESH
  // evaluation of send-utils.js (and therefore a fresh setConfig({ locales })
  // capture) instead of the browser's cached module instance from an earlier
  // scenario in this same test file.
  const freshBuildCaasXdmPayload = async () => {
    uid += 1;
    const mod = await import(`../../../tools/send-to-caas/send-utils.js?_verify=${uid}`);
    return mod.buildCaasXdmPayload;
  };

  it('a bacom-like site with only {fr} configured does NOT inject a "de" prefix (in LOCALES globally, not in this site)', async () => {
    // Simulates the real site's own scripts.js setConfig({ locales: {...} }) call,
    // which already happens before this block/tool ever runs on the page.
    setMiloConfig({ locales: SITE_LOCALES_FR });
    const buildCaasXdmPayload = await freshBuildCaasXdmPayload();

    const parser = new DOMParser();
    const dom = parser.parseFromString(PAGE_HTML, 'text/html');
    const result = await buildCaasXdmPayload({
      dom,
      pageUrl: 'https://business.adobe.com/de/products/bar',
      repo: 'bacom',
      bulkPublish: true,
    });
    const ctaUrl = result.caasProps?.cardData?.cta?.primaryCta?.url;
    // 'de' is a real key in the full global LOCALES table but NOT in this
    // site's own locales, so it must not be treated as a locale-prefixed path
    // for THIS site -- pageLocale comes back falsy and injection is skipped.
    expect(ctaUrl).to.equal('https://business.adobe.com/products/foo');
  });

  it('a bacom-like site with {fr} configured DOES inject /fr/ when the current page is under /fr/', async () => {
    setMiloConfig({ locales: SITE_LOCALES_FR });
    const buildCaasXdmPayload = await freshBuildCaasXdmPayload();

    const parser = new DOMParser();
    const dom = parser.parseFromString(PAGE_HTML, 'text/html');
    const result = await buildCaasXdmPayload({
      dom,
      pageUrl: 'https://business.adobe.com/fr/products/bar',
      repo: 'bacom',
      bulkPublish: true,
    });
    const ctaUrl = result.caasProps?.cardData?.cta?.primaryCta?.url;
    expect(ctaUrl).to.equal('https://business.adobe.com/fr/products/foo');
  });

  it('a site with NO locales configured (non-localized site) never injects a prefix (matches pre-refactor no-op)', async () => {
    setMiloConfig({ locales: undefined });
    const buildCaasXdmPayload = await freshBuildCaasXdmPayload();

    const parser = new DOMParser();
    const dom = parser.parseFromString(PAGE_HTML, 'text/html');
    const result = await buildCaasXdmPayload({
      dom,
      pageUrl: 'https://www.example.com/de/products/bar',
      repo: 'example',
      bulkPublish: true,
    });
    const ctaUrl = result.caasProps?.cardData?.cta?.primaryCta?.url;
    expect(ctaUrl).to.equal('https://business.adobe.com/products/foo');
  });
});
