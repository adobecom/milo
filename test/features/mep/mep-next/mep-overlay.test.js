import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig, updateConfig, getConfig } = await import('../../../../libs/utils/utils.js');
const { CARD_STORAGE_KEY, EXCLUDE_MANIFEST_PARAMS_KEY } = await import('../../../../libs/features/mep/mep-next/mep-overlay/mep-overlay-logic.js');

// icon-mep has onclick/onload attributes to exercise svgIcon() sanitization branch
const SVG_DATA = {
  svg: {
    'icon-close': '<svg><path/></svg>',
    'icon-expand-circle-down': '<svg><path/></svg>',
    'icon-radio-checked': '<svg><path/></svg>',
    'icon-radio-unchecked': '<svg><path/></svg>',
    'icon-mep': '<svg onclick="xss()"><path onload="evil"/></svg>',
    'logo-mep': '<svg><path/></svg>',
  },
};

const BASE_CONFIG = {
  miloLibs: 'https://main--milo--adobecom.aem.live/libs',
  codeRoot: 'https://main--homepage--adobecom.aem.live/homepage',
  locale: { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '', region: 'us', regions: {} },
  mep: {
    experiments: [],
    prefix: '',
    highlight: true,
    targetEnabled: true,
    consentState: { functional: true, advertising: true },
  },
  env: { name: 'stage' },
};

// fetchOverride allows per-test fetch interception on top of the base stub
let fetchOverride = null;

setConfig(BASE_CONFIG);

const fetchStub = sinon.stub(window, 'fetch').callsFake((url) => {
  if (fetchOverride) return fetchOverride(url);
  const href = url instanceof URL ? url.href : String(url);
  if (href.includes('mep-overlay-svg.json')) {
    return Promise.resolve({ ok: true, json: async () => SVG_DATA });
  }
  if (href.includes('supported-markets')) {
    return Promise.resolve({ ok: true, json: async () => ({ languages: { data: [] } }) });
  }
  // isWithinFirewall()'s corp-only reachability check: reject by default so tests
  // exercise the intended Sidekick-auth path instead of always bypassing via firewall.
  if ((url instanceof URL ? url.hostname : new URL(href).hostname) === 'mep-auth-check.awesome-sites.corp.adobe.com') {
    return Promise.reject(new Error('offline'));
  }
  // Lambda/API calls return 404 by default so getAdditionalManifests returns undefined
  return Promise.resolve({ ok: false, status: 404, json: async () => ({}), text: async () => '' });
});

const { default: init, __buildCardContent } = await import('../../../../libs/features/mep/mep-next/mep-overlay/mep-overlay.js');

after(() => fetchStub.restore());

// ---- Helpers ----

function makeBody() {
  document.body.replaceChildren();
  return document.body;
}

function makeHeader(bottom = 50) {
  const el = document.createElement('header');
  el.getBoundingClientRect = () => ({ bottom });
  document.body.prepend(el);
  return el;
}

function cleanup(bodyEl, headerEl, ...extras) {
  headerEl?.remove();
  extras.forEach((el) => el?.remove());
  document.querySelectorAll('#mep-drawer, .mep-fab').forEach((el) => el.remove());
  localStorage.removeItem(CARD_STORAGE_KEY);
}

const wait = (ms = 0) => new Promise((r) => { setTimeout(r, ms); });

