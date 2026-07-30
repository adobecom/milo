// L22 gate for forge-tools-that-work-for-you-3. Runs under Milo's
// @web/test-runner (browser). Each it() loads the class-less fixture itself
// (no shared before/beforeEach hook) so the session never hangs on a heavy
// async setup, and every image is a data-URI so nothing hits the network.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from './forge-tools-that-work-for-you-3.js';

const FIXTURE = './mocks/body.html';
const BLOCK = 'forge-tools-that-work-for-you-3';

describe('forge-tools-that-work-for-you-3', () => {
  it('exports a callable init(el)', () => {
    expect(init).to.be.a('function');
  });

  it('reconstructs the media layer with both background pictures + scrim', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const media = block.querySelector('.hero-media');
    expect(media, 'media layer rebuilt (not a flat stack)').to.exist;
    expect(media.querySelectorAll('picture').length, 'both pictures moved into media').to.equal(2);
    expect(media.querySelector('.hero-scrim'), 'gradient scrim present').to.exist;
  });

  it('reconstructs the foreground lockup and stamps the forge marker', async () => {
    document.body.innerHTML = await readFile({ path: FIXTURE });
    const block = document.querySelector(`.${BLOCK}`);
    await init(block);
    const heading = block.querySelector('.hero-foreground .hero-heading');
    expect(heading?.textContent).to.contain('Tools that work for you.');
    expect(block.querySelector('.hero-foreground .hero-cta'), 'CTA rebuilt').to.exist;
    expect(block.dataset.forgeAuthored).to.equal(BLOCK);
  });
});
