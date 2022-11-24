import { expect } from '@esm-bundle/chai';
import { showError } from '../../../libs/blocks/fallback/fallback.js';

describe('Fallback', () => {
  it('sets error properly on block', async () => {
    const block = { dataset: {}, classList: [] };
    const name = 'test';
    showError(block, name);
    expect(block.dataset.failed).to.be.equal('true');
    expect(block.dataset.reason).to.be.equal(`Failed loading ${name} block.`);
  });

  it('does not set error if block is a sub-block', async () => {
    const block = { dataset: {}, classList: ['adobe-logo'] };
    const name = 'test2';
    showError(block, name);
    expect(block.dataset.failed).to.be.undefined;
    expect(block.dataset.reason).to.be.undefined;
  });
});
