// Gate test for the authored Milo C2 block forge-offer-sec9943. Runs under Milo's
// @web/test-runner (browser). The fixture is loaded INSIDE each it() (self-
// contained, no shared async hook) and every image is a data-URI, so the session
// never hits the network. Assertions GATE the reconstruction from flat content:
// collage rebuilt from the leading pictures, 8 tiles sliced at filename labels.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-offer-sec9943.js';

describe('forge-offer-sec9943', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the collage + document grid from flat class-less content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-offer-sec9943');
    expect(block, 'mock body has the block root').to.exist;
    await init(block);

    // The 5 leading pictures become collage cards (never an empty container).
    expect(block.querySelectorAll('.collage .collage-card').length).to.equal(5);
    // Every filename label slices a tile: 8 labels -> 8 tiles in the grid.
    expect(block.querySelectorAll('.docgrid .doc').length).to.equal(8);
    // The two in-grid photos land in their tiles' media slots.
    expect(block.querySelectorAll('.docgrid .doc-media').length).to.equal(2);
    expect(block.dataset.forgeAuthored).to.equal('forge-offer-sec9943');
  });
});
