import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: '../../personalization/mocks/postPersonalization.html' });
const {
  escapeHtml,
  escapeAttr,
  parsePageAndUrl,
  getMepPopup,
  saveToMmm,
  API_URLS,
} = await import('../../../../libs/features/mep/mep-next/mep-next.js');
const {
  injectMasBadges,
  removeMasBadges,
  updateMasNoContentMessage,
  getResolvedPageMarket,
  getCardMarket,
  deriveChildCardStudioUrl,
  toFragmentEditorUrl,
  watchForMasContent,
  MAS_RESTAMP_DEBOUNCE_MS,
} = await import('../../../../libs/features/mep/mep-next/mep-mas.js');
const { setConfig, createTag, getConfig } = await import('../../../../libs/utils/utils.js');
const { mepMasStudioUrls } = await import('../../../../libs/blocks/merch/mas-mep-utils.js');
const { mepMasSubCollections } = await import('../../../../libs/features/mep/mep-next/mep-mas-subcollection.js');

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

describe('escapeHtml', () => {
  it('returns null and undefined unchanged', () => {
    expect(escapeHtml(null)).to.equal(null);
    expect(escapeHtml(undefined)).to.equal(undefined);
  });

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).to.equal('');
  });

  it('leaves plain country codes unchanged', () => {
    expect(escapeHtml('de')).to.equal('de');
    expect(escapeHtml('lu')).to.equal('lu');
  });

  it('encodes HTML metacharacters for safe insertion into HTML', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const out = escapeHtml(malicious);
    expect(out).to.include('&lt;');
    expect(out).to.include('&gt;');
    expect(out).to.not.include('<img');
  });

  it('stringifies non-string input before escaping', () => {
    expect(escapeHtml(42)).to.equal('42');
  });
});

describe('escapeAttr', () => {
  it('returns null, undefined and empty string unchanged', () => {
    expect(escapeAttr(null)).to.equal(null);
    expect(escapeAttr(undefined)).to.equal(undefined);
    expect(escapeAttr('')).to.equal('');
  });

  it('encodes quotes so a value cannot close a quoted attribute', () => {
    const out = escapeAttr('" onmouseover="alert(1)');
    expect(out).to.not.include('"');
    expect(out).to.include('&quot;');
  });

  it('encodes & < > and single quotes', () => {
    expect(escapeAttr('a&b')).to.include('&amp;');
    expect(escapeAttr('<x>')).to.equal('&lt;x&gt;');
    expect(escapeAttr("o'clock")).to.include('&#39;');
  });

  it('stringifies non-string input before escaping', () => {
    expect(escapeAttr(42)).to.equal('42');
  });
});

describe('preview feature', () => {
  beforeEach(() => {
    setConfig(config);
  });
  afterEach(() => {
    delete window.lenis;
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
});

describe('M@S highlight badges', () => {
  // Each surface gets its own wrapper element + WeakMap entry. Reset between tests.
  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge, a.mep-mas-sub-collection-badge, .mep-mas-no-content, .mep-mas-card-actions').forEach((el) => el.remove());
  });

  function seedSurface(surface, href) {
    const tag = {
      collection: 'div',
      card: 'div',
      inline: 'span',
      ost: 'span',
    }[surface] || 'div';
    const el = document.createElement(tag);
    el.dataset.masBlock = surface;
    document.body.append(el);
    mepMasStudioUrls.set(el, href);
    return el;
  }

  it('injectMasBadges adds a sibling <a> badge for the collection surface (only)', () => {
    // Cards render a CSS outline only; inline (mas-field), ost, and offer render
    // via CSS ::before pseudo on the host. Only collection uses a sibling <a> badge.
    const collection = seedSurface(
      'collection',
      'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1',
    );
    injectMasBadges();
    const prev = collection.previousElementSibling;
    expect(prev, 'sibling badge missing before collection surface').to.exist;
    expect(prev.tagName).to.equal('A');
    expect(prev.classList.contains('mep-mas-edit-badge')).to.be.true;
    expect(prev.classList.contains('mep-mas-edit-badge-collection')).to.be.true;
    expect(prev.getAttribute('href')).to.equal(
      'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1',
    );
    expect(prev.getAttribute('target')).to.equal('_blank');
  });

  it('injectMasBadges does NOT inject a sibling <a> for card / inline / ost surfaces', () => {
    const cardHost = seedSurface('card', 'https://mas.adobe.com/studio.html#content-type=merch-card&query=card-1');
    const inlineHost = seedSurface('inline', 'https://mas.adobe.com/studio.html#content-type=merch-card&query=card-1&field=cardTitle');
    const ostHost = seedSurface('ost', '/tools/ost?osi=03&type=price&term=false');

    injectMasBadges();

    // No sibling <a> badge for any of these — card renders a CSS outline,
    // inline/ost render via ::before pseudo.
    expect(cardHost.previousElementSibling?.classList?.contains('mep-mas-edit-badge')).to.not.equal(true);
    expect(inlineHost.previousElementSibling?.classList?.contains('mep-mas-edit-badge')).to.not.equal(true);
    expect(ostHost.previousElementSibling?.classList?.contains('mep-mas-edit-badge')).to.not.equal(true);
    // WeakMap entries remain so handlers can open the captured URL.
    expect(mepMasStudioUrls.get(inlineHost)).to.equal('https://mas.adobe.com/studio.html#content-type=merch-card&query=card-1&field=cardTitle');
    expect(mepMasStudioUrls.get(ostHost)).to.equal('/tools/ost?osi=03&type=price&term=false');
  });

  it('injectMasBadges does NOT duplicate the parent collection badge when a sub-collection badge sits between it and the container', () => {
    // Regression: when a sub-collection badge is wedged between the parent
    // badge and the container, the idempotence check must walk past it or
    // the parent badge gets rebuilt every pass and orphans the sub badge.
    const collection = seedSurface(
      'collection',
      'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1',
    );
    injectMasBadges();
    expect(document.querySelectorAll('a.mep-mas-edit-badge-collection').length).to.equal(1);
    // Re-insert a fake sub badge each pass — the real injector would strip
    // it because this seeded surface has no <merch-card-collection> child.
    const wedgeSubBadge = () => {
      if (!collection.previousElementSibling?.classList?.contains('mep-mas-sub-collection-badge')) {
        const sub = document.createElement('a');
        sub.classList.add('mep-mas-sub-collection-badge');
        collection.insertAdjacentElement('beforebegin', sub);
      }
    };
    wedgeSubBadge();
    injectMasBadges();
    wedgeSubBadge();
    injectMasBadges();
    wedgeSubBadge();
    injectMasBadges();
    // Parent badge must still be exactly one — proves the walk-back hop
    // in the idempotence check correctly skips past the wedge.
    expect(document.querySelectorAll('a.mep-mas-edit-badge-collection').length).to.equal(1);
  });

  it('injectMasBadges does not add a stack or sibling badge for a STANDALONE card (per-element OST instead)', () => {
    // Standalone = card NOT inside a [data-mas-block="collection"]. Even with a
    // captured Studio URL it gets no stack — the gating is on collection membership.
    const cardHost = document.createElement('div');
    cardHost.dataset.masBlock = 'card';
    document.body.append(cardHost);
    mepMasStudioUrls.set(cardHost, 'https://mas.adobe.com/studio.html#content-type=merch-card&query=solo');
    injectMasBadges();
    expect(cardHost.previousElementSibling?.classList?.contains('mep-mas-edit-badge')).to.not.equal(true);
    expect(document.querySelectorAll('.mep-mas-card-actions').length, 'standalone card gets no stack').to.equal(0);
    cardHost.remove();
  });

  it('removeMasBadges clears sibling collection badges AND collection card stacks', () => {
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&query=col-1');
    const child = document.createElement('merch-card');
    const aem = document.createElement('aem-fragment');
    aem.setAttribute('fragment', 'child-x');
    child.append(aem);
    container.append(child);

    injectMasBadges();
    expect(document.querySelectorAll('a.mep-mas-edit-badge').length).to.equal(1);
    expect(document.querySelectorAll('.mep-mas-card-actions').length).to.equal(1);

    removeMasBadges();
    expect(document.querySelectorAll('a.mep-mas-edit-badge').length).to.equal(0);
    expect(document.querySelectorAll('.mep-mas-card-actions').length).to.equal(0);
    container.remove();
  });

  it('updateMasNoContentMessage toggles every .mep-mas-no-content placeholder', () => {
    const a = createTag('div', { class: 'mep-mas-no-content', hidden: '' }, 'no content');
    const b = createTag('div', { class: 'mep-mas-no-content', hidden: '' }, 'no content');
    document.body.append(a, b);

    updateMasNoContentMessage(true);
    expect(a.hidden).to.be.false;
    expect(b.hidden).to.be.false;

    updateMasNoContentMessage(false);
    expect(a.hidden).to.be.true;
    expect(b.hidden).to.be.true;
  });

  it('injectMasBadges shows the no-content message when zero surfaces are present', () => {
    const placeholder = createTag('div', { class: 'mep-mas-no-content', hidden: '' }, 'no content');
    document.body.append(placeholder);
    injectMasBadges();
    expect(placeholder.hidden).to.be.false;
  });

  it('injectMasBadges hides the no-content message when at least one badge renders', () => {
    const placeholder = createTag('div', { class: 'mep-mas-no-content' }, 'no content');
    document.body.append(placeholder);
    seedSurface('card', 'https://mas.adobe.com/studio.html#content-type=merch-card&query=card-1');
    injectMasBadges();
    expect(placeholder.hidden).to.be.true;
  });

  it('injectMasBadges appends the page-level market (Case A) to the collection sibling badge as a chip', () => {
    // Test config has locale.ietf = 'en-US' so getResolvedPageMarket() returns 'us'.
    // Cards use a CSS outline (no sibling <a>); the market chip is a
    // collection-only affordance.
    const collection = seedSurface(
      'collection',
      'https://mas.adobe.com/studio.html#content-type=merch-card-collection&query=col-1',
    );
    injectMasBadges();
    const badge = collection.previousElementSibling;
    expect(badge?.textContent).to.match(/ \u00b7 US$/);
    const chip = badge.querySelector('.mep-mas-edit-badge-market');
    expect(chip, 'market chip should be a child element').to.exist;
    expect(chip.textContent).to.equal('US');
    expect(chip.classList.contains('mep-mas-edit-badge-market-mismatch')).to.be.false;
  });
});