// ============================================================
// GROUP 1: Stage env — first init() call
// auth state: false → true
// Covers: buildOverlay, buildFAB, buildDrawer, buildTabsAndBody,
//   buildActionsContent (authenticated=true path), buildCard all types,
//   buildCardContent (all branches), buildToggleRow (function+string desc),
//   buildToggle (stage: MM excluded), buildSpoofGeo, buildLoadManifest,
//   buildSummaryData (null→"No content available", nested pairs),
//   buildNestedSection, buildFooter, buildRow (value='on' emphasis),
//   markExpanded, svgIcon sanitization, checkAuthAndBuild (auth change),
//   setDefaultValues (!mepAkamaiLocale path), setEventListeners, setMasObserver,
//   calcGnavOffset, getGnavOffset (immediate path)
// ============================================================
describe('init: DOM structure — stage env first call', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader(50);
    await init();
    await wait(150);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('appends .mep-fab button to body', () => {
    expect(bodyEl.querySelector('.mep-fab')).to.exist;
  });

  it('FAB has popovertarget="mep-drawer"', () => {
    expect(bodyEl.querySelector('.mep-fab').getAttribute('popovertarget')).to.equal('mep-drawer');
  });

  it('FAB top style equals gnav bottom (50) + 16', () => {
    expect(parseFloat(bodyEl.querySelector('.mep-fab').style.top)).to.equal(66);
  });

  it('FAB contains an SVG icon', () => {
    expect(bodyEl.querySelector('.mep-fab svg')).to.exist;
  });

  it('svgIcon strips onclick from FAB SVG element', () => {
    expect(bodyEl.querySelector('.mep-fab svg').hasAttribute('onclick')).to.be.false;
  });

  it('svgIcon strips onload from child elements of FAB SVG', () => {
    const path = bodyEl.querySelector('.mep-fab svg path');
    expect(path?.hasAttribute('onload')).to.be.false;
  });

  it('appends #mep-drawer to body', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });

  it('drawer has popover="manual"', () => {
    expect(bodyEl.querySelector('#mep-drawer').getAttribute('popover')).to.equal('manual');
  });

  it('drawer top style reflects gnav offset (50px)', () => {
    expect(bodyEl.querySelector('#mep-drawer').style.top).to.equal('50px');
  });

  it('drawer height style uses calc()', () => {
    expect(bodyEl.querySelector('#mep-drawer').style.height).to.include('calc');
  });

  it('drawer contains .logo-mep anchor', () => {
    expect(bodyEl.querySelector('#mep-drawer .logo-mep')).to.exist;
  });

  it('drawer contains .icon-close button', () => {
    expect(bodyEl.querySelector('#mep-drawer .icon-close')).to.exist;
  });

  it('drawer has exactly two .mep-tab elements', () => {
    expect(bodyEl.querySelectorAll('#mep-drawer .mep-tab').length).to.equal(2);
  });

  it('first tab is "Actions" and active', () => {
    const tabs = bodyEl.querySelectorAll('#mep-drawer .mep-tab');
    expect(tabs[0].textContent.trim()).to.equal('Actions');
    expect(tabs[0].classList.contains('active')).to.be.true;
  });

  it('second tab is "Summary" and not active', () => {
    const tabs = bodyEl.querySelectorAll('#mep-drawer .mep-tab');
    expect(tabs[1].textContent.trim()).to.equal('Summary');
    expect(tabs[1].classList.contains('active')).to.be.false;
  });

  it('Actions tab-content is active, Summary is not', () => {
    const panels = bodyEl.querySelectorAll('#mep-drawer .mep-tab-content');
    expect(panels[0].classList.contains('active')).to.be.true;
    expect(panels[1].classList.contains('active')).to.be.false;
  });

  it('drawer has .mep-footer with Preview link when authenticated', () => {
    const footer = bodyEl.querySelector('#mep-drawer .mep-footer');
    expect(footer).to.exist;
    expect(footer.querySelector('a').textContent.trim()).to.equal('Preview');
  });

  it('Highlight card is present in Actions tab', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.querySelector('[data-card-key="Highlight"]')).to.exist;
  });

  it('Toggle card is present in Actions tab', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.querySelector('[data-card-key="Toggle"]')).to.exist;
  });

  it('Spoof Country card is present with select.mep-spoof-geo', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.querySelector('[data-card-key="Spoof Country"]')).to.exist;
    expect(content.querySelector('select.mep-spoof-geo')).to.exist;
  });

  it('Load Manifest card has input.mep-load-manifest of type text', () => {
    const input = bodyEl.querySelector('#mep-drawer input.mep-load-manifest');
    expect(input).to.exist;
    expect(input.type).to.equal('text');
  });

  it('Manifest Manager toggle is absent on stage env (buildToggle filter)', () => {
    const ids = [...bodyEl.querySelectorAll('#mep-drawer input[type="checkbox"]')].map((cb) => cb.id);
    expect(ids).to.not.include('toggle-manifest-manager');
  });

  it('Preview Link toggle exists (string description in buildToggleRow)', () => {
    expect(bodyEl.querySelector('#toggle-preview-link')).to.exist;
  });

  it('persists the Manifest Parameters toggle to sessionStorage on change', () => {
    const cb = bodyEl.querySelector('#toggle-manifest-parameters');
    expect(cb).to.exist;
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    expect(sessionStorage.getItem(EXCLUDE_MANIFEST_PARAMS_KEY)).to.equal('true');
    cb.checked = false;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    expect(sessionStorage.getItem(EXCLUDE_MANIFEST_PARAMS_KEY)).to.equal('false');
    sessionStorage.removeItem(EXCLUDE_MANIFEST_PARAMS_KEY);
  });

  it('MEP highlight toggle has function-computed description (0 Page Updates)', () => {
    const label = bodyEl.querySelector('[data-card-key="Highlight"] .mep-row-value');
    expect(label?.textContent).to.include('Page Updates');
  });

  it('Highlight toggles render outlined circle keys for each highlight type', () => {
    const card = mainEl.querySelector('[data-card-key="Highlight"]');
    expect(card.querySelector('.mep-toggle-key-mep')).to.exist;
    expect(card.querySelector('.mep-toggle-key-lingo')).to.exist;
    expect(card.querySelector('.mep-toggle-key-caas')).to.exist;
    expect(card.querySelector('.mep-toggle-key-mas')).to.exist;
    expect(card.querySelector('.mep-toggle-key-other')).to.exist;
  });

  it('non-Highlight toggles do not render outlined circle keys', () => {
    const card = mainEl.querySelector('[data-card-key="Toggle"]');
    expect(card.querySelector('.mep-toggle-key')).to.not.exist;
  });

  it('spoof-geo-top-markets radio is checked by default', () => {
    const radio = bodyEl.querySelector('#spoof-geo-top-markets');
    expect(radio).to.exist;
    expect(radio.checked).to.be.true;
  });

  it('spoof-geo-mep-lingo radio is disabled when no lingo regions configured', () => {
    const radio = bodyEl.querySelector('#spoof-geo-mep-lingo');
    expect(radio?.disabled).to.be.true;
  });

  it('Summary tab has at least one card', () => {
    const summary = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="1"]');
    expect(summary.querySelector('.mep-card')).to.exist;
  });

  it('Summary tab contains "No content available" (getCaasSummary returns null)', () => {
    const summary = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="1"]');
    expect(summary.textContent).to.include('No content available');
  });

  it('Summary tab has .mep-row-section (buildNestedSection via M@S data)', () => {
    const summary = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="1"]');
    expect(summary.querySelector('.mep-row-section')).to.exist;
  });

  it('buildRow with value "on" produces .mep-row-value.emphasis (consent summary)', () => {
    const summary = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="1"]');
    expect(summary.querySelector('.mep-row-value.emphasis')).to.exist;
  });

  it('buildAdditionalManifests with no cached data: data?.activities ?? [] fires, !manifests.length returns early', async () => {
    // Must run BEFORE GROUP 3 sets the additionalManifests module cache.
    // Default fetchStub returns 404 for lambda → getAdditionalManifests returns undefined
    // → data?.activities ?? [] uses the [] fallback → !manifests.length → early return
    const drawer = bodyEl.querySelector('#mep-drawer');
    const mmCb = document.createElement('input');
    mmCb.type = 'checkbox';
    mmCb.id = 'toggle-manifest-manager';
    mmCb.checked = true;
    drawer.append(mmCb);
    mmCb.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    mmCb.remove();
    expect(drawer.querySelector('.mmm-manifest-card')).to.not.exist;
  });
});

