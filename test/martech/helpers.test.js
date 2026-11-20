import { expect } from 'chai';
import sinon from 'sinon';
import {
  getVisitorStatus,
  loadAnalyticsAndInteractionData,
  startEarlyTargetInteraction,
  startTargetInteraction,
} from '../../libs/martech/helpers.js';

describe('loadAnalyticsAndInteractionData', () => {
  beforeEach(() => {
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        handle: [
          {
            type: 'personalization:decisions',
            payload: [{ decisionId: '1', proposition: 'Test Proposition' }],
          },
        ],
      }),
    });
  });

  afterEach(() => {
    delete window.fetch;
  });

  it('should fetch and return the proposition data', async () => {
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        handle: [
          {
            type: 'personalization:decisions',
            payload: [
              {
                decisionId: '1',
                proposition: 'Test Proposition',
                items: [{
                  data: {
                    id: '901343',
                    format: 'application/json',
                  },
                },
                ],
              },
            ],
          },
        ],
      }),
    });
    const result = await loadAnalyticsAndInteractionData({
      locale: { ietf: 'en-US', prefix: 'us' },
      env: 'prod',
      calculatedTimeout: 10000,
    });

    expect(result.result.propositions).to.have.lengthOf(1);
    expect(result.type).to.be.equal('pageView');
  });

  it('should handle consent cookie being set to "out"', async () => {
    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 10000,
      });
    } catch (err) {
      expect(err.message).to.equal('Consent Cookie doesnt allow interact');
    }
  });

  it('should handle fetch failure gracefully', async () => {
    window.fetch = () => Promise.reject(new Error('Network error'));

    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 10000,
      });
    } catch (err) {
      expect(err.message).to.equal('Error: Network error');
    }
  });

  it('should handle timeout errors correctly', async () => {
    window.fetch = () => new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 2000);
    });

    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 1000,
      });
    } catch (err) {
      expect(err.message).to.equal('Error: Request timed out');
    }
  });

  it('should handle missing handle in the response', async () => {
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });

    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 10000,
      });
    } catch (err) {
      expect(err.message).to.be.string;
    }
  });

  it('should return the correct target property for non-prod environments', async () => {
    const result = await loadAnalyticsAndInteractionData({
      locale: { ietf: 'en-US', prefix: 'us' },
      env: 'dev',
      calculatedTimeout: 10000,
    });

    expect(result.result.propositions).to.have.lengthOf(1);
  });

  it('should return the correct target property for prod environment', async () => {
    const result = await loadAnalyticsAndInteractionData({
      locale: { ietf: 'en-US', prefix: 'us' },
      env: 'prod',
      calculatedTimeout: 10000,
    });

    expect(result.result.propositions).to.have.lengthOf(1);
  });

  it('should handle different screen orientations', async () => {
    window.getDeviceInfo = () => ({
      screenWidth: 1920,
      screenHeight: 1080,
      screenOrientation: 'portrait',
      viewportWidth: 800,
      viewportHeight: 600,
    });

    const result = await loadAnalyticsAndInteractionData({
      locale: { ietf: 'en-US', prefix: 'us' },
      env: 'prod',
      calculatedTimeout: 10000,
    });

    expect(result.result.propositions).to.have.lengthOf(1);
  });

  it('should generate a new FPID when ECID is not present', async () => {
    window.innerWidth = 234;
    window.innerHeight = 1234;
    const data = {
      handle: [
        {
          type: 'personalization:decisions',
          payload: [
            {
              id: '12345',
              namespace: { code: 'ECID' },
            },
            {
              id: '67890',
              namespace: { code: 'Other' },
            },
          ],
        },
        {
          type: 'user:profile',
          payload: [
            {
              id: '98765',
              namespace: { code: 'ECID' },
            },
            {
              id: '54321',
              namespace: { code: 'Other' },
            },
          ],
        },
        {
          type: 'session:info',
          payload: [
            {
              id: '11223',
              namespace: { code: 'ECID' },
            },
          ],
        },
      ],
    };
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await loadAnalyticsAndInteractionData({
      locale: { ietf: 'en-US', prefix: 'us' },
      env: 'prod',
      calculatedTimeout: 10000,
    });

    expect(result.result.propositions).to.have.lengthOf(2);
  });

  it('should handle targetResp.ok as false and throw an error', async () => {
    window.fetch = () => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    });
    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 10000,
      });

      expect.fail('Error: Failed to fetch interact call');
    } catch (err) {
      expect(err.message).to.equal('Error: Failed to fetch interact call');
    }
  });

  it('should handle targetRespwhen no prepositions are there', async () => {
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        handle: [
          {
            type: 'personalization:decisions',
            payload: [],
          },
          {
            type: 'other:type',
            payload: [
              { decisionId: '3', proposition: 'Other Proposition' },
            ],
          },
        ],
      }),
    });
    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 10000,
      });
    } catch (err) {
      expect(err.message).to.equal('Error: No propositions found');
    }
  });

  it('should handle cookies update on api payload', async () => {
    document.cookie = 'AMCV_9E1005A551ED61CA0A490D45%40AdobeOrg=65550139393016453617222570753620662484';
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        handle: [
          {
            type: 'personalization:decisions',
            payload: [],
          },
          {
            payload: [
              {
                id: '65550139393016453617222570753620662484',
                namespace: { code: 'ECID' },
              },
            ],
            type: 'identity:result',
          },
          {
            payload: [
              {
                key: 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_cluster',
                value: 'irl1',
                maxAge: 1800,
                attrs: { SameSite: 'None' },
              },
              {
                key: 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_identity',
                value: 'CiY2NTU1MDEzOTM5MzAxNjQ1MzYxNzIyMjU3MDc1MzYyMDY2MjQ4NFIRCOHA5pvHMhgCKgRJUkwxMAPwAeHA5pvHMg==',
                maxAge: 34128000,
                attrs: { SameSite: 'None' },
              },
            ],
            type: 'state:store',
          },
        ],
      }),
    });
    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 10000,
      });
    } catch (err) {
      expect(err.message).to.equal('Error: No propositions found');
    }
  });

  it('should throw error when cookie prohibits it', async () => {
    document.cookie = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent=general=out';

    try {
      await loadAnalyticsAndInteractionData({
        locale: { ietf: 'en-US', prefix: 'us' },
        env: 'prod',
        calculatedTimeout: 1000,
      });
    } catch (err) {
      expect(err.message).to.equal('Consent Cookie doesnt allow interact');
    }

    document.cookie = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent=general=in';
  });

  describe('getVisitorStatus', () => {
    let getCookieStub;
    let setCookieStub;
    let clock;

    const mockCurrentTime = (time) => {
      clock = sinon.useFakeTimers({ now: time, toNow: 'date' });
    };

    beforeEach(() => {
      getCookieStub = sinon.stub().returns('');
      setCookieStub = sinon.stub();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should return "New" and set a new cookie when no cookie exists', () => {
      mockCurrentTime(new Date('2025-01-01T00:00:00Z'));

      const result = getVisitorStatus({
        getCookie: getCookieStub,
        setCookie: setCookieStub,
      });

      expect(result).to.equal('New');
    });

    it('should return "New" when cookie exists and is within 30 minutes of being set', () => {
      mockCurrentTime(new Date('2025-01-01T00:29:00Z'));

      getCookieStub.returns('1704084000000-New');

      const result = getVisitorStatus({
        getCookie: getCookieStub,
        setCookie: setCookieStub,
      });

      expect(result).to.equal('New');
    });

    it('should return "Repeat" when cookie exists and is older than 30 minutes', () => {
      mockCurrentTime(new Date('2025-01-01T01:01:00Z'));

      getCookieStub.returns('1704084000000-New');

      const result = getVisitorStatus({
        getCookie: getCookieStub,
        setCookie: setCookieStub,
      });

      expect(result).to.equal('Repeat');
    });
  });
});

