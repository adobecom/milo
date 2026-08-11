// Gate test for the authored Milo block forge-work-faster-no-matter-the-work.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// Each it() loads the fixture itself (no shared async hook) to keep the session
// from hanging the coverage gate; images in the fixture are data-URIs (no network).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-work-faster-no-matter-the-work.js';

const NAME = 'forge-work-faster-no-matter-the-work';

describe(NAME, () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the flat DA content into the card grid + logo strip', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector(`.${NAME}`);
    expect(block, 'mock body has the block root').to.exist;
    await init(block);

    // reconstruction is gated, not assumed: grid + exactly 4 audience cards + logos
    expect(block.querySelector('.fwf__carousel'), 'carousel grid built').to.exist;
    expect(block.querySelectorAll('.fwf__card').length, '4 audience cards').to.equal(4);
    expect(block.querySelector('.fwf__logos'), 'logo strip built').to.exist;
    // the Human Resources card carries a base photo + one overlay layer
    const layered = [...block.querySelectorAll('.fwf__card-img')].some((w) => w.querySelectorAll('picture').length === 2);
    expect(layered, 'a card has a stacked overlay layer').to.equal(true);
    expect(block.dataset.forgeAuthored).to.equal(NAME);
  });
});
