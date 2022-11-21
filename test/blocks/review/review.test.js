import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import init from '../../../libs/blocks/review/review.js';

describe('Review Comp', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    window.localStorage.setItem('/data/review', JSON.stringify({ rating: 5 }));
    window.s_adobe = { visitor: { getMarketingCloudVisitorID: () => 'abcd' } };
  });

  it('could be initialized', async () => {
    const div = document.querySelector('.review');
    await init(div);
    const review = await waitForElement('.hlx-ReviewWrapper');
    expect(review).to.exist;
  });

  it('could be initialized (with all missing fields)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/missing-fields.html' });
    const div = document.querySelector('.review');
    await init(div);

    const review = await waitForElement('.hlx-ReviewWrapper');
    expect(review).to.exist;
  });
});
