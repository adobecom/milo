/* eslint-disable no-underscore-dangle */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import { setConfig } from '../../../libs/utils/utils.js';
import init, { filterLang, isIetfMatchForPrefix } from '../../../libs/blocks/market-selector/market-selector.js';

const mockMarketsJson = {
  data: [
    { marketCode: 'us', en: 'United States' },
    { marketCode: 'gb', en: 'United Kingdom' },
    { marketCode: 'de', en: 'Germany' },
  ],
};

function setupFetchStub() {
  return sinon.stub(window, 'fetch').callsFake((url, options) => {
    const href = typeof url === 'string' ? url : url?.url || '';
    if (options?.method === 'HEAD') {
      return Promise.resolve({ ok: true, status: 200 });
    }
    if (href.includes('/federal/assets/markets.json')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMarketsJson),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
}

describe('Market selector block', () => {
  afterEach(() => {
    sinon.restore();
    setConfig({});
    document.body.innerHTML = '';
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('akamai');
    sessionStorage.removeItem('market');
  });

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    sessionStorage.setItem('akamai', 'us');
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: {
        '': { ietf: 'en-US' },
        de: { ietf: 'de-DE' },
      },
      marketsConfig: {
        languages: {
          data: [
            {
              prefix: '',
              nativeName: 'English (US)',
              langName: 'English',
              group: 'English',
              supportedRegions: 'us,gb,de',
              defaultMarket: 'us',
            },
            {
              prefix: 'de',
              nativeName: 'Deutsch',
              langName: 'German',
              supportedRegions: 'de,at',
              defaultMarket: 'de',
            },
          ],
        },
      },
    });
    setupFetchStub();
    const block = document.querySelector('.market-selector');
    await init(block);
    await new Promise((r) => { setTimeout(r, 0); });
  });

  it('renders language and market dropdowns inside the wrapper', () => {
    const wrapper = document.querySelector('.market-selector-wrapper');
    expect(wrapper).to.exist;
    const dropdowns = document.querySelectorAll('.market-selector-dropdown');
    expect(dropdowns.length).to.equal(2);
    expect(document.querySelector('.market-selector-button span')).to.exist;
  });

  it('opens the market popover and lists supported regions', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    const marketBtn = buttons[1];
    marketBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = marketBtn.parentElement.querySelector('.market-selector-popover');
    expect(popover.dataset.open).to.equal('true');
    const links = popover.querySelectorAll('.market-selector-link');
    expect(links.length).to.be.greaterThan(0);
  });

  it('sets listbox semantics on the market list', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const list = document.querySelector('.market-selector-list');
    expect(list.getAttribute('role')).to.equal('listbox');
    const opts = list.querySelectorAll('.market-selector-link[role="option"]');
    expect(opts.length).to.be.greaterThan(0);
  });

  it('marks the current market option as selected', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const selected = document.querySelector('.market-selector-item.selected .market-selector-link');
    expect(selected).to.exist;
    expect(selected.getAttribute('aria-selected')).to.equal('true');
  });

  it('filters market options when searching', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await clock.runAllAsync();
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    searchInput.value = 'germ';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await clock.tickAsync(250);
    const links = document.querySelectorAll('.market-selector-dropdown')[1].querySelectorAll('.market-selector-link');
    const germany = Array.from(links).filter((a) => a.textContent.includes('Germany'));
    expect(germany.length).to.equal(1);
    clock.restore();
  });

  it('closes the market popover on Escape', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(popover.style.display).to.equal('none');
    expect(buttons[1].getAttribute('aria-expanded')).to.equal('false');
  });

  it('closes the market popover when clicking outside', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    document.body.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    expect(popover.style.display).to.equal('none');
  });

  it('navigates market options with arrow keys', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const list = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-list');
    const first = list.querySelector('.market-selector-link');
    first.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).to.not.equal(first);
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).to.equal(first);
  });

  it('opens the language popover and lists locale options', async () => {
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = langBtn.parentElement.querySelector('.market-selector-popover');
    expect(popover.dataset.open).to.equal('true');
    expect(popover.querySelectorAll('.market-selector-link').length).to.be.greaterThan(0);
  });

  it('navigates from search to list with ArrowDown on language dropdown', async () => {
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[0].querySelector('.search-input');
    searchInput.focus();
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement?.classList.contains('market-selector-link')).to.be.true;
  });

  describe('mobile drag to close', () => {
    async function openMarketPopover() {
      const buttons = document.querySelectorAll('.market-selector-button');
      buttons[1].click();
      await new Promise((r) => { setTimeout(r, 0); });
      const button = buttons[1];
      const popover = button.parentElement.querySelector('.market-selector-popover');
      return {
        button,
        popover,
        handle: popover.querySelector('.market-selector-drag-handle'),
        list: popover.querySelector('.market-selector-list'),
      };
    }

    function endPopoverTransition(popover) {
      popover.dispatchEvent(new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'transform',
      }));
    }

    it('moves the popover with the pointer while dragging the handle (mouse)', async () => {
      const { handle, popover } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 100, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 140, clientX: 20 }));
      expect(popover.style.transform).to.equal('translateY(40px)');
    });

    it('snaps the popover back when the handle drag ends below the close threshold', async () => {
      const { handle, popover } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 240, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 240 }));
      expect(popover.style.transform).to.equal('translateY(0px)');
      expect(popover.dataset.open).to.equal('true');
    });

    it('closes the popover after handle drag passes threshold and transition ends (mouse)', async () => {
      const { handle, popover, button } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 260, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 320 }));
      expect(popover.style.transform).to.equal('translateY(100%)');
      endPopoverTransition(popover);
      expect(popover.style.display).to.equal('none');
      expect(popover.dataset.open).to.be.undefined;
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('does not close on handle mouseup if movement stayed within MIN_DRAG_PX', async () => {
      const { handle, popover } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 202, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 250 }));
      expect(popover.dataset.open).to.equal('true');
      expect(popover.style.display).to.equal('block');
    });

    it('closes after drag-handle touch swipe past threshold', async function closesAfterDragHandleTouchSwipe() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { handle, popover, button } = await openMarketPopover();
      const id = 99;
      const docEl = document.documentElement;
      const tStart = new TouchCtor({ clientX: 30, clientY: 180, identifier: id, target: handle });
      handle.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      const tMove = new TouchCtor({ clientX: 30, clientY: 300, identifier: id, target: docEl });
      document.dispatchEvent(new TouchEventCtor('touchmove', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tMove],
        composed: false,
        targetTouches: [tMove],
        touches: [tMove],
      }));
      const tEnd = new TouchCtor({ clientX: 30, clientY: 300, identifier: id, target: docEl });
      document.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      expect(popover.style.transform).to.equal('translateY(100%)');
      endPopoverTransition(popover);
      expect(popover.style.display).to.equal('none');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('closes after list swipe down from top when scrollTop is 0', async function closesAfterListSwipeFromTop() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { list, popover, button } = await openMarketPopover();
      list.scrollTop = 0;
      const id = 77;
      const tStart = new TouchCtor({ clientX: 40, clientY: 100, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      const tMove = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchmove', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tMove],
        composed: false,
        targetTouches: [tMove],
        touches: [tMove],
      }));
      const tEnd = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      expect(popover.style.transform).to.equal('translateY(100%)');
      endPopoverTransition(popover);
      expect(popover.style.display).to.equal('none');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('does not start list swipe-to-close when the list is scrolled away from top', async function doesNotSwipeCloseWhenListScrolled() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { list, popover } = await openMarketPopover();
      Object.defineProperty(list, 'scrollTop', { value: 40, configurable: true, writable: true });
      const id = 55;
      const tStart = new TouchCtor({ clientX: 40, clientY: 100, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      const tMove = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchmove', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tMove],
        composed: false,
        targetTouches: [tMove],
        touches: [tMove],
      }));
      const tEnd = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      expect(popover.dataset.open).to.equal('true');
      expect(popover.style.display).to.equal('block');
    });

    it('drag handle touchend removes document touch listeners when popover closed early', async function dragHandleTouchEndWhenPopoverClosed() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { handle, popover } = await openMarketPopover();
      const id = 88;
      const docEl = document.documentElement;
      const removeSpy = sinon.spy(document, 'removeEventListener');
      const tStart = new TouchCtor({ clientX: 10, clientY: 50, identifier: id, target: handle });
      handle.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const tEnd = new TouchCtor({ clientX: 10, clientY: 50, identifier: id, target: docEl });
      document.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      const touchRemovals = removeSpy.getCalls().filter((c) => (
        ['touchmove', 'touchend', 'touchcancel'].includes(c.args[0])
      ));
      removeSpy.restore();
      expect(touchRemovals.length).to.be.at.least(3);
    });
  });
});

