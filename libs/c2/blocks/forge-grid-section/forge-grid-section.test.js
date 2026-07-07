// L22 gate for the authored Milo C2 block forge-grid-section.
// Runs under Milo's @web/test-runner (browser). Each it() loads the network-free
// fixture itself (no shared before/beforeEach hook) so the session never hangs.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-grid-section.js';

describe('forge-grid-section', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs a non-empty masonry with all seven mockup cards', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-grid-section');
    await init(block);
    const masonry = block.querySelector('.fgs-masonry');
    expect(masonry, 'masonry container present').to.exist;
    expect(masonry.querySelectorAll('.fgs-col').length, 'staggered columns built').to.be.greaterThan(1);
    expect(masonry.querySelectorAll('.fgs-card').length, 'one tile per content card').to.equal(7);
  });

  it('stamps distinctive card types and preserves authored list content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-grid-section');
    await init(block);
    ['survey', 'pipeline', 'sign', 'invoice', 'benefits', 'msa', 'cert']
      .forEach((t) => expect(block.querySelector(`.fgs-${t}`), `${t} card built`).to.exist);
    expect(block.querySelectorAll('.fgs-ben-list li').length, 'authored <li>s kept').to.equal(5);
    expect(block.querySelector('.fgs-cert-go'), 'unlock control is a button').to.exist;
    expect(block.getAttribute('daa-lh')).to.equal('forge-grid-section');
  });
});
