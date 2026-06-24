import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../../libs/utils/utils.js');

const config = {
  miloLibs: 'https://main--milo--adobecom.aem.live/libs',
  codeRoot: 'https://main--homepage--adobecom.aem.live/homepage',
  locale: { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '', region: 'us' },
  mep: { experiments: [], prefix: '', highlight: true, targetEnabled: true },
  env: { name: 'stage' },
};

setConfig(config);

const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true, status: 200, json: async () => ({}), text: async () => '' });

const {
  default: initHighlight,
  HIGHLIGHT_KEYS,
  TOGGLE_KEYS,
  toggleHighlight,
  getParameters,
  setBadgeEventListeners,
  getPageUpdates,
} = await import('../../../../libs/features/mep/mep-next/mep-overlay/mep-overlay-highlight.js');

after(() => fetchStub.restore());

describe('HIGHLIGHT_KEYS', () => {
  it('has mep, caas, mas, and other keys', () => {
    expect(HIGHLIGHT_KEYS).to.have.keys('mep', 'caas', 'mas', 'other');
  });

  it('mep key maps to "mepHighlight"', () => {
    expect(HIGHLIGHT_KEYS.mep).to.equal('mepHighlight');
  });

  it('caas key maps to "mepCaasHighlight"', () => {
    expect(HIGHLIGHT_KEYS.caas).to.equal('mepCaasHighlight');
  });

  it('mas key maps to "mepMasHighlight"', () => {
    expect(HIGHLIGHT_KEYS.mas).to.equal('mepMasHighlight');
  });

  it('other key maps to "otherHighlight"', () => {
    expect(HIGHLIGHT_KEYS.other).to.equal('otherHighlight');
  });
});

describe('TOGGLE_KEYS', () => {
  it('has mep, caas, mas, and other keys', () => {
    expect(TOGGLE_KEYS).to.have.keys('mep', 'caas', 'mas', 'other');
  });

  it('mep key maps to "toggle-mep"', () => {
    expect(TOGGLE_KEYS.mep).to.equal('toggle-mep');
  });

  it('caas key maps to "toggle-caas"', () => {
    expect(TOGGLE_KEYS.caas).to.equal('toggle-caas');
  });

  it('mas key maps to "toggle-mas"', () => {
    expect(TOGGLE_KEYS.mas).to.equal('toggle-mas');
  });

  it('other key maps to "toggle-other-fragments"', () => {
    expect(TOGGLE_KEYS.other).to.equal('toggle-other-fragments');
  });
});

describe('getParameters', () => {
  afterEach(() => window.history.replaceState({}, '', window.location.pathname));

  it('returns null/undefined values when URL has no relevant params', () => {
    window.history.replaceState({}, '', '/');
    const params = getParameters();
    expect(params.mepAkamaiLocale).to.be.null;
    expect(params.mepHighlight).to.be.null;
    expect(params.mepCaasHighlight).to.be.null;
    expect(params.mepMasHighlight).to.be.null;
    expect(params.mepOtherHighlight).to.be.null;
  });

  it('returns mepAkamaiLocale from the akamaiLocale URL param', () => {
    window.history.replaceState({}, '', '/?akamaiLocale=de');
    expect(getParameters().mepAkamaiLocale).to.equal('de');
  });

  it('returns mepHighlight from the mepHighlight URL param', () => {
    window.history.replaceState({}, '', '/?mepHighlight=true');
    expect(getParameters().mepHighlight).to.equal('true');
  });

  it('returns mepCaasHighlight from the mepCaasHighlight URL param', () => {
    window.history.replaceState({}, '', '/?mepCaasHighlight=true');
    expect(getParameters().mepCaasHighlight).to.equal('true');
  });

  it('returns mepMasHighlight from the mepMasHighlight URL param', () => {
    window.history.replaceState({}, '', '/?mepMasHighlight=true');
    expect(getParameters().mepMasHighlight).to.equal('true');
  });

  it('returns mepOtherHighlight from the otherHighlight URL param', () => {
    window.history.replaceState({}, '', '/?otherHighlight=true');
    expect(getParameters().mepOtherHighlight).to.equal('true');
  });

  it('reads multiple params simultaneously', () => {
    window.history.replaceState({}, '', '/?akamaiLocale=fr&mepHighlight=true');
    const params = getParameters();
    expect(params.mepAkamaiLocale).to.equal('fr');
    expect(params.mepHighlight).to.equal('true');
  });
});