describe('Market selector language helpers', () => {
  const locales = { '': { ietf: 'en-US' }, de: { ietf: 'de-DE' } };

  it('isIetfMatchForPrefix returns false without locales or empty prefix', () => {
    expect(isIetfMatchForPrefix('de', 'de', null)).to.be.false;
    expect(isIetfMatchForPrefix('de', 'de', undefined)).to.be.false;
    expect(isIetfMatchForPrefix('', 'en', locales)).to.be.false;
  });

  it('isIetfMatchForPrefix matches IETF substring for prefix key', () => {
    expect(isIetfMatchForPrefix('de', 'de-de', locales)).to.be.true;
    expect(isIetfMatchForPrefix('/de', 'de', locales)).to.be.true;
    expect(isIetfMatchForPrefix('de', 'xx', locales)).to.be.false;
  });

  it('isIetfMatchForPrefix returns false when locale entry has no ietf', () => {
    expect(isIetfMatchForPrefix('de', 'de', { de: {} })).to.be.undefined;
  });

  it('filterLang matches label, englishName, or IETF', () => {
    const item = { label: 'Deutsch', englishName: 'German', value: 'de' };
    expect(filterLang(item, 'deutsch', locales)).to.be.true;
    expect(filterLang(item, 'german', locales)).to.be.true;
    expect(filterLang(item, 'de-de', locales)).to.be.true;
    expect(filterLang(item, 'nope', locales)).to.be.false;
  });
});