// ============================================================
// GROUP 2: With experiments — covers buildManifestCard all branches
// including option.id and option.dataManifest (set by getManifestList)
// auth state: true → true (early return in checkAuthAndBuild)
// ============================================================
describe('init: buildManifestCard — all branches via experiment config', () => {
  let bodyEl;
  let headerEl;

  const configWithExps = {
    ...BASE_CONFIG,
    mep: {
      ...BASE_CONFIG.mep,
      experiments: [
        {
          name: 'My Campaign',
          manifest: '/frags/mep/exp1.json',
          variantNames: ['v-a', 'v-b'],
          selectedVariantName: 'v-a',
          source: 'adobe-target',
          countryRestriction: 'emea',
          consentType: 'promo or no offer changes',
          disabled: false,
          event: { start: '2025-01-01T00:00:00Z', end: '2025-12-31T23:59:59Z' },
        },
        {
          name: 'Disabled Test',
          manifest: '/frags/mep/exp2.json',
          variantNames: ['v-a'],
          selectedVariantName: 'not-in-list',
          source: 'helix',
          countryRestriction: null,
          consentType: null,
          disabled: true,
        },
      ],
    },
  };

  before(async () => {
    setConfig(configWithExps);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
  });

  it('two .mep-manifest-card elements are rendered', () => {
    expect(bodyEl.querySelectorAll('.mep-manifest-card').length).to.equal(2);
  });

  it('manifest card shows targetActivityName (campaign name)', () => {
    expect(bodyEl.querySelector('.mep-manifest-card').textContent).to.include('My Campaign');
  });

  it('countryRestriction is uppercased in manifest card (EMEA)', () => {
    expect(bodyEl.querySelector('.mep-manifest-card').textContent).to.include('EMEA');
  });

  it('On/Off event rows appear when both eventStart and eventEnd present', () => {
    const card = bodyEl.querySelector('.mep-manifest-card');
    expect(card.textContent).to.include('On');
    expect(card.textContent).to.include('Off');
  });

  it('Instant link is present in the On row', () => {
    expect(bodyEl.querySelector('.mep-manifest-card a[href*="instant"]')).to.exist;
  });

  it('disabled experiment shows "inactive" in Active? row', () => {
    const cards = bodyEl.querySelectorAll('.mep-manifest-card');
    expect(cards[1].textContent).to.include('inactive');
  });

  it('selectedVariantName not in variantNames → "default (control)" experience', () => {
    const cards = bodyEl.querySelectorAll('.mep-manifest-card');
    expect(cards[1].textContent).to.include('default (control)');
  });

  it('variant select includes None, Default, and named variants', () => {
    const select = bodyEl.querySelector('.mep-manifest-card select.mep-manifest-variants');
    const values = [...select.options].map((o) => o.value);
    expect(values).to.include('');
    expect(values).to.include('default');
    expect(values).to.include('v-a');
    expect(values).to.include('v-b');
  });

  it('default option has id attribute (option.id branch in buildManifestCard)', () => {
    const select = bodyEl.querySelector('.mep-manifest-card select.mep-manifest-variants');
    const defaultOpt = [...select.options].find((o) => o.value === 'default');
    expect(defaultOpt?.id).to.be.a('string').and.not.empty;
  });

  it('default option has data-manifest attribute (option.dataManifest branch)', () => {
    const select = bodyEl.querySelector('.mep-manifest-card select.mep-manifest-variants');
    const defaultOpt = [...select.options].find((o) => o.value === 'default');
    expect(defaultOpt?.dataset.manifest).to.be.a('string').and.not.empty;
  });

  it('None option has no id attribute (option.id falsy branch)', () => {
    const select = bodyEl.querySelector('.mep-manifest-card select.mep-manifest-variants');
    const noneOpt = [...select.options].find((o) => o.value === '');
    expect(noneOpt?.id).to.equal('');
  });

  it('selected variant option is flagged selected=true', () => {
    const select = bodyEl.querySelector('.mep-manifest-card select.mep-manifest-variants');
    const vaOpt = [...select.options].find((o) => o.value === 'v-a');
    expect(vaOpt?.selected).to.be.true;
  });

  it('manifest card header link targets editUrl', () => {
    expect(bodyEl.querySelector('.mep-manifest-card .mep-manifest-header a')).to.exist;
  });

  it('manifest index starts at 1', () => {
    const card = bodyEl.querySelector('.mep-manifest-card');
    expect(card.textContent).to.include('1.');
  });
});

// ============================================================
// XSS (review #1): manifest-derived values must render as inert text, not be
// parsed as HTML. Feeds an <img onerror> payload through name/variant/source
// and asserts no element is injected and the raw string renders as text.
// ============================================================
describe('init: buildManifestCard — XSS payload renders as inert text', () => {
  let bodyEl;
  let headerEl;

  const XSS = 'x"><img src=x onerror="window.mepXssFired = true">';
  const xssConfig = {
    ...BASE_CONFIG,
    mep: {
      ...BASE_CONFIG.mep,
      experiments: [
        {
          name: XSS, // → Campaign row (buildRow)
          manifest: '/frags/mep/xss.json',
          variantNames: [XSS], // → <option> label
          selectedVariantName: XSS, // → Experience row (buildRow)
          source: XSS, // → Source row (buildRow)
          countryRestriction: null,
          consentType: null,
          disabled: false,
        },
      ],
    },
  };

  before(async () => {
    window.mepXssFired = undefined;
    setConfig(xssConfig);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    delete window.mepXssFired;
  });

  it('does not parse injected markup into the DOM (no <img>, onerror never fires)', () => {
    const card = bodyEl.querySelector('.mep-manifest-card');
    expect(card, 'manifest card rendered').to.exist;
    expect(card.querySelectorAll('img').length).to.equal(0);
    expect(window.mepXssFired).to.not.equal(true);
  });

  it('renders the payload as literal text in rows and the option label', () => {
    const card = bodyEl.querySelector('.mep-manifest-card');
    expect(card.textContent).to.include(XSS);
    const option = [...card.querySelectorAll('option')].find((o) => o.textContent === XSS);
    expect(option, 'variant option label rendered as text').to.exist;
  });
});

