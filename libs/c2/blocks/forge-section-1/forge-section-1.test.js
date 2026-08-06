// Fixture-backed smoke test for the authored Milo C2 block forge-section-1.
// Runs under Milo's @web/test-runner (browser). Each it() loads the class-less
// DA-serialised fixture itself (no shared async hook) and keeps to a handful of
// focused assertions so it never hangs the coverage session.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-section-1.js';

describe('forge-section-1', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the flat DA content into the 5-card collage', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-section-1');
    expect(block, 'mock body has the block root').to.exist;

    await init(block);

    expect(block.dataset.forgeAuthored).to.equal('forge-section-1');
    expect(block.querySelector('.fs1-stage .fs1-inner'), 'stage reconstructed').to.exist;
    expect(block.querySelectorAll('.fs1-card').length, 'five cards rebuilt').to.equal(5);
    expect(block.querySelector('.fs1-report .rpt__title')?.tagName, 'report title is an h2').to.equal('H2');
    expect(block.querySelectorAll('.mm__bar').length, 'four media-mix bars').to.equal(4);
    expect(block.querySelectorAll('.rpt__bar').length, 'twelve report bars').to.equal(12);
  });
});
