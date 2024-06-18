import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({});
const { default: init } = await import('../../../libs/blocks/video/video.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('video uploaded using franklin bot', () => {
  it('decorates no-lazy video', async () => {
    const block = document.querySelector('.video.no-lazy');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = await waitForElement('.video.no-lazy video');
    expect(video).to.exist;
  });

  it('decorates video', async () => {
    const block = document.querySelector('.video.normal');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.normal video');
    expect(video).to.exist;
  });

  it('decorates video with autoplay', async () => {
    const block = document.querySelector('.video.autoplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.autoplay video');
    expect(video.hasAttribute('autoplay')).to.be.true;
  });

  it('decorates video with autoplay and no loop', async () => {
    const block = document.querySelector('.video.no-loop');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.no-loop video');
    expect(video.hasAttribute('loop')).to.be.false;
  });

  it('decorates video with autoplay, no loop and hover play', async () => {
    const block = document.querySelector('.video.no-loop.hoverplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.no-loop.hoverplay video');
    expect(video.hasAttribute('loop')).to.be.false;
    expect(video.hasAttribute('data-hoverplay')).to.be.true;
  });

  it('no hoverplay attribute added when with autoplay on loop', async () => {
    const block = document.querySelector('.video.autoplay.playonhover');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.autoplay.playonhover video');
    expect(video.hasAttribute('loop')).to.be.true;
    expect(video.hasAttribute('data-hoverplay')).to.be.false;
  });

  it('decorate video with hoverplay when only hoverplay is added to url', async () => {
    const block = document.querySelector('.video.hoveronly');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.hoveronly video');
    expect(video.hasAttribute('data-hoverplay')).to.be.true;
  });

  // Tests for play video in ViewPort
  it('decorate video with viewportplay only with autoplay', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.autoplay.viewportplay video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });
  it('decorate video with viewportplay only with autoplay1', async () => {
    const block = document.querySelector('.video.autoplay1.viewportplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.autoplay1.viewportplay video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });
  it('decorate video with no viewportplay with autoplay1 hoverplay', async () => {
    const block = document.querySelector('.video.autoplay1.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.autoplay1.hoverplay.no-viewportplay video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
  it('decorate video with no viewportplay with hoverplay', async () => {
    const block = document.querySelector('.video.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.hoverplay.no-viewportplay video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
  it('decorate video with no viewportplay no autoplay', async () => {
    const block = document.querySelector('.video.no-autoplay.no-viewportplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.no-autoplay.no-viewportplay video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
  it('decorate video with no viewportplay no autoplay1', async () => {
    const block = document.querySelector('.video.no-autoplay1.no-viewportplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);
    const video = await waitForElement('.video.no-autoplay1.no-viewportplay video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
});