describe('M@S badge market resolution', () => {
  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge').forEach((el) => el.remove());
  });

  describe('getResolvedPageMarket (Case A — page-level)', () => {
    // Priority chain: <mas-commerce-service country> > getMiloLocaleSettings >
    // ?akamaiLocale=. Default test locale en-US makes getMiloLocaleSettings
    // return us, so akamaiLocale is shadowed by design.
    let originalSearch;
    beforeEach(() => { originalSearch = window.location.search; });
    afterEach(() => {
      // Reset URL to baseline so akamaiLocale doesn't leak across tests.
      window.history.replaceState({}, '', `${window.location.pathname}${originalSearch}${window.location.hash}`);
      document.head.querySelectorAll('mas-commerce-service').forEach((el) => el.remove());
    });

    it('returns the locale ietf country when no higher-priority signal is present', () => {
      // Default test config: locale.ietf = 'en-US'
      expect(getResolvedPageMarket()).to.equal('us');
    });

    it('prefers <mas-commerce-service country> over the locale (authoritative WCS country)', () => {
      const svc = document.createElement('mas-commerce-service');
      svc.setAttribute('country', 'CA');
      document.head.append(svc);
      expect(getResolvedPageMarket()).to.equal('ca');
    });

    it('falls back to ?akamaiLocale= only when neither service nor locale resolves a country', () => {
      window.history.replaceState({}, '', `${window.location.pathname}?akamaiLocale=fr${window.location.hash}`);
      // Default locale 'us' shadows ?akamaiLocale=fr, by design.
      expect(getResolvedPageMarket()).to.equal('us');
    });

    it('normalizes legacy country shapes via normCountryCode (uk -> gb) on the service signal', () => {
      const svc = document.createElement('mas-commerce-service');
      svc.setAttribute('country', 'uk');
      document.head.append(svc);
      expect(getResolvedPageMarket()).to.equal('gb');
    });

    it('returns the akamaiLocale param when locale maps to an empty country (root locale prefix)', () => {
      // locale.prefix='/' → getMiloLocaleSettings returns country:'' (falsy)
      // so the function falls through to the akamaiLocale branch.
      const origLocale = getConfig().locale;
      getConfig().locale = { ...origLocale, prefix: '/' };
      window.history.replaceState({}, '', `${window.location.pathname}?akamaiLocale=fr${window.location.hash}`);
      try {
        expect(getResolvedPageMarket()).to.equal('fr');
      } finally {
        getConfig().locale = origLocale;
      }
    });

    it('returns null when no market signal exists at all (empty locale country + no akamaiLocale)', () => {
      const origLocale = getConfig().locale;
      getConfig().locale = { ...origLocale, prefix: '/' };
      try {
        expect(getResolvedPageMarket()).to.be.null;
      } finally {
        getConfig().locale = origLocale;
      }
    });
  });

  describe('getCardMarket (Case B — per-card derivation from checkout link)', () => {
    it('returns the country= param from a descendant checkout link when present', () => {
      const wrap = createTag('div', { 'data-mas-block': 'ost' });
      const link = createTag('a', {
        is: 'checkout-link',
        href: 'https://commerce.adobe.com/store/?country=DE&lang=de&items=03',
      }, 'Buy');
      wrap.append(link);
      document.body.append(wrap);
      expect(getCardMarket(wrap, 'us')).to.equal('de');
      wrap.remove();
    });

    it('returns the country= param when the element itself is the link', () => {
      const link = createTag('a', { href: 'https://commerce.adobe.com/store/?country=jp&items=03' }, 'Buy');
      document.body.append(link);
      expect(getCardMarket(link, 'us')).to.equal('jp');
      link.remove();
    });

    it('falls back to the page market when no descendant has country=', () => {
      const wrap = createTag('div', { 'data-mas-block': 'card' });
      wrap.append(createTag('a', { href: 'https://example.com/no-country' }, 'Link'));
      document.body.append(wrap);
      expect(getCardMarket(wrap, 'fr')).to.equal('fr');
      wrap.remove();
    });

    it('returns null page-market unchanged when nothing resolves', () => {
      const wrap = createTag('div', { 'data-mas-block': 'inline' });
      document.body.append(wrap);
      expect(getCardMarket(wrap, null)).to.equal(null);
      wrap.remove();
    });
  });

  describe('injectMasBadges market stamping for card surfaces (integration)', () => {
    it('upgrades a card surface from page-market to per-card-market and flags the mismatch on the host when they differ', () => {
      // Page market is "us" (default test locale) but this card's checkout link
      // resolves to GB — the host is stamped data-mas-market=GB and flagged
      // data-mas-market-mismatch so per-element badges can render the warning.
      const wrap = document.createElement('div');
      wrap.dataset.masBlock = 'card';
      wrap.append(createTag('a', {
        is: 'checkout-link',
        href: 'https://commerce.adobe.com/store/?country=GB&items=03',
      }, 'Buy'));
      document.body.append(wrap);
      mepMasStudioUrls.set(wrap, 'https://mas.adobe.com/studio.html#content-type=merch-card&query=card-x');

      injectMasBadges();

      expect(wrap.dataset.masMarket).to.equal('GB');
      // GB on a US page → mismatch flagged on the host; per-element offer badges
      // read this via CSS (data-mas-market-mismatch), no card-level stack.
      expect(wrap.dataset.masMarketMismatch).to.equal('true');
      wrap.remove();
    });

    it('does not flag mismatch on the host when the per-card market equals the page market', () => {
      const wrap = document.createElement('div');
      wrap.dataset.masBlock = 'card';
      wrap.append(createTag('a', {
        is: 'checkout-link',
        href: 'https://commerce.adobe.com/store/?country=US&items=03',
      }, 'Buy'));
      document.body.append(wrap);
      mepMasStudioUrls.set(wrap, 'https://mas.adobe.com/studio.html#content-type=merch-card&query=card-x');

      injectMasBadges();

      expect(wrap.dataset.masMarket).to.equal('US');
      expect(wrap.dataset.masMarketMismatch).to.be.undefined;
      wrap.remove();
    });
  });

  describe('injectMasBadges market stamping for pseudo-badge surfaces (inline + ost)', () => {
    // The inline (mas-field) and ost surfaces render their badges via CSS
    // ::before pseudo using attr(data-mas-market). preview.js stamps the
    // data attribute on the host so the chip text can render purely in CSS.
    it('stamps data-mas-market on the inline host using its descendant checkout link country', () => {
      const host = document.createElement('span');
      host.dataset.masBlock = 'inline';
      host.append(createTag('a', {
        is: 'checkout-link',
        href: 'https://commerce.adobe.com/store/?country=DE&items=03',
      }, 'Buy'));
      document.body.append(host);
      mepMasStudioUrls.set(host, 'https://mas.adobe.com/studio.html#content-type=merch-card&query=field-1');

      injectMasBadges();

      expect(host.dataset.masMarket).to.equal('DE');
      // Page market is "us" — DE on a US page is a mismatch, expect the flip flag.
      expect(host.dataset.masMarketMismatch).to.equal('true');
      host.remove();
    });

    it('stamps data-mas-market on the ost host and clears the mismatch flag when markets agree', () => {
      const host = document.createElement('span');
      host.dataset.masBlock = 'ost';
      host.append(createTag('a', {
        is: 'checkout-link',
        href: 'https://commerce.adobe.com/store/?country=US&items=03',
      }, 'Buy'));
      document.body.append(host);
      mepMasStudioUrls.set(host, '/tools/ost?osi=03&type=price');

      injectMasBadges();

      expect(host.dataset.masMarket).to.equal('US');
      // Page market is "us" — match, mismatch flag should be absent.
      expect(host.dataset.masMarketMismatch).to.be.undefined;
      host.remove();
    });

    it('annotates an inline-price that already has data-mas-block="ost" stamped by M@S', () => {
      // M@S can pre-stamp data-mas-block="ost" on inline-price elements before
      // MEP runs. The old guard (if el.dataset.masBlock) skipped these, leaving
      // mepMasStudioUrls empty and the click handler unable to open OST.
      const host = createTag('span', {
        is: 'inline-price',
        'data-wcs-osi': 'pre-stamped-osi',
        'data-mas-block': 'ost',
      });
      document.body.append(host);

      injectMasBadges();

      expect(mepMasStudioUrls.has(host), 'URL should be registered for pre-stamped ost element').to.be.true;
      expect(mepMasStudioUrls.get(host)).to.include('/tools/ost?osi=pre-stamped-osi');
      expect(host.dataset.masBlock).to.equal('ost');
      host.remove();
    });

    it('stamps data-mas-market on offer hosts using the host\'s own data-ims-country', () => {
      // Offer hosts ARE the checkout-link / inline-price element, so the
      // ims-country attribute lives on the host itself (set by M@S
      // checkout-mixin after WCS resolves) — verify getCardMarket reads it.
      const host = createTag('a', {
        is: 'checkout-link',
        'data-wcs-osi': 'fake-osi',
        'data-ims-country': 'JP',
        href: 'https://commerce.adobe.com/store/?items=03',
      }, 'Buy');
      document.body.append(host);

      injectMasBadges();

      expect(host.dataset.masBlock).to.equal('offer');
      expect(host.dataset.masMarket).to.equal('JP');
      // Page market is "us" — JP is a mismatch, expect the flip flag.
      expect(host.dataset.masMarketMismatch).to.equal('true');
      host.remove();
    });
  });
});

