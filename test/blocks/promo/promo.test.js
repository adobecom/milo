import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const ogDoc = document.body.innerHTML;

const { default: init } = await import('../../../libs/blocks/promo/promo.js');

describe('init', async () => {
  afterEach(() => {
    document.body.innerHTML = ogDoc;
  });

  it('creates promo block', async () => {
    const block = document.querySelector('.promo');
    init(block);
    expect(block.querySelector('.promo-close')).to.be.exist;
  });

  it('removes sticky header when close button is clicked', async () => {
    const block = document.querySelector('.promo');
    init(block);
    const button = document.body.querySelector('.promo-close');
    sinon.fake();
    button.click();
    expect(document.body.querySelector('.promo')).to.not.exist;
  });
});
