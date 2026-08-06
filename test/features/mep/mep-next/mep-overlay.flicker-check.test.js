import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../../libs/utils/utils.js');

const SVG_DATA = {
  svg: {
    'icon-close': '<svg><path/></svg>',
    'icon-expand-circle-down': '<svg><path/></svg>',
    'icon-radio-checked': '<svg><path/></svg>',
    'icon-radio-unchecked': '<svg><path/></svg>',
    'icon-mep': '<svg><path/></svg>',
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

setConfig(BASE_CONFIG);

const fetchStub = sinon.stub(window, 'fetch').callsFake((url) => {
  const href = url instanceof URL ? url.href : String(url);
  if (href.includes('mep-overlay-svg.json')) {
    return Promise.resolve({ ok: true, json: async () => SVG_DATA });
  }
  if (href.includes('supported-markets')) {
    return Promise.resolve({ ok: true, json: async () => ({ languages: { data: [] } }) });
  }
  return Promise.resolve({ ok: false, status: 404, json: async () => ({}), text: async () => '' });
});

const { default: init } = await import('../../../../libs/features/mep/mep-next/mep-overlay/mep-overlay.js');

after(() => fetchStub.restore());

function makeMain() {
  const el = document.createElement('main');
  document.body.prepend(el);
  return el;
}

function makeHeader(bottom = 50) {
  const el = document.createElement('header');
  el.getBoundingClientRect = () => ({ bottom });
  document.body.prepend(el);
  return el;
}

const wait = (ms = 0) => new Promise((r) => { setTimeout(r, ms); });

describe('mep-drawer idle flicker check', () => {
  it('does not mutate #mep-drawer style/attrs while idle (no scroll/resize/DOM changes)', async () => {
    const mainEl = makeMain();
    const headerEl = makeHeader(50);
    await init();
    await wait(150);

    const drawer = mainEl.querySelector('#mep-drawer');
    expect(drawer).to.exist;
    try { drawer.showPopover(); } catch { /* jsdom/older engines */ }
    await wait(150);

    let attrMutations = 0;
    let childMutations = 0;
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes') attrMutations += 1;
        if (m.type === 'childList') childMutations += 1;
      });
    });
    obs.observe(drawer, { attributes: true, attributeFilter: ['style', 'class'], childList: true, subtree: true });

    let rafCalls = 0;
    const origRaf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => {
      rafCalls += 1;
      return origRaf(cb);
    };

    // Idle window: no scroll, no resize, no synthetic DOM mutation triggered by us.
    await wait(3000);

    obs.disconnect();
    window.requestAnimationFrame = origRaf;

    // eslint-disable-next-line no-console
    console.log(`[flicker-check] attrMutations=${attrMutations} childMutations=${childMutations} rafCallsScheduled=${rafCalls}`);

    expect(attrMutations, 'unexpected attribute mutations on #mep-drawer while idle').to.equal(0);
    expect(childMutations, 'unexpected child mutations on #mep-drawer while idle').to.equal(0);
    expect(rafCalls, 'unexpected requestAnimationFrame scheduling while idle').to.equal(0);

    try { drawer.hidePopover(); } catch { /* jsdom/older engines */ }
    mainEl.remove();
    headerEl.remove();
    document.querySelectorAll('#mep-drawer, .mep-fab').forEach((el) => el.remove());
  }).timeout(6000);

  it('does not rebuild the M@S summary DOM when a re-rendering merch-card leaves the count unchanged', async () => {
    const mainEl = makeMain();
    const headerEl = makeHeader(50);
    await init();
    await wait(150);

    const drawer = mainEl.querySelector('#mep-drawer');
    try { drawer.showPopover(); } catch { /* jsdom/older engines */ }
    await wait(150);

    // Switch to the Summary tab so the M@S card body exists in the DOM.
    drawer.querySelector('.mep-tab[data-tab="1"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await wait(50);

    const masBody = drawer.querySelector('[data-card-key="M@S"] .mep-card-body');
    expect(masBody).to.exist;

    let childMutations = 0;
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((m) => { if (m.type === 'childList') childMutations += 1; });
    });
    obs.observe(masBody, { childList: true });

    // Establish a baseline: one real merch-card on the page (count 0 -> 1),
    // a genuine data change that must rebuild the summary once.
    let currentCard = document.createElement('merch-card');
    document.body.append(currentCard);
    await wait(300);
    expect(childMutations, 'baseline card add should rebuild the summary once').to.equal(1);

    // Simulate a component that re-renders itself (swaps its own element for a
    // new one) several times, the way a web component often does on updates.
    // The merch-card COUNT never actually changes (always exactly 1) because
    // the old node is removed in the same tick the new one is added.
    for (let i = 0; i < 5; i += 1) {
      const nextCard = document.createElement('merch-card');
      document.body.append(nextCard);
      currentCard.remove();
      currentCard = nextCard;
      // eslint-disable-next-line no-await-in-loop
      await wait(250);
    }

    obs.disconnect();

    // eslint-disable-next-line no-console
    console.log(`[flicker-check] M@S card-body childList mutations after 5 no-op merch-card swaps=${childMutations}`);

    expect(childMutations, 'M@S summary DOM rebuilt even though the data never changed').to.equal(1);

    mainEl.remove();
    headerEl.remove();
    document.querySelectorAll('#mep-drawer, .mep-fab, merch-card').forEach((el) => el.remove());
  }).timeout(8000);

  it('does not restyle #mep-drawer on repeated scroll events when the gnav offset is unchanged', async () => {
    const mainEl = makeMain();
    const headerEl = makeHeader(50);
    await init();
    await wait(150);

    const drawer = mainEl.querySelector('#mep-drawer');
    try { drawer.showPopover(); } catch { /* jsdom/older engines */ }
    await wait(150);

    let attrMutations = 0;
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((m) => { if (m.type === 'attributes') attrMutations += 1; });
    });
    obs.observe(drawer, { attributes: true, attributeFilter: ['style'] });

    // Simulate a scroll storm (as happens during a real touch/wheel scroll)
    // against a header whose bottom never actually changes (e.g. a
    // position: sticky header already pinned at top: 0).
    for (let i = 0; i < 30; i += 1) {
      window.dispatchEvent(new Event('scroll'));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => { requestAnimationFrame(r); });
    }
    await wait(50);

    obs.disconnect();

    // eslint-disable-next-line no-console
    console.log(`[flicker-check] #mep-drawer style mutations from 30 no-op scroll events=${attrMutations}`);

    expect(attrMutations, '#mep-drawer restyled even though the gnav offset never changed').to.equal(0);

    try { drawer.hidePopover(); } catch { /* jsdom/older engines */ }
    mainEl.remove();
    headerEl.remove();
    document.querySelectorAll('#mep-drawer, .mep-fab').forEach((el) => el.remove());
  }).timeout(8000);
});
