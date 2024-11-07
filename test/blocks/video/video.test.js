import { readFile } from '@web/test-runner-commands';
import { expect, assert } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor, waitForElement } from '../../helpers/waitfor.js';

import { setConfig, createTag } from '../../../libs/utils/utils.js';
import { decorateAnchorVideo, handlePause, applyHoverPlay } from '../../../libs/utils/decorate.js';

setConfig({});
const { default: init } = await import('../../../libs/blocks/video/video.js');

describe('video uploaded using franklin bot', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('removes the element, if it does not have a parent node', (done) => {
    const anchor = createTag('a');
    anchor.remove = () => done();
    init(anchor);
  });

  it('does not do anything, if the element is not a valid htmlEl', () => {
    expect(() => {
      decorateAnchorVideo({ anchorTag: undefined });
    }).not.to.throw();

    expect(() => {
      decorateAnchorVideo({ src: 'some-length', anchorTag: undefined });
    }).not.to.throw();
  });

  it('decorates video', async () => {
    const block = document.querySelector('.video.normal');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    await init(a);
    const video = await waitForElement('.video.normal video');
    expect(video).to.exist;
  });

  it('decorates video with autoplay', async () => {
    const block = document.querySelector('.video.autoplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    await init(a);
    const video = await waitForElement('.video.autoplay video');
    expect(video.hasAttribute('autoplay')).to.be.true;
  });

  it('decorates video with autoplay and no loop', async () => {
    const block = document.querySelector('.video.no-loop');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    await init(a);
    const video = await waitForElement('.video.no-loop video');
    expect(video.hasAttribute('loop')).to.be.false;
  });

  it('decorates video with autoplay, no loop and hover play', async () => {
    const block = document.querySelector('.video.no-loop.hoverplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    await init(a);
    const video = await waitForElement('.video.no-loop.hoverplay video');
    expect(video.hasAttribute('loop')).to.be.false;
    expect(video.hasAttribute('data-hoverplay')).to.be.true;
  });

  it('no hoverplay attribute added when with autoplay on loop', async () => {
    const block = document.querySelector('.video.autoplay.playonhover');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('loop')).to.be.true;
    expect(video.hasAttribute('data-hoverplay')).to.be.false;
  });

  it('decorate video with hoverplay when only hoverplay is added to url', async () => {
    const block = document.querySelector('.video.hoveronly');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-hoverplay')).to.be.true;
  });

  it('decorate video with viewportplay only with autoplay', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('accessibility controls should pause autoplay videos', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({
      total: 19,
      offset: 0,
      limit: 19,
      data: [
        {
          key: 'play-motion',
          value: 'Play',
        },
        {
          key: 'pause-motion',
          value: 'Pause',
        },
        {
          key: 'play-icon',
          value: 'play icon',
        },
        {
          key: 'pause-icon',
          value: 'pause icon',
        },
      ],
      ':type': 'sheet',
    });
    const a = block.querySelector('a');
    block.append(a);
    await init(a);
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    const video = block.querySelector('video');
    pausePlayWrapper.click();
    expect(video.paused).to.be.true;
  });

  it('accessibility controls should play autoplay videos after pausing', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    block.append(a);
    await init(a);
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    const video = block.querySelector('video');
    pausePlayWrapper.click();
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    await pausePlayWrapper.click();
    expect(video.paused).to.be.false;
  });

  it('aria-label should not have index when page has only one video', async () => {
    const block = document.querySelector('.video.autoplay.single');
    const a = block.querySelector('a');
    a.setAttribute('indexOfBlock', 1);
    block.append(a);
    await init(a);
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    const airaLabel = pausePlayWrapper.getAttribute('aria-label');
    expect(airaLabel).to.equals('Pause');
  });

  it('aria-label should have index when page has only one video', async () => {
    const block = document.querySelector('.video.autoplay.single');
    const block2 = document.querySelector('.video.autoplay.second');
    const a = block.querySelector('a');
    const a2 = block2.querySelector('a');
    a.setAttribute('indexOfBlock', 1);
    a2.setAttribute('indexOfBlock', 2);
    block.append(a);
    block2.append(a2);
    await init(a);
    await init(a2);
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    const airaLabel = pausePlayWrapper.getAttribute('aria-label');
    expect(airaLabel).to.equals('Pause 1');
  });

  it('handlePause should return undefined if called with unknown event', async () => {
    const event = {};
    event.stopPropagation = sinon.stub();
    const x = handlePause(event);
    expect(x).to.be.undefined;
  });

  it('video should be paused on focus out or blur', async () => {
    const block = document.querySelector('.video.autoplay1.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);
    await init(a);
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    const video = block.querySelector('video');
    pausePlayWrapper.focus();
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    pausePlayWrapper.blur();
    expect(video.paused).to.be.true;
  });

  it('should return undefined if video is not present', async () => {
    const returnValue = applyHoverPlay();
    expect(returnValue).to.be.undefined;
  });

  it('play video when element reached 80% viewport', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay.scrolled-80');
    const a = block.querySelector('a');
    block.append(a);
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    await init(a);
    const video = block.querySelector('video');
    const playSpy = sinon.spy(video, 'play');
    const pauseSpy = sinon.spy(video, 'pause');
    const intersectionObserverAddsSource = () => video.querySelector('source');
    await waitFor(intersectionObserverAddsSource);
    video.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    assert.isTrue(playSpy.calledOnce);

    // push the video out of the viewport
    const div = document.createElement('div');
    div.style.height = '2000px';
    video.parentNode.insertBefore(div, video);

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
    block.append(a);
    const nextFrame = () => new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    await init(a);
    const video = block.querySelector('video');
    const playSpy = sinon.spy(video, 'play');
    const pauseSpy = sinon.spy(video, 'pause');
    const endedSpy = sinon.spy();
    const intersectionObserverAddsSource = () => video.querySelector('source');
    await waitFor(intersectionObserverAddsSource);

    video.addEventListener('ended', endedSpy);
    video.scrollIntoView();
    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    assert.isTrue(playSpy.calledOnce);

    // push the video out of the viewport
    const div = document.createElement('div');
    div.style.height = '2000px';
    video.parentNode.insertBefore(div, video);

    await nextFrame();
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
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
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('decorate video with no viewportplay with autoplay1 hoverplay', async () => {
    const block = document.querySelector('.video.autoplay1.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay with hoverplay', async () => {
    const block = document.querySelector('.video.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay no autoplay', async () => {
    const block = document.querySelector('.video.no-autoplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay no autoplay1', async () => {
    const block = document.querySelector('.video.no-autoplay1.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    await init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
});
