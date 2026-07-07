// forge-grid-section — gates the JS reconstruction against the CLASS-LESS DA
// serialization (mocks/body.html). Fixture is loaded INSIDE each it() (no shared
// hook) and is network-free (no <img>/srcset), so the web-test-runner session
// never stalls.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-grid-section.js';

describe('forge-grid-section', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the grid from the flat DA content and stamps the marker', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-grid-section');
    await init(block);
    // grid container present, 8 cards (one per ".pdf" pill), each with a pill
    expect(block.querySelector('.grid-rows'), 'grid container built').to.exist;
    expect(block.querySelectorAll('.card').length, '8 cards reconstructed').to.equal(8);
    expect(block.querySelectorAll('.file-pill').length, '8 file pills').to.equal(8);
    expect(block.dataset.forgeAuthored).to.equal('forge-grid-section');
  });

  it('rows carry the authored 4-up cadence and copy holds the single h1', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-grid-section');
    await init(block);
    expect(block.querySelectorAll('.row').length, 'two rows of four').to.equal(2);
    expect(block.querySelectorAll('h1').length, 'exactly one h1').to.equal(1);
    expect(block.querySelector('.copy .copy-heading'), 'copy headline moved').to.exist;
  });
});