describe('toggleHighlight', () => {
  function makeEvent(id, checked) {
    return { target: { id, checked } };
  }

  afterEach(() => {
    delete document.body.dataset.mepHighlight;
    delete document.body.dataset.otherHighlight;
    delete document.body.dataset.mepCaasHighlight;
    delete document.body.dataset.mepMasHighlight;
  });

  it('sets document.body.dataset.mepHighlight to "true" when mep checkbox is checked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.mep, true));
    expect(document.body.dataset.mepHighlight).to.equal('true');
  });

  it('sets document.body.dataset.mepHighlight to "false" when mep checkbox is unchecked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.mep, false));
    expect(document.body.dataset.mepHighlight).to.equal('false');
  });

  it('sets document.body.dataset.otherHighlight to "true" when other checkbox is checked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.other, true));
    expect(document.body.dataset.otherHighlight).to.equal('true');
  });

  it('sets document.body.dataset.otherHighlight to "false" when other checkbox is unchecked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.other, false));
    expect(document.body.dataset.otherHighlight).to.equal('false');
  });

  it('sets mepCaasHighlight on the body when caas checkbox is checked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.caas, true));
    expect(document.body.dataset.mepCaasHighlight).to.equal('true');
  });

  it('sets mepCaasHighlight to "false" when caas checkbox is unchecked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.caas, false));
    expect(document.body.dataset.mepCaasHighlight).to.equal('false');
  });

  it('sets mepMasHighlight on the body when mas checkbox is checked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.mas, true));
    expect(document.body.dataset.mepMasHighlight).to.equal('true');
  });

  it('sets mepMasHighlight to "false" when mas checkbox is unchecked', () => {
    toggleHighlight(makeEvent(TOGGLE_KEYS.mas, false));
    expect(document.body.dataset.mepMasHighlight).to.equal('false');
  });

  it('does nothing when the event target id has no matching handler', () => {
    toggleHighlight(makeEvent('unknown-id', true));
    expect(document.body.dataset.mepHighlight).to.be.undefined;
    expect(document.body.dataset.otherHighlight).to.be.undefined;
  });
});

describe('getPageUpdates', () => {
  afterEach(() => {
    document.querySelectorAll(
      '[data-manifest-id], [data-code-manifest-id], [data-mep-lingo-fallback], [data-mep-lingo-roc], [data-removed-manifest-id], [data-caas-block], [data-fragment-default], .mep-toggle-text',
    ).forEach((el) => el.remove());
  });

  it('returns "0 Page Updates" for MEP label when no MEP elements exist', () => {
    expect(getPageUpdates('MEP')).to.equal('0 Page Updates');
  });

  it('returns "0 Page Updates" for Caas label when no Caas elements exist', () => {
    expect(getPageUpdates('Caas')).to.equal('0 Page Updates');
  });

  it('returns "0 Page Updates" for Other Fragments when no [data-fragment-default] elements exist', () => {
    expect(getPageUpdates('Other Fragments')).to.equal('0 Page Updates');
  });

  it('returns "0 Page Updates" for an unknown label (no matching selector)', () => {
    expect(getPageUpdates('Unknown Label')).to.equal('0 Page Updates');
  });

  it('counts [data-manifest-id] elements for the MEP label', () => {
    const el = document.createElement('div');
    el.setAttribute('data-manifest-id', 'test-manifest');
    document.body.append(el);
    expect(getPageUpdates('MEP')).to.equal('1 Page Updates');
  });

  it('counts [data-caas-block] elements for the Caas label', () => {
    const el = document.createElement('div');
    el.setAttribute('data-caas-block', 'test');
    document.body.append(el);
    expect(getPageUpdates('Caas')).to.equal('1 Page Updates');
  });

  it('counts [data-fragment-default] elements for the Other Fragments label', () => {
    const el = document.createElement('div');
    el.setAttribute('data-fragment-default', '');
    document.body.append(el);
    expect(getPageUpdates('Other Fragments')).to.equal('1 Page Updates');
  });

  it('updates the associated .mep-toggle-text value element via MutationObserver', async () => {
    const container = document.createElement('div');
    container.className = 'mep-toggle-text';
    const h2 = document.createElement('h2');
    h2.textContent = 'MEP';
    const valueEl = document.createElement('p');
    valueEl.className = 'mep-row-value';
    valueEl.textContent = '0 Page Updates';
    container.append(h2, valueEl);
    document.body.append(container);

    getPageUpdates('MEP');

    const manifestEl = document.createElement('div');
    manifestEl.setAttribute('data-manifest-id', 'observer-test');
    document.body.append(manifestEl);

    await new Promise((r) => { setTimeout(r, 50); });

    expect(valueEl.textContent).to.equal('1 Page Updates');
    manifestEl.remove();
  });

  it('does not update value element when text already matches the new count', async () => {
    const container = document.createElement('div');
    container.className = 'mep-toggle-text';
    const h2 = document.createElement('h2');
    h2.textContent = 'MEP';
    const valueEl = document.createElement('p');
    valueEl.className = 'mep-row-value';
    valueEl.textContent = '0 Page Updates';
    container.append(h2, valueEl);
    document.body.append(container);

    getPageUpdates('MEP');

    const unrelated = document.createElement('span');
    document.body.append(unrelated);

    await new Promise((r) => { setTimeout(r, 50); });

    expect(valueEl.textContent).to.equal('0 Page Updates');
    unrelated.remove();
  });
});

