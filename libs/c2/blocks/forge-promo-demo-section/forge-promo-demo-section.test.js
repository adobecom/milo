// L22 test fixture for the authored Milo block forge-promo-demo-section.
// Runs under Milo's @web/test-runner (browser); the ship gate scopes to
// libs/c2/blocks/forge-*/**/*.test.js, so a forge block gates on ITS own test.
// Each it() loads the fixture itself (no shared async hook) and the fixture uses
// only data-URI images, so nothing hits the network.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-promo-demo-section.js';

describe('forge-promo-demo-section', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the promo frame/bar from the flat DA content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-promo-demo-section');
    await init(block);
    const frame = block.querySelector('.promo-frame');
    expect(frame, 'built the promo frame container').to.exist;
    expect(frame.querySelector('.promo-bar'), 'built the promo bar').to.exist;
    expect(frame.querySelector('.promo-screenshot'), 'built the screenshot canvas').to.exist;
    expect(block.dataset.forgeAuthored).to.equal('forge-promo-demo-section');
  });

  it('rebuilds the copy, CTA and close control from probed content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-promo-demo-section');
    await init(block);
    const cta = block.querySelector('.see-offers-btn');
    expect(block.querySelector('.promo-body')?.textContent).to.contain('Black Friday');
    expect(cta, 'built the CTA link').to.exist;
    expect(cta.querySelectorAll('.ic-cta').length, 'kept leading + trailing icons').to.equal(2);
    expect(block.querySelector('.promo-close'), 'built the close button').to.exist;
  });
});