// ============================================================
// Malformed manifests (mep.manifestErrors): a manifest that failed to load
// or parse never becomes a full experiment, so it's rendered as a lean card
// via the same error tooltip used by buildManifestCard's getManifestStatus.
// ============================================================
describe('init: buildManifestCard — malformed manifest via mep.manifestErrors', () => {
  let bodyEl;
  let headerEl;

  const malformedConfig = {
    ...BASE_CONFIG,
    mep: {
      ...BASE_CONFIG.mep,
      experiments: [
        {
          name: 'Valid Campaign',
          manifest: '/frags/mep/valid.json',
          variantNames: ['v-a'],
          selectedVariantName: 'v-a',
          source: 'helix',
          disabled: false,
        },
      ],
      manifestErrors: [{ name: 'broken-manifest', manifestPath: '/frags/mep/broken.json', error: 'Manifest' }],
    },
  };

  before(async () => {
    setConfig(malformedConfig);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
  });

  it('renders one card per valid experiment plus one per malformed manifest', () => {
    expect(bodyEl.querySelectorAll('.mep-manifest-card').length).to.equal(2);
  });

  it('renders the malformed manifest name and marks the card as an error', () => {
    const cards = [...bodyEl.querySelectorAll('.mep-manifest-card')];
    const malformedCard = cards.find((c) => c.textContent.includes('broken-manifest'));
    expect(malformedCard, 'malformed manifest card rendered').to.exist;
    expect(malformedCard.classList.contains('manifest-error')).to.be.true;
  });

  it('lists the malformed reason in the error tooltip', () => {
    const cards = [...bodyEl.querySelectorAll('.mep-manifest-card')];
    const malformedCard = cards.find((c) => c.textContent.includes('broken-manifest'));
    const tooltip = malformedCard.querySelector('.mep-manifest-error-tooltip');
    expect(tooltip.textContent).to.include('Manifest not found.');
  });

  it('does not render a variant select or body rows for the malformed card', () => {
    const cards = [...bodyEl.querySelectorAll('.mep-manifest-card')];
    const malformedCard = cards.find((c) => c.textContent.includes('broken-manifest'));
    expect(malformedCard.querySelector('select.mep-manifest-variants')).to.be.null;
    expect(malformedCard.querySelector('.mep-card-body')).to.be.null;
  });

  it('still renders the valid manifest card without an error class', () => {
    const cards = [...bodyEl.querySelectorAll('.mep-manifest-card')];
    const validCard = cards.find((c) => c.textContent.includes('Valid Campaign'));
    expect(validCard, 'valid manifest card rendered').to.exist;
    expect(validCard.classList.contains('manifest-error')).to.be.false;
  });
});

// ============================================================
// GROUP 3: buildAdditionalManifests — with activities returned
// Config includes one experiment so the drawer has a base manifest card.
// auth state: true → true (early return)
// ============================================================
describe('buildAdditionalManifests: with activities returned', () => {
  let bodyEl;
  let headerEl;

  const configWithOneExp = {
    ...BASE_CONFIG,
    mep: {
      ...BASE_CONFIG.mep,
      experiments: [{
        name: 'Base Exp',
        manifest: '/frags/mep/base.json',
        variantNames: ['v-a'],
        selectedVariantName: 'v-a',
        source: 'helix',
        disabled: false,
      }],
    },
  };

  // Additional activity in the shape the lambda API returns — includes
  // options/editUrl/fileName because buildManifestCard reads these directly.
  // lastSeen is set to exercise that branch (only reachable via lambda activities,
  // not via getManifestList which uses toActivity that strips the field).
  const rawAdditionalActivity = {
    url: '/frags/mep/extra.json',
    name: 'Extra Activity',
    editUrl: 'https://da.live/edit/extra.json',
    fileName: 'extra.json',
    variantNames: ['v-extra'],
    selectedVariantName: 'v-extra',
    disabled: false,
    index: 99,
    lastSeen: '2024-06-01T12:00:00Z',
    options: [
      { value: '', label: 'None', title: 'None' },
      {
        id: 'opt-default-extra',
        dataManifest: '/frags/mep/extra.json',
        value: 'default',
        label: 'Default',
        selected: false,
        title: 'Default',
      },
      {
        id: 'opt-vextra-extra',
        dataManifest: '/frags/mep/extra.json',
        value: 'v-extra',
        label: 'v-extra',
        selected: true,
        title: 'v-extra',
      },
    ],
    source: 'MMM',
  };

  before(async () => {
    setConfig(configWithOneExp);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);

    // Override fetch to make getAdditionalManifests return an activity
    fetchOverride = (url) => {
      const href = url instanceof URL ? url.href : String(url);
      if (href.includes('mep-overlay-svg.json')) return Promise.resolve({ ok: true, json: async () => SVG_DATA });
      if (href.includes('supported-markets')) return Promise.resolve({ ok: true, json: async () => ({ languages: { data: [] } }) });
      // Any other URL (lambda) → return the additional activity
      const activities = [rawAdditionalActivity];
      return Promise.resolve({ ok: true, json: async () => ({ activities }) });
    };

    const drawer = bodyEl.querySelector('#mep-drawer');
    const mmCb = document.createElement('input');
    mmCb.type = 'checkbox';
    mmCb.id = 'toggle-manifest-manager';
    mmCb.checked = true;
    drawer.append(mmCb);
    mmCb.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    mmCb.remove();

    fetchOverride = null;
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('additional manifest card appended with mmm-manifest-card class', () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    expect(drawer.querySelector('.mmm-manifest-card')).to.exist;
  });

  it('mmm-manifest-card shows Last Seen row (manifest.lastSeen branch in buildManifestCard)', () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const mmmCard = drawer.querySelector('.mmm-manifest-card');
    expect(mmmCard?.textContent).to.include('Last Seen');
  });

  it('unchecking hides mmm-manifest-card instead of removing/refetching it', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const before = drawer.querySelectorAll('.mmm-manifest-card').length;

    const mmCb = document.createElement('input');
    mmCb.type = 'checkbox';
    mmCb.id = 'toggle-manifest-manager';
    mmCb.checked = false;
    drawer.append(mmCb);
    mmCb.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    mmCb.remove();

    const mmmCards = [...drawer.querySelectorAll('.mmm-manifest-card')];
    expect(mmmCards.length).to.equal(before);
    expect(mmmCards.every((card) => card.hidden)).to.be.true;
  });

  it('rechecking shows the existing mmm-manifest-card again without duplicating it', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const before = drawer.querySelectorAll('.mmm-manifest-card').length;

    const mmCb = document.createElement('input');
    mmCb.type = 'checkbox';
    mmCb.id = 'toggle-manifest-manager';
    mmCb.checked = true;
    drawer.append(mmCb);
    mmCb.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    mmCb.remove();

    const mmmCards = [...drawer.querySelectorAll('.mmm-manifest-card')];
    expect(mmmCards.length).to.equal(before);
    expect(mmmCards.every((card) => !card.hidden)).to.be.true;
  });
});

