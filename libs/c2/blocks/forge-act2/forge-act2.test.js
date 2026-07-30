// Gate for forge-act2. Runs under Milo's @web/test-runner (browser). The
// fixture mirrors DA's FLAT, class-less serialization, so these assertions
// prove init() RECONSTRUCTS the lede + tiles layout — not that authored
// classes survived (they don't in production).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-act2.js';

describe('forge-act2', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the contact section from flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-act2');
    await init(block);
    expect(block.dataset.forgeAuthored, 'forge marker set').to.equal('forge-act2');
    expect(block.getAttribute('daa-lh'), 'section analytics handle').to.equal('forge-act2');
    expect(block.querySelector('.wrap .lede .info-ic'), 'lede + info icon rebuilt').to.exist;
    expect(block.querySelectorAll('.tiles .tile').length, 'three tiles rebuilt').to.equal(3);
    expect(block.querySelectorAll('.tiles .tile .arw').length, 'each tile has an arrow').to.equal(3);
    expect(block.querySelector('.tile[daa-ll]'), 'tiles carry analytics labels').to.exist;
  });
});
