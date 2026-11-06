/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setViewport } from '@web/test-runner-commands';
import { setConfig } from '../../../libs/utils/utils.js';
import { waitFor } from '../../helpers/waitfor.js';
import { handleCustomAnalyticsEvent, cleanupTabsAnalytics, enableAnalytics, postProcessAutoblock, overrideCardHeadingLevel } from '../../../libs/blocks/merch/autoblock.js';
import { getMerchCardHeadingLevel } from '../../../libs/blocks/merch/merch.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
setConfig({ locales, miloLibs: '/libs' });

describe('autoblock', () => {
  let satellite;

  beforeEach(() => {
    satellite = { track: sinon.spy() };
    window._satellite = satellite;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('modal link localization', () => {
    const modalPath = '/test/fragments/modals/test-modal';
    const modalHash = '#test-modal';
    const previewOrigin = 'https://main--test--adobecom.aem.page';

    afterEach(() => {
      setConfig({ locales, miloLibs: '/libs' });
    });

    [
      { locale: 'de', origin: previewOrigin },
      { locale: 'br', origin: previewOrigin },
      { locale: '', origin: previewOrigin },
      { locale: 'de', origin: '' },
      { locale: 'br', origin: '' },
      { locale: 'de', origin: previewOrigin, authoredPrefix: '/de' },
      { locale: 'de', origin: previewOrigin, dnt: true },
      { locale: 'br', origin: previewOrigin, dnt: true },
      { locale: 'de', origin: previewOrigin, storedDnt: true },
    ].forEach(({ locale, origin, authoredPrefix = '', dnt = false, storedDnt = false }) => {
      it(`${dnt || storedDnt ? 'does not localize' : 'localizes'} ${origin ? 'absolute' : 'relative'} modal links for ${locale || 'US'}${authoredPrefix ? ' without duplicating the locale' : ''}${dnt ? ' with #_dnt' : ''}${storedDnt ? ' with data-has-dnt' : ''}`, async () => {
        setConfig({
          locales: { ...locales, de: { ietf: 'de-DE' }, br: { ietf: 'pt-BR' } },
          pathname: locale ? `/${locale}/test-page.html` : '/test-page.html',
          codeRoot: '/libs',
          miloLibs: '/libs',
        });
        const card = document.createElement('merch-card');
        const link = document.createElement('a');
        link.href = `${origin}${authoredPrefix}${modalPath}${modalHash}${dnt ? '#_dnt' : ''}`;
        if (storedDnt) link.dataset.hasDnt = 'true';
        link.textContent = 'Test modal';
        card.append(link);
        card.checkReady = sinon.stub().resolves(true);

        await postProcessAutoblock(card, true);
        await waitFor(() => card.hasAttribute('data-analytics-id') && link.dataset.blockStatus === 'loaded');

        const expectedPrefix = locale && !dnt && !storedDnt ? `/${locale}` : '';
        expect(link.dataset.modalPath).to.equal(`${expectedPrefix}${modalPath}`);
        expect(link.getAttribute('href')).to.equal(modalHash);
        if (dnt || storedDnt) expect(link.dataset.hasDnt).to.equal('true');
      });
    });

    [
      { marker: '#_mep-lingo', flag: 'mepLingo' },
      { marker: '#_mep-lingo-insert', flag: 'mepLingoInsert' },
      { marker: '#_mep-lingo-remove', flag: 'mepLingoRemove' },
    ].forEach(({ marker, flag }) => {
      it(`preserves ${marker} metadata when localizing a preview modal link`, async () => {
        setConfig({
          locales: { ...locales, de: { ietf: 'de-DE' } },
          pathname: '/de/test-page.html',
          codeRoot: '/libs',
          miloLibs: '/libs',
        });
        const card = document.createElement('merch-card');
        const link = document.createElement('a');
        const originalHref = `${previewOrigin}${modalPath}${modalHash}`;
        link.href = `${originalHref}${marker}`;
        link.textContent = 'Test modal';
        card.append(link);
        card.checkReady = sinon.stub().resolves(true);

        await postProcessAutoblock(card, true);
        await waitFor(() => card.hasAttribute('data-analytics-id') && link.dataset.blockStatus === 'loaded');

        expect({ ...link.dataset }).to.include({ mepLingo: 'true', originalHref, [flag]: 'true' });
        expect(link.dataset.modalPath).to.equal(`/de${modalPath}`);
        expect(link.getAttribute('href')).to.equal(modalHash);
      });
    });
  });

  describe('handleCustomAnalyticsEvent', () => {
    it('should track analytics event with daa-lh hierarchy', () => {
      const element = document.createElement('div');
      element.setAttribute('daa-lh', 'level1');

      const parent = document.createElement('div');
      parent.setAttribute('daa-lh', 'level2');
      parent.appendChild(element);

      handleCustomAnalyticsEvent('test-event', element);
      expect(satellite.track.called).to.be.true;
      const { name } = satellite.track.args[0][1].data.web.webInteraction;
      expect(name).to.equal('test-event|level2|level1');
    });

    it('should handle element without daa-lh', () => {
      const element = document.createElement('div');
      handleCustomAnalyticsEvent('test-event', element);
      expect(satellite.track.called).to.be.false;
    });
  });

  describe('enableAnalytics', () => {
    it('should enable analytics for merch cards', async () => {
      const card = document.createElement('merch-card');
      card.setAttribute('daa-lh', 'test-card');
      const link = document.createElement('a');
      link.setAttribute('daa-ll', 'test-link');
      card.appendChild(link);

      // Mock checkReady method
      card.checkReady = sinon.stub().resolves();

      cleanupTabsAnalytics(card);
      enableAnalytics(card);

      expect(card.getAttribute('data-analytics-id')).to.equal('test-card');
      expect(card.hasAttribute('daa-lh')).to.be.false;
      expect(link.getAttribute('daa-ll')).to.equal('test-link--test-card--card');
    });

    it('should handle tabs context', async () => {
      const tabs = document.createElement('div');
      tabs.className = 'tabs';
      const block = document.createElement('div');
      block.setAttribute('data-block', 'true');
      const card = document.createElement('merch-card');
      block.appendChild(card);
      tabs.appendChild(block);
      document.body.appendChild(tabs);

      // Mock checkReady method
      card.checkReady = sinon.stub().resolves();

      cleanupTabsAnalytics(card);
      enableAnalytics(card);

      expect(block.hasAttribute('data-block')).to.be.false;

      // Cleanup
      document.body.removeChild(tabs);
    });

    it('should handle tabpanel context', async () => {
      const tab = document.createElement('div');
      tab.className = 'tabs';
      const tabpanel = document.createElement('div');
      tab.appendChild(tabpanel);
      tabpanel.className = 'tabpanel';
      tabpanel.setAttribute('data-nested-lh', 'T1Ind');
      const card = document.createElement('merch-card');
      tabpanel.appendChild(card);

      // Mock checkReady method
      card.checkReady = sinon.stub().resolves();

      cleanupTabsAnalytics(card);
      enableAnalytics(card);

      expect(tabpanel.getAttribute('daa-lh')).to.equal('T1Ind--tab');
    });

    it('should handle multiple cards', async () => {
      const container = document.createElement('div');
      const card1 = document.createElement('merch-card');
      const card2 = document.createElement('merch-card');

      // Mock checkReady methods
      card1.checkReady = sinon.stub().resolves();
      card2.checkReady = sinon.stub().resolves();

      container.appendChild(card1);
      container.appendChild(card2);

      postProcessAutoblock(container, false);

      expect(card1.checkReady.called).to.be.true;
      expect(card2.checkReady.called).to.be.true;
    });

    it('should load badge icons when card has merch-badge with sp-icon', async () => {
      const container = document.createElement('div');
      const card = document.createElement('merch-card');
      const badge = document.createElement('merch-badge');
      badge.setAttribute('icon', 'sp-icon-star');
      card.appendChild(badge);
      card.checkReady = sinon.stub().resolves();
      container.appendChild(card);

      // should not throw even though icons-workflow.js doesn't exist in test env
      await postProcessAutoblock(container, false);
      expect(card.checkReady.called).to.be.true;
    });

    it('should not reload badge icons on subsequent calls', async () => {
      const container = document.createElement('div');
      const card = document.createElement('merch-card');
      const badge = document.createElement('merch-badge');
      badge.setAttribute('icon', 'sp-icon-star');
      card.appendChild(badge);
      card.checkReady = sinon.stub().resolves();
      container.appendChild(card);

      // second call — iconsLoaded flag prevents re-import
      await postProcessAutoblock(container, false);
      expect(card.checkReady.called).to.be.true;
    });

    it('should not load badge icons when no sp-icon badges exist', async () => {
      const container = document.createElement('div');
      const card = document.createElement('merch-card');
      const badge = document.createElement('merch-badge');
      badge.setAttribute('icon', 'https://example.com/icon.png');
      card.appendChild(badge);
      card.checkReady = sinon.stub().resolves();
      container.appendChild(card);

      await postProcessAutoblock(container, false);
      expect(card.checkReady.called).to.be.true;
    });
  });

  describe('getMerchCardHeadingLevel', () => {
    afterEach(() => {
      document.head.querySelectorAll('meta[name="mas-heading-level"]').forEach((m) => m.remove());
    });

    const setMeta = (content) => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'mas-heading-level');
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    };

    it('returns null when nothing is set', () => {
      expect(getMerchCardHeadingLevel()).to.equal(null);
    });

    it('reads a numeric metadata value', () => {
      setMeta('2');
      expect(getMerchCardHeadingLevel()).to.equal(2);
    });

    it('reads an h-prefixed metadata value', () => {
      setMeta('H4');
      expect(getMerchCardHeadingLevel()).to.equal(4);
    });

    it('returns null for out-of-range or invalid values', () => {
      setMeta('7');
      expect(getMerchCardHeadingLevel()).to.equal(null);
      document.head.querySelector('meta[name="mas-heading-level"]').setAttribute('content', 'foo');
      expect(getMerchCardHeadingLevel()).to.equal(null);
    });
  });

  describe('overrideCardHeadingLevel', () => {
    const makeCard = (tags) => {
      const card = document.createElement('merch-card');
      tags.forEach((tag) => {
        const h = document.createElement(tag);
        h.textContent = tag;
        h.setAttribute('slot', `heading-${tag}`);
        card.appendChild(h);
      });
      return card;
    };

    it('shifts all headings by the delta, preserving relative structure', () => {
      const card = makeCard(['h3', 'h4', 'h4']);
      overrideCardHeadingLevel(card, 2);
      const levels = [...card.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName);
      expect(levels).to.deep.equal(['H2', 'H3', 'H3']);
    });

    it('preserves attributes and content when swapping', () => {
      const card = makeCard(['h3']);
      overrideCardHeadingLevel(card, 2);
      const heading = card.querySelector('h2');
      expect(heading.getAttribute('slot')).to.equal('heading-h3');
      expect(heading.textContent).to.equal('h3');
    });

    it('clamps to a maximum of h6', () => {
      const card = makeCard(['h3', 'h5']);
      overrideCardHeadingLevel(card, 5);
      const levels = [...card.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName);
      expect(levels).to.deep.equal(['H5', 'H6']);
    });

    it('is idempotent across repeated calls', () => {
      const card = makeCard(['h3', 'h4']);
      overrideCardHeadingLevel(card, 2);
      overrideCardHeadingLevel(card, 2);
      const levels = [...card.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName);
      expect(levels).to.deep.equal(['H2', 'H3']);
    });

    it('does nothing when there are no headings', () => {
      const card = document.createElement('merch-card');
      expect(() => overrideCardHeadingLevel(card, 2)).to.not.throw();
    });

    it('preserves the original tag styling inline after swapping', () => {
      const style = document.createElement('style');
      style.textContent = 'merch-card h4 { font-weight: 400; font-size: 14px; }';
      document.head.appendChild(style);
      const card = makeCard(['h3', 'h4']);
      document.body.appendChild(card);
      overrideCardHeadingLevel(card, 2);
      const heading = card.querySelector('h3');
      expect(heading.style.fontWeight).to.equal('400');
      expect(heading.style.fontSize).to.equal('14px');
      style.remove();
      card.remove();
    });

    it('preserves icon-dependent heading layout and original content', () => {
      const style = document.createElement('style');
      style.textContent = `
        merch-card[variant="pro"] [slot="whats-included"] h4:has(> svg, > .sp-icon, > merch-icon) {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `;
      const card = makeCard(['h3']);
      card.setAttribute('variant', 'pro');
      const included = document.createElement('div');
      included.setAttribute('slot', 'whats-included');
      included.innerHTML = '<h4><svg></svg>Apps</h4><h4><span class="sp-icon"></span>Creative AI</h4><h4>Extras</h4>';
      const icons = [...included.querySelectorAll('svg, .sp-icon')];
      card.appendChild(included);
      document.head.appendChild(style);
      document.body.appendChild(card);
      try {
        overrideCardHeadingLevel(card, 2);
        const headings = [...included.querySelectorAll('h3')];
        headings.slice(0, 2).forEach((heading, index) => {
          expect(heading.style.display).to.equal('flex');
          expect(heading.style.alignItems).to.equal('center');
          expect(heading.style.gap).to.equal('4px');
          expect(heading.firstElementChild).to.equal(icons[index]);
        });
        expect(headings[2].style.display).to.equal('block');
        expect(included.children.length).to.equal(3);
      } finally {
        style.remove();
        card.remove();
      }
    });

    it('preserves icon layout while resizing heading typography in both directions', async () => {
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const style = document.createElement('style');
      style.textContent = `
        merch-card h3 { font-size: 24px; }
        merch-card h3:has(> svg) { display: flex; align-items: center; gap: 4px; }
        @media (max-width: 767px) {
          merch-card h3 { font-size: 18px; }
        }
      `;
      const card = makeCard(['h3']);
      card.firstElementChild.innerHTML = '<svg></svg>Creative Cloud Pro';
      document.head.appendChild(style);
      document.body.appendChild(card);
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      try {
        await setViewport({ width: 1200, height: 800 });
        overrideCardHeadingLevel(card, 2);
        const heading = card.querySelector('h2');
        expect(heading.style.fontSize).to.equal('24px');
        for (const width of [600, 1200]) {
          await setViewport({ width, height: 800 });
          window.dispatchEvent(new Event('resize'));
          clock.tick(150);
          expect(heading.style.fontSize).to.equal(width === 600 ? '18px' : '24px');
          expect(heading.style.display).to.equal('flex');
          expect(heading.style.alignItems).to.equal('center');
          expect(heading.style.gap).to.equal('4px');
          expect(card.querySelectorAll('svg').length).to.equal(1);
        }
      } finally {
        clock.restore();
        style.remove();
        card.remove();
        await setViewport(viewport);
      }
    });

    it('debounces the resize style sync by 150ms', async () => {
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const style = document.createElement('style');
      style.textContent = `
        merch-card h3 { font-size: 24px; }
        @media (max-width: 767px) { merch-card h3 { font-size: 18px; } }
      `;
      const card = makeCard(['h3']);
      document.head.appendChild(style);
      document.body.appendChild(card);
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldClearNativeTimers: true });
      try {
        await setViewport({ width: 1200, height: 800 });
        overrideCardHeadingLevel(card, 2);
        const heading = card.querySelector('h2');
        expect(heading.style.fontSize).to.equal('24px');
        await setViewport({ width: 600, height: 800 });
        window.dispatchEvent(new Event('resize'));
        clock.tick(100);
        window.dispatchEvent(new Event('resize'));
        clock.tick(100);
        expect(heading.style.fontSize).to.equal('24px');
        clock.tick(50);
        expect(heading.style.fontSize).to.equal('18px');
      } finally {
        clock.restore();
        style.remove();
        card.remove();
        await setViewport(viewport);
      }
    });

    // Records the inline style of every heading each time a probe's computed style is read, so a
    // write landing between two reads (a forced style recalc per read) can be detected.
    const recordProbeReads = () => {
      const reads = [];
      const realGetComputedStyle = window.getComputedStyle.bind(window);
      const stub = sinon.stub(window, 'getComputedStyle').callsFake((el, ...args) => {
        const computed = realGetComputedStyle(el, ...args);
        if (!el.hasAttribute?.('data-mas-orig-level') || el.style.position !== 'absolute') return computed;
        return new Proxy(computed, {
          get(target, prop) {
            if (typeof prop === 'string') {
              reads.push([...document.querySelectorAll('[data-mas-orig-level]')]
                .filter((h) => !h.style.position)
                .map((h) => h.style.cssText));
            }
            const value = Reflect.get(target, prop, target);
            return typeof value === 'function' ? value.bind(target) : value;
          },
        });
      });
      return { reads, restore: () => stub.restore() };
    };

    it('reads every heading probe before writing any heading style', () => {
      const style = document.createElement('style');
      style.textContent = `
        merch-card h3 { font-size: 20px; }
        merch-card h4 { font-size: 14px; }
        merch-card h5 { font-size: 12px; }
      `;
      const card = makeCard(['h3', 'h4', 'h5']);
      document.head.appendChild(style);
      document.body.appendChild(card);
      const recorder = recordProbeReads();
      try {
        overrideCardHeadingLevel(card, 2);
        expect(recorder.reads.length).to.be.greaterThan(0);
        recorder.reads.forEach((inlineStyles) => {
          expect(inlineStyles).to.deep.equal(['', '', '']);
        });
        const headings = [...card.querySelectorAll('h1,h2,h3,h4,h5,h6')];
        expect(headings.map((h) => h.tagName)).to.deep.equal(['H2', 'H3', 'H4']);
        expect(headings.map((h) => h.style.fontSize)).to.deep.equal(['20px', '14px', '12px']);
        expect(card.children.length).to.equal(3);
      } finally {
        recorder.restore();
        style.remove();
        card.remove();
      }
    });

    it('resyncs the headings of every card in a single read-then-write pass on resize', async () => {
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const style = document.createElement('style');
      style.textContent = `
        merch-card h3 { font-size: 24px; }
        @media (max-width: 767px) { merch-card h3 { font-size: 18px; } }
      `;
      const cards = [makeCard(['h3', 'h3']), makeCard(['h3'])];
      document.head.appendChild(style);
      cards.forEach((card) => document.body.appendChild(card));
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      let recorder;
      try {
        await setViewport({ width: 1200, height: 800 });
        cards.forEach((card) => overrideCardHeadingLevel(card, 2));
        const headings = cards.flatMap((card) => [...card.querySelectorAll('h2')]);
        expect(headings.length).to.equal(3);
        const before = headings.map((h) => h.style.cssText);
        expect(headings.map((h) => h.style.fontSize)).to.deep.equal(['24px', '24px', '24px']);
        await setViewport({ width: 600, height: 800 });
        recorder = recordProbeReads();
        window.dispatchEvent(new Event('resize'));
        clock.tick(150);
        expect(recorder.reads.length).to.be.greaterThan(0);
        recorder.reads.forEach((inlineStyles) => {
          expect(inlineStyles).to.deep.equal(before);
        });
        expect(headings.map((h) => h.style.fontSize)).to.deep.equal(['18px', '18px', '18px']);
        cards.forEach((card) => expect(card.children.length).to.equal(card.querySelectorAll('h2').length));
      } finally {
        recorder?.restore();
        clock.restore();
        style.remove();
        cards.forEach((card) => card.remove());
        await setViewport(viewport);
      }
    });

    it('removes every probe even when measuring fails', () => {
      const card = makeCard(['h3', 'h4']);
      document.body.appendChild(card);
      const stub = sinon.stub(window, 'getComputedStyle').throws(new Error('measure failed'));
      try {
        expect(() => overrideCardHeadingLevel(card, 2)).to.throw('measure failed');
        expect(card.children.length).to.equal(2);
      } finally {
        stub.restore();
        card.remove();
      }
    });

    it('swaps the tag of a heading wrapping a customized built-in (inline-price), preserving content', () => {
      const card = makeCard(['h3']);
      const priceHeading = document.createElement('h3');
      priceHeading.innerHTML = '<span is="inline-price">$9.99</span>';
      card.appendChild(priceHeading);
      overrideCardHeadingLevel(card, 2);
      const swapped = card.querySelectorAll('h2');
      expect(swapped.length).to.equal(2);
      const price = card.querySelector('[is="inline-price"]');
      expect(price).to.not.equal(null);
      expect(price.closest('h2')).to.not.equal(null);
    });

    it('swaps the tag of a heading wrapping a custom element, preserving content', () => {
      const card = makeCard(['h3']);
      const heading = document.createElement('h4');
      heading.innerHTML = '<mas-mnemonic></mas-mnemonic>';
      card.appendChild(heading);
      overrideCardHeadingLevel(card, 2);
      const custom = card.querySelector('mas-mnemonic');
      expect(custom).to.not.equal(null);
      expect(custom.closest('h3')).to.not.equal(null);
    });
  });
});
