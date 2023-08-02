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

    it('should not append JSON-LD if url is falsey', async () => {
      const lanaStub = stub(window.lana, 'log');
      await appendVideoObjectScriptTag('', { getConfig, createTag });
      expect(lanaStub.calledOnceWith('SEOTECH: URL undefined')).to.be.true;
    });

    it('should not append JSON-LD if url not found', async () => {
      const lanaStub = stub(window.lana, 'log');
      const fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(new Response(
        JSON.stringify({ error: 'ERROR!' }),
        { status: 400 },
      )));
      await appendVideoObjectScriptTag('FAKE', { getConfig, createTag });
      expect(fetchStub.calledOnceWith(
        'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getVideoObject?url=FAKE',
      )).to.be.true;
      expect(lanaStub.calledOnceWith('SEOTECH: ERROR!')).to.be.true;
    });

    it('should append JSON-LD', async () => {
      const fetchStub = stub(window, 'fetch');
      const expectedVideoObject = {
        '@context': 'http://schema.org',
        '@type': 'VideoObject',
        name: 'FAKE',
      };
      fetchStub.returns(Promise.resolve(new Response(JSON.stringify(
        { videoObject: expectedVideoObject },
        { status: 200 },
      ))));
      await appendVideoObjectScriptTag('FAKE', { getConfig, createTag });
      expect(fetchStub.calledOnceWith(
        'https://14257-seotech-stage.adobeioruntime.net/api/v1/web/seotech/getVideoObject?url=FAKE',
      )).to.be.true;
      const el = await waitForElement('script[type="application/ld+json"]');
      const obj = JSON.parse(el.text);
      expect(obj).to.deep.equal(expectedVideoObject);
    });
  });
});