describe('annotateOffers OSI dedupe (same-parent duplicate offers)', () => {
  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge').forEach((el) => el.remove());
  });

  it('stamps only the first of two same-OSI offer spans under one parent', () => {
    // price + legal inline-price share an OSI in one <p slot="heading-m-price">.
    const parent = createTag('p', { slot: 'heading-m-price' });
    const price = createTag('span', { is: 'inline-price', 'data-template': 'price', 'data-wcs-osi': 'DUP-OSI' });
    const legal = createTag('span', { is: 'inline-price', 'data-template': 'legal', 'data-wcs-osi': 'DUP-OSI' });
    parent.append(price, legal);
    document.body.append(parent);

    injectMasBadges();

    expect(price.dataset.masBlock, 'first same-OSI offer is stamped').to.equal('offer');
    expect(legal.dataset.masBlock, 'second same-OSI offer under the same parent is skipped').to.be.undefined;
    expect(mepMasStudioUrls.has(price)).to.be.true;
    expect(mepMasStudioUrls.has(legal)).to.be.false;

    // Idempotent — a second pass must keep the duplicate suppressed.
    injectMasBadges();
    expect(legal.dataset.masBlock).to.be.undefined;
    parent.remove();
  });

  it('stamps same-OSI offers that live under different parents (price vs footer CTA)', () => {
    const priceParent = createTag('p', { slot: 'heading-m-price' });
    const price = createTag('span', { is: 'inline-price', 'data-wcs-osi': 'SHARED-OSI' });
    priceParent.append(price);
    const footer = createTag('div', { slot: 'footer' });
    const cta = createTag('a', { is: 'checkout-link', 'data-wcs-osi': 'SHARED-OSI', href: 'https://commerce.adobe.com/store/?items=03' }, 'Buy');
    footer.append(cta);
    document.body.append(priceParent, footer);

    injectMasBadges();

    expect(price.dataset.masBlock).to.equal('offer');
    expect(cta.dataset.masBlock).to.equal('offer');
    priceParent.remove();
    footer.remove();
  });
});

