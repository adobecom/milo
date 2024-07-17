import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

import { getConfig, createTag } from '../../../libs/utils/utils.js';
import {
  appendScriptTag,
  ADOBECOM_MATCHER,
  HLX_MATCHER,
  PATHNAME_MATCHER,
  parseAdobeUrl,
  sha256,
  calcAdobeUrlHash,
} from '../../../libs/features/seotech/seotech.js';

describe('HLX_MATCHER ', () => {
  const tests = [
    {
      url: 'https://main--milo--adobecom.hlx.live/',
      expected: [
        'main--milo--adobecom.hlx.live',
        'main',
        'milo',
        'adobecom',
        'live',
      ],
    },
    {
      url: 'https://MWPW-123456--milo--hparra.hlx.page/',
      expected: [
        'MWPW-123456--milo--hparra.hlx.page',
        'MWPW-123456',
        'milo',
        'hparra',
        'page',
      ],
    },
    {
      url: 'https://www.adobe.com/',
      expected: null,
    },
  ];
  tests.forEach(({ url, expected }) => {
    it(`should parse ${url}`, () => {
      const parsed = url.match(HLX_MATCHER);
      expect(parsed).deep.to.equal(expected);
    });
  });
});

describe('ADOBECOM_MATCHER ', () => {
  const tests = [
    {
      url: 'https://main--milo--adobecom.hlx.live/',
      expected: null,
    },
    {
      url: 'https://www.adobe.com/',
      expected: [
        'www.adobe.com',
        'www',
        undefined,
      ],
    },
    {
      url: 'https://business.stage.adobe.com/',
      expected: [
        'business.stage.adobe.com',
        'business',
        '.stage',
      ],
    },
  ];
  tests.forEach(({ url, expected }) => {
    it(`should parse ${url}`, () => {
      const parsed = url.match(ADOBECOM_MATCHER);
      expect(parsed).deep.to.equal(expected);
    });
  });
});

describe('PATHNAME_MATCHER ', () => {
  const tests = [
    {
      pathname: '/africa/blah',
      expected: {
        geo: 'africa',
        country: 'africa',
        lang: undefined,
        geopath: '/blah',
        cloudfolder: undefined,
      },
    },
    {
      pathname: '/ab_cd/acrobat/blah.html?hello',
      expected: {
        geo: 'ab_cd',
        country: 'ab',
        lang: 'cd',
        geopath: '/acrobat/blah.html?hello',
        cloudfolder: 'acrobat',
      },
    },
  ];
  tests.forEach(({ pathname, expected }) => {
    it(`should parse ${pathname}`, () => {
      const parsed = pathname.match(PATHNAME_MATCHER);
      expect(parsed.groups).deep.to.equal(expected);
    });
  });
});

describe('parseAdobeUrl', () => {
  const tests = [
    {
      url: 'https://main--milo--adobecom.hlx.live/drafts',
      expected: {
        domain: 'main--milo--adobecom.hlx.live',
        pathname: '/drafts',
        cloud: 'milo',
        cloudfolder: undefined,
        env: 'prod',
        country: undefined,
        geo: undefined,
        geopath: '/drafts',
        lang: undefined,
      },
    },
    {
      url: 'https://www.adobe.com/',
      expected: {
        domain: 'www.adobe.com',
        pathname: '/',
        cloud: 'homepage',
        cloudfolder: undefined,
        env: 'prod',
        country: undefined,
        geo: undefined,
        geopath: '/',
        lang: undefined,
      },
    },
    {
      url: 'https://www.adobe.com/in/express/templates/logo/youtube',
      expected: {
        domain: 'www.adobe.com',
        pathname: '/in/express/templates/logo/youtube',
        cloud: 'express',
        cloudfolder: 'express',
        env: 'prod',
        country: 'in',
        geo: 'in',
        geopath: '/express/templates/logo/youtube',
        lang: undefined,
      },
    },
    {
      url: 'https://business.stage.adobe.com/',
      expected: {
        domain: 'business.stage.adobe.com',
        pathname: '/',
        cloud: 'bacom',
        cloudfolder: undefined,
        env: 'stage',
        country: undefined,
        geo: undefined,
        geopath: '/',
        lang: undefined,
      },
    },
  ];
  tests.forEach(({ url, expected }) => {
    it(`should parse ${url}`, () => {
      const parsed = parseAdobeUrl(url);
      expect(parsed).deep.to.equal(expected);
    });
  });
});

