// L22 gate for the authored Milo C2 block forge-with-great-power-comes-great-productivity.
// Runs under Milo's @web/test-runner (browser). The fixture (mocks/body.html) is
// the FLAT, class-less DA serialisation, and every image is a data-URI so the
// suite is network-free. Each test loads the fixture inside its own it() (no
// shared async hook) and asserts init() RECONSTRUCTED the rich layout — so a
// regression to a flat, empty-container stack fails this gate.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-with-great-power-comes-great-productivity.js';

const SELECTOR = '.forge-with-great-power-comes-great-productivity';

describe('forge-with-great-power-comes-great-productivity', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the hero: one h1 headline + a fully-populated image collage', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(SELECTOR);
    await init(block);
    expect(block.querySelectorAll('h1.fwp-headline'), 'exactly one <h1> headline').to.have.lengthOf(1);
    expect(block.querySelectorAll('.fwp-mosaic .fwp-tile'), 'one collage tile per hero picture').to.have.lengthOf(15);
  });

  it('rebuilds the audience band: 4 use-case cards + a partner-logo strip, and marks the block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(SELECTOR);
    await init(block);
    expect(block.querySelectorAll('.fwp-cards .fwp-card'), 'one card per use case').to.have.lengthOf(4);
    expect(block.querySelector('.fwp-logos img'), 'partner-logo strip').to.exist;
    expect(block.dataset.forgeAuthored).to.equal('forge-with-great-power-comes-great-productivity');
  });
});
