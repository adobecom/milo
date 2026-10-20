import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/base-card/base-card.js';

describe('Base Card', () => {
  it('adds base-card-section class to the closest section', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    expect(block.closest('.section').classList.contains('base-card-section')).to.be.true;
  });

  it('decorates foreground and media, and marks only standalone links', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    const foreground = block.querySelector('.foreground');
    expect(foreground).to.exist;

    const media = block.querySelector('.media');
    expect(media).to.exist;
    expect(media.classList.contains('parallax-featured-card-media')).to.be.false;
    expect(media.querySelector('picture').classList.contains('parallax-scale-down')).to.be.true;

    const links = foreground.querySelectorAll('a');
    const standalone = [...links].find((a) => a.textContent.trim() === 'Learn more');
    const inline = [...links].find((a) => a.textContent.trim() === 'terms');

    expect(standalone.classList.contains('standalone-link')).to.be.true;
    expect(standalone.classList.contains('label')).to.be.true;
    expect(inline.classList.contains('standalone-link')).to.be.false;
    expect(inline.classList.contains('label')).to.be.false;
  });

  it('adds parallax-featured-card-media class when the block is featured', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/featured.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    const media = block.querySelector('.media');
    expect(media.classList.contains('parallax-featured-card-media')).to.be.true;
  });

  it('moves a single-picture first cell into media as the icon and rewrites its federated svg src', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/icon.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    const foreground = block.querySelector('.foreground');
    const media = block.querySelector('.media');

    const icon = media.querySelector('picture.icon');
    expect(icon).to.exist;
    expect(icon.querySelector('img').getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/icon.svg');

    // original icon cell removed, heading is now the first child of foreground
    expect(foreground.children[0].tagName).to.equal('H3');
  });

  it('leaves a non-icon first cell in place', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/non-icon-first-cell.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    const foreground = block.querySelector('.foreground');
    const media = block.querySelector('.media');

    expect(foreground.children[0].textContent.trim()).to.equal('Plain text first cell, not an icon.');
    expect(media.querySelector('picture.icon')).to.be.null;
  });

  it('decorates foreground without throwing when there is no media cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-media.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    expect(block.querySelector('.foreground')).to.exist;
    expect(block.querySelector('.media')).to.be.null;
  });

  it('does not throw when the block has no foreground cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/empty.html' });
    const block = document.querySelector('.base-card');
    await init(block);

    expect(block.closest('.section').classList.contains('base-card-section')).to.be.true;
  });

  describe('video', () => {
    const hitAtCenter = (el) => {
      el.scrollIntoView({ block: 'center' });
      const { left, top, width, height } = el.getBoundingClientRect();
      return document.elementFromPoint(left + width / 2, top + height / 2);
    };

    before(async () => {
      await new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/libs/c2/blocks/base-card/base-card.css';
        link.onload = resolve;
        document.head.append(link);
      });
    });

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/video.html' });
      document.querySelectorAll('.base-card').forEach((block) => init(block));
    });

    it('lets clicks reach native video controls instead of the card link', () => {
      const video = document.querySelector('#nativeControls video');
      expect(hitAtCenter(video) === video, 'click reaches the video').to.be.true;
    });

    it('lets clicks reach the MPC iframe player instead of the card link', () => {
      const iframe = document.querySelector('#mpcIframe iframe');
      expect(hitAtCenter(iframe) === iframe, 'click reaches the iframe').to.be.true;
    });

    it('keeps the card link clickable over a native video without controls', () => {
      const video = document.querySelector('#nativeAutoplay video');
      expect(hitAtCenter(video).closest('a')?.href).to.equal('https://www.adobe.com/card-link');
    });

    it('sizes MPC native video to the card media box instead of its intrinsic size', () => {
      const { width, height } = document.querySelector('#nativeControls video').getBoundingClientRect();
      expect(Math.round(width)).to.equal(400);
      expect(Math.round(height)).to.equal(300);
    });

    it('leaves non-MPC native video sizing unchanged', () => {
      const { width, height } = document.querySelector('#nativeOther video').getBoundingClientRect();
      expect(Math.round(width)).to.equal(300);
      expect(Math.round(height)).to.equal(150);
    });
  });
});