describe('sha256', () => {
  it('should return a hash', async () => {
    const message = 'hello';
    const hash = await sha256(message);
    expect(hash).to.equal('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});

describe('calcAdobeUrlHash', () => {
  const tests = [
    // set 1
    {
      url: 'https://MWPW-123456--milo--hparra.hlx.page/drafts/example?foo=bar',
      expected: '17d0d0712b603227422e78ab8113271c6ace1b7bf034804fa773b370e99de691',
    },
    {
      url: 'https://stage--milo--adobecom.hlx.live/drafts/example?filter=foo',
      expected: '17d0d0712b603227422e78ab8113271c6ace1b7bf034804fa773b370e99de691',
    },
    {
      url: 'https://milo.stage.adobe.com/drafts/example?nothing#something',
      expected: '17d0d0712b603227422e78ab8113271c6ace1b7bf034804fa773b370e99de691',
    },
    {
      url: 'https://milo.adobe.com/drafts/example',
      expected: '17d0d0712b603227422e78ab8113271c6ace1b7bf034804fa773b370e99de691',
    },
    // set 2
    {
      url: 'https://main--cc--adobecom.hlx.page/in/creativecloud/example?foo=bar',
      expected: '2c17ad64467b6c0b6a960279a0dbe7d8b2792d8d066907c990e2f62933895584',
    },
    {
      url: 'https://main--cc--adobecom.hlx.live/in/creativecloud/example?filter=foo',
      expected: '2c17ad64467b6c0b6a960279a0dbe7d8b2792d8d066907c990e2f62933895584',
    },
    {
      url: 'https://www.stage.adobe.com/in/creativecloud/example?nothing#something',
      expected: '2c17ad64467b6c0b6a960279a0dbe7d8b2792d8d066907c990e2f62933895584',
    },
    {
      url: 'https://www.adobe.com/in/creativecloud/example.html',
      expected: '2c17ad64467b6c0b6a960279a0dbe7d8b2792d8d066907c990e2f62933895584',
    },
  ];
  tests.forEach(({ url, expected }) => {
    it(`should hash ${url}`, async () => {
      const hash = await calcAdobeUrlHash(url);
      expect(hash).to.equal(expected);
    });
  });
});

describe('seotech', () => {
  describe('appendScriptTag + seotech-structured-data', () => {
    beforeEach(async () => {
      window.lana = { log: (s) => console.log(`LANA NOT STUBBED! ${s}`) };
    });
    afterEach(() => {
      window.fetch?.restore?.();
      window.lana?.restore?.();
    });

    it('should not append JSON-LD', async () => {
      const locationUrl = 'https://main--cc--adobecom.hlx.page/in/creativecloud/example2?foo=bar';
      stub(window.lana, 'log');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-structured-data').returns('on');
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(Response.json(
        { error: 'ERROR!' },
        { status: 400 },
      )));
      await appendScriptTag(
        { locationUrl, getMetadata, getConfig, createTag },
      );
      const expectedApiCall = 'https://firefly.azureedge.net/1cdd3f3be067c8b58843503529aeb3c8-public/public/seotech-structured-data/d0fff97ff9cbfbb63614b986ca47562288450c6c6d64f3f5f5a7b95afb518e83.json';
      expect(fetchStub.getCall(0)?.firstArg).to.equal(expectedApiCall);
    });

    it('should append JSON-LD', async () => {
      const locationUrl = 'https://main--cc--adobecom.hlx.page/in/creativecloud/example?foo=bar';
      const lanaStub = stub(window.lana, 'log');
      const fetchStub = stub(window, 'fetch');
      const getConfigStub = stub().returns({ env: { name: 'prod' } });
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-structured-data').returns('on');
      const expectedObject = {
        '@context': 'http://schema.org',
        '@type': 'VideoObject',
        name: 'fake',
      };
      fetchStub.returns(Promise.resolve(Response.json(
        { ...expectedObject },
        { status: 200 },
      )));
      await appendScriptTag(
        { locationUrl, getMetadata, getConfig: getConfigStub, createTag },
      );
      const expectedApiCall = 'https://firefly.azureedge.net/1cdd3f3be067c8b58843503529aeb3c8-public/public/seotech-structured-data/2c17ad64467b6c0b6a960279a0dbe7d8b2792d8d066907c990e2f62933895584.json';
      expect(fetchStub.getCall(0)?.firstArg).to.equal(expectedApiCall);
      const el = await waitForElement('script[type="application/ld+json"]');
      const obj = JSON.parse(el.text);
      expect(obj).to.deep.equal(expectedObject);
      expect(lanaStub.called).to.be.false;
    });
  });

  describe('appendScriptTag + seotech-video-url', () => {
    beforeEach(async () => {
      window.lana = { log: () => console.log('LANA NOT STUBBED!') };
    });
    afterEach(() => {
      window.fetch?.restore?.();
      window.lana?.restore?.();
    });

    it('should not append JSON-LD if url is invalid', async () => {
      const lanaStub = stub(window.lana, 'log');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-video-url').returns('fake');
      await appendScriptTag(
        { locationUrl: window.location.href, getMetadata, getConfig, createTag },
      );
      expect(lanaStub.calledOnceWith('SEOTECH: Failed to construct \'URL\': Invalid URL')).to.be.true;
    });

    it('should not append JSON-LD if url not found', async () => {
      const lanaStub = stub(window.lana, 'log');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-video-url').returns('http://fake');
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(Response.json(
        { error: 'ERROR!' },
        { status: 400 },
      )));
      await appendScriptTag(
        { locationUrl: window.location.href, getMetadata, getConfig, createTag },
      );
      expect(fetchStub.calledOnceWith(
        'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getVideoObject?url=http://fake/',
      )).to.be.true;
      expect(lanaStub.calledOnceWith('SEOTECH: Failed to fetch video: ERROR!')).to.be.true;
    });

    it('should append JSON-LD', async () => {
      const lanaStub = stub(window.lana, 'log');
      const fetchStub = stub(window, 'fetch');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-video-url').returns('http://fake');
      const expectedVideoObject = {
        '@context': 'http://schema.org',
        '@type': 'VideoObject',
        name: 'fake',
      };
      fetchStub.returns(Promise.resolve(Response.json(
        { videoObject: expectedVideoObject },
        { status: 200 },
      )));
      await appendScriptTag(
        { locationUrl: window.location.href, getMetadata, getConfig, createTag },
      );
      expect(fetchStub.calledOnceWith(
        'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getVideoObject?url=http://fake/',
      )).to.be.true;
      const el = await waitForElement('script[type="application/ld+json"]');
      const obj = JSON.parse(el.text);
      expect(obj).to.deep.equal(expectedVideoObject);
      expect(lanaStub.called).to.be.false;
    });
  });
});
