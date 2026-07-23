// Runs under Milo's @web/test-runner (browser). Each it() loads the fixture
// itself (no shared before hook) and the fixture uses only data-URI images, so
// the run stays network-free and never churns the session.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-work-faster-smarter-and-more-securely-with-verify-widget.js';

const NAME = 'forge-work-faster-smarter-and-more-securely-with-verify-widget';

describe(NAME, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${NAME}`);
    await init(block);
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    expect(block.querySelector('.content .eyebrow'), 'eyebrow present').to.exist;
    expect(block.querySelector('.action-area')?.children.length, 'two CTAs').to.equal(2);
    expect(block.querySelector('.media picture img'), 'hero image present').to.exist;
    expect(block.getAttribute('daa-lh'), 'analytics handle').to.equal(NAME);
  });
});