describe('setBadgeEventListeners', () => {
  let windowOpenStub;
  let getComputedStyleStub;
  let testEl;
  const originalGetComputedStyle = window.getComputedStyle;

  before(() => {
    setBadgeEventListeners();
  });

  beforeEach(() => {
    windowOpenStub = sinon.stub(window, 'open');
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') {
        return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      }
      return originalGetComputedStyle(el, pseudo);
    });
  });

  afterEach(() => {
    windowOpenStub.restore();
    getComputedStyleStub.restore();
    testEl?.remove();
    testEl = null;
  });

  function makeFragment(attrs = {}) {
    const el = document.createElement('div');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });
    document.body.append(el);
    return el;
  }

  function click(el, clientX = 10, clientY = 10) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX, clientY }));
  }

  it('opens window with data-path when clicking inside the badge area of a [data-manifest-id] element', () => {
    testEl = makeFragment({ 'data-manifest-id': 'my-manifest', 'data-path': '/fragments/test' });
    click(testEl, 10, 10);
    expect(windowOpenStub.calledOnce).to.be.true;
    expect(windowOpenStub.firstCall.args[0]).to.equal('/fragments/test');
    expect(windowOpenStub.firstCall.args[1]).to.equal('_blank');
  });

  it('opens window for [data-mep-lingo-roc] elements', () => {
    testEl = makeFragment({ 'data-mep-lingo-roc': 'roc: /lu_fr/test', 'data-path': '/fr/test' });
    click(testEl, 50, 10);
    expect(windowOpenStub.calledOnce).to.be.true;
  });

  it('opens window for [data-mep-lingo-fallback] elements', () => {
    testEl = makeFragment({ 'data-mep-lingo-fallback': 'fallback: /fr/test', 'data-path': '/fr/fallback' });
    click(testEl, 50, 10);
    expect(windowOpenStub.calledOnce).to.be.true;
  });

  it('opens window for [data-fragment-default] elements', () => {
    testEl = makeFragment({ 'data-fragment-default': '', 'data-path': '/fragments/default' });
    click(testEl, 10, 10);
    expect(windowOpenStub.calledOnce).to.be.true;
  });

  it('does NOT open window when click is to the right of the badge area', () => {
    testEl = makeFragment({ 'data-manifest-id': 'my-manifest', 'data-path': '/fragments/test' });
    click(testEl, 250, 10);
    expect(windowOpenStub.called).to.be.false;
  });

  it('does NOT open window when click is below the badge area', () => {
    testEl = makeFragment({ 'data-manifest-id': 'my-manifest', 'data-path': '/fragments/test' });
    click(testEl, 10, 50);
    expect(windowOpenStub.called).to.be.false;
  });

  it('does NOT open window when the element has no fragment selector attribute', () => {
    testEl = document.createElement('div');
    testEl.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });
    document.body.append(testEl);
    click(testEl, 10, 10);
    expect(windowOpenStub.called).to.be.false;
  });

  it('does NOT open window when the element has no data-path (fragmentPath is undefined)', () => {
    testEl = makeFragment({ 'data-manifest-id': 'no-path' });
    click(testEl, 10, 10);
    expect(windowOpenStub.called).to.be.false;
  });

  it('does NOT open window when the ::before badge has display:none', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') {
        return { display: 'none', content: '"badge"', width: '170px', height: '35px' };
      }
      return originalGetComputedStyle(el, pseudo);
    });
    testEl = makeFragment({ 'data-manifest-id': 'hidden-badge', 'data-path': '/fragments/test' });
    click(testEl, 10, 10);
    expect(windowOpenStub.called).to.be.false;
  });

  it('does NOT open window when the ::before badge has content:none', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') {
        return { display: 'block', content: 'none', width: '170px', height: '35px' };
      }
      return originalGetComputedStyle(el, pseudo);
    });
    testEl = makeFragment({ 'data-manifest-id': 'no-content-badge', 'data-path': '/fragments/test' });
    click(testEl, 10, 10);
    expect(windowOpenStub.called).to.be.false;
  });

  it('respects a non-zero ::before top when computing the badge area', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') {
        return { display: 'block', content: '"badge"', width: '170px', height: '35px', top: '20px' };
      }
      return originalGetComputedStyle(el, pseudo);
    });

    testEl = makeFragment({ 'data-manifest-id': 'offset-badge', 'data-path': '/fragments/test' });

    click(testEl, 10, 10);
    expect(windowOpenStub.called).to.be.false;

    click(testEl, 10, 25);
    expect(windowOpenStub.calledOnce).to.be.true;
  });

  it('uses data-fragment-path when data-path is absent', () => {
    testEl = makeFragment({ 'data-manifest-id': 'my-manifest', 'data-fragment-path': '/fragments/via-fragment-path' });
    click(testEl, 10, 10);
    expect(windowOpenStub.calledOnce).to.be.true;
    expect(windowOpenStub.firstCall.args[0]).to.equal('/fragments/via-fragment-path');
  });

  it('opens window for display:contents fragment with no children when click is inside badge width', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return { display: 'contents' };
    });
    testEl = makeFragment({ 'data-manifest-id': 'contents-no-child', 'data-path': '/contents-no-child' });
    click(testEl, 10, 0);
    expect(windowOpenStub.calledOnce).to.be.true;
  });

  it('does NOT open window for display:contents fragment with no children when click is outside badge width', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return { display: 'contents' };
    });
    testEl = makeFragment({ 'data-manifest-id': 'contents-wide', 'data-path': '/contents-wide' });
    click(testEl, 250, 0);
    expect(windowOpenStub.called).to.be.false;
  });

  it('opens window for display:contents fragment when click hits the child badge area', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return { display: 'contents' };
    });
    testEl = makeFragment({ 'data-manifest-id': 'contents-child', 'data-path': '/contents-child' });
    const child = document.createElement('div');
    child.style.height = '10px';
    child.getBoundingClientRect = () => ({ top: 100, left: 0 });
    testEl.append(child);
    click(testEl, 50, 70);
    expect(windowOpenStub.calledOnce).to.be.true;
  });

  it('does NOT open window for display:contents when click misses all child badge areas', () => {
    getComputedStyleStub.restore();
    getComputedStyleStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return { display: 'contents' };
    });
    testEl = makeFragment({ 'data-manifest-id': 'contents-miss', 'data-path': '/contents-miss' });
    const child = document.createElement('div');
    child.style.height = '10px';
    child.getBoundingClientRect = () => ({ top: 100, left: 0 });
    testEl.append(child);
    click(testEl, 50, 200);
    expect(windowOpenStub.called).to.be.false;
  });
});