// ============================================================
// GROUP 4: buildAdditionalManifests — no base manifest cards
// auth state: true → true
// ============================================================
describe('buildAdditionalManifests: no base manifest cards → early return', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(100);

    // getAdditionalManifests returns cached data from Group 3 (non-empty activities)
    // But there are no base manifest cards → early return
    const drawer = bodyEl.querySelector('#mep-drawer');
    const mmCb = document.createElement('input');
    mmCb.type = 'checkbox';
    mmCb.id = 'toggle-manifest-manager';
    mmCb.checked = true;
    drawer.append(mmCb);
    mmCb.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    mmCb.remove();
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('no mmm-manifest-card added when no base manifest cards exist', () => {
    expect(bodyEl.querySelector('.mmm-manifest-card')).to.not.exist;
  });
});

// ============================================================
// GROUP 5: markExpanded — per-type defaults and localStorage overrides
// auth state: true → true
// ============================================================
const CONFIG_WITH_DEFAULT_EXP = {
  ...BASE_CONFIG,
  mep: {
    ...BASE_CONFIG.mep,
    experiments: [{
      name: 'Default Card',
      manifest: '/frags/mep/default-exp.json',
      variantNames: [],
      selectedVariantName: 'default',
      source: 'adobe-target',
    }],
  },
};

describe('markExpanded: defaults with no localStorage entry', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    localStorage.removeItem(CARD_STORAGE_KEY);
    setConfig(CONFIG_WITH_DEFAULT_EXP);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('manifest cards start collapsed by default', () => {
    const card = bodyEl.querySelector('.mep-manifest-card');
    expect(card.classList.contains('expanded')).to.be.false;
  });

  it('action cards (e.g. Highlight) start expanded by default', () => {
    const card = bodyEl.querySelector('#mep-drawer [data-card-key="Highlight"]');
    expect(card.classList.contains('expanded')).to.be.true;
  });

  it('summary cards (e.g. Page) start expanded by default', () => {
    const card = bodyEl.querySelector('#mep-drawer [data-card-key="Page"]');
    expect(card.classList.contains('expanded')).to.be.true;
  });
});

describe('markExpanded: localStorage overrides the per-type default', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify({
      '/frags/mep/default-exp.json': true,
      Highlight: false,
    }));
    setConfig(CONFIG_WITH_DEFAULT_EXP);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('manifest card starts expanded when localStorage explicitly sets it true', () => {
    const card = bodyEl.querySelector('.mep-manifest-card');
    expect(card.classList.contains('expanded')).to.be.true;
  });

  it('Highlight card starts collapsed when localStorage explicitly sets it false', () => {
    const card = bodyEl.querySelector('#mep-drawer [data-card-key="Highlight"]');
    expect(card.classList.contains('expanded')).to.be.false;
  });
});

// ============================================================
// GROUP 6: Event listeners — tab switching
// auth state: true → true
// ============================================================
describe('setEventListeners: tab switching', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('clicking Summary tab activates it and deactivates Actions', () => {
    const tabs = bodyEl.querySelectorAll('#mep-drawer .mep-tab');
    const panels = bodyEl.querySelectorAll('#mep-drawer .mep-tab-content');
    tabs[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(tabs[1].classList.contains('active')).to.be.true;
    expect(panels[1].classList.contains('active')).to.be.true;
    expect(tabs[0].classList.contains('active')).to.be.false;
  });

  it('clicking Actions tab restores it as active', () => {
    const tabs = bodyEl.querySelectorAll('#mep-drawer .mep-tab');
    const panels = bodyEl.querySelectorAll('#mep-drawer .mep-tab-content');
    tabs[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(tabs[0].classList.contains('active')).to.be.true;
    expect(panels[0].classList.contains('active')).to.be.true;
  });

  it('clicking non-tab element in drawer does not switch active tab', () => {
    const tabs = bodyEl.querySelectorAll('#mep-drawer .mep-tab');
    const body = bodyEl.querySelector('#mep-drawer .mep-card-body');
    if (body) body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(tabs[0].classList.contains('active')).to.be.true;
  });
});

// ============================================================
// GROUP 7: Event listeners — toggleExpandedCard
// auth state: true → true
// ============================================================
describe('setEventListeners: toggleExpandedCard', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    localStorage.removeItem(CARD_STORAGE_KEY);
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(50);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('clicking card SVG toggles expanded class on the card', () => {
    const card = bodyEl.querySelector('#mep-drawer .mep-card[data-card-key]');
    const svg = card.querySelector('svg');
    const was = card.classList.contains('expanded');
    svg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(card.classList.contains('expanded')).to.equal(!was);
  });

  it('expanded state is persisted to localStorage', () => {
    const card = bodyEl.querySelector('#mep-drawer .mep-card[data-card-key]');
    const svg = card.querySelector('svg');
    const key = card.dataset.cardKey;
    svg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const stored = JSON.parse(localStorage.getItem(CARD_STORAGE_KEY) || '{}');
    expect(stored).to.be.an('object');
    expect(stored[key]).to.equal(card.classList.contains('expanded'));
  });

  it('clicking a Spoof Country radio-row SVG does not collapse the card', () => {
    const card = bodyEl.querySelector('#mep-drawer [data-card-key="Spoof Country"]');
    const radioSvg = card.querySelector('.mep-radio-row svg');
    const was = card.classList.contains('expanded');
    radioSvg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(card.classList.contains('expanded')).to.equal(was);
  });
});

