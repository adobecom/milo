// L22 fixture for the authored Milo C2 block forge-dww-root.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// Each it() loads the fixture itself (no shared async hook) and the fixture's
// images are 1x1 data-URIs, so the run is network-free and cannot hang the gate.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-dww-root.js';

describe('forge-dww-root', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the hero from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-dww-root');
    await init(block);
    // Rebuilt three-layer hero: media plate + scrim + copy lockup.
    expect(block.querySelector('.forge-dww-root-media picture'), 'media plate').to.exist;
    expect(block.querySelector('.forge-dww-root-scrim'), 'gradient scrim').to.exist;
    expect(block.querySelectorAll('h2.forge-dww-root-heading').length, 'one h2 title').to.equal(1);
    expect(block.querySelectorAll('.forge-dww-root-sub').length, 'sub-copy count').to.equal(1);
    expect(block.querySelector('a.forge-dww-root-btn'), 'pill CTA').to.exist;
  });

  it('preserves the LCP image + wires analytics + stamps the forge marker', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-dww-root');
    await init(block);
    expect(block.getAttribute('daa-lh'), 'section analytics handle').to.equal('forge-dww-root');
    expect(block.querySelector('img').getAttribute('loading'), 'eager LCP image').to.equal('eager');
    expect(block.querySelector('img').getAttribute('daa-im'), 'image analytics').to.exist;
    expect(block.querySelector('a.forge-dww-root-btn').getAttribute('daa-ll'), 'cta analytics').to.exist;
    expect(block.dataset.forgeAuthored).to.equal('forge-dww-root');
  });
});
