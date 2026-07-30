// L22 fixture test for the authored Milo C2 block
// forge-adobe-is-transforming-the-world-s-biggest-brands.
// Milo's @web/test-runner runs this (browser) as a ship gate. The fixture is
// loaded INSIDE each it() (self-contained — no shared async hook) and every
// image is a 1x1 data-URI, so the session never touches the network.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-adobe-is-transforming-the-world-s-biggest-brands.js';

const SEL = '.forge-adobe-is-transforming-the-world-s-biggest-brands';

describe('forge-adobe-is-transforming-the-world-s-biggest-brands', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs heading, a 6-logo strip, and the featured story from flat content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(SEL);
    expect(block, 'mock body has the block root').to.exist;

    await init(block);

    // Marker + heading (exactly one, not promoted to h1).
    expect(block.dataset.forgeAuthored).to.equal('forge-adobe-is-transforming-the-world-s-biggest-brands');
    expect(block.querySelector('.section-head h2'), 'heading rebuilt').to.exist;
    expect(block.querySelectorAll('h1').length, 'no h1').to.equal(0);

    // Logo strip: 7 authored pictures -> 6 customer logos (last picture is the story logo).
    expect(block.querySelectorAll('.logos .logos__item').length, 'six customer logos').to.equal(6);

    // Featured story card: brand logo + pull-quote + attribution + link.
    const story = block.querySelector('.story');
    expect(
      story
        && story.querySelector('.story__logo-img')
        && story.querySelector('.story__quote')
        && story.querySelector('.story__link'),
      'story card rebuilt with logo, quote and link',
    ).to.exist;
  });
});