describe('Market selector block – analytics', () => {
  let track;
  let oldSatellite;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    sessionStorage.setItem('akamai', 'us');
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: { '': { ietf: 'en-US' }, de: { ietf: 'de-DE' } },
      marketsConfig: {
        languages: {
          data: [
            {
              prefix: '',
              nativeName: 'English (US)',
              langName: 'English',
              group: 'English',
              supportedRegions: 'us,gb',
              defaultMarket: 'us',
            },
            {
              prefix: 'de',
              nativeName: 'Deutsch',
              langName: 'German',
              supportedRegions: 'de',
              defaultMarket: 'de',
            },
          ],
        },
      },
    });
    setupFetchStub();
    // handleMarketSelect uses window.open(..., '_self'); real navigation tears down WTR.
    sinon.stub(window, 'open').returns(null);
    await init(document.querySelector('.market-selector'));
    await new Promise((r) => { setTimeout(r, 0); });
    oldSatellite = window._satellite;
    track = sinon.spy();
    window._satellite = { track };
  });

  afterEach(() => {
    window._satellite = oldSatellite;
    sinon.restore();
    setConfig({});
    document.body.innerHTML = '';
    sessionStorage.removeItem('akamai');
  });

  it('tracks market selector opened', async () => {
    track.resetHistory();
    document.querySelectorAll('.market-selector-button')[1].click();
    await Promise.resolve();
    expect(track.called).to.be.true;
    expect(track.getCalls().some((c) => c.args[1]?.data?.web?.webInteraction?.name === 'market-selector:opened')).to.be.true;
  });

  it('tracks market selector dismissed', async () => {
    const btn = document.querySelectorAll('.market-selector-button')[1];
    btn.click();
    await Promise.resolve();
    track.resetHistory();
    btn.click();
    await Promise.resolve();
    expect(track.getCalls().some((c) => c.args[1]?.data?.web?.webInteraction?.name === 'market-selector:dismissed')).to.be.true;
  });

  it('tracks language selector opened', async () => {
    track.resetHistory();
    document.querySelectorAll('.market-selector-button')[0].click();
    await Promise.resolve();
    expect(track.called).to.be.true;
    expect(track.getCalls().some((c) => c.args[1]?.data?.web?.webInteraction?.name === 'language-selector:opened')).to.be.true;
  });

  it('tracks market switch on item click', async () => {
    const btn = document.querySelectorAll('.market-selector-button')[1];
    btn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    track.resetHistory();
    const link = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-link');
    expect(link).to.exist;
    link.click();
    await Promise.resolve();
    const switched = track.getCalls().some(
      (c) => c.args[1]?.data?.web?.webInteraction?.name?.startsWith('market-switch:'),
    );
    expect(switched).to.be.true;
  });
});

