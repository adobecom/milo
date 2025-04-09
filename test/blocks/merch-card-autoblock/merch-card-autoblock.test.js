import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/merch-card-autoblock/merch-card-autoblock.js';
import { setConfig } from '../../../libs/utils/utils.js';

const originalFetch = window.fetch;
describe('merch-card-autoblock autoblock', () => {
  describe('init method', () => {
    before(async () => {
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        let fileName = '';
        if (url.includes('/mas/io/fragment')) {
          fileName = 'fragment.json';
        }
        if (url.includes('/web_commerce_artifact')) {
          fileName = 'artifact.json';
        }
        const result = await originalFetch(`/test/blocks/merch-card-autoblock/mocks/${fileName}`).then(async (res) => {
          if (res.ok) {
            if (url.includes('/mas/io/fragment?id=1234')) {
              const responseBody = JSON.stringify(await res.json()).replaceAll('Creative Cloud All Apps', 'Creative Cloud All Apps PROMO');
              return new Response(responseBody, { status: 200 });
            }
            return res;
          }
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('creates card', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      content.append(a);
      document.body.append(content);
      await init(a);
      const card = document.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal('Creative Cloud All Apps');
    });

    it('override card if mep replace tells to do', async () => {
      setConfig({
        mep: {
          preview: true,
          inBlock: {
            'mas-block': {
              fragments: {
                a657fd3d9f67: {
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
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      content.append(a);
      document.body.append(content);
      await init(a);
      const card = document.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal('Creative Cloud All Apps PROMO');
    });
  });
});
