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
});
/* eslint-enable no-underscore-dangle */