describe('init (default export)', () => {
  let windowOpenStub2;
  let gcsStub;
  const originalGCS = window.getComputedStyle;
  let persistEl;

  before(async () => {
    persistEl = document.createElement('div');
    persistEl.setAttribute('data-path', '/test-default-fragment');
    document.body.append(persistEl);
    setConfig({ ...config, mep: { prefix: '', highlight: true } });
    await initHighlight();
    setConfig(config);
  });

  after(() => {
    persistEl?.remove();
    persistEl = null;
  });

  beforeEach(() => {
    windowOpenStub2 = sinon.stub(window, 'open');
    gcsStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return originalGCS(el, pseudo);
    });
  });

  afterEach(() => {
    windowOpenStub2.restore();
    gcsStub.restore();
    delete document.body.dataset.mepHighlight;
    delete document.body.dataset.mepFragments;
    delete document.body.dataset.mepCaasHighlight;
    document.querySelectorAll('[data-manifest-id]').forEach((el) => el.remove());
    setConfig(config);
  });

  it('init completes without throwing', () => {
    expect(initHighlight).to.be.a('function');
  });

  it('setDefaultFragments marks [data-path] elements without manifest or lingo data', () => {
    expect(persistEl.dataset.fragmentDefault).to.equal('');
    expect(persistEl.dataset.fragmentDisplay).to.equal('/test-default-fragment');
  });

  it('setDefaultFragments skips elements that already have data-manifest-id', async () => {
    const el = document.createElement('div');
    el.setAttribute('data-path', '/skip-me');
    el.setAttribute('data-manifest-id', 'existing');
    document.body.append(el);
    setConfig({ ...config, mep: { prefix: '', highlight: true } });
    await initHighlight();
    expect(el.dataset.fragmentDefault).to.be.undefined;
    el.remove();
  });

  it('setBadgeHandlers: exercises isAnyHighlightEnabled when highlight is disabled', () => {
    const fragment = document.createElement('div');
    fragment.setAttribute('data-manifest-id', 'no-highlight');
    fragment.setAttribute('data-path', '/no-highlight');
    fragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });
    document.body.append(fragment);
    fragment.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    fragment.remove();
  });

  it('setBadgeHandlers: opens window when mepHighlight is enabled and click is in badge area', () => {
    document.body.dataset.mepHighlight = 'true';
    const fragment = document.createElement('div');
    fragment.setAttribute('data-manifest-id', 'handler-open');
    fragment.setAttribute('data-path', '/handler-open-path');
    fragment.getBoundingClientRect = () => ({ top: 0, left: 0, width: 500, height: 100 });
    document.body.append(fragment);
    fragment.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    expect(windowOpenStub2.called).to.be.true;
    fragment.remove();
  });

  it('setBadgeHandlers: does not open window when click is inside .mep-preview-overlay', () => {
    document.body.dataset.mepHighlight = 'true';
    const overlay = document.createElement('div');
    overlay.className = 'mep-preview-overlay';
    const btn = document.createElement('button');
    overlay.append(btn);
    document.body.append(overlay);
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    expect(windowOpenStub2.called).to.be.false;
    overlay.remove();
  });

  it('setBadgeHandlers display:contents with visible child: calls clickHitsBadgeInContents', () => {
    document.body.dataset.mepHighlight = 'true';
    gcsStub.restore();
    gcsStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return { display: 'contents' };
    });
    const fragment = document.createElement('div');
    fragment.setAttribute('data-manifest-id', 'contents-handler');
    fragment.setAttribute('data-path', '/contents-handler-path');
    fragment.getBoundingClientRect = () => ({ top: 0, left: 0 });
    const child = document.createElement('div');
    child.style.height = '10px';
    child.getBoundingClientRect = () => ({ top: 100, left: 0 });
    fragment.append(child);
    document.body.append(fragment);
    fragment.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 50, clientY: 70 }));
    expect(windowOpenStub2.called).to.be.true;
    fragment.remove();
  });

  it('setBadgeHandlers display:contents with no visible children: clientX < badgeWidth → opens', () => {
    document.body.dataset.mepHighlight = 'true';
    gcsStub.restore();
    gcsStub = sinon.stub(window, 'getComputedStyle').callsFake((el, pseudo) => {
      if (pseudo === '::before') return { display: 'block', content: '"badge"', width: '170px', height: '35px' };
      return { display: 'contents' };
    });
    const fragment = document.createElement('div');
    fragment.setAttribute('data-manifest-id', 'contents-nochild-handler');
    fragment.setAttribute('data-path', '/nochild-handler');
    document.body.append(fragment);
    fragment.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 50, clientY: 10 }));
    expect(windowOpenStub2.called).to.be.true;
    fragment.remove();
  });
});

