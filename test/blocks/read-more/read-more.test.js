import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const ogDoc = document.body.innerHTML;
const { default: init } = await import('../../../libs/blocks/read-more/read-more.js')

describe('init', () => {
  afterEach(() => {
    document.body.innerHTML = ogDoc;
  });
  it('replaces the strong tag with a button element', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.body.querySelector('.read-more');

    init(block);

    expect(block.querySelector('strong')).to.be.null;
    expect(block.querySelector('button')).to.exist;
    expect(block.querySelector('.button.con-button.filled.blue')).to.exist;
  });

  it('adds the "read-more-expanded" class when clicked', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.body.querySelector('.read-more');
    const container = block.closest('.section');

    init(block);

    const button = block.querySelector('button');
    sinon.fake();
    button.click();

    expect(container.classList.contains('read-more-expanded')).to.be.true;
  });

  it('should show recommended articles all the time', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-with-recommended.html' });
    const block = document.body.querySelector('.read-more');

    init(block);

    const recommendedBlock = document.body.querySelector('.recommended-articles');
    const computedStyle = window.getComputedStyle(recommendedBlock);
    const opacity = computedStyle.getPropertyValue('opacity');
    const height = computedStyle.getPropertyValue('max-height');
    expect(opacity).to.be.equal('1');
    expect(height).to.not.equal('0');
  });
});
