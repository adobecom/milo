import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

import { getConfig, createTag } from '../../../libs/utils/utils.js';
import {
  appendScriptTag,
  sha256,
} from '../../../libs/features/seotech/seotech.js';

describe('sha256', () => {
  it('should return a hash', async () => {
    const message = 'hello';
    const hash = await sha256(message);
    expect(hash).to.equal('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
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
      const locationUrl = 'https://main--cc--adobecom.hlx.page/in/creativecloud/example2?foo=bar&seotech-env=stage';
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
      const locationUrl = 'https://main--cc--adobecom.hlx.page/in/creativecloud/example?foo=bar';
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