describe('v2 Target from the consumer head', () => {
  const originalGetEntriesByType = window.performance.getEntriesByType;
  const originalUrl = window.location.href;
  const metas = [];
  let interactCalls;

  const setMeta = (md) => Object.entries(md).forEach(([name, content]) => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.head.append(meta);
    metas.push(meta);
  });
  const clearMeta = () => metas.splice(0).forEach((meta) => meta.remove());
  const setServerTiming = (serverTiming) => {
    window.performance.getEntriesByType = (type) => (type === 'navigation'
      ? [{ serverTiming }] : originalGetEntriesByType.call(window.performance, type));
  };

  beforeEach(() => {
    interactCalls = 0;
    window.fetch = (url) => {
      if (String(url).includes('/interact')) interactCalls += 1;
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ handle: [] }) });
    };
    delete window.milo?.targetInteraction;
    setServerTiming([]);
  });

  afterEach(() => {
    clearMeta();
    delete window.fetch;
    delete window.milo?.targetInteraction;
    window.performance.getEntriesByType = originalGetEntriesByType;
    window.history.replaceState({}, '', originalUrl);
  });

  it('starts one interact call that the utils.js path reuses', async () => {
    setMeta({ 'personalization-v2': 'on', target: 'on' });
    const headPromise = startEarlyTargetInteraction();
    const utilsPromise = startTargetInteraction({ locale: { prefix: '' }, env: 'stage', calculatedTimeout: 4000 });

    expect(headPromise).to.be.a('promise');
    expect(utilsPromise).to.equal(headPromise);
    expect(window.milo.targetInteraction.source).to.equal('head');
    const result = await utilsPromise;
    expect(result).to.have.keys('targetInteractionData', 'respTime', 'respStartTime');
    expect(interactCalls).to.equal(1);
  });

  it('does nothing when utils.js would not start a v2 call', async () => {
    setMeta({ 'personalization-v2': 'on' });
    expect(startEarlyTargetInteraction()).to.be.null;
    setMeta({ target: 'on' });
    setServerTiming([{ name: 'sis', description: '1' }]);
    expect(startEarlyTargetInteraction()).to.be.null;
    expect(window.milo?.targetInteraction).to.be.undefined;
    expect(interactCalls).to.equal(0);
  });

  it('leaves unmapped locale-shaped prefixes to utils.js', () => {
    setMeta({ 'personalization-v2': 'on', target: 'on' });
    window.history.replaceState({}, '', `/xx_zz/page${window.location.search}`);
    expect(startEarlyTargetInteraction()).to.be.null;
    expect(window.milo?.targetInteraction).to.be.undefined;
  });

  it('logs when the configured locale differs from the head locale', async () => {
    setMeta({ 'personalization-v2': 'on', target: 'on' });
    window.lana = { log: sinon.spy() };
    const headPromise = startEarlyTargetInteraction();
    startTargetInteraction({ locale: { prefix: '/de' }, env: 'stage', calculatedTimeout: 4000 });
    expect(window.lana.log.calledOnce).to.be.true;
    await headPromise;
    delete window.lana;
  });

  describe('gate parity with utils.js', () => {
    const PARAMS = ['', 'mep=off', 'martech=off', 'target=off', 'target=postlcp', 'xlg=loggedout',
      'personalization-v2=off', 'personalization-v2=on', 'target-timeout=1234', 'env=prod', 'env=bogus'];
    const METAS = [
      {}, { target: 'on' }, { 'personalization-v2': 'on' },
      { 'personalization-v2': 'on', target: 'on' },
      { 'personalization-v2': 'on', target: 'off' },
      { 'personalization-v2': 'on', target: 'postlcp' },
      { 'personalization-v2': 'off', target: 'on' },
      { 'personalization-v2': 'on', xlg: 'loggedout' },
      { 'personalization-v2': 'on', target: 'on', 'target-timeout': '2500' },
    ];
    const TIMINGS = [
      [],
      [{ name: 'sis', description: '0' }],
      [{ name: 'sis', description: '1' }],
      [{ name: 'geo', description: 'DE' }],
      [{ name: 'geo', description: 'us' }, { name: 'sis', description: '0' }],
    ];

    PARAMS.forEach((param, i) => {
      it(`matches utils.js with ?${param || '(none)'}`, async () => {
        const url = new URL(originalUrl);
        if (param) url.search += `${url.search ? '&' : '?'}${param}`;
        window.history.replaceState({}, '', url);
        // Fresh module instances so both read this URL at load, as on a real page.
        const head = await import(`../../libs/martech/helpers.js?parity=${i}`);
        const utils = await import(`../../libs/utils/utils.js?parity=${i}`);
        expect(head.getEnvName()).to.equal(utils.getEnv({}).name);

        METAS.forEach((md) => TIMINGS.forEach((timing) => {
          clearMeta();
          setMeta(md);
          setServerTiming(timing);
          const label = `${param} ${JSON.stringify(md)} ${JSON.stringify(timing)}`;
          expect(head.shouldStartTargetV2(), label).to.equal(utils.shouldStartTargetV2());
          expect(head.getTargetTimeout(), label).to.equal(utils.getTargetTimeout());

          const country = (setCountry) => {
            sessionStorage.removeItem('akamai');
            sessionStorage.removeItem('feds_location');
            setCountry();
            return [sessionStorage.getItem('akamai'), sessionStorage.getItem('feds_location')];
          };
          expect(country(head.setCountry), label).to.deep.equal(country(utils.setCountry));
        }));
        sessionStorage.removeItem('akamai');
        sessionStorage.removeItem('feds_location');
      });
    });
  });
});
