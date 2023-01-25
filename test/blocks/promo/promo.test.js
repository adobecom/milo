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

  it('adds sticky inside main', async () => {
    const block = document.querySelector('.sticky')

    init(block);

    const stickyEl = document.body.querySelector('.sticky-wrapper');
    const main = document.body.querySelector('main');
    expect(stickyEl).to.exist;
    expect(main.firstElementChild).to.eql(stickyEl);
  });

  it('removes sticky header when close button is clicked', async () => {
    const block = document.querySelector('.sticky')

    init(block);

    const button = document.body.querySelector('.sticky-close');
    sinon.fake();
    button.click();
    expect(document.body.querySelector('.sticky')).to.not.exist;
  });
});
