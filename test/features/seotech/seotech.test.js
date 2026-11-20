import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { waitFor, waitForElement } from '../../helpers/waitfor.js';

import { getConfig, createTag, loadArea, setConfig, preloadModuleLowPriority } from '../../../libs/utils/utils.js';
import {
  appendScriptTag,
  sha256,
  REGEX_ADOBETV,
  REGEX_YOUTUBE,
} from '../../../libs/features/seotech/seotech.js';

describe('REGEX_ADOBETV', () => {
  const testCases = [
    {
      url: 'https://video.tv.adobe.com/v/26535',
      expected: '26535',
    },
    {
      url: 'https://video.tv.adobe.com/v/26535/',
      expected: '26535',
    },
    {
      url: 'https://stage-video.tv.adobe.com/v/26535',
      expected: '26535',
    },
    {
      url: 'https://blah.com/26535',
      expected: null,
    },
  ];
  testCases.forEach(({ url, expected }) => {
    it(`should ${expected ? 'parse' : 'not parse'} adobetv url: ${url}`, () => {
      const match = url.match(REGEX_ADOBETV);
      if (expected) {
        expect(match[1]).to.equal(expected);
      } else {
        expect(match).to.be.null;
      }
    });
  });
});

describe('REGEX_YOUTUBE', () => {
  const testCases = [
    {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      expected: 'dQw4w9WgXcQ',
    },
    {
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      expected: 'dQw4w9WgXcQ',
    },
    {
      url: 'https://youtu.be/dQw4w9WgXcQ',
      expected: 'dQw4w9WgXcQ',
    },
    {
      url: 'https://www.example.com/watch?v=dQw4w9WgXcQ',
      expected: null,
    },
  ];
  testCases.forEach(({ url, expected }) => {
    it(`should ${expected ? 'parse' : 'not parse'} youtube url: ${url}`, () => {
      const match = url.match(REGEX_YOUTUBE);
      if (expected) {
        expect(match[1]).to.equal(expected);
      } else {
        expect(match).to.be.null;
      }
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

describe('seotech', () => {
  describe('deferred module preload', () => {
    let sandbox;
    let originalHead;
    let originalBody;
    let originalLana;
    let originalUrl;
    let originalConfig;
    let preload;
    let seotechRequests;
    let appendHead;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      originalHead = document.head.innerHTML;
      originalBody = document.body.innerHTML;
      originalLana = window.lana;
      originalUrl = window.location.href;
      originalConfig = getConfig();
      setConfig({});
      window.lana = { log: sandbox.spy() };
      document.head.innerHTML = `${await readFile({ path: '../../utils/mocks/head.html' })}
        <meta name="seotech-video-url" content="https://youtu.be/fake">`;
      document.head.querySelector('meta[name="footer-promo-tag"]')?.remove();
      document.body.innerHTML = '<main><div><p>Plain content</p></div></main>';
      appendHead = document.head.appendChild.bind(document.head);
      sandbox.stub(document.head, 'appendChild').callsFake((node) => {
        if (node.tagName === 'LINK' && node.rel === 'modulepreload'
          && (node.href.endsWith('/features/seotech/seotech.js') || node.href.endsWith('/module.js'))) {
          preload = node;
          return node;
        }
        return appendHead(node);
      });
      seotechRequests = 0;
      const fetch = window.fetch.bind(window);
      sandbox.stub(window, 'fetch').callsFake((url, ...args) => {
        if (String(url).includes('/mock-seotech-api/')) {
          seotechRequests += 1;
          return Promise.resolve(Response.json({ videoObject: { '@type': 'VideoObject', name: 'Test video' } }));
        }
        return fetch(url, ...args);
      });
      const url = new URL(window.location.href);
      url.searchParams.set('seotech-api-base-url', `${url.origin}/mock-seotech-api`);
      window.history.replaceState({}, '', url);
    });

    afterEach(() => {
      window.history.replaceState({}, '', originalUrl);
      document.head.innerHTML = originalHead;
      document.body.innerHTML = originalBody;
      window.lana = originalLana;
      setConfig(originalConfig);
      sandbox.restore();
      preload = undefined;
    });

    it('exports the shared low-priority module preload helper', async () => {
      const url = `${window.location.origin}/module.js`;
      const result = preloadModuleLowPriority(url);
      await waitFor(() => preload, 1000);
      const { rel, fetchPriority } = preload;
      expect(rel).to.equal('modulepreload');
      expect(fetchPriority).to.equal('low');
      preload.dispatchEvent(new Event('load'));
      expect(await result).to.be.undefined;
    });

    it('preloads SEOTECH after its metadata gate without blocking page load', async () => {
      await loadArea();
      await waitFor(() => preload, 2000);
      expect(document.getElementById('page-load-ok-milo')).to.exist;
      expect(preload.fetchPriority).to.equal('low');
      expect(seotechRequests).to.equal(0);
      preload.dispatchEvent(new Event('load'));
      await waitFor(() => document.head.querySelector('script.seotech-video-url'), 2000);
      const script = document.head.querySelector('script.seotech-video-url');
      expect(JSON.parse(script.textContent)).to.deep.equal({
        '@type': 'VideoObject',
        name: 'Test video',
      });
      expect(seotechRequests).to.equal(1);
    });

    it('logs a failed SEOTECH preload and falls back to import', async () => {
      await loadArea();
      await waitFor(() => preload, 2000);
      preload.dispatchEvent(new Event('error'));
      await waitFor(() => seotechRequests === 1 && document.head.querySelector('script.seotech-video-url'), 2000);
      expect(window.lana.log.calledWithMatch('SEOTECH module preload failed')).to.be.true;
      expect(document.head.querySelector('script.seotech-video-url')).to.exist;
    });

    it('reuses an existing SEOTECH modulepreload without changing its priority', async () => {
      const url = new URL('../../../libs/features/seotech/seotech.js', import.meta.url).href;
      const existingLink = document.createElement('link');
      existingLink.rel = 'modulepreload';
      existingLink.fetchPriority = 'high';
      existingLink.href = url;
      appendHead(existingLink);
      await loadArea();
      await waitFor(() => seotechRequests === 1 && document.head.querySelector('script.seotech-video-url'), 2000);
      expect(preload).to.be.undefined;
      expect(existingLink.rel).to.equal('modulepreload');
      expect(existingLink.fetchPriority).to.equal('high');
      expect(document.head.querySelector('script.seotech-video-url')).to.exist;
    });

    it('does not preload SEOTECH when its metadata gate is disabled', async () => {
      document.querySelector('meta[name="seotech-video-url"]').remove();
      await loadArea();
      await new Promise((resolve) => { setTimeout(resolve, 50); });
      expect(preload).to.be.undefined;
      expect(seotechRequests).to.equal(0);
    });
  });

  describe('appendScriptTag + seotech-structured-data', () => {
    beforeEach(async () => {
      window.lana = { log: (s) => console.log(`LANA NOT STUBBED! ${s}`) };
    });
    afterEach(() => {
      window.fetch?.restore?.();
      window.lana?.restore?.();
    });

    it('should not append JSON-LD', async () => {
      const locationUrl = 'https://main--cc--adobecom.aem.page/in/creativecloud/example2?foo=bar&seotech-env=stage';
      stub(window.lana, 'log');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-structured-data').returns('on');
      const getConfigStub = stub().returns({ imsClientId: 'adobedotcom-cc' });
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(Response.json(
        { error: 'ERROR!' },
        { status: 400 },
      )));
      await appendScriptTag(
        { locationUrl, getMetadata, getConfig: getConfigStub, createTag },
      );
      const expectedApiCall = 'https://www.adobe.com/seotech/api/structured-data/cc/3e2d1ce8ccf0e45d42d33e0f190fc306ab1ee0f2890c8ff5da27414f8014ceb2';
      expect(fetchStub.getCall(0)?.firstArg).to.equal(expectedApiCall);
    });

    it('should append JSON-LD', async () => {
      const locationUrl = 'https://main--cc--adobecom.aem.page/in/creativecloud/example?foo=bar';
      const lanaStub = stub(window.lana, 'log');
      const fetchStub = stub(window, 'fetch');
      const getConfigStub = stub().returns({ imsClientId: 'adobedotcom-cc' });
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
      const expectedApiCall = 'https://www.adobe.com/seotech/api/structured-data/cc/f0f5cec5d8b70cf798b602c3586da39e93b9638d9b8001b3a4298605dc5f6ebe';
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
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(lanaStub.calledOnce).to.be.true;
      expect(lanaStub.firstCall.args[0]).to.equal('SEOTECH: Video object operation failed ¶ videoUrl:fake');
    });

    it('should not append JSON-LD if url not found', async () => {
      const lanaStub = stub(window.lana, 'log');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-video-url').returns('https://youtu.be/fake');
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(Response.json(
        { error: 'ERROR!' },
        { status: 400 },
      )));
      await appendScriptTag(
        { locationUrl: window.location.href, getMetadata, getConfig, createTag },
      );
      expect(fetchStub.calledOnceWith(
        'https://www.adobe.com/seotech/api/json-ld/types/video-object/providers/youtube/fake',
      )).to.be.true;
      expect(lanaStub.calledOnceWith('SEOTECH: Video object operation failed ¶ videoUrl:https://youtu.be/fake')).to.be.true;
    });

    it('should append JSON-LD', async () => {
      const lanaStub = stub(window.lana, 'log');
      const fetchStub = stub(window, 'fetch');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-video-url').returns('https://youtu.be/dQw4w9WgXcQ');
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
        'https://www.adobe.com/seotech/api/json-ld/types/video-object/providers/youtube/dQw4w9WgXcQ',
      )).to.be.true;
      const el = await waitForElement('script[type="application/ld+json"]');
      const obj = JSON.parse(el.text);
      expect(obj).to.deep.equal(expectedVideoObject);
      expect(lanaStub.called).to.be.false;
    });
  });
});
