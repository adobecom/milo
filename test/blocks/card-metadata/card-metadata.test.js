import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../libs/c2/blocks/card-metadata/card-metadata.js';

describe('Card Metadata', () => {
  it('leaves an authored block with rows completely untouched', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.card-metadata');
    const before = block.outerHTML;

    init(block);

    expect(block.outerHTML).to.equal(before);
    expect(document.querySelector('.card-metadata')).to.equal(block);
  });

  it('does not throw and leaves an empty block untouched', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/empty.html' });
    const block = document.querySelector('.card-metadata');
    const before = block.outerHTML;

    expect(() => init(block)).to.not.throw();

    expect(block.outerHTML).to.equal(before);
  });

  it('does not throw when called without a block element', () => {
    expect(() => init()).to.not.throw();
    expect(() => init(undefined)).to.not.throw();
  });
});
