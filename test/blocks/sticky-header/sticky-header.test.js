import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const ogDoc = document.body.innerHTML;

const { default: init } = await import('../../../libs/blocks/sticky-header/sticky-header.js');

describe('init', async () => {
  afterEach(() => {
    document.body.innerHTML = ogDoc;
  });

  it('adds sticky header below the gnav header', async () => {
    const block = await readFile({ path: './mocks/block.html' });
    const blockEl = document.createElement('div');
    blockEl.innerHTML = block.trim();

    init(blockEl);

    expect(document.body.querySelector('.sticky-header')).to.exist;

    const headerSiblingBlock = document.body.querySelector('header').nextElementSibling;
    expect(headerSiblingBlock.querySelector(':scope > .sticky-header')).to.exist;
  });

  it('removes sticky header when close button is clicked', async () => {
    const block = await readFile({ path: './mocks/block.html' });
    const blockEl = document.createElement('div');
    blockEl.innerHTML = block.trim();

    init(blockEl);

    const button = document.body.querySelector('.sticky-header-close');
    sinon.fake();
    button.click();
    expect(document.body.querySelector('.sticky-header')).to.not.exist;
  });
});