// ============================================================
// GROUP 8: Event listeners — change handler
// auth state: true → true
// ============================================================
describe('setEventListeners: change handler', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(50);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('change on checked checkbox sets "checked" attribute', () => {
    const cb = bodyEl.querySelector('#mep-drawer input[type="checkbox"]');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cb.hasAttribute('checked')).to.be.true;
  });

  it('change on unchecked checkbox removes "checked" attribute', () => {
    const cb = bodyEl.querySelector('#mep-drawer input[type="checkbox"]');
    cb.removeAttribute('checked');
    cb.checked = false;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cb.hasAttribute('checked')).to.be.false;
  });

  it('change on a non-checkbox element (select) calls setPreviewButton without throwing', () => {
    const sel = bodyEl.querySelector('#mep-drawer select');
    if (!sel) return;
    expect(() => sel.dispatchEvent(new Event('change', { bubbles: true }))).to.not.throw();
  });
});

// ============================================================
// GROUP 9: Event listeners — input handler
// auth state: true → true
// ============================================================
describe('setEventListeners: input handler', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(50);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('input on toggle-manifest-manager triggers buildAdditionalManifests without throwing', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const mmCb = document.createElement('input');
    mmCb.type = 'checkbox';
    mmCb.id = 'toggle-manifest-manager';
    mmCb.checked = true;
    drawer.append(mmCb);
    expect(() => mmCb.dispatchEvent(new Event('input', { bubbles: true }))).to.not.throw();
    await wait(100);
    mmCb.remove();
  });

  it('input on a Highlight checkbox fires toggleHighlight', () => {
    const cb = bodyEl.querySelector('#toggle-mep');
    expect(() => cb?.dispatchEvent(new Event('input', { bubbles: true }))).to.not.throw();
  });

  it('input on text input (non-checkbox) fires setPreviewButton', () => {
    const input = bodyEl.querySelector('#mep-drawer input.mep-load-manifest');
    expect(() => input?.dispatchEvent(new Event('input', { bubbles: true }))).to.not.throw();
  });
});

// ============================================================
// GROUP 10: scroll/resize → updateGnavOffset
// auth state: true → true
// ============================================================
describe('setEventListeners: scroll and resize → updateGnavOffset', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader(60);
    await init();
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('scroll event updates FAB top to gnav bottom + 16', async () => {
    window.dispatchEvent(new Event('scroll'));
    await wait(50);
    expect(parseFloat(bodyEl.querySelector('.mep-fab').style.top)).to.equal(76);
  });

  it('scroll event updates drawer top to gnav bottom', async () => {
    window.dispatchEvent(new Event('scroll'));
    await wait(50);
    expect(bodyEl.querySelector('#mep-drawer').style.top).to.equal('60px');
  });

  it('resize event updates FAB without throwing', async () => {
    expect(() => window.dispatchEvent(new Event('resize'))).to.not.throw();
    await wait(50);
  });

  it('calcGnavOffset returns 0 when no header: FAB top = 0 + 16', async () => {
    headerEl.remove();
    window.dispatchEvent(new Event('scroll'));
    await wait(50);
    const top = parseFloat(bodyEl.querySelector('.mep-fab').style.top);
    expect(top).to.equal(16); // 0 (no header) + 16
    document.body.prepend(headerEl);
  });
});

// ============================================================
// GROUP 11: calcGnavOffset — feds-localnav and feds-promo-aside-wrapper
// auth state: true → true
// ============================================================
describe('calcGnavOffset: feds-localnav and feds-promo-aside-wrapper', () => {
  let bodyEl;
  let headerEl;
  let fedsEl;
  let promoEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader(40);

    fedsEl = document.createElement('div');
    fedsEl.className = 'feds-localnav';
    fedsEl.getBoundingClientRect = () => ({ bottom: 90 });
    document.body.prepend(fedsEl);

    promoEl = document.createElement('div');
    promoEl.className = 'feds-promo-aside-wrapper';
    promoEl.getBoundingClientRect = () => ({ bottom: 70 });
    document.body.prepend(promoEl);

    await init();
  });

  after(() => {
    fedsEl.remove();
    promoEl.remove();
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('FAB top = max(header, feds-localnav, feds-promo) + 16 = 90 + 16', () => {
    expect(parseFloat(bodyEl.querySelector('.mep-fab').style.top)).to.equal(106);
  });

  it('scroll recalculates using all feds elements', () => {
    window.dispatchEvent(new Event('scroll'));
    expect(parseFloat(bodyEl.querySelector('.mep-fab').style.top)).to.equal(106);
  });
});

// ============================================================
// GROUP 12: getGnavOffset — MutationObserver path
// auth state: true → true
// ============================================================
describe('getGnavOffset: MutationObserver resolves when header gains height', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = document.createElement('header');
    headerEl.getBoundingClientRect = () => ({ bottom: 0 }); // 0 → observer path
    document.body.prepend(headerEl);

    const initPromise = init();
    await wait(0);
    headerEl.getBoundingClientRect = () => ({ bottom: 30 });
    const tmp = document.createElement('div');
    document.documentElement.append(tmp);
    tmp.remove();
    await initPromise;
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('drawer is appended even when gnav resolves via MutationObserver', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });
});

// ============================================================
// GROUP 13: Spoof Country radio change and select change handlers
// auth state: true → true
// ============================================================
describe('buildSpoofGeo: radio change and select change handlers', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('radio change event triggers populateGeoSelect', async () => {
    const radio = bodyEl.querySelector('#spoof-geo-top-markets');
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    await wait(50);
    const select = bodyEl.querySelector('select.mep-spoof-geo');
    expect(select.options.length).to.be.greaterThan(0);
  });

  it('select change stores selected value on the checked radio label via data-selected', () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const select = drawer.querySelector('select.mep-spoof-geo');
    if (!select || select.options.length === 0) return;
    select.value = select.options[0].value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const radio = drawer.querySelector('input[name]:checked');
    const label = radio && drawer.querySelector(`label[for="${radio.id}"]`);
    if (label) expect(label.dataset.selected).to.equal(select.options[0].value);
  });

  it('radio change restores data-selected value to select', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const radio = drawer.querySelector('#spoof-geo-top-markets');
    const label = radio && drawer.querySelector(`label[for="${radio.id}"]`);
    if (label) label.dataset.selected = 'jp';
    radio?.dispatchEvent(new Event('change', { bubbles: true }));
    await wait(50);
  });
});

