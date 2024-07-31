import { readFile } from '@web/test-runner-commands';
import { expect, assert } from '@esm-bundle/chai';

import sinon from 'sinon';

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
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('loop')).to.be.true;
    expect(video.hasAttribute('data-hoverplay')).to.be.false;
  });

  it('decorate video with hoverplay when only hoverplay is added to url', async () => {
    const block = document.querySelector('.video.hoveronly');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-hoverplay')).to.be.true;
  });

  it('decorate video with viewportplay only with autoplay', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('play video when element reached 80% viewport', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay.scrolled-80');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    init(a);
    const video = block.querySelector('video');
    const source = video.querySelector('source');
    source.setAttribute('src', 'https://www.adobe.com/creativecloud/media_1167374e3354ef57f126fa78a55cbc1708ac4babd.mp4');
    source.setAttribute('type', 'video/mp4');

    const playSpy = sinon.spy(video, 'play');
    const pauseSpy = sinon.spy(video, 'pause');

    video.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    assert.isTrue(playSpy.calledOnce);

    document.body.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    assert.isTrue(pauseSpy.calledOnce);

    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('Don\'t play the video once it end when autoplay1 enabled', async () => {
    const block = document.querySelector('.video.autoplay1.viewportplay.ended');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    init(a);
    const video = block.querySelector('video');
    const source = video.querySelector('source');
    source.setAttribute('src', 'https://www.adobe.com/creativecloud/media_1167374e3354ef57f126fa78a55cbc1708ac4babd.mp4');
    source.setAttribute('type', 'video/mp4');

    const playSpy = sinon.spy(video, 'play');
    const pauseSpy = sinon.spy(video, 'pause');
    const endedSpy = sinon.spy();
    video.addEventListener('ended', endedSpy);

    video.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    assert.isTrue(playSpy.calledOnce);

    document.body.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    assert.isTrue(pauseSpy.calledOnce);

    video.dispatchEvent(new Event('ended'));
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    video.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(playSpy.callCount).to.equal(1);
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('decorate video with viewportplay only with autoplay1', async () => {
    const block = document.querySelector('.video.autoplay1.viewportplay');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('decorate video with no viewportplay with autoplay1 hoverplay', async () => {
    const block = document.querySelector('.video.autoplay1.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay with hoverplay', async () => {
    const block = document.querySelector('.video.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay no autoplay', async () => {
    const block = document.querySelector('.video.no-autoplay.no-viewportplay');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay no autoplay1', async () => {
    const block = document.querySelector('.video.no-autoplay1.no-viewportplay');
    const a = block.querySelector('a');
    a.textContent = 'no-lazy';
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
});
