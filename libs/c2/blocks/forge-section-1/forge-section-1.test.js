// L22 gate for forge-section-1. Runs under Milo's @web/test-runner (browser).
// Fixture is loaded INSIDE each it() (self-contained, network-free data-URIs) so
// no shared async hook can hang the session.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-section-1.js';

const FIXTURE = './mocks/body.html';

describe('forge-section-1', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the media asset + copy row from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-section-1');
    await init(block);
    const media = block.querySelector('.fs1-media');
    expect(media, 'media asset container rebuilt').to.exist;
    expect(media.querySelectorAll('picture').length, 'both pictures kept').to.equal(2);
    expect(block.querySelector('.fs1-media .fs1-badge'), 'Pr badge pinned in media').to.exist;
    expect(block.querySelector('.fs1-copy'), 'copy row rebuilt').to.exist;
  });

  it('promotes the headline to an h2 and wires the CTA + analytics', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector('.forge-section-1');
    await init(block);
    const headline = block.querySelector('.fs1-headline');
    expect(headline?.tagName, 'headline is a single sub-heading').to.equal('H2');
    expect(block.querySelectorAll('h1').length, 'no h1 emitted').to.equal(0);
    const cta = block.querySelector('a.fs1-cta');
    expect(cta?.querySelector('.fs1-cta-arrow'), 'CTA has a chevron').to.exist;
    expect(cta?.getAttribute('daa-ll'), 'CTA tagged for analytics').to.be.a('string');
    expect(block.getAttribute('daa-lh')).to.equal('forge-section-1');
    expect(block.dataset.forgeAuthored).to.equal('forge-section-1');
  });
});
