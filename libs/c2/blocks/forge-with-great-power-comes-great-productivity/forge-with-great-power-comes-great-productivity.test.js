// Smoke + reconstruction test for the authored Milo C2 block
// forge-with-great-power-comes-great-productivity. Runs under Milo's
// @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js. The fixture (mocks/body.html) mirrors the
// FLAT, class-less DA serialisation — asserting decorate() REBUILT the hero +
// collage gates the C24 under-build/empty-grid failure.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-with-great-power-comes-great-productivity.js';

const BLOCK = 'forge-with-great-power-comes-great-productivity';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the hero + image collage from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    expect(block, 'mock body has the block root').to.exist;
    await init(block);
    expect(block.querySelector('.hero'), 'hero rebuilt').to.exist;
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    expect(block.querySelector('.gallery'), 'collage container present').to.exist;
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });

  it('accounts for every collage tile (no empty grid)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    expect(block.querySelectorAll('.gallery .tile').length).to.equal(17);
    expect(block.querySelectorAll('.gallery .doc-card').length).to.equal(1);
  });
});
