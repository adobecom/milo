import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect, assert } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor, waitForElement } from '../../helpers/waitfor.js';

import { setConfig, createTag, getFedsPlaceholderConfig } from '../../../libs/utils/utils.js';
import { decorateAnchorVideo, handlePause, applyHoverPlay, USER_PAUSED_ATTR } from '../../../libs/utils/decorate.js';

setConfig({});
const { default: init } = await import('../../../libs/blocks/video/video.js');

describe('video uploaded using franklin bot', () => {
  let clock;
  const callback = sinon.spy();
  beforeEach(async () => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
    document.body.innerHTML = '';
  });

  it('numbers both controls only after a second video is decorated', async () => {
    const block = document.querySelector('.video.autoplay.single');
    const block2 = document.querySelector('.video.autoplay.second');
    const a = block.querySelector('a');
    const a2 = block2.querySelector('a');
    init(a);
    setTimeout(callback, 600);
    await clock.runAllAsync();
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    expect(pausePlayWrapper.getAttribute('video-index')).to.equal('1');
    expect(pausePlayWrapper.getAttribute('aria-label')).not.to.match(/\d/);
    init(a2);
    setTimeout(callback, 500);
    await clock.runAllAsync();
    expect(pausePlayWrapper.getAttribute('aria-label')).to.match(/ 1$/);
    expect(block2.querySelector('.pause-play-wrapper').getAttribute('aria-label')).to.match(/ 2$/);
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
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('loop')).to.be.true;
    expect(video.hasAttribute('data-hoverplay')).to.be.false;
  });

  it('decorate video with hoverplay when only hoverplay is added to url', async () => {
    const block = document.querySelector('.video.hoveronly');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-hoverplay')).to.be.true;
  });

  it('decorate video with viewportplay only with autoplay', async () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('accessibility controls should reflect paused videos that are not ready to play', () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    init(a);
    const video = block.querySelector('video');
    sinon.stub(video, 'readyState').get(() => 0);
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    pausePlayWrapper.click();
    pausePlayWrapper.click();
    expect(video.paused).to.be.true;
    expect(pausePlayWrapper.querySelector('.is-playing')).not.to.exist;
    expect(pausePlayWrapper.getAttribute('aria-label')).to.match(/^Play/i);
    expect(pausePlayWrapper.getAttribute('aria-pressed')).to.equal('false');
  });

  it('accessibility controls should play autoplay videos after a manual pause', () => {
    const block = document.querySelector('.video.autoplay.viewportplay');
    const a = block.querySelector('a');
    init(a);
    const video = block.querySelector('video');
    let paused = true;
    sinon.stub(video, 'paused').get(() => paused);
    sinon.stub(video, 'readyState').get(() => 4);
    sinon.stub(video, 'play').callsFake(() => { paused = false; return Promise.resolve(); });
    sinon.stub(video, 'pause').callsFake(() => { paused = true; });
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    pausePlayWrapper.click();
    pausePlayWrapper.setAttribute('daa-ll', pausePlayWrapper.getAttribute('aria-label'));
    pausePlayWrapper.click();
    expect(video.hasAttribute(USER_PAUSED_ATTR)).to.be.true;
    pausePlayWrapper.click();
    expect(video.hasAttribute(USER_PAUSED_ATTR)).to.be.false;
    expect(pausePlayWrapper.querySelector('.is-playing')).to.exist;
    expect(pausePlayWrapper.getAttribute('daa-ll')).to.equal(pausePlayWrapper.getAttribute('aria-label'));
  });

  ['milo', 'c2'].forEach((foundation) => {
    describe(`shared video controls (${foundation})`, () => {
      let decorate;
      let video;
      let control;
      let stream;

      before(async () => {
        const meta = createTag('meta', { name: 'foundation', content: foundation });
        document.head.append(meta);
        decorate = await import(`../../../libs/utils/decorate.js?video-controls-${foundation}`);
        meta.remove();
        setConfig({
          placeholders: {
            'play-motion': 'Play motion',
            'pause-motion': 'Pause motion',
            'play-icon': 'Play icon',
            'pause-icon': 'Pause icon',
          },
        });
        getFedsPlaceholderConfig({ useCache: false });
      });

      beforeEach(async () => {
        document.body.innerHTML = decorate.addAccessibilityControl('<video autoplay muted></video>', 'autoplay muted', 2);
        video = document.querySelector('video');
        control = document.querySelector('.play-pause-button, .pause-play-wrapper');
        const canvas = createTag('canvas', { width: 16, height: 16 });
        canvas.getContext('2d').fillRect(0, 0, 16, 16);
        stream = canvas.captureStream(10);
        video.srcObject = stream;
        await video.play();
        video.pause();
      });

      afterEach(() => {
        video.pause();
        video.srcObject = null;
        stream.getTracks().forEach((track) => track.stop());
        sinon.restore();
        document.body.innerHTML = '';
      });

      function expectState(playing) {
        expect(control.querySelector('.offset-filler').classList.contains('is-playing')).to.equal(playing);
        expect(control.getAttribute('aria-label')).to.match(playing ? /^Pause(?: motion)? 2$/ : /^Play(?: motion)? 2$/);
        expect(control.getAttribute('title')).to.equal(control.getAttribute('aria-label'));
        expect(control.getAttribute('aria-pressed')).to.equal(String(playing));
      }

      it('preserves tabindex and the video index for existing callers', () => {
        const holder = createTag('div');
        holder.innerHTML = decorate.addAccessibilityControl('<video muted></video>', 'muted', 2, -1);
        const button = holder.querySelector('.play-pause-button, .pause-play-wrapper');
        expect(button.tabIndex).to.equal(-1);
        expect(button.getAttribute('video-index')).to.equal('2');
        expect(button.getAttribute('aria-pressed')).to.equal('false');
        decorate.syncPausePlayIcon(holder.querySelector('video'));
        expect(button.getAttribute('aria-label')).to.match(/^Play(?: motion)? 2$/);
      });

      it('preserves reduced-motion state through localization and Enter/Space playback', async () => {
        const matchMedia = window.matchMedia.bind(window);
        sinon.stub(window, 'matchMedia').callsFake((query) => (
          query === '(prefers-reduced-motion: reduce)' ? { matches: true } : matchMedia(query)
        ));
        decorate.applyAccessibilityEvents(video);
        expectState(false);
        expect(video.hasAttribute('autoplay')).to.be.false;
        video.dispatchEvent(new Event('canplay'));
        expect(video.paused).to.be.true;
        decorate.decoratePausePlayWrapper(video);
        await waitFor(() => control.getAttribute('aria-label') === 'Play motion 2');
        expectState(false);
        control.focus();
        await sendKeys({ press: 'Enter' });
        expect(video.paused).to.be.false;
        expectState(true);
        await sendKeys({ press: 'Space' });
        expect(video.paused).to.be.true;
        expectState(false);
        expect(video.hasAttribute(USER_PAUSED_ATTR)).to.be.true;
        await sendKeys({ press: 'Space' });
        expect(video.paused).to.be.false;
        expectState(true);
        expect(video.hasAttribute(USER_PAUSED_ATTR)).to.be.false;
      });

      it('keeps delayed media paused under reduced motion until the user starts playback', async () => {
        const matchMedia = window.matchMedia.bind(window);
        sinon.stub(window, 'matchMedia').callsFake((query) => (
          query === '(prefers-reduced-motion: reduce)' ? { matches: true } : matchMedia(query)
        ));
        video.srcObject = null;
        video.load();
        decorate.applyAccessibilityEvents(video);
        const canPlay = new Promise((resolve) => {
          video.addEventListener('canplay', resolve, { once: true });
        });
        video.srcObject = stream;
        await canPlay;
        expect(video.paused).to.be.true;
        expectState(false);
        const playing = new Promise((resolve) => {
          video.addEventListener('playing', resolve, { once: true });
        });
        control.click();
        await playing;
        expectState(true);
      });

      it('preserves normal autoplay and does not restart a manually paused video on canplay', async () => {
        const matchMedia = window.matchMedia.bind(window);
        sinon.stub(window, 'matchMedia').callsFake((query) => (
          query === '(prefers-reduced-motion: reduce)' ? { matches: false } : matchMedia(query)
        ));
        const playSpy = sinon.spy(video, 'play');
        decorate.applyAccessibilityEvents(video);
        expect(video.hasAttribute('autoplay')).to.be.true;
        const playing = new Promise((resolve) => {
          video.addEventListener('playing', resolve, { once: true });
        });
        video.dispatchEvent(new Event('canplay'));
        await playing;
        expectState(true);
        control.click();
        expect(video.paused).to.be.true;
        expect(video.hasAttribute(USER_PAUSED_ATTR)).to.be.true;
        video.dispatchEvent(new Event('canplay'));
        expect(playSpy.calledOnce).to.be.true;
        expectState(false);
      });

      it('renumbers the first control without changing its paused state when another video is decorated', async () => {
        sinon.stub(window, 'IntersectionObserver').returns({ observe: sinon.stub() });
        const addVideo = (hash = '#autoplay') => {
          const holder = createTag('div');
          const anchor = createTag('a', { href: `/test/video.mp4${hash}` });
          holder.append(anchor);
          document.body.append(holder);
          decorate.decorateAnchorVideo({ src: anchor.href, anchorTag: anchor });
          return holder.querySelector('[video-index]');
        };
        const first = addVideo();
        if (first.getAttribute('aria-label') !== 'Play motion') {
          await waitFor(() => first.getAttribute('aria-label') === 'Play motion');
        }
        expect(addVideo('')).to.be.null;
        expect(addVideo('#hoverplay')).to.be.null;
        expect(first.getAttribute('aria-label')).to.equal('Play motion');
        const second = addVideo();
        expect(first.getAttribute('aria-label')).to.equal('Play motion 1');
        expect(first.getAttribute('title')).to.equal('Play motion 1');
        expect(first.querySelector('.is-playing')).not.to.exist;
        expect(first.getAttribute('aria-pressed')).to.equal('false');
        expect(second.getAttribute('aria-label')).to.equal('Play motion 2');
        decorate.syncPausePlayIcon(first.parentElement.querySelector('video'));
        expect(first.getAttribute('aria-label')).to.equal('Play motion 1');
      });

      it('synchronizes repeated media events, programmatic pauses, and the end of viewport playback', async () => {
        video.removeAttribute('autoplay');
        video.setAttribute('data-play-viewport', '');
        decorate.applyAccessibilityEvents(video);
        expectState(false);
        await video.play();
        expectState(true);
        video.dispatchEvent(new Event('playing'));
        video.dispatchEvent(new Event('playing'));
        expectState(true);
        video.pause();
        video.dispatchEvent(new Event('pause'));
        expectState(false);
        await video.play();
        sinon.stub(video, 'ended').get(() => true);
        video.dispatchEvent(new Event('ended'));
        video.dispatchEvent(new Event('ended'));
        expectState(false);
      });

      it('synchronizes controls relocated outside the video holder via aria-controls', async () => {
        video.id = 'background-video';
        control.setAttribute('aria-controls', video.id);
        decorate.applyAccessibilityEvents(video);
        document.body.append(control);
        control.click();
        expectState(true);
        video.pause();
        await waitFor(() => !control.querySelector('.is-playing'));
        expectState(false);
      });

      ['blocks', 'mep/ace1151', 'mep/emea1443'].forEach((path) => {
        it(`preserves accordion video playback on panel changes (${path})`, async () => {
          const matchMedia = window.matchMedia.bind(window);
          sinon.stub(window, 'matchMedia').callsFake((query) => (
            ['(min-width: 1200px)', '(max-width: 1199px)'].includes(query)
              ? { matches: query === '(min-width: 1200px)', addEventListener: sinon.stub() }
              : matchMedia(query)
          ));
          const { default: initAccordion } = await import(`../../../libs/${path}/accordion/accordion.js`);
          const block = createTag('div', { class: 'accordion editorial' }, `
            <div><div>Video</div></div><div><div>Video description</div></div><div></div>
            <div><div>Other media</div></div><div><div>Other description</div></div><div></div>
          `);
          block.children[2].append(video.closest('.video-holder'));
          document.body.replaceChildren(block);
          decorate.applyAccessibilityEvents(video);
          await video.play();
          const clickSpy = sinon.spy(control, 'click');
          await initAccordion(block);
          expect(clickSpy.called).to.be.false;
          expectState(true);
          const [first, second] = block.querySelectorAll('.accordion-trigger');
          second.click();
          expectState(false);
          first.click();
          expectState(true);
          first.click();
          expectState(false);
        });
      });
    });
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
    init(a);
    setTimeout(callback, 0);
    await clock.runAllAsync();
    const pausePlayWrapper = block.querySelector('.pause-play-wrapper');
    const video = block.querySelector('video');
    pausePlayWrapper.focus();
    setTimeout(callback, 0);
    await clock.runAllAsync();
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

    init(a);
    const video = block.querySelector('video');
    const playSpy = sinon.spy(video, 'play');
    const pauseSpy = sinon.spy(video, 'pause');
    const intersectionObserverAddsSource = () => video.querySelector('source');
    await waitFor(intersectionObserverAddsSource);
    video.scrollIntoView();
    await nextFrame();
    setTimeout(callback, 100);
    await clock.runAllAsync();
    assert.isTrue(playSpy.calledOnce);

    // push the video out of the viewport
    const div = document.createElement('div');
    div.style.height = '2000px';
    video.parentNode.insertBefore(div, video);

    await nextFrame();
    setTimeout(callback, 100);
    await clock.runAllAsync();
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

    init(a);
    const video = block.querySelector('video');
    const playSpy = sinon.spy(video, 'play');
    const pauseSpy = sinon.spy(video, 'pause');
    const endedSpy = sinon.spy();
    const intersectionObserverAddsSource = () => video.querySelector('source');
    await waitFor(intersectionObserverAddsSource);

    video.addEventListener('ended', endedSpy);
    video.scrollIntoView();
    await nextFrame();
    setTimeout(callback, 100);
    await clock.runAllAsync();
    assert.isTrue(playSpy.calledOnce);

    // push the video out of the viewport
    const div = document.createElement('div');
    div.style.height = '2000px';
    video.parentNode.insertBefore(div, video);

    await nextFrame();
    setTimeout(callback, 200);
    await clock.runAllAsync();
    assert.isTrue(pauseSpy.calledOnce);
    video.dispatchEvent(new Event('ended'));
    await nextFrame();
    setTimeout(callback, 100);
    await clock.runAllAsync();

    video.scrollIntoView();
    await nextFrame();
    setTimeout(callback, 100);
    await clock.runAllAsync();

    expect(playSpy.callCount).to.equal(1);
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('decorate video with viewportplay only with autoplay1', async () => {
    const block = document.querySelector('.video.autoplay1.viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.true;
  });

  it('decorate video with no viewportplay with autoplay1 hoverplay', async () => {
    const block = document.querySelector('.video.autoplay1.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay with hoverplay', async () => {
    const block = document.querySelector('.video.hoverplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay no autoplay', async () => {
    const block = document.querySelector('.video.no-autoplay.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });

  it('decorate video with no viewportplay no autoplay1', async () => {
    const block = document.querySelector('.video.no-autoplay1.no-viewportplay');
    const a = block.querySelector('a');
    block.append(a);

    init(a);
    const video = block.querySelector('video');
    expect(video.hasAttribute('data-play-viewport')).to.be.false;
  });
});