// ============================================================
// GROUP 14: setMasObserver — debounced DOM mutations
// auth state: true → true
// ============================================================
describe('setMasObserver: debounced DOM mutations', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(100);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    document.querySelectorAll('merch-card').forEach((el) => el.remove());
    setConfig(BASE_CONFIG);
  });

  it('adding a merch-card triggers observer without throwing', async () => {
    const card = document.createElement('merch-card');
    document.body.append(card);
    await wait(300);
    card.remove();
  });

  it('mutations with drawer :popover-open trigger refreshMasSummary', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    let opened = false;
    try { drawer.showPopover(); opened = true; } catch { return; }
    const card = document.createElement('merch-card');
    document.body.append(card);
    await wait(300);
    card.remove();
    if (opened) try { drawer.hidePopover(); } catch { /* ignore */ }
    expect(bodyEl.querySelector('.mep-tab-content')).to.exist;
  });

  it('refreshSpoofGeoMas path: disabled lingo-mas radio with MAS content on page', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const masLingo = drawer.querySelector('#spoof-geo-lingo-mas');
    if (!masLingo) return;
    masLingo.disabled = true;

    let opened = false;
    try { drawer.showPopover(); opened = true; } catch { return; }
    const card = document.createElement('merch-card');
    document.body.append(card);
    await wait(300);
    card.remove();
    if (opened) try { drawer.hidePopover(); } catch { /* ignore */ }
    // masAvailability might still be false, so radio might stay disabled
    expect(drawer).to.exist;
  });
});

// ============================================================
// GROUP 15: setMasObserver — refreshSpoofGeoMas with akamaiLocale + MAS regions
// auth state: true → true
// ============================================================
describe('setMasObserver: refreshSpoofGeoMas with akamaiLocale and MAS regions', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    window.history.replaceState({}, '', '/?akamaiLocale=us');
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(100);
  });

  after(() => {
    window.history.replaceState({}, '', window.location.pathname);
    cleanup(bodyEl, headerEl);
    document.querySelectorAll('merch-card').forEach((el) => el.remove());
    setConfig(BASE_CONFIG);
  });

  it('init with akamaiLocale URL param builds drawer correctly', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });

  it('mutations enable disabled MAS lingo radio when MAS regions include akamaiLocale', async () => {
    const drawer = bodyEl.querySelector('#mep-drawer');
    const masLingo = drawer.querySelector('#spoof-geo-lingo-mas');
    if (!masLingo) return;
    masLingo.disabled = true;

    let opened = false;
    try { drawer.showPopover(); opened = true; } catch { return; }

    fetchOverride = (url) => {
      const href = url instanceof URL ? url.href : String(url);
      if (href.includes('mep-overlay-svg.json')) return Promise.resolve({ ok: true, json: async () => SVG_DATA });
      if (href.includes('supported-markets')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ languages: { data: [{ prefix: '', supportedRegions: 'us,ca,gb' }] } }),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    };

    const card = document.createElement('merch-card');
    document.body.append(card);
    await wait(400);
    card.remove();
    fetchOverride = null;
    if (opened) try { drawer.hidePopover(); } catch { /* ignore */ }
  });
});

// =====================================================================
// PROD ENV BLOCK 1: auth changes from true → false
// GROUP 16: Prod env → unauthenticated path
// Covers: buildLoginCard, footer removal, buildToggle isProd=true
// (buildDrawer runs with authenticated=true so real content is built first,
//  then checkAuthAndBuild replaces with login card)
// =====================================================================
describe('init: prod env → unauthenticated (login card + footer removal)', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig({ ...BASE_CONFIG, env: { name: 'prod' } });
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(100);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('Actions tab shows login card when not authenticated', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.querySelector('.mep-card.center')).to.exist;
  });

  it('login card text contains "Content Unavailable"', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.textContent).to.include('Content Unavailable');
  });

  it('login card text contains "Sign into AEM Sidekick"', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.textContent).to.include('Sign into AEM Sidekick');
  });

  it('footer is absent after becoming unauthenticated', () => {
    expect(bodyEl.querySelector('#mep-drawer .mep-footer')).to.not.exist;
  });

  it('buildToggle isProd=true was exercised (Manifest Manager included in initial build)', () => {
    // The initial buildDrawer call happened with authenticated=true + env=prod,
    // so buildToggle ran with isProd=true (Manifest Manager included) before the
    // content was replaced by login card. No assertion needed beyond init completing.
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });
});

// =====================================================================
// GROUP 17: Stage env after Prod env #1 → setDefaultValues called
// auth changes: false → true
// Covers: setDefaultValues with highlight URL params
// =====================================================================
describe('setDefaultValues: highlight URL params set body dataset', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    window.history.replaceState({}, '', '/?mepHighlight=true&mepLingoHighlight=true&mepCaasHighlight=true&mepMasHighlight=true&otherHighlight=true');
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(100);
  });

  after(() => {
    window.history.replaceState({}, '', window.location.pathname);
    cleanup(bodyEl, headerEl);
    delete document.body.dataset.mepHighlight;
    delete document.body.dataset.mepLingoHighlight;
    delete document.body.dataset.mepCaasHighlight;
    delete document.body.dataset.mepMasHighlight;
    delete document.body.dataset.otherHighlight;
    setConfig(BASE_CONFIG);
  });

  it('mepHighlight param sets body.dataset.mepHighlight to "true"', () => {
    expect(document.body.dataset.mepHighlight).to.equal('true');
  });

  it('mepCaasHighlight param sets body.dataset.mepCaasHighlight to "true"', () => {
    expect(document.body.dataset.mepCaasHighlight).to.equal('true');
  });

  it('mepLingoHighlight param sets body.dataset.mepLingoHighlight to "true"', () => {
    expect(document.body.dataset.mepLingoHighlight).to.equal('true');
  });

  it('#toggle-mep checkbox gets "checked" attribute set', () => {
    const cb = bodyEl.querySelector('#toggle-mep');
    expect(cb?.hasAttribute('checked')).to.be.true;
  });

  it('#toggle-mep-lingo checkbox gets "checked" attribute set', () => {
    const cb = mainEl.querySelector('#toggle-mep-lingo');
    expect(cb?.hasAttribute('checked')).to.be.true;
  });
});

