import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA' });

const { getChatSessionId } = await import('../../../../libs/c2/blocks/brand-concierge/bc-utils.js');
const { bcAnalytics } = await import('../../../../libs/c2/blocks/brand-concierge/bc-analytics.js');

/* eslint-disable no-underscore-dangle */
describe('Brand Concierge back-navigation analytics', () => {
  const SESSION_COOKIE = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_bc_session_id';

  afterEach(() => {
    document.cookie = `${SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    delete window._satellite;
    sinon.restore();
  });

  describe('getChatSessionId', () => {
    it('returns the decoded session id from the cookie', () => {
      document.cookie = `${SESSION_COOKIE}=${encodeURIComponent('sess 123')}; path=/`;
      expect(getChatSessionId()).to.equal('sess 123');
    });

    it('returns an empty string when the cookie is absent', () => {
      expect(getChatSessionId()).to.equal('');
    });
  });

  describe('bcAnalytics navigation:backNavigation', () => {
    it('tracks a back-navigation event with all required fields', () => {
      const track = sinon.spy();
      window._satellite = { track };

      bcAnalytics({
        eventType: 'navigation:backNavigation',
        data: {
          clickType: 'inline_hyperlink',
          sessionId: 'sess-1',
          sourcePage: 'https://www.adobe.com/source',
          destinationPage: 'https://www.adobe.com/dest',
          loginStatus: 'logged-in',
          navigatedBack: true,
        },
      });

      expect(track.calledOnce).to.be.true;
      const [type, payload] = track.firstCall.args;
      expect(type).to.equal('event');
      const eventName = 'BC-chat_inline_hyperlink_back_navigation';
      expect(payload.data.web.webInteraction.name).to.equal(`${eventName}|loginStatus:logged-in`);
      expect(payload.data.bc).to.include({
        eventName,
        sessionId: 'sess-1',
        clickType: 'inline_hyperlink',
        sourcePage: 'https://www.adobe.com/source',
        destinationPage: 'https://www.adobe.com/dest',
        navigatedBack: true,
        loginStatus: 'logged-in',
      });
      expect(payload.data.bc.timestamp).to.be.a('string');
    });

    it('does not track when _satellite is unavailable', () => {
      delete window._satellite;
      expect(() => bcAnalytics({
        eventType: 'navigation:backNavigation',
        data: { clickType: 'cta' },
      })).to.not.throw();
    });
  });

  describe('card:clicked navigation recording', () => {
    it('records the resolved destinationUrl from the event payload', () => {
      const replaceState = sinon.spy(window.history, 'replaceState');

      bcAnalytics({
        eventType: 'card:clicked',
        data: { destinationUrl: 'https://acrobat.adobe.com/pdf-editor?adobe_brand_concierge_source=bc-adobe-product-card' },
      });

      expect(replaceState.calledOnce).to.be.true;
      const [state] = replaceState.firstCall.args;
      expect(state.bcClickType).to.equal('product_card_cta');
      expect(state.bcDestinationPage).to.equal('https://acrobat.adobe.com/pdf-editor?adobe_brand_concierge_source=bc-adobe-product-card');
    });

    it('stores an empty destination without falling back to the referrer', () => {
      const replaceState = sinon.spy(window.history, 'replaceState');

      bcAnalytics({ eventType: 'card:clicked', data: {} });

      const [state] = replaceState.firstCall.args;
      expect(state.bcDestinationPage).to.equal('');
    });
  });

  describe('card analytics formatting', () => {
    it('formats nested product fields and keeps login status only for Firefly clicks', () => {
      const track = sinon.spy();
      window._satellite = { track };

      bcAnalytics({
        eventType: 'cards:rendered',
        data: {
          element: [{
            cardType: 'acomProduct',
            entity_info: {
              productName: 'Acrobat',
              productPageURL: 'https://acrobat.adobe.com/pdf-editor',
            },
          }],
          displayMode: 'single',
        },
      });
      bcAnalytics({
        eventType: 'card:clicked',
        data: {
          element: { cardType: 'acomProduct', loginStatus: 'logged-in', entity_info: { productName: 'Acrobat' } },
          destinationUrl: 'https://acrobat.adobe.com/pdf-editor?adobe_brand_concierge_source=bc-adobe-product-card',
        },
      });
      bcAnalytics({
        eventType: 'card:clicked',
        data: {
          element: {
            type: 'firefly-community-gallery',
            cardType: 'firefly-community-gallery',
            productName: 'Firefly',
            loginStatus: 'logged-in',
          },
          destinationUrl: 'https://firefly.adobe.com',
        },
      });

      const impressionData = track.firstCall.args[1].data;
      const impressions = impressionData._adobe_corpnew.digitalData.primaryEvent.eventInfo
        .interaction.additionalImpressions;
      expect(impressions)
        .to.equal('BC-card|acomProduct|Acrobat|https://acrobat.adobe.com/pdf-editor');
      const productData = track.secondCall.args[1].data;
      expect(productData.web.webInteraction.name).to.equal('BC-card_clicked|acomProduct|Acrobat');
      const productClick = productData._adobe_corpnew.digitalData.primaryEvent.eventInfo
        .interaction.click;
      expect(productClick)
        .to.equal('BC-card|acomProduct|Acrobat|https://acrobat.adobe.com/pdf-editor?adobe_brand_concierge_source=bc-adobe-product-card');
      const fireflyData = track.thirdCall.args[1].data;
      expect(fireflyData.web.webInteraction.name)
        .to.equal('BC-card_clicked|firefly-community-gallery|Firefly|loginStatus:logged-in');
    });
  });
});
/* eslint-enable no-underscore-dangle */