describe('M@S per-child-card badges (Tier 3b — collection children)', () => {
  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge, .mep-mas-card-actions, merch-card, merch-card-collection').forEach((el) => el.remove());
  });

  describe('deriveChildCardStudioUrl', () => {
    it('substitutes the query= identifier and switches content-type to merch-card', () => {
      const parent = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-abc';
      const out = deriveChildCardStudioUrl(parent, 'card-xyz');
      expect(out).to.include('content-type=merch-card');
      expect(out).to.not.include('content-type=merch-card-collection');
      expect(out).to.include('path=acom');
      expect(out).to.include('query=card-xyz');
      expect(out).to.not.include('query=col-abc');
    });

    it('substitutes the fragment= identifier when the parent uses fragment= instead of query=', () => {
      const parent = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=cc&fragment=col-1';
      const out = deriveChildCardStudioUrl(parent, 'child-1');
      expect(out).to.include('fragment=child-1');
      expect(out).to.not.include('query=');
    });

    it('appends query= when the parent has neither query= nor fragment=', () => {
      const parent = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom';
      const out = deriveChildCardStudioUrl(parent, 'child-1');
      expect(out).to.include('query=child-1');
    });

    it('returns null when parentUrl is missing', () => {
      expect(deriveChildCardStudioUrl(null, 'child-1')).to.equal(null);
      expect(deriveChildCardStudioUrl('', 'child-1')).to.equal(null);
    });

    it('returns null when childFragmentId is missing', () => {
      expect(deriveChildCardStudioUrl('https://mas.adobe.com/studio.html#x=1', null)).to.equal(null);
      expect(deriveChildCardStudioUrl('https://mas.adobe.com/studio.html#x=1', '')).to.equal(null);
    });
  });

  describe('toFragmentEditorUrl', () => {
    it('renames query=<id> to fragmentId=<id> and switches page to fragment-editor', () => {
      const input = 'https://mas.adobe.com/studio.html#content-type=merch-card&page=content&path=acom&query=2c5cd672';
      const out = toFragmentEditorUrl(input);
      expect(out).to.include('fragmentId=2c5cd672');
      expect(out).to.include('page=fragment-editor');
      expect(out).to.not.include('query=');
      expect(out).to.not.include('page=content');
      expect(out).to.include('content-type=merch-card');
      expect(out).to.include('path=acom');
    });

    it('renames fragment=<id> to fragmentId=<id> too', () => {
      const input = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=abc-123';
      const out = toFragmentEditorUrl(input);
      expect(out).to.include('fragmentId=abc-123');
      expect(out).to.not.include('fragment=abc-123');
    });

    it('adds page=fragment-editor when the input had no page param at all', () => {
      const input = 'https://mas.adobe.com/studio.html#content-type=merch-card&query=xyz';
      expect(toFragmentEditorUrl(input)).to.include('page=fragment-editor');
    });

    it('is idempotent — already-fragment-editor URLs pass through with the same shape', () => {
      const input = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragmentId=xyz&page=fragment-editor&path=acom';
      const out = toFragmentEditorUrl(input);
      expect(out).to.include('fragmentId=xyz');
      expect(out).to.include('page=fragment-editor');
    });

    it('leaves non-card URLs untouched (e.g., merch-card-collection stays on its current view)', () => {
      const input = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&page=content&query=col-1';
      expect(toFragmentEditorUrl(input)).to.equal(input);
    });

    it('returns the input unchanged when no id param is present', () => {
      const input = 'https://mas.adobe.com/studio.html#content-type=merch-card&page=content';
      expect(toFragmentEditorUrl(input)).to.equal(input);
    });

    it('returns the input unchanged when given falsy / unparseable input', () => {
      expect(toFragmentEditorUrl(null)).to.equal(null);
      expect(toFragmentEditorUrl('')).to.equal('');
      expect(toFragmentEditorUrl(undefined)).to.equal(undefined);
    });
  });

  describe('annotateCollectionChildren (via injectMasBadges integration)', () => {
    function buildCollection(parentUrl, childFragmentIds) {
      // Wrap mimics the structure produced by createCollection: a <div> with
      // data-mas-block="collection" containing a <merch-card-collection>, which
      // in turn contains <merch-card> children with <aem-fragment fragment="…">.
      const container = document.createElement('div');
      container.dataset.masBlock = 'collection';
      mepMasStudioUrls.set(container, parentUrl);
      const collEl = document.createElement('merch-card-collection');
      childFragmentIds.forEach((id) => {
        const card = document.createElement('merch-card');
        const aemFragment = document.createElement('aem-fragment');
        aemFragment.setAttribute('fragment', id);
        card.append(aemFragment);
        collEl.append(card);
      });
      container.append(collEl);
      document.body.append(container);
      return container;
    }

    it('stamps each child <merch-card> with data-mas-block="card" and a derived URL', () => {
      const parentUrl = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1';
      const container = buildCollection(parentUrl, ['child-a', 'child-b', 'child-c']);

      injectMasBadges();

      const children = container.querySelectorAll('merch-card');
      expect(children.length).to.equal(3);
      children.forEach((card, i) => {
        expect(card.dataset.masBlock, `child #${i} should be marked as a card`).to.equal('card');
        const captured = mepMasStudioUrls.get(card);
        expect(captured).to.include('content-type=merch-card');
        expect(captured).to.not.include('content-type=merch-card-collection');
      });
      // Each child should have its own fragment id substituted into the URL.
      expect(mepMasStudioUrls.get(children[0])).to.include('query=child-a');
      expect(mepMasStudioUrls.get(children[1])).to.include('query=child-b');
      expect(mepMasStudioUrls.get(children[2])).to.include('query=child-c');
    });

    it('injects a body-level action stack for each collection child card', () => {
      // Collection cards get the consolidated stack (body-level overlay). These
      // test cards carry no [data-wcs-osi], so the stack is Edit + Copy only.
      const parentUrl = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1';
      buildCollection(parentUrl, ['child-a', 'child-b']);

      injectMasBadges();

      const stacks = document.querySelectorAll('.mep-mas-card-actions');
      expect(stacks.length, 'one stack per child card').to.equal(2);
      stacks.forEach((stack) => {
        const edit = stack.querySelector('.mep-mas-card-action-edit');
        expect(edit, 'Edit Card action should exist').to.exist;
        expect(edit.getAttribute('href')).to.include('page=fragment-editor');
        expect(edit.getAttribute('href')).to.include('fragmentId=');
        expect(stack.querySelector('.mep-mas-card-action-copy'), 'Copy action should exist').to.exist;
      });
    });

    it('skips children whose <aem-fragment> has no fragment attribute', () => {
      const parentUrl = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1';
      const container = document.createElement('div');
      container.dataset.masBlock = 'collection';
      mepMasStudioUrls.set(container, parentUrl);
      const card = document.createElement('merch-card');
      // No <aem-fragment> at all — this child should be skipped, not crash.
      container.append(card);
      document.body.append(container);

      injectMasBadges();

      expect(card.dataset.masBlock, 'unattributed child card stays unmarked').to.be.undefined;
    });

    it('is idempotent — re-running keeps each child stamped exactly once', () => {
      const parentUrl = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-1';
      const container = buildCollection(parentUrl, ['child-a']);

      injectMasBadges();
      injectMasBadges();
      injectMasBadges();

      // No legacy overlay anchors after multiple passes.
      expect(document.querySelectorAll('a.mep-mas-edit-badge-overlay').length).to.equal(0);
      const child = container.querySelector('merch-card');
      expect(child.dataset.masBlock).to.equal('card');
      // Stamped exactly once with a stable derived Studio URL after multiple passes.
      expect(mepMasStudioUrls.get(child)).to.include('query=child-a');
    });

    it('does not annotate children when the collection has no captured parent URL', () => {
      const container = document.createElement('div');
      container.dataset.masBlock = 'collection';
      // Note: no mepMasStudioUrls.set — no captured parent URL.
      const card = document.createElement('merch-card');
      const aemFragment = document.createElement('aem-fragment');
      aemFragment.setAttribute('fragment', 'child-a');
      card.append(aemFragment);
      container.append(card);
      document.body.append(container);

      injectMasBadges();

      expect(card.dataset.masBlock).to.be.undefined;
    });
  });
});

describe('M@S highlight click-driven re-stamp (tabs / accordions / filters)', () => {
  // watchForMasContent installs a debounced document click listener that
  // re-runs injectMasBadges() so badges reappear when the user navigates UI
  // patterns that don't mutate the DOM (tab toggles, accordion expands, filter
  // chips). These tests use the side-effect of injectMasBadges (a collection
  // surface gains its sibling edit badge) to verify the listener fires.

  // Wait long enough for the debounce timer + a microtask flush. We add a
  // generous margin so timer slop on busy CI machines doesn't cause flake.
  const waitForRestamp = () => new Promise((resolve) => {
    setTimeout(resolve, MAS_RESTAMP_DEBOUNCE_MS + 100);
  });

  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge, .mep-mas-card-actions, merch-card').forEach((el) => el.remove());
    document.body.dataset.mepMasHighlight = 'true';
    // Idempotent: watchForMasContent guards against double-attach internally.
    watchForMasContent();
  });

  afterEach(() => {
    delete document.body.dataset.mepMasHighlight;
  });

  it('re-runs injectMasBadges after a click (debounced) so newly-visible surfaces get their badge', async () => {
    // Seed an unstamped collection AFTER watchForMasContent — the click listener
    // is the path under test (we avoid calling injectMasBadges directly).
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&query=col-1');
    expect(container.previousElementSibling?.classList?.contains('mep-mas-edit-badge'), 'no badge before click').to.not.equal(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForRestamp();

    expect(container.previousElementSibling?.classList.contains('mep-mas-edit-badge'), 'badge should exist after debounced re-stamp').to.be.true;
  });

  it('coalesces rapid clicks into a single re-stamp pass', async () => {
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&query=col-2');

    // Fire 3 clicks within the debounce window — exactly one badge after the
    // timer fires (never two).
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForRestamp();

    expect(document.querySelectorAll('a.mep-mas-edit-badge').length).to.equal(1);
  });

  it('does NOT re-run when highlight mode is off', async () => {
    delete document.body.dataset.mepMasHighlight;
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&query=col-3');

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForRestamp();

    expect(container.previousElementSibling?.classList?.contains('mep-mas-edit-badge'), 'no badge when highlight is off').to.not.equal(true);
  });
});