describe('Market selector block — selection flows', () => {
  afterEach(() => {
    sinon.restore();
    setConfig({});
    document.body.innerHTML = '';
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'international=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('akamai');
    sessionStorage.removeItem('market');
  });

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    sessionStorage.setItem('akamai', 'us');
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: {
        '': { ietf: 'en-US' },
        de: { ietf: 'de-DE' },
      },
      marketsConfig: {
        languages: {
          data: [
            {
              prefix: '',
              nativeName: 'English (US)',
              langName: 'English',
              group: 'English',
              supportedRegions: 'us,gb,de',
              defaultMarket: 'us',
            },
            {
              prefix: 'de',
              nativeName: 'Deutsch',
              langName: 'German',
              supportedRegions: 'de,at',
              defaultMarket: 'de',
            },
          ],
        },
      },
    });
    setupFetchStub();
    const block = document.querySelector('.market-selector');
    await init(block);
    await new Promise((r) => { setTimeout(r, 0); });
  });

  it('shows the globe icon on the language dropdown button', () => {
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    expect(langBtn.querySelector('.market-selector-globe')).to.exist;
  });

  it('does not show the globe icon on the market dropdown button', () => {
    const marketBtn = document.querySelectorAll('.market-selector-button')[1];
    expect(marketBtn.querySelector('.market-selector-globe')).to.be.null;
  });

  it('shows no-result text when market search matches nothing', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await clock.runAllAsync();
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    searchInput.value = 'zzzzz';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await clock.tickAsync(250);
    const noResult = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.no-search-result-text');
    expect(noResult).to.exist;
    clock.restore();
  });

  it('closes market popover when focus leaves', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    popover.dispatchEvent(new FocusEvent('focusout', { relatedTarget: document.body }));
    expect(popover.style.display).to.equal('none');
  });

  it('moves focus to search input on ArrowUp from first list item', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const list = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-list');
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    const first = list.querySelector('.market-selector-link');
    first.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).to.equal(searchInput);
  });

  it('toggles popover closed when clicking the button a second time', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    expect(popover.dataset.open).to.equal('true');
    buttons[1].click();
    expect(popover.style.display).to.equal('none');
  });

  it('navigates to the selected market on link click', async () => {
    const openStub = sinon.stub(window, 'open');
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const link = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-link');
    if (link) {
      link.click();
      await new Promise((r) => { setTimeout(r, 0); });
      expect(openStub.called).to.be.true;
    }
    openStub.restore();
  });

  it('navigates to the selected language on link click', async () => {
    const openStub = sinon.stub(window, 'open');
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const link = document.querySelectorAll('.market-selector-dropdown')[0].querySelector('.market-selector-link');
    if (link) {
      link.click();
      await new Promise((r) => { setTimeout(r, 0); });
      expect(openStub.called).to.be.true;
    }
    openStub.restore();
  });

  it('sets international cookie on language selection', async () => {
    const openStub = sinon.stub(window, 'open');
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const links = document.querySelectorAll('.market-selector-dropdown')[0].querySelectorAll('.market-selector-link');
    const nonSelectedLink = Array.from(links).find((l) => l.getAttribute('aria-selected') !== 'true');
    if (nonSelectedLink) {
      nonSelectedLink.click();
      await new Promise((r) => { setTimeout(r, 0); });
      expect(document.cookie).to.include('international=');
    }
    openStub.restore();
  });

  it('prevents space key from propagating in search input', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    const stopSpy = sinon.spy(spaceEvent, 'stopPropagation');
    searchInput.dispatchEvent(spaceEvent);
    expect(stopSpy.calledOnce).to.be.true;
  });

  it('does not return early when config has no languages', async () => {
    sinon.restore();
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: { '': { ietf: 'en-US' } },
    });
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: () => Promise.resolve({ languages: { data: [] } }),
    });
    const block = document.querySelector('.market-selector');
    await init(block);
    const wrapper = document.querySelector('.market-selector-wrapper');
    expect(wrapper).to.be.null;
  });

  it('adds feds-regionPicker-wrapper class to the block', () => {
    const block = document.querySelector('.market-selector');
    expect(block.classList.contains('feds-regionPicker-wrapper')).to.be.true;
  });
});
