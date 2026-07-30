// L22 smoke fixture for the authored Milo C2 block. Runs under Milo's
// @web/test-runner (browser). The fixture (mocks/body.html) mirrors the REAL
// class-less DA serialization the block receives at runtime, so these tests gate
// that init() RECONSTRUCTS the bento challenge grid from content order — not that
// it merely passes over the already-structured section.html.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-address-your-biggest-customer-experience-challenges-with-adobe.js';

const BLOCK = 'forge-address-your-biggest-customer-experience-challenges-with-adobe';

describe(BLOCK, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds a 5-card grid: 2 media cards + 3 text cards from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    expect(block.querySelector('.challenge-grid'), 'grid container rebuilt').to.exist;
    expect(block.querySelectorAll('.challenge').length, 'five challenge cards').to.equal(5);
    expect(block.querySelectorAll('.challenge--media').length, 'two media cards').to.equal(2);
    expect(block.querySelectorAll('.challenge--text').length, 'three text cards').to.equal(3);
  });

  it('wires each card with a heading + text link, and media cards with a picture', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    const cards = [...block.querySelectorAll('.challenge')];
    const wellFormed = cards.every((c) => c.querySelector('.challenge__body h3')
      && c.querySelector('.challenge__body a.textlink'));
    expect(wellFormed, 'each card has a heading + text link').to.be.true;
    const media = [...block.querySelectorAll('.challenge--media')];
    expect(media.every((c) => c.querySelector('picture.challenge__media img.challenge__img')), 'media cards keep their picture').to.be.true;
  });

  it('keeps one h2 in the section head, no h1, and stamps analytics', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);

    expect(block.querySelectorAll('.section-head h2').length, 'single section h2').to.equal(1);
    expect(block.querySelectorAll('h1').length, 'no h1').to.equal(0);
    expect(block.getAttribute('daa-lh'), 'daa-lh handle set').to.equal(BLOCK);
    expect(block.dataset.forgeAuthored, 'forge marker set').to.equal(BLOCK);
  });
});
