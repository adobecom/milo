import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/visually-hidden/visually-hidden.js';

// visually-hidden is a CSS-only block; its JS init is an intentional no-op.
describe('Visually Hidden (c2)', () => {
  it('exports a default init function', () => {
    expect(init).to.be.a('function');
  });

  it('is a no-op that returns undefined and does not throw', () => {
    expect(init()).to.equal(undefined);
  });

  it('leaves the block markup untouched', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.visually-hidden');
    const before = block.outerHTML;

    init(block);

    expect(block.outerHTML).to.equal(before);
  });
});
