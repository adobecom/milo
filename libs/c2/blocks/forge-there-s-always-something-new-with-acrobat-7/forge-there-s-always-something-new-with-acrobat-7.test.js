// Auto-scaffolded smoke fixture for the authored Milo block forge-there-s-always-something-new-with-acrobat-7.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-there-s-always-something-new-with-acrobat-7.js';

describe('forge-there-s-always-something-new-with-acrobat-7', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('decorates the EDS-rendered block and stamps the forge marker', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-there-s-always-something-new-with-acrobat-7');
    expect(block, 'mock body has the block root').to.exist;
    await init(block);
    expect(block.dataset.forgeAuthored).to.equal('forge-there-s-always-something-new-with-acrobat-7');
  });
});
