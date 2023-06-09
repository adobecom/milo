import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import init from '../../../libs/blocks/version-history/version-history.js';

describe('Review Comp', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  it('could be initialized', async () => {
    const div = document.querySelector('.section');
    await init(div);
    const review = await waitForElement('.container');
    expect(review).to.exist;
  });
});