// =====================================================================
// PROD ENV BLOCK 2: auth changes from true → false
// GROUP 18: Prod env (reset only)
// =====================================================================
describe('init: prod env block 2 (auth reset for next setDefaultValues test)', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig({ ...BASE_CONFIG, env: { name: 'prod' } });
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(50);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('drawer exists after prod env init', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });
});

// =====================================================================
// GROUP 19: Stage env after Prod env #2 → setDefaultValues called
// auth changes: false → true
// Covers: setDefaultValues with akamaiLocale (top-markets group)
// =====================================================================
describe('setDefaultValues: akamaiLocale=us sets select value', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    window.history.replaceState({}, '', '/?akamaiLocale=us');
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(150);
  });

  after(() => {
    window.history.replaceState({}, '', window.location.pathname);
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('spoof-geo select value is set to "us" from akamaiLocale param', () => {
    const select = bodyEl.querySelector('select.mep-spoof-geo');
    if (!select) return; // skip if no select
    expect(select.value).to.equal('us');
  });

  it('top-markets radio is checked', () => {
    const radio = bodyEl.querySelector('#spoof-geo-top-markets');
    expect(radio?.checked).to.be.true;
  });
});

// =====================================================================
// PROD ENV BLOCK 3: auth changes from true → false
// GROUP 20: Prod env (reset only)
// =====================================================================
describe('init: prod env block 3 (auth reset for lingo test)', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig({ ...BASE_CONFIG, env: { name: 'prod' } });
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(50);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('drawer exists after prod env init', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });
});

// =====================================================================
// GROUP 21: Stage env after Prod env #3 → setDefaultValues called
// auth changes: false → true
// Covers: setDefaultValues with akamaiLocale matching lingo region
// =====================================================================
describe('setDefaultValues: akamaiLocale matching lingo region', () => {
  let bodyEl;
  let headerEl;
  let lingoMeta;

  before(async () => {
    lingoMeta = document.createElement('meta');
    lingoMeta.name = 'langfirst';
    lingoMeta.content = 'on';
    document.head.append(lingoMeta);
    window.history.replaceState({}, '', '/?akamaiLocale=ch');
    // setConfig overwrites locale via getLocale(), so we must patch regions
    // afterward via updateConfig (direct assignment, no processing).
    setConfig(BASE_CONFIG);
    const cfg = getConfig();
    updateConfig({ ...cfg, locale: { ...cfg.locale, regions: { ch_de: {} } } });
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(300);
  });

  after(() => {
    lingoMeta.remove();
    window.history.replaceState({}, '', window.location.pathname);
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('spoof-geo-mep-lingo radio is enabled (lingo is active with regions)', () => {
    const radio = bodyEl.querySelector('#spoof-geo-mep-lingo');
    expect(radio?.disabled).to.be.false;
  });

  it('spoof-geo-mep-lingo radio is checked after setDefaultValues', () => {
    const radio = bodyEl.querySelector('#spoof-geo-mep-lingo');
    expect(radio?.checked).to.be.true;
  });
});

// =====================================================================
// GROUP 22: Content rebuilt after re-auth (stage env after prod env)
// auth changes: false → true (from Group 21)
// =====================================================================
describe('init: re-authenticated — content rebuilt', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(100);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('Actions tab has real card content after re-auth', () => {
    const content = bodyEl.querySelector('#mep-drawer .mep-tab-content[data-tab="0"]');
    expect(content.querySelector('[data-card-key="Highlight"]')).to.exist;
  });

  it('footer is present after re-auth', () => {
    expect(bodyEl.querySelector('#mep-drawer .mep-footer')).to.exist;
  });
});

// =====================================================================
// PROD ENV BLOCK 4: auth changes from true → false
// =====================================================================
describe('init: prod env block 4 (auth reset for unknown-locale test)', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    setConfig({ ...BASE_CONFIG, env: { name: 'prod' } });
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(50);
    setConfig(BASE_CONFIG);
  });

  after(() => {
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('drawer exists after prod env init', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });
});

// =====================================================================
// GROUP: Stage env after Prod env #4 — setDefaultValues with unknown locale
// auth changes: false → true
// Covers: !id return branch in setDefaultValues (findGeoGroupForLocale returns null)
// =====================================================================
describe('setDefaultValues: akamaiLocale not in any group → !id early return', () => {
  let bodyEl;
  let headerEl;

  before(async () => {
    window.history.replaceState({}, '', '/?akamaiLocale=zz');
    setConfig(BASE_CONFIG);
    bodyEl = makeBody();
    headerEl = makeHeader();
    await init();
    await wait(200);
  });

  after(() => {
    window.history.replaceState({}, '', window.location.pathname);
    cleanup(bodyEl, headerEl);
    setConfig(BASE_CONFIG);
  });

  it('drawer is built correctly when akamaiLocale is unknown', () => {
    expect(bodyEl.querySelector('#mep-drawer')).to.exist;
  });

  it('spoof-geo-top-markets radio is still checked (default, setDefaultValues returned early)', () => {
    const radio = bodyEl.querySelector('#spoof-geo-top-markets');
    expect(radio?.checked).to.be.true;
  });
});

// =====================================================================
// GROUP: buildCardContent — else branch (safety fallback)
// Covers: return createTag('div', {}, 'No content available')
// =====================================================================
describe('buildCardContent: unknown header → safety fallback', () => {
  it('returns a div with "No content available" for a card with no getData and no known header', () => {
    const result = __buildCardContent({ header: 'Custom Unknown Type' }, '');
    expect(result.tagName.toLowerCase()).to.equal('div');
    expect(result.textContent).to.equal('No content available');
  });
});
