// L22 fixture for the authored Milo C2 block forge-section. Runs under Milo's
// @web/test-runner (browser). The fixture mirrors the FLAT, class-less shape DA
// serialises at runtime (no .logos/.quote/.brand Figma classes) — so these
// assertions gate that init() RECONSTRUCTS the rich layout, not that it inherits
// authored classes. Each it() loads the fixture itself (no shared async hook).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-section.js';

describe('forge-section', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('rebuilds the section head and responsive logo wall', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-section');
    await init(block);
    expect(block.getAttribute('daa-lh')).to.equal('forge-section');
    expect(block.querySelector('.container'), 'container rebuilt').to.exist;
    expect(block.querySelectorAll('.logo-item').length, 'six brand tiles').to.equal(6);
    expect(block.querySelector('.section-head .title').textContent).to.contain('transforming');
    expect(block.querySelector('.center-link a').textContent.toLowerCase()).to.contain('read more');
  });

  it('rebuilds the featured quote card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-section');
    await init(block);
    const quote = block.querySelector('.quote');
    expect(quote, 'quote card rebuilt').to.exist;
    expect(quote.querySelector('.brand').textContent).to.contain('Workday');
    expect(quote.querySelector('blockquote'), 'blockquote preserved').to.exist;
    expect(quote.querySelector('.who').textContent).to.contain('Emma');
    expect(quote.querySelector('.read a').textContent.toLowerCase()).to.contain('read the story');
  });
});
