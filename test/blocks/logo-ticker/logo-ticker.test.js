import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/logo-ticker/logo-ticker.js';

describe('Logo Ticker', () => {
  it('builds a single track (role=img) that replaces the block content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    expect(block.children.length).to.equal(1);
    const track = block.querySelector(':scope > .logo-ticker-track');
    expect(track).to.exist;
    expect(track.getAttribute('role')).to.equal('img');
  });

  it('duplicates the logos into two sets, hiding the second from assistive tech', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const sets = block.querySelectorAll('.logo-ticker-set');
    expect(sets.length).to.equal(2);
    expect(sets[0].hasAttribute('aria-hidden')).to.be.false;
    expect(sets[1].getAttribute('aria-hidden')).to.equal('true');

    // each set has a clone of all three logos → six icons total
    expect(sets[0].querySelectorAll('span.icon').length).to.equal(3);
    expect(sets[1].querySelectorAll('span.icon').length).to.equal(3);
    expect(block.querySelectorAll('span.icon').length).to.equal(6);
  });

  it('labels the track from the second block row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    expect(block.querySelector('.logo-ticker-track').getAttribute('aria-label'))
      .to.equal('Trusted by leading brands');
  });

  it('omits the aria-label when there is no second row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-aria.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const track = block.querySelector('.logo-ticker-track');
    expect(track).to.exist;
    expect(track.hasAttribute('aria-label')).to.be.false;
    expect(block.querySelectorAll('.logo-ticker-set span.icon').length).to.equal(4);
  });

  it('does nothing when there are no logos', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-logos.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    expect(block.querySelector('.logo-ticker-track')).to.be.null;
  });
});
