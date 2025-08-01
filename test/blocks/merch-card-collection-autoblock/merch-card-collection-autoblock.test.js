/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';
import init from '../../../libs/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.js';
import { setConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: '/libs' };
setConfig(conf);

const satellite = { track: sinon.spy() };
const originalFetch = window.fetch;
describe('merch-card-collection autoblock', () => {
  describe('init method', () => {
    before(async () => {
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        const result = await originalFetch('/test/blocks/merch-card-collection-autoblock/mocks/fragment.json').then(async (res) => {
          if (url.includes('id=1234')) {
            const responseBody = JSON.stringify(await res.json()).replaceAll('049231fd-0c45-4ef5-8792-7fa2dcd5005a', '4567');
            return new Response(responseBody, { status: 200 });
          }
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    beforeEach(() => {
      window._satellite = satellite;
      window._satellite.track.called = false;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('creates collection', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.className).to.include('plans');
    });

    it('creates creates sidenav by default', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.exist;
    });

    it('test analytics', async () => {
      const root = document.createElement('div');
      root.setAttribute('daa-lh', 'topdaalh');
      const content = document.createElement('div');
      root.append(content);
      content.setAttribute('daa-lh', 'test-analytics');
      content.classList.add('content');
      content.classList.add('tabs');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(root);
      await init(a);
      document.querySelector('.collection-container')?.setAttribute('daa-lh', 'all--cat');
      const sidenav = document.querySelector('merch-sidenav');

      window._satellite.track.called = false;
      sidenav.dispatchEvent(new Event('merch-sidenav:select'));
      await delay(100);
      expect(window._satellite.track.called).to.be.true;
      expect(window._satellite.track.args[0][1].data.web.webInteraction.name).to.equal('cat-changed|topdaalh|test-analytics|all--cat');
    });

    it('creates does not create sidenav if specified in the query params', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368&sidenav=false');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.not.exist;
    });

    it('overrides collection if mep replace tells to do', async () => {
      setConfig({
        ...conf,
        mep: {
          preview: true,
          inBlock: {
            mas: {
              fragments: {
                'e58f8f75-b882-409a-9ff8-8826b36a8368': {
                  action: 'replace',
                  manifestId: 'promo1.json',
                  content: '1234',
                },
              },
            },
          },
        },
      });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.getAttribute('overrides')).to.include('e58f8f75-b882-409a-9ff8-8826b36a8368:1234');
      const card = collection.querySelector('merch-card[id="4567"]');
      expect(card).to.exist;
    });
    it('forwards mep maps to collection', async () => {
      setConfig({
        ...conf,
        mep: {
          preview: true,
          inBlock: {
            mas: {
              fragments: {
                'should-be-replaced': {
                  action: 'replace',
                  manifestId: 'promo1.json',
                  content: 'promo-1',
                },
                'should-also-be-replaced': {
                  action: 'replace',
                  manifestId: 'promo2.json',
                  content: 'promo-2',
                },
              },
            },
          },
        },
      });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.getAttribute('overrides')).to.equal('should-be-replaced:promo-1,should-also-be-replaced:promo-2');
    });
  });
});
