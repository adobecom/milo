import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

import { getConfig, createTag } from '../../../libs/utils/utils.js';
import appendVideoObjectScriptTag from '../../../libs/features/seotech/seotech.js';

describe('seotech', () => {
  describe('appendVideoObjectScriptTag', () => {
    beforeEach(async () => {
      window.lana = { log: () => console.log('LANA NOT STUBBED!') };
    });
    afterEach(() => {
      window.fetch?.restore?.();
      window.lana?.restore?.();
    });

    it('should not append JSON-LD if url is invalid', async () => {
      const lanaStub = stub(window.lana, 'log');
      await appendVideoObjectScriptTag('', { getConfig, createTag });
      expect(lanaStub.calledOnceWith('SEOTECH: Failed to construct \'URL\': Invalid URL')).to.be.true;
    });

    it('should not append JSON-LD if url not found', async () => {
      const lanaStub = stub(window.lana, 'log');
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(Response.json(
        { error: 'ERROR!' },
        { status: 400 },
      )));
      await appendVideoObjectScriptTag('http://fake', { getConfig, createTag });
      expect(fetchStub.calledOnceWith(
        'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getVideoObject?url=http://fake/',
      )).to.be.true;
      expect(lanaStub.calledOnceWith('SEOTECH: Failed to fetch video: ERROR!')).to.be.true;
    });

    it('should append JSON-LD', async () => {
      const fetchStub = stub(window, 'fetch');
      const expectedVideoObject = {
        '@context': 'http://schema.org',
        '@type': 'VideoObject',
        name: 'fake',
      };
      fetchStub.returns(Promise.resolve(Response.json(
        { videoObject: expectedVideoObject },
        { status: 200 },
      )));
      await appendVideoObjectScriptTag('http://fake', { getConfig, createTag });
      expect(fetchStub.calledOnceWith(
        'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getVideoObject?url=http://fake/',
      )).to.be.true;
      const el = await waitForElement('script[type="application/ld+json"]');
      const obj = JSON.parse(el.text);
      expect(obj).to.deep.equal(expectedVideoObject);
    });
  });
});
