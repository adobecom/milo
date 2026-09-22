import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/logo-ticker/logo-ticker.js';

describe('Logo Ticker', () => {
  it('builds a wrap + play/pause button as the two direct block children', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    expect(block.children.length).to.equal(2);
    expect(block.querySelector(':scope > .logo-ticker-wrap')).to.exist;
    expect(block.querySelector(':scope > .logo-ticker-play-pause')).to.exist;
  });

  it('places the track (role=img) inside the wrap', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const track = block.querySelector('.logo-ticker-wrap > .logo-ticker-track');
    expect(track).to.exist;
    expect(track.getAttribute('role')).to.equal('img');
  });

  it('duplicates logos into three sets, hiding sets 2 and 3 from assistive tech', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const sets = block.querySelectorAll('.logo-ticker-set');
    expect(sets.length).to.equal(3);
    expect(sets[0].hasAttribute('aria-hidden')).to.be.false;
    expect(sets[1].getAttribute('aria-hidden')).to.equal('true');
    expect(sets[2].getAttribute('aria-hidden')).to.equal('true');

    expect(sets[0].querySelectorAll('span.icon').length).to.equal(3);
    expect(sets[1].querySelectorAll('span.icon').length).to.equal(3);
    expect(sets[2].querySelectorAll('span.icon').length).to.equal(3);
    expect(block.querySelectorAll('span.icon').length).to.equal(9);
  });

  it('labels the track from the first segment of the second row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    expect(block.querySelector('.logo-ticker-track').getAttribute('aria-label'))
      .to.equal('Trusted by leading brands');
  });

  it('reads play and pause labels from the || segments of the second row', async () => {
    document.body.innerHTML = `
      <div class="logo-ticker">
        <div><p><span class="icon icon-a"></span></p><p><span class="icon icon-b"></span></p></div>
        <div>Logo row || Start rolling || Stop rolling</div>
      </div>`;
    const block = document.querySelector('.logo-ticker');
    init(block);

    const button = block.querySelector('.logo-ticker-play-pause');
    expect(button.getAttribute('aria-label')).to.equal('Stop rolling');
  });

  it('play/pause button starts in playing state with correct aria attributes', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const button = block.querySelector('.logo-ticker-play-pause');
    expect(button).to.exist;
    expect(button.classList.contains('is-playing')).to.be.true;
    expect(button.getAttribute('aria-pressed')).to.equal('true');
  });

  it('toggles playing state and aria-pressed when the button is clicked', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const button = block.querySelector('.logo-ticker-play-pause');
    button.click();
    expect(button.classList.contains('is-playing')).to.be.false;
    expect(button.getAttribute('aria-pressed')).to.equal('false');

    button.click();
    expect(button.classList.contains('is-playing')).to.be.true;
    expect(button.getAttribute('aria-pressed')).to.equal('true');
  });

  it('omits the track aria-label when there is no second row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-aria.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    const track = block.querySelector('.logo-ticker-track');
    expect(track).to.exist;
    expect(track.hasAttribute('aria-label')).to.be.false;
    expect(block.querySelectorAll('.logo-ticker-set span.icon').length).to.equal(6);
  });

  it('does nothing when there are no logos', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-logos.html' });
    const block = document.querySelector('.logo-ticker');
    init(block);

    expect(block.querySelector('.logo-ticker-track')).to.be.null;
  });
});