describe('setHighlightData via init (with experiments)', () => {
  let fragmentEl; let pathEl; let noPathEl; let blockEl; let sectionEl; let
    headerEl;

  before(async () => {
    fragmentEl = document.createElement('div');
    fragmentEl.setAttribute('data-path', '/test-frag/page');
    document.body.append(fragmentEl);

    pathEl = document.createElement('div');
    pathEl.dataset.manifestId = 'test-manifest.json';
    pathEl.dataset.path = '/pre-path';
    document.body.append(pathEl);

    noPathEl = document.createElement('div');
    noPathEl.dataset.manifestId = 'test-manifest.json';
    document.body.append(noPathEl);

    blockEl = document.createElement('div');
    blockEl.className = 'my-block';
    document.body.append(blockEl);

    headerEl = document.createElement('header');
    document.body.append(headerEl);

    sectionEl = document.createElement('div');
    sectionEl.className = 'section merch-cards';
    const fragDiv = document.createElement('div');
    fragDiv.className = 'fragment';
    fragDiv.dataset.manifestId = 'test-manifest.json';
    const card = document.createElement('merch-card');
    fragDiv.append(card);
    sectionEl.append(fragDiv);
    document.body.append(sectionEl);

    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          manifest: '/test-manifest.json',
          selectedVariant: {
            replacefragment: [{ val: '/test-frag' }],
            useblockcode: [{ selector: 'my-block' }, { selector: '' }],
            updatemetadata: [{ selector: 'gnav-source' }, { selector: 'title' }],
          },
        }],
      },
    });
    await initHighlight();
    setConfig(config);
  });

  after(() => {
    [fragmentEl, pathEl, noPathEl, blockEl, sectionEl, headerEl].forEach((el) => el?.remove());
  });

  it('replacefragment branch sets manifestId, fragmentPath, and manifestDisplay on matching element', () => {
    expect(fragmentEl.dataset.manifestId).to.equal('test-manifest.json');
    expect(fragmentEl.dataset.fragmentPath).to.equal('/test-frag');
    expect(fragmentEl.dataset.manifestDisplay).to.include('test-manifest.json');
  });

  it('useblockcode sets codeManifestId (prop !== manifestId) and skips manifestDisplay', () => {
    expect(blockEl.dataset.codeManifestId).to.equal('test-manifest.json');
    expect(blockEl.dataset.manifestDisplay).to.be.undefined;
  });

  it('updatemetadata gnav-source sets manifestId and manifestDisplay on header/footer', () => {
    expect(headerEl.dataset.manifestId).to.equal('test-manifest.json');
    expect(headerEl.dataset.manifestDisplay).to.include('test-manifest.json');
  });

  it('merch-card inside merch-cards section fragment gets manifestId set', () => {
    expect(sectionEl.querySelector('merch-card').dataset.manifestId).to.equal('test-manifest.json');
  });

  it('final querySelectorAll: element with data-path but no manifestDisplay gets fragmentPath and manifestDisplay', () => {
    expect(pathEl.dataset.fragmentPath).to.equal('/pre-path');
    expect(pathEl.dataset.manifestDisplay).to.include('test-manifest.json');
  });

  it('final querySelectorAll: element without data-path gets mepHtmlBadge and manifestDisplay set', () => {
    expect(noPathEl.dataset.mepHtmlBadge).to.equal('true');
    expect(noPathEl.dataset.manifestDisplay).to.equal('test-manifest.json: html');
  });
});
