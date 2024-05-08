import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement, delay } from '../../helpers/waitfor.js';
import init from '../../../libs/blocks/review/review.js';

describe('Review Component Ratings vs. Thresholds', () => {
  let fetchStub;
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    window.s_adobe = { visitor: { getMarketingCloudVisitorID: () => 'abcd' } };
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    sinon.restore();
    localStorage.removeItem('/data/review');
    const metaTag = document.querySelector('meta[name="comment-threshold"]');
    if (metaTag) {
      metaTag.remove();
    }
  });

  const thresholds = [4, 5];
  const ratings = [5, 4, 3, 2, 1];

  describe('Reviews loaded', () => {
    it('could be initialized', async () => {
      const div = document.querySelector('.review');
      await init(div);
      fetchStub.resolves(
        new Response(JSON.stringify({
          total: 4,
          offset: 0,
          limit: 4,
          data: [
            { country: 'all', total: '17', average: '3.5' },
            { country: 'en', total: '6', average: '3.3' },
            { country: 'fr', total: '3', average: '3.3' },
            { country: 'de', total: '3', average: '3.3' },
          ],
          ':type': 'sheet',
        }), {
          status: 200,
          headers: { 'Content-type': 'application/json' },
        }),
      );
      const review = await waitForElement('.hlx-ReviewWrapper');
      expect(review).to.exist;
    });
  });

  thresholds.forEach((threshold) => {
    describe(`with a comment threshold of ${threshold}`, () => {
      ratings.forEach((rating) => {
        it(`tests rating ${rating}`, async () => {
          const metaTag = document.createElement('meta');
          metaTag.setAttribute('name', 'comment-threshold');
          metaTag.setAttribute('content', threshold);
          document.head.appendChild(metaTag);

          fetchStub.resolves(
            new Response(JSON.stringify({
              total: 4,
              offset: 0,
              limit: 4,
              data: [
                { country: 'all', total: '17', average: '3.5' },
                { country: 'en', total: '6', average: '3.3' },
                { country: 'fr', total: '3', average: '3.3' },
                { country: 'de', total: '3', average: '3.3' },
              ],
              ':type': 'sheet',
            }), {
              status: 200,
              headers: { 'Content-type': 'application/json' },
            }),
          );

          await init(document.querySelector('.review'));
          const review = await waitForElement('.hlx-ReviewWrapper');
          const ratingInputs = review.querySelectorAll('.hlx-Review-ratingFields input');
          await delay(125);
          await ratingInputs[rating - 1].dispatchEvent(new Event('click'));
          await delay(125);
          expect(ratingInputs[rating - 1].getAttribute('aria-checked')).to.equal('true');
          await delay(125);
          const comment = document.querySelectorAll('#rating-comments');
          if (rating <= threshold) {
            expect(comment.length).to.equal(1);
          } else {
            expect(comment.length).to.equal(0);
          }
          await delay(125);
        });
      });
    });
  });
});