describe('M@S highlight MutationObserver — late <aem-fragment> injection', () => {
  // M@S sometimes inserts <merch-card> first and the inner <aem-fragment
  // fragment="..."> in a separate render pass shortly after. The observer's
  // isMasMutation matcher includes aem-fragment[fragment] so this second
  // insertion triggers a re-stamp pass; annotateCollectionChildren can then
  // find the fragment id and stamp data-mas-block="card" on the host.

  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge, .mep-mas-card-actions, merch-card, merch-card-collection').forEach((el) => el.remove());
    document.body.dataset.mepMasHighlight = 'true';
    watchForMasContent();
  });

  afterEach(() => {
    delete document.body.dataset.mepMasHighlight;
  });

  it('stamps a previously-fragmentless <merch-card> after a late <aem-fragment fragment> is injected into it', async () => {
    // Build a collection with a single fragmentless child card. The first
    // injectMasBadges pass should NOT stamp the card (no fragment to derive
    // the Studio URL from).
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-late');
    const collEl = document.createElement('merch-card-collection');
    const card = document.createElement('merch-card');
    collEl.append(card);
    container.append(collEl);
    document.body.append(container);

    injectMasBadges();
    expect(card.dataset.masBlock, 'card stays unstamped while fragmentless').to.be.undefined;

    // Late insertion: M@S now adds the inner <aem-fragment>. The observer
    // should pick it up and re-run injectMasBadges → annotateCollectionChildren
    // finds the fragment and stamps the host.
    const aemFragment = document.createElement('aem-fragment');
    aemFragment.setAttribute('fragment', 'child-late');
    card.append(aemFragment);

    // Wait a couple of macrotasks for the MutationObserver microtask + the
    // re-run pass.
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    expect(card.dataset.masBlock, 'card should now be stamped after late fragment insertion').to.equal('card');
    // Parent url uses query= for the id, so the derived child url substitutes
    // child-late into the same query= slot.
    expect(mepMasStudioUrls.get(card)).to.include('query=child-late');
  });
});

describe('handleChildCardBadgeClick — nested ost/offer inside inline', () => {
  let windowOpenStub;

  beforeEach(() => {
    document.querySelectorAll('[data-mas-block="inline"], [data-mas-block="ost"]').forEach((el) => el.remove());
    document.body.dataset.mepMasHighlight = 'true';
    watchForMasContent();
    windowOpenStub = sinon.stub(window, 'open');
  });

  afterEach(() => {
    windowOpenStub.restore();
    sinon.restore();
    delete document.body.dataset.mepMasHighlight;
    document.querySelectorAll('[data-mas-block="inline"], [data-mas-block="ost"]').forEach((el) => el.remove());
  });

  it('fires ost URL when clicking in the moved-below badge zone of a nested ost', () => {
    const inline = document.createElement('div');
    inline.dataset.masBlock = 'inline';
    const ost = document.createElement('span');
    ost.dataset.masBlock = 'ost';
    inline.append(ost);
    document.body.append(inline);

    mepMasStudioUrls.set(inline, 'https://mas.adobe.com/inline-studio');
    mepMasStudioUrls.set(ost, 'https://milo.adobe.com/tools/ost?osi=OSI-NESTED&type=price&country=US');

    // rect: top=0, right=500, height=50. Moved zone: yMin=54, yMax=76
    sinon.stub(ost, 'getBoundingClientRect').returns({ top: 0, right: 500, height: 50 });
    sinon.stub(inline, 'getBoundingClientRect').returns({ top: 0, right: 500, height: 50 });

    ost.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 490, clientY: 58 }));

    expect(windowOpenStub.calledOnce, 'OST URL opened from moved badge zone').to.be.true;
    expect(windowOpenStub.firstCall.args[0]).to.include('osi=OSI-NESTED');
  });

  it('does NOT fire for a nested ost clicked in the old top zone (badge moved below, click misses)', () => {
    const inline = document.createElement('div');
    inline.dataset.masBlock = 'inline';
    const ost = document.createElement('span');
    ost.dataset.masBlock = 'ost';
    inline.append(ost);
    document.body.append(inline);

    mepMasStudioUrls.set(ost, 'https://milo.adobe.com/tools/ost?osi=OSI-MISS&type=price&country=US');

    // rect: top=10, right=500, height=50. Moved zone: yMin=64, yMax=86
    sinon.stub(ost, 'getBoundingClientRect').returns({ top: 10, right: 500, height: 50 });
    sinon.stub(inline, 'getBoundingClientRect').returns({ top: 10, right: 500, height: 50 });

    ost.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 490, clientY: 5 }));

    expect(windowOpenStub.called, 'click in pre-fix zone should not fire').to.be.false;
  });
});

describe('injectMasBadges — stale badge replacement when market changes', () => {
  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge').forEach((el) => el.remove());
    document.head.querySelectorAll('mas-commerce-service').forEach((el) => el.remove());
  });

  afterEach(() => {
    document.querySelectorAll('[data-mas-block], a.mep-mas-edit-badge').forEach((el) => el.remove());
    document.head.querySelectorAll('mas-commerce-service').forEach((el) => el.remove());
  });

  it('removes and replaces the sibling badge when the resolved market changes between passes', () => {
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-stale');

    injectMasBadges();
    const firstBadge = container.previousElementSibling;
    expect(firstBadge?.classList?.contains('mep-mas-edit-badge'), 'first badge exists after initial pass').to.be.true;
    const firstMarket = firstBadge.dataset.mepMasMarket;

    // data-ims-country on the element overrides the page market in getCardMarket.
    const differentMarket = firstMarket === 'de' ? 'fr' : 'de';
    container.setAttribute('data-ims-country', differentMarket);

    injectMasBadges();

    const newBadge = container.previousElementSibling;
    expect(newBadge?.classList?.contains('mep-mas-edit-badge'), 'new badge present after re-stamp').to.be.true;
    expect(newBadge.dataset.mepMasMarket, 'new badge reflects updated market').to.equal(differentMarket);
    expect(document.querySelectorAll('a.mep-mas-edit-badge').length, 'only one badge — stale one removed').to.equal(1);
  });
});

