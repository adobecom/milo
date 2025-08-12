/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { handleCustomAnalyticsEvent, cleanupTabsAnalytics, enableAnalytics, postProcessAutoblock } from '../../../libs/blocks/merch/autoblock.js';

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
  });
});
