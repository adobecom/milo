import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

import { getConfig, createTag } from '../../../libs/utils/utils.js';
import { appendScriptTag } from '../../../libs/features/seotech/seotech.js';

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
      const lanaStub = stub(window.lana, 'log');
      const getMetadata = stub().returns(null);
      getMetadata.withArgs('seotech-structured-data').returns('on');
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(Response.json(
        { error: 'ERROR!' },
        { status: 400 },
      )));
      await appendScriptTag(
        { locationUrl: window.location.href, getMetadata, getConfig, createTag },
      );
      const expectedApiCall = 'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getStructuredData?url=http%3A%2F%2Flocalhost%3A2000%2F';
      expect(fetchStub.getCall(0).firstArg).to.equal(expectedApiCall);
      expect(lanaStub.getCall(0).firstArg).to.equal('SEOTECH: Failed to fetch structured data: ERROR!');
    });

    it('should append JSON-LD', async () => {
      const locationUrl = 'http://localhost:2000/?seotech-sheet-url=http://foo';
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
        { objects: [expectedObject] },
        { status: 200 },
      )));
      await appendScriptTag(
        { locationUrl, getMetadata, getConfig: getConfigStub, createTag },
      );
      const expectedApiCall = 'https://14257-seotech.adobeioruntime.net/api/v1/web/seotech/getStructuredData?url=http%3A%2F%2Flocalhost%3A2000%2F&sheetUrl=http%3A%2F%2Ffoo';
      expect(fetchStub.getCall(0).firstArg).to.equal(expectedApiCall);
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