describe('masAemLoadHandler — aem:load event handler', () => {
  beforeEach(() => {
    document.querySelectorAll('[data-mas-block], merch-card').forEach((el) => el.remove());
    document.body.dataset.mepMasHighlight = 'true';
    watchForMasContent();
  });

  afterEach(() => {
    delete document.body.dataset.mepMasHighlight;
    document.querySelectorAll('[data-mas-block], merch-card').forEach((el) => el.remove());
  });

  it('ignores aem:load when mepMasHighlight is off', () => {
    delete document.body.dataset.mepMasHighlight;
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    const aemFragment = document.createElement('aem-fragment');
    container.append(aemFragment);
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-off');

    aemFragment.dispatchEvent(new CustomEvent('aem:load', { bubbles: true, detail: null }));

    expect(document.querySelector('a.mep-mas-edit-badge'), 'no badge injected when highlight is off').to.be.null;
  });

  it('ignores aem:load when target is not an AEM-FRAGMENT element', () => {
    const div = document.createElement('div');
    document.body.append(div);

    div.dispatchEvent(new CustomEvent('aem:load', { bubbles: true, detail: null }));

    expect(document.querySelector('a.mep-mas-edit-badge'), 'no badge for non-aem-fragment target').to.be.null;
  });

  it('ignores aem:load when the aem-fragment is not inside a [data-mas-block="collection"]', () => {
    const aemFragment = document.createElement('aem-fragment');
    document.body.append(aemFragment);

    aemFragment.dispatchEvent(new CustomEvent('aem:load', { bubbles: true, detail: null }));

    expect(document.querySelector('a.mep-mas-edit-badge'), 'no badge when fragment has no collection container').to.be.null;
  });

  it('stores sub-collections and schedules a re-stamp when aem:load fires with sub-collection detail', async () => {
    const container = document.createElement('div');
    container.dataset.masBlock = 'collection';
    const aemFragment = document.createElement('aem-fragment');
    container.append(aemFragment);
    document.body.append(container);
    mepMasStudioUrls.set(container, 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=col-subs');

    const detail = {
      referencesTree: [{ identifier: 'sub-id-1', fieldName: 'subFilter', referencesTree: [] }],
      references: { 'sub-id-1': { value: { fields: { label: 'Sub One', queryLabel: 'sub-one' } } } },
    };
    aemFragment.dispatchEvent(new CustomEvent('aem:load', { bubbles: true, detail }));

    expect(mepMasSubCollections.get(container)?.length, 'sub-collections stored on the container').to.equal(1);
    expect(mepMasSubCollections.get(container)[0].id).to.equal('sub-id-1');

    await new Promise((resolve) => { setTimeout(resolve, MAS_RESTAMP_DEBOUNCE_MS + 100); });
    expect(document.querySelector('a.mep-mas-edit-badge'), 'collection badge injected after debounced re-stamp').to.exist;
  });
});

describe('saveToMmm', () => {
  let fetchStub;
  const baseExperiment = {
    name: 'Test Activity',
    event: { start: '2024-01-01T00:00:00.000Z', end: '2024-01-02T00:00:00.000Z' },
    manifest: 'https://main--homepage--adobecom.aem.live/homepage/fragments/mep/test.json',
    variantNames: ['default', 'target-smb'],
    selectedVariantName: 'target-smb',
    disabled: false,
    analyticsTitle: 'Test Activity',
    source: ['mep param', 'target'],
    geoRestriction: 'us',
    mktgAction: 'test-action',
  };

  beforeEach(() => {
    config.mep.experiments = [];
    setConfig(config);
  });

  afterEach(() => {
    fetchStub?.restore();
    fetchStub = undefined;
    config.mep.experiments = [];
    setConfig(config);
  });

  it('returns false when there is no mep config', async () => {
    const originalMep = config.mep;
    delete config.mep;
    setConfig(config);
    const result = await saveToMmm();
    expect(result).to.be.false;
    config.mep = originalMep;
  });

  it('returns false for excluded page URL patterns (e.g. drafts)', async () => {
    const originalPath = window.location.pathname;
    window.history.pushState({}, '', '/drafts/some-page');
    config.mep.experiments = [baseExperiment];
    setConfig(config);
    try {
      const result = await saveToMmm();
      expect(result).to.be.false;
    } finally {
      window.history.pushState({}, '', originalPath);
    }
  });

  it('filters activities, transforms fields, and posts the payload on success', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'ok' }),
    });
    config.mep.experiments = [
      baseExperiment,
      { // source becomes empty after removing "mep param" -> filtered out entirely
        ...baseExperiment,
        manifest: 'https://main--homepage--adobecom.aem.live/homepage/fragments/mep/only-param.json',
        source: ['mep param'],
      },
      { // excluded because its own manifest path is a draft
        ...baseExperiment,
        manifest: 'https://main--homepage--adobecom.aem.live/homepage/drafts/mep/draft.json',
        source: ['target'],
      },
      { // invalid manifest URL -> exercises toActivity's catch branch, still survives filtering
        ...baseExperiment,
        manifest: 'not-a-valid-url',
        source: ['promo'],
      },
    ];
    setConfig(config);

    const result = await saveToMmm();

    expect(fetchStub.calledOnce).to.be.true;
    const [url, options] = fetchStub.firstCall.args;
    expect(url).to.equal(API_URLS.save);
    expect(options.method).to.equal('POST');
    const body = JSON.parse(options.body);
    expect(body.activities.length, 'only non-draft activities with surviving sources remain').to.equal(2);
    expect(body.activities[0].variantNames).to.equal('default||target-smb');
    expect(body.activities[0].source).to.equal('target');
    expect(body.activities[0]).to.not.have.property('selectedVariantName');
    expect(body.activities[1].url).to.equal('not-a-valid-url');
    expect(body.page).to.not.have.property('highlight');
    expect(result).to.deep.equal({ result: 'ok' });
  });

  it('throws with the response message when the save request is not ok', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: false,
      json: async () => ({ message: 'save failed' }),
    });
    config.mep.experiments = [baseExperiment];
    setConfig(config);

    let error;
    try {
      await saveToMmm();
    } catch (e) {
      error = e;
    }
    expect(error?.message).to.equal('save failed');
  });
});

