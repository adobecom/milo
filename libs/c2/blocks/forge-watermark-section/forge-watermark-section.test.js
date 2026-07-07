// L22 fixture test for the authored Milo block forge-watermark-section.
// Runs under Milo's @web/test-runner (browser). Each it() loads the fixture
// itself (no shared before hook — keeps the coverage session from hanging) and
// asserts init() RECONSTRUCTED the decorative watermark + foreground (C24).
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-watermark-section.js';

describe('forge-watermark-section', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('builds the decorative watermark layer and stamps the forge marker', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-watermark-section');
    expect(block, 'mock body has the block root').to.exist;
    await init(block);

    const watermark = block.querySelector('.forge-watermark-section__watermark');
    expect(watermark, 'watermark layer reconstructed').to.exist;
    expect(watermark.getAttribute('aria-hidden')).to.equal('true');
    expect(watermark.querySelector('svg .forge-watermark-section__mark-path'), 'stroked mark path present').to.exist;
    expect(block.dataset.forgeAuthored).to.equal('forge-watermark-section');
  });

  it('lifts authored foreground content above the watermark', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.forge-watermark-section');
    await init(block);

    const content = block.querySelector('.forge-watermark-section__content');
    expect(content, 'foreground content layer present').to.exist;
    expect(content.querySelector('h2'), 'authored heading preserved').to.exist;
    expect(block.querySelector(':scope > div > div'), 'DA cell wrappers unwrapped').to.not.exist;
  });
});
