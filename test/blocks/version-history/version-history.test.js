import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import init from '../../../libs/blocks/version-history/version-history.js';

describe('Version history Comp', () => {
  it('could be initialized', async () => {
    document.body.innerHTML = '<div class="section"><div></div></div>';
    const div = document.querySelector('.section');
    await init(div);
    const review = await waitForElement('.container');
    expect(review).to.exist;
  });
});