describe('getMepPopup', () => {
  const popups = [];
  let originalMarketsConfig;

  function buildActivity(overrides = {}) {
    return {
      targetActivityName: 'Test Activity',
      variantNames: ['variant-a', 'variant-b'],
      selectedVariantName: 'variant-a',
      url: 'https://main--homepage--adobecom.aem.live/homepage/fragments/mep/a.json',
      disabled: false,
      source: 'target',
      analyticsTitle: 'Test',
      eventStart: null,
      eventEnd: null,
      mktgAction: 'test',
      ...overrides,
    };
  }

  async function renderPopup(mepConfig) {
    const popup = await getMepPopup(mepConfig);
    document.body.append(popup);
    popups.push(popup);
    return popup;
  }

  beforeEach(() => {
    originalMarketsConfig = config.marketsConfig;
  });

  afterEach(() => {
    popups.splice(0).forEach((popup) => popup.remove());
    document.querySelectorAll('[data-mas-block]').forEach((el) => el.remove());
    document.querySelectorAll('meta[name="langfirst"]').forEach((el) => el.remove());
    delete getConfig().locale.regions;
    delete config.locale.regions;
    if (originalMarketsConfig === undefined) {
      delete config.marketsConfig;
    } else {
      config.marketsConfig = originalMarketsConfig;
    }
    setConfig(config);
    window.history.replaceState({}, '', `${window.location.pathname}`);
  });

  it('renders a manifest list entry with a mismatched selectedVariantName at pageId 0, and a matching variant with a geo restriction', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page.html', pageId: 0, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [
        buildActivity({ selectedVariantName: 'not-in-list', geoRestriction: 'us' }),
        buildActivity({ selectedVariantName: 'variant-b' }),
        buildActivity({ disabled: true, eventStart: null, eventEnd: null }),
        buildActivity({ disabled: false, eventStart: '2024-01-01T00:00:00.000Z', eventEnd: null }),
      ],
    });

    const sections = popup.querySelectorAll('.mep-section-data');
    expect([...sections].some((data) => data.textContent.includes('Geo')), 'geo restriction row rendered').to.be.true;
    expect([...sections].some((data) => data.textContent.includes('inactive')), 'disabled activity shows inactive').to.be.true;
    const defaultSelectedOptions = popup.querySelectorAll('option[value="not-in-list"]');
    // selectedVariantName not in variantNames -> falls back to default
    expect(defaultSelectedOptions.length).to.equal(0);
    const matchedOption = popup.querySelector('option[value="variant-b"][selected]');
    expect(matchedOption, 'matching variant option is pre-selected').to.exist;
  });

  const XSS = '<img src=x onerror=alert(1)>';
  const basePage = {
    url: 'https://www.adobe.com/test-page.html', pageId: 0, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
  };

  it('escapes a malicious variant name in both option text and attributes', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: { ...basePage },
      activities: [buildActivity({ variantNames: [XSS], selectedVariantName: XSS })],
    });
    expect(popup.querySelector('img'), 'no injected element from variant name').to.be.null;
    const selected = popup.querySelector('.mep-selected-variant');
    expect(selected.textContent, 'variant rendered as literal text').to.include(XSS);
    expect(selected.querySelector('img'), 'variant text not parsed as markup').to.be.null;
  });

  it('does not let a malicious manifest url break out of the href/title attributes', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: { ...basePage },
      activities: [buildActivity({ url: 'https://x/"><img src=x onerror=alert(1)>' })],
    });
    expect(popup.querySelector('.mep-manifest-title img'), 'attribute break-out blocked').to.be.null;
  });

  it('neutralizes a javascript: manifest url to an empty href', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: { ...basePage },
      // eslint-disable-next-line no-script-url
      activities: [buildActivity({ url: 'javascript:alert(1)' })],
    });
    expect(popup.querySelector('.mep-edit-manifest').getAttribute('href')).to.equal('');
  });

  it('escapes malicious source, mktgAction, geoRestriction and targetActivityName', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: { ...basePage },
      activities: [buildActivity({ source: '<b>x</b>', mktgAction: '<b>x</b>', geoRestriction: '<b>x</b>', targetActivityName: '<b>x</b>' })],
    });
    expect(popup.querySelector('.mep-section-data b'), 'section data values not parsed as markup').to.be.null;
    expect(popup.querySelector('.target-activity-name b'), 'target activity name not parsed as markup').to.be.null;
  });

  it('does not throw and renders default (control) when variantNames is undefined', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: { ...basePage },
      activities: [buildActivity({ variantNames: undefined, selectedVariantName: 'default' })],
    });
    expect([...popup.querySelectorAll('.mep-active')].some((el) => el.textContent.includes('default (control)'))).to.be.true;
  });

  it('renders a usable expand svg (no duplicated xmlns attribute)', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: { ...basePage },
      activities: [buildActivity()],
    });
    const expand = popup.querySelector('.mep-toggle-expand');
    expect(expand, 'expand svg present').to.exist;
    expect(expand.tagName.toLowerCase()).to.equal('svg');
  });

  it('renders "0 manifests found" and a manifests-found count of 0 when there are no activities', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-empty.html', pageId: 508, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [],
    });

    expect(popup.textContent).to.include('0 manifests found');
    const summaryTab = popup.querySelectorAll('.mep-popup-tabs .mep-tab')[1];
    summaryTab.click();
    expect(popup.querySelector('.mep-popup-body[active] .mep-section-data').textContent).to.include('0');
  });

  function findPageSummarySection(popup) {
    popup.querySelectorAll('.mep-popup-tabs .mep-tab')[1].click();
    return [...popup.querySelectorAll('.mep-section')].find(
      (section) => section.querySelector('h6.mep-section-header')?.textContent.trim() === 'Page',
    );
  }

  it('setTargetOnText: falls back to page.target when target is undefined, and formats postlcp', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const undefinedTargetPopup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-target-undefined.html', pageId: 509, target: undefined, personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });
    expect(findPageSummarySection(undefinedTargetPopup), 'Page summary section renders').to.exist;

    const postlcpPopup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-target-postlcp.html', pageId: 510, target: 'postlcp', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });
    expect(findPageSummarySection(postlcpPopup).textContent).to.include('on post LCP');
  });

  it('switches tabs via changeTab and toggles a manifest section via expandManifest', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-2.html', pageId: 501, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    const [optionsTab, summaryTab] = popup.querySelectorAll('.mep-popup-tabs .mep-tab');
    const [optionsBody, summaryBody] = popup.querySelectorAll('.mep-popup-body');
    expect(optionsTab.hasAttribute('active')).to.be.true;
    summaryTab.click();
    expect(summaryTab.hasAttribute('active')).to.be.true;
    expect(optionsTab.hasAttribute('active')).to.be.false;
    expect(summaryBody.hasAttribute('active')).to.be.true;
    expect(optionsBody.hasAttribute('active')).to.be.false;

    const manifestToggle = popup.querySelector('.mep-manifest-title .mep-manifest-toggle');
    const manifestInfo = popup.querySelector('.mep-manifest-info');
    expect(manifestToggle.hasAttribute('active')).to.be.false;
    manifestToggle.click();
    expect(manifestToggle.hasAttribute('active')).to.be.true;
    expect(manifestInfo.hasAttribute('active')).to.be.true;
  });

  it('checks the fragments/CaaS/M@S highlight checkboxes and selects a manifest variant', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-3.html', pageId: 502, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    popup.querySelector('#mepFragmentsCheckbox-502').click();
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('mepFragments=true');

    popup.querySelector('#mepCaasHighlightCheckbox-502').click();
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('mepCaasHighlight=true');

    popup.querySelector('#mepMasHighlightCheckbox-502').click();
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('mepMasHighlight=true');

    const variantSelect = popup.querySelector('option[value="variant-b"]').closest('select');
    variantSelect.value = 'variant-b';
    variantSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('variant-b');
  });

  it('renders highlight checkboxes pre-checked from page/URL params, and reports geo-detection + sub-collections in the M@S summary', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    window.history.pushState({}, '', `${window.location.pathname}?mepCaasHighlight=true&mepMasHighlight=true&mas-geo-detection=on`);
    const collection = document.createElement('div');
    collection.dataset.masBlock = 'collection';
    document.body.append(collection);

    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-4.html', pageId: 503, target: 'on', personalization: 'on', locale: 'en-US', geo: '', highlight: true, fragments: true,
      },
      activities: [buildActivity()],
    });

    expect(popup.querySelector('#mepHighlightCheckbox-503').getAttribute('checked')).to.equal('checked');
    expect(popup.querySelector('#mepFragmentsCheckbox-503').getAttribute('checked')).to.equal('checked');
    expect(popup.querySelector('#mepCaasHighlightCheckbox-503').getAttribute('checked')).to.equal('checked');
    expect(popup.querySelector('#mepMasHighlightCheckbox-503').getAttribute('checked')).to.equal('checked');

    const summaryTab = popup.querySelectorAll('.mep-popup-tabs .mep-tab')[1];
    summaryTab.click();
    const masSection = [...popup.querySelectorAll('.mep-section')].find(
      (section) => section.querySelector('h6.mep-section-header')?.textContent.trim() === 'M@S',
    );
    expect(masSection.textContent).to.include('Mas Geo Detection');
    expect(masSection.textContent).to.include('on');
    expect(masSection.textContent).to.include('Collections');
  });

  it('reports geo-detection source from URL param when detection is off', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    window.history.pushState({}, '', `${window.location.pathname}?mas-geo-detection=off`);

    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-5.html', pageId: 504, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    const summaryTab = popup.querySelectorAll('.mep-popup-tabs .mep-tab')[1];
    summaryTab.click();
    const masSection = [...popup.querySelectorAll('.mep-section')].find(
      (section) => section.querySelector('h6.mep-section-header')?.textContent.trim() === 'M@S',
    );
    expect(masSection.textContent).to.include('Geo Source');
    expect(masSection.textContent).to.include('URL param (off)');
  });

  it('reports geo-detection source from metadata when on, and from metadata when off with no URL param', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'mas-geo-detection');
    meta.setAttribute('content', 'on');
    document.head.append(meta);

    try {
      const popupOn = await renderPopup({
        page: {
          url: 'https://www.adobe.com/test-page-5b.html', pageId: 513, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
        },
        activities: [buildActivity()],
      });
      popupOn.querySelectorAll('.mep-popup-tabs .mep-tab')[1].click();
      let masSection = [...popupOn.querySelectorAll('.mep-section')].find(
        (section) => section.querySelector('h6.mep-section-header')?.textContent.trim() === 'M@S',
      );
      expect(masSection.textContent).to.include('Metadata');

      meta.setAttribute('content', 'off');
      const popupOff = await renderPopup({
        page: {
          url: 'https://www.adobe.com/test-page-5c.html', pageId: 514, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
        },
        activities: [buildActivity()],
      });
      popupOff.querySelectorAll('.mep-popup-tabs .mep-tab')[1].click();
      masSection = [...popupOff.querySelectorAll('.mep-section')].find(
        (section) => section.querySelector('h6.mep-section-header')?.textContent.trim() === 'M@S',
      );
      expect(masSection.textContent).to.include('Metadata (off)');
    } finally {
      meta.remove();
    }
  });

  it('reports the page market from <mas-commerce-service country> when present', async () => {
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    const svc = document.createElement('mas-commerce-service');
    svc.setAttribute('country', 'CA');
    document.head.append(svc);

    try {
      const popup = await renderPopup({
        page: {
          url: 'https://www.adobe.com/test-page-5d.html', pageId: 515, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
        },
        activities: [buildActivity()],
      });
      popup.querySelectorAll('.mep-popup-tabs .mep-tab')[1].click();
      const masSection = [...popup.querySelectorAll('.mep-section')].find(
        (section) => section.querySelector('h6.mep-section-header')?.textContent.trim() === 'M@S',
      );
      expect(masSection.textContent).to.include('Page Market');
      expect(masSection.textContent).to.include('CA');
      expect(masSection.textContent).to.include('mas-commerce-service');
    } finally {
      svc.remove();
    }
  });

  it('Lingo + M@S: auto-checks the market checkbox, toggles the market dropdown, and drives the market select', async () => {
    const langfirstMeta = document.createElement('meta');
    langfirstMeta.setAttribute('name', 'langfirst');
    langfirstMeta.setAttribute('content', 'on');
    document.head.append(langfirstMeta);
    config.marketsConfig = { languages: { data: [{ prefix: '', defaultMarket: 'us', supportedRegions: 'us,gb' }] } };
    setConfig(config);
    // setConfig recomputes .locale from scratch, discarding any custom fields — mutate the
    // live config's locale directly, after setConfig (same pattern used by the
    // getResolvedPageMarket tests above).
    getConfig().locale.regions = { ch_de: { prefix: '/ch_de' }, at_de: { prefix: '/at_de' } };
    const masEl = document.createElement('div');
    masEl.dataset.masBlock = 'ost';
    document.body.append(masEl);

    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-6.html', pageId: 505, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    const lingoSelect = popup.querySelector('select[id^="mepLingoRegionSelect"]');
    expect(lingoSelect, 'Lingo region dropdown renders when lingo is active').to.exist;
    const masMarketCheckbox = popup.querySelector('input[id^="mepMasMarketCheckbox"]');
    expect(masMarketCheckbox, 'M@S market checkbox renders when Lingo + M@S are both present').to.exist;
    const masMarketSelect = popup.querySelector('select[id^="mepMasMarketSelect"]');
    expect(masMarketSelect.querySelectorAll('option[value="us"], option[value="gb"]').length).to.equal(2);

    const masHighlightCheckbox = popup.querySelector('input[id^="mepMasHighlightCheckbox"]');
    expect(masMarketCheckbox.checked).to.be.false;
    masHighlightCheckbox.checked = true;
    masHighlightCheckbox.dispatchEvent(new Event('change'));
    expect(masMarketCheckbox.checked, 'flipping Highlight M@S auto-checks the markets checkbox').to.be.true;

    masMarketSelect.value = 'gb';
    masMarketSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('akamaiLocale=gb');

    masMarketSelect.value = '';
    masMarketSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.not.include('akamaiLocale');

    masMarketCheckbox.checked = false;
    masMarketCheckbox.dispatchEvent(new Event('change'));
    lingoSelect.value = 'ch';
    lingoSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('akamaiLocale=ch');

    lingoSelect.value = '';
    lingoSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.not.include('akamaiLocale');
  });

  it('Lingo + M@S: pre-checks the market checkbox and pre-selects the Lingo region from URL params', async () => {
    const langfirstMeta = document.createElement('meta');
    langfirstMeta.setAttribute('name', 'langfirst');
    langfirstMeta.setAttribute('content', 'on');
    document.head.append(langfirstMeta);
    config.marketsConfig = { languages: { data: [{ prefix: '', defaultMarket: 'us', supportedRegions: 'us,gb' }] } };
    setConfig(config);
    getConfig().locale.regions = { ch_de: { prefix: '/ch_de' }, at_de: { prefix: '/at_de' } };
    const masEl = document.createElement('div');
    masEl.dataset.masBlock = 'ost';
    document.body.append(masEl);
    window.history.pushState({}, '', `${window.location.pathname}?mepMasMarket=true&akamaiLocale=ch`);

    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-6b.html', pageId: 511, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    const masMarketCheckbox = popup.querySelector('input[id^="mepMasMarketCheckbox"]');
    expect(masMarketCheckbox.getAttribute('checked')).to.equal('checked');
    const lingoSelect = popup.querySelector('select[id^="mepLingoRegionSelect"]');
    expect(lingoSelect.disabled, 'Lingo dropdown disabled while M@S markets drive akamaiLocale').to.be.true;
  });

  it('Lingo: pre-selects the Lingo region option matching ?akamaiLocale on initial render', async () => {
    const langfirstMeta = document.createElement('meta');
    langfirstMeta.setAttribute('name', 'langfirst');
    langfirstMeta.setAttribute('content', 'on');
    document.head.append(langfirstMeta);
    config.marketsConfig = { languages: { data: [] } };
    setConfig(config);
    getConfig().locale.regions = { ch_de: { prefix: '/ch_de' } };
    window.history.pushState({}, '', `${window.location.pathname}?akamaiLocale=ch`);

    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-6c.html', pageId: 512, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    const preselected = popup.querySelector('select[id^="mepLingoRegionSelect"] option[value="ch"][selected]');
    expect(preselected, 'region matching ?akamaiLocale is pre-selected').to.exist;
  });

  it('M@S only (non-Lingo): renders the standalone market dropdown and drives it directly', async () => {
    config.marketsConfig = { languages: { data: [{ prefix: '', defaultMarket: 'us', supportedRegions: 'us,fr' }] } };
    setConfig(config);
    const masEl = document.createElement('div');
    masEl.dataset.masBlock = 'ost';
    document.body.append(masEl);

    const popup = await renderPopup({
      page: {
        url: 'https://www.adobe.com/test-page-7.html', pageId: 506, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
      },
      activities: [buildActivity()],
    });

    expect(popup.querySelector('input[id^="mepMasMarketCheckbox"]'), 'no toggle without Lingo').to.be.null;
    const masMarketSelect = popup.querySelector('select[id^="mepMasMarketSelect"]');
    expect(masMarketSelect.closest('.mep-mas-market-dropdown').classList.contains('standalone')).to.be.true;

    masMarketSelect.value = 'fr';
    masMarketSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('akamaiLocale=fr');
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.include('mepMasMarket=true');

    masMarketSelect.value = '';
    masMarketSelect.dispatchEvent(new Event('change'));
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.not.include('akamaiLocale');
    expect(popup.querySelector('a.con-button').getAttribute('href')).to.not.include('mepMasMarket');
  });

  it('cold market cache: renders a disabled placeholder, then re-renders with fetched markets in place', async () => {
    delete config.marketsConfig;
    setConfig(config);
    const masEl = document.createElement('div');
    masEl.dataset.masBlock = 'ost';
    document.body.append(masEl);

    const fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      status: 200,
      json: async () => ({ languages: { data: [{ prefix: '', defaultMarket: 'us', supportedRegions: 'us,de' }] } }),
    });

    try {
      const popup = await renderPopup({
        page: {
          url: 'https://www.adobe.com/test-page-8.html', pageId: 507, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
        },
        activities: [buildActivity()],
      });

      const initialSelect = popup.querySelector('select[id^="mepMasMarketSelect"]');
      expect(initialSelect.disabled, 'cold cache renders a disabled placeholder select').to.be.true;

      await new Promise((resolve) => { setTimeout(resolve, 0); });
      await new Promise((resolve) => { setTimeout(resolve, 0); });

      const updatedSelect = popup.querySelector('select[id^="mepMasMarketSelect"]');
      expect(updatedSelect.disabled, 'select is enabled once markets resolve').to.be.false;
      const values = [...updatedSelect.querySelectorAll('option')].map((o) => o.value);
      expect(values).to.include('us');
      expect(values).to.include('de');
    } finally {
      fetchStub.restore();
    }
  });

  it('cold market cache: does not clobber a value the user already picked before the fetch resolves', async () => {
    delete config.marketsConfig;
    setConfig(config);
    const masEl = document.createElement('div');
    masEl.dataset.masBlock = 'ost';
    document.body.append(masEl);

    let resolveMarketsFetch;
    const marketsPromise = new Promise((resolve) => { resolveMarketsFetch = resolve; });
    const fetchStub = sinon.stub(window, 'fetch').returns(marketsPromise);

    try {
      const popup = await renderPopup({
        page: {
          url: 'https://www.adobe.com/test-page-9.html', pageId: 516, target: 'on', personalization: 'on', locale: 'en-US', geo: '',
        },
        activities: [buildActivity()],
      });

      const initialSelect = popup.querySelector('select[id^="mepMasMarketSelect"]');
      // Simulate the user picking a value on the placeholder before the fetch resolves.
      const userOption = document.createElement('option');
      userOption.value = 'us';
      userOption.selected = true;
      initialSelect.append(userOption);
      initialSelect.value = 'us';

      resolveMarketsFetch({
        ok: true,
        status: 200,
        json: async () => ({ languages: { data: [{ prefix: '', defaultMarket: 'us', supportedRegions: 'us,de' }] } }),
      });
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      await new Promise((resolve) => { setTimeout(resolve, 0); });

      const selectAfter = popup.querySelector('select[id^="mepMasMarketSelect"]');
      expect(selectAfter, 'wrapper is not replaced when the user already made a selection').to.equal(initialSelect);
      expect(selectAfter.value).to.equal('us');
    } finally {
      fetchStub.restore();
    }
  });
});
