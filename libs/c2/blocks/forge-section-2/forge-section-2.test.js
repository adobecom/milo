// L22 gate for forge-section-2. Runs under Milo's @web/test-runner (browser).
// Fixture is loaded INSIDE each it() (self-contained, network-free data-URIs) so
// no shared async hook can hang the session.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-section-2.js';

const FIXTURE = './mocks/body.html';

describe('forge-section-2', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the 3-up bento grid from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-section-2');
    await init(block);
    expect(block.querySelector('.fs2-grid'), 'grid container rebuilt').to.exist;
    expect(block.querySelectorAll('.fs2-col').length, 'three columns').to.equal(3);
    expect(block.querySelectorAll('.fs2-card').length, 'three media cards').to.equal(3);
    // Every authored <picture> is placed, none dropped (10 in the fixture).
    expect(block.querySelectorAll('picture').length, 'all pictures kept').to.equal(10);
  });

  it('rebuilds cards, chips and copy with semantic headings + wired CTAs', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-section-2');
    await init(block);
    expect(block.querySelectorAll('.fs2-headline').length, 'a headline per column').to.equal(3);
    expect(block.querySelectorAll('h1').length, 'no h1 emitted').to.equal(0);
    expect(block.querySelectorAll('.fs2-chip').length, 'three floating chips').to.equal(3);
    const ctas = block.querySelectorAll('a.fs2-cta');
    expect(ctas.length, 'a CTA per column').to.equal(3);
    expect(ctas[0].querySelector('.fs2-cta-arrow'), 'CTA has a chevron').to.exist;
    expect(ctas[0].getAttribute('daa-ll'), 'CTA tagged for analytics').to.be.a('string');
  });

  it('stamps analytics + forge markers on the block root', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-section-2');
    await init(block);
    expect(block.getAttribute('daa-lh')).to.equal('forge-section-2');
    expect(block.dataset.forgeAuthored).to.equal('forge-section-2');
  });
});
