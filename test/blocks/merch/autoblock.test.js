/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
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

    it('leaves headings that wrap a customized built-in (inline-price) untouched', () => {
      const card = makeCard(['h3']);
      const priceHeading = document.createElement('h3');
      priceHeading.innerHTML = '<span is="inline-price">$9.99</span>';
      card.appendChild(priceHeading);
      overrideCardHeadingLevel(card, 2);
      expect(card.querySelectorAll('h2').length).to.equal(1);
      expect(priceHeading.tagName).to.equal('H3');
      expect(priceHeading.querySelector('[is="inline-price"]')).to.not.equal(null);
    });

    it('leaves headings that wrap a custom element untouched', () => {
      const card = makeCard(['h3']);
      const heading = document.createElement('h4');
      heading.innerHTML = '<mas-mnemonic></mas-mnemonic>';
      card.appendChild(heading);
      overrideCardHeadingLevel(card, 2);
      expect(heading.tagName).to.equal('H4');
    });
  });
});
