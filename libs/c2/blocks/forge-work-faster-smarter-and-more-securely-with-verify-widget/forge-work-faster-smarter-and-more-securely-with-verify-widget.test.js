// Auto-scaffolded smoke fixture for the authored Milo block forge-work-faster-smarter-and-more-securely-with-verify-widget.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-work-faster-smarter-and-more-securely-with-verify-widget.js';

describe('forge-work-faster-smarter-and-more-securely-with-verify-widget', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('decorates the EDS-rendered block and stamps the forge marker', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-work-faster-smarter-and-more-securely-with-verify-widget');
    expect(block, 'mock body has the block root').to.exist;
    await init(block);
    expect(block.dataset.forgeAuthored).to.equal('forge-work-faster-smarter-and-more-securely-with-verify-widget');
  });
});
