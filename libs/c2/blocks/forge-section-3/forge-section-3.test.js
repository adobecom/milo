// forge-section-3 — L22 fixture test. Runs under Milo's @web/test-runner
// (browser). Each it() loads the class-less DA fixture itself (no shared hook)
// and asserts init() RECONSTRUCTED the collage from that flat content.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-section-3.js';

describe('forge-section-3', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the five-card collage from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-section-3');
    await init(block);
    const collage = block.querySelector('.fs3-collage');
    expect(collage, 'collage container built').to.exist;
    expect(collage.querySelectorAll('.fs3-card').length, 'all five cards rebuilt').to.equal(5);
    expect(block.dataset.forgeAuthored).to.equal('forge-section-3');
  });

  it('groups content into cards and builds the media-mix bars', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-section-3');
    await init(block);
    expect(block.querySelectorAll('.fs3-mm-bar').length, 'four media-mix bars').to.equal(4);
    expect(block.querySelector('.fs3-card--whitepaper img'), 'white-paper media preserved').to.exist;
    expect(block.querySelectorAll('h1').length, 'at most one h1').to.be.at.most(1);
  });
});
