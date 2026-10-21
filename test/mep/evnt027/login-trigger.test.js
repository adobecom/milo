import { expect } from '@esm-bundle/chai';
import { readFile, setViewport } from '@web/test-runner-commands';
import sinon from 'sinon';
import { createTag, loadArea, setConfig } from '../../../libs/utils/utils.js';
import init from '../../../libs/mep/evnt027/login-trigger.js';
import initBlock from '../../../libs/mep/evnt027/max26-login-prompt/max26-login-prompt.js';

const DISMISSED_KEY = 'evnt027-login-prompt-dismissed';
const FRAGMENT_PATH = '/fragments/max-login-trigger-test';
const FRAGMENT_HTML = '<div><div><div class="max26-login-prompt" data-block-status="loaded"><h2>MAX login</h2></div></div></div>';
const IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"/%3E';
const AUTHORED_BLOCK = `<div class="max26-login-prompt dark">
  <div><div><picture><img src="${IMAGE}" alt=""></picture></div></div>
  <div><div>
    <p><picture><img src="${IMAGE}" alt="Adobe MAX"></picture></p>
    <h2>Personalize your MAX experience.</h2>
    <p>Build your schedule.</p>
    <p><a href="https://www.adobe.com/">Register/Sign in</a></p>
    <p><a href="#guest">Continue as guest</a></p>
  </div></div>
</div>`;

describe('MAX login prompt trigger', () => {
  let clock;
  let stop;
  let target;
  let targetTop;
  let targetHeight;
  let fetchStub;
  let fragmentResponse;
  let visibility;
  let styles;

  const metadata = (name, content) => {
    document.head.querySelector(`meta[name="${name}"]`)?.remove();
    document.head.append(createTag('meta', { name, content }));
  };
  const configure = (query = '') => metadata('max26-login-prompt', `${FRAGMENT_PATH}${query}`);
  const flush = async () => {
    await clock.tickAsync(0);
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
    await clock.tickAsync(0);
  };
  const reachTarget = async () => {
    targetTop = window.innerHeight - 1;
    window.dispatchEvent(new Event('scroll'));
    await flush();
  };
  const modal = () => document.getElementById('max26-login-prompt');
  const addTarget = (top, height = 200) => {
    const element = createTag('section', { class: target.className }, 'Later section');
    const bounds = { top, bottom: top + height };
    sinon.stub(element, 'getBoundingClientRect').callsFake(() => bounds);
    document.querySelector('main').append(element);
    return { element, bounds };
  };
  const addVideo = (top = 0) => {
    const video = createTag('video', { controls: '' });
    const bounds = {
      top, bottom: top + 200, left: 0, right: 300, width: 300, height: 200,
    };
    sinon.stub(video, 'getBoundingClientRect').callsFake(() => bounds);
    document.querySelector('main').append(video);
    return { video, bounds };
  };
  const addIframe = (src = 'https://video.tv.adobe.com/v/3458790?autoplay=true') => {
    const iframe = createTag('iframe', { src: 'about:blank' });
    const source = { value: src };
    const bounds = {
      top: 0, bottom: 200, left: 0, right: 300, width: 300, height: 200,
    };
    // Keep tests offline while exposing the real embed URL to the trigger.
    sinon.stub(iframe, 'src').get(() => source.value);
    sinon.stub(iframe, 'getBoundingClientRect').callsFake(() => bounds);
    document.querySelector('main').append(iframe);
    return { iframe, bounds, source };
  };
  const moveVideo = async (player, top) => {
    player.bounds.top = top;
    player.bounds.bottom = top + player.bounds.height;
    window.dispatchEvent(new Event('scroll'));
    await flush();
  };
  const loadAuthoredFragment = async (query) => {
    document.head.querySelector('meta[name="max26-login-prompt"]')?.remove();
    metadata('foundation', 'c2');
    fragmentResponse = () => Promise.resolve(new Response(`<div>${AUTHORED_BLOCK}</div>`));
    const holder = createTag('div');
    const url = `${FRAGMENT_PATH}${query}`;
    const link = createTag('a', { href: url }, url);
    holder.append(createTag('div', null, createTag('p', null, link)));
    document.querySelector('main').append(holder);
    await loadArea(holder);
    await flush();
    return holder.querySelector('.fragment');
  };

  before(async () => {
    setConfig({
      codeRoot: '/libs',
      mep: { blocks: { 'max26-login-prompt': `${window.location.origin}/libs/mep/evnt027/max26-login-prompt` } },
    });
    styles = createTag('style');
    styles.textContent = await readFile({ path: '../../../libs/c2/styles/styles.css' })
      + await readFile({ path: '../../../libs/mep/evnt027/max26-login-prompt/max26-login-prompt.css' });
    document.head.append(styles);
  });

  after(() => styles.remove());

  beforeEach(() => {
    localStorage.removeItem(DISMISSED_KEY);
    document.body.replaceChildren(createTag('main'));
    target = createTag('section', { class: 'session-details' }, 'Session details');
    document.querySelector('main').append(target);
    targetTop = window.innerHeight + 1;
    targetHeight = 200;
    sinon.stub(target, 'getBoundingClientRect')
      .callsFake(() => ({ top: targetTop, bottom: targetTop + targetHeight }));
    visibility = 'visible';
    sinon.stub(document, 'visibilityState').get(() => visibility);
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    const originalFetch = window.fetch.bind(window);
    fragmentResponse = () => Promise.resolve(new Response(FRAGMENT_HTML));
    fetchStub = sinon.stub(window, 'fetch').callsFake((resource, options) => (
      String(resource).includes(FRAGMENT_PATH)
        ? fragmentResponse() : originalFetch(resource, options)
    ));
    configure();
  });

  afterEach(() => {
    stop?.();
    window.dispatchEvent(new Event('pagehide'));
    stop = null;
    sinon.restore();
    document.querySelectorAll('meta[name^="max26-login-prompt"]').forEach((meta) => meta.remove());
    document.head.querySelector('meta[name="foundation"]')?.remove();
    document.body.replaceChildren();
    document.documentElement.classList.remove('disable-scroll');
    localStorage.removeItem(DISMISSED_KEY);
  });

  it('preserves the default two-minute delay', async () => {
    stop = init();
    await clock.tickAsync(119999);
    expect(modal()).to.be.null;
    await clock.tickAsync(1);
    await flush();
    expect(modal()).to.exist;
  });

  it('uses the authored delay and strips trigger parameters from the fragment request', async () => {
    configure('?delay=3&showAfter=session-details&showAfterNth=2&showAfterMode=passed&operator=or&content=live');
    stop = init();
    await clock.tickAsync(2999);
    expect(modal()).to.be.null;
    await clock.tickAsync(1);
    await flush();
    expect(modal()).to.exist;
    const request = fetchStub.getCalls()
      .find(({ args }) => String(args[0]).includes(FRAGMENT_PATH));
    expect(request.args[0]).to.equal(`${window.location.origin}${FRAGMENT_PATH}.plain.html?content=live`);
  });

  it('measures the delay from navigation when initialized late', async () => {
    await clock.tickAsync(5000);
    configure('?delay=3');
    stop = init();
    await flush();
    expect(modal()).to.exist;
  });

  it('opens the authored fragment link as a modal without metadata or an insertScript action', async () => {
    target.className = 'side-by-side';
    const query = '?delay=3&showAfter=side-by-side&operator=and';
    const fragment = await loadAuthoredFragment(query);
    expect(fragment.hidden).to.be.true;
    expect(getComputedStyle(fragment).display).to.equal('none');
    expect(modal()).to.be.null;
    await clock.tickAsync(3000);
    expect(modal()).to.be.null;
    await reachTarget();
    const dialog = modal();
    expect(dialog).to.exist;
    expect(fragment.hidden).to.be.false;
    expect(fragment.parentElement).to.equal(dialog);
    expect(getComputedStyle(dialog).position).to.equal('fixed');
    expect(getComputedStyle(fragment).overflowY).to.equal('auto');
    expect(dialog.getBoundingClientRect().top).to.be.at.least(0);
    expect(dialog.getBoundingClientRect().bottom).to.be.at.most(window.innerHeight);
    expect(document.querySelector('main').contains(fragment)).to.be.false;
    expect(document.querySelectorAll('.max26-login-prompt')).to.have.length(1);
    expect(document.querySelectorAll('.dialog-modal')).to.have.length(1);
    expect(document.querySelector('.modal-curtain.is-open')).to.exist;
    const requests = fetchStub.getCalls()
      .filter(({ args }) => String(args[0]).includes(FRAGMENT_PATH));
    expect(requests).to.have.length(1);
    expect(requests[0].args[0])
      .to.equal(`${window.location.origin}${FRAGMENT_PATH}.plain.html${query}`);
    dialog.querySelector('.max26-login-prompt-guest').click();
    expect(localStorage.getItem(DISMISSED_KEY)).to.equal('true');
  });

  it('opens the authored modal only after the selected row is passed and its delay expires', async () => {
    target.className = 'sg-time-row';
    targetTop = -targetHeight;
    const later = addTarget(100);
    const query = '?delay=3&showAfter=sg-time-row&showAfterNth=2&showAfterMode=passed&operator=and';
    const fragment = await loadAuthoredFragment(query);
    expect(fragment.hidden).to.be.true;
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.be.null;
    later.bounds.top = -199.5;
    later.bounds.bottom = 0.5;
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(modal()).to.be.null;
    later.bounds.top = -200;
    later.bounds.bottom = 0;
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(modal()).to.exist;
    expect(fragment.parentElement).to.equal(modal());
    expect(getComputedStyle(modal()).position).to.equal('fixed');
    expect(document.querySelector('.modal-curtain.is-open')).to.exist;
    const requests = fetchStub.getCalls()
      .filter(({ args }) => String(args[0]).includes(FRAGMENT_PATH));
    expect(requests).to.have.length(1);
    expect(requests[0].args[0])
      .to.equal(`${window.location.origin}${FRAGMENT_PATH}.plain.html${query}`);
  });

  it('does not reveal inline fragment content for dismissed visitors', async () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    const fragment = await loadAuthoredFragment('?delay=0');
    expect(fragment.hidden).to.be.true;
    expect(getComputedStyle(fragment).display).to.equal('none');
    expect(modal()).to.be.null;
  });

  it('defers an expired timer until a visible paused video is fully passed', async () => {
    const player = addVideo();
    configure('?delay=3');
    stop = init();
    await clock.tickAsync(3000);
    await flush();
    expect(player.video.paused).to.be.true;
    expect(modal()).to.be.null;
    expect(fetchStub.getCalls().some(({ args }) => String(args[0]).includes(FRAGMENT_PATH)))
      .to.be.false;
    await moveVideo(player, -199.5);
    expect(modal()).to.be.null;
    await moveVideo(player, -200);
    expect(modal()).to.exist;
    expect(performance.now()).to.equal(3000);
  });

  ['and', 'or'].forEach((operator) => {
    it(`does not let ${operator.toUpperCase()} conditions override a visible video`, async () => {
      const player = addVideo();
      configure(`?delay=3&showAfter=session-details&showAfterMode=passed&operator=${operator}`);
      stop = init();
      targetTop = -targetHeight;
      window.dispatchEvent(new Event('scroll'));
      await flush();
      expect(modal()).to.be.null;
      await clock.tickAsync(3000);
      await flush();
      expect(modal()).to.be.null;
      await moveVideo(player, -200);
      expect(modal()).to.exist;
    });
  });

  it('does not release a seen video when the user scrolls back above it', async () => {
    const player = addVideo();
    configure('?delay=0');
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    await moveVideo(player, window.innerHeight + 1);
    expect(modal()).to.be.null;
    await moveVideo(player, -200);
    expect(modal()).to.exist;
  });

  it('waits until every video seen in the viewport is passed', async () => {
    const first = addVideo();
    const second = addVideo(200);
    configure('?delay=0');
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    await moveVideo(second, window.innerHeight + 1);
    await moveVideo(first, -200);
    expect(modal()).to.be.null;
    await moveVideo(second, -200);
    expect(modal()).to.exist;
  });

  ['hidden', 'invisible', 'zero-sized', 'above', 'below', 'offscreen-left', 'offscreen-right']
    .forEach((placement) => {
      it(`does not block on a ${placement} video that has not been viewed`, async () => {
        const player = addVideo();
        if (placement === 'hidden') player.video.hidden = true;
        if (placement === 'invisible') player.video.style.visibility = 'hidden';
        if (placement === 'zero-sized') player.bounds.width = 0;
        if (placement === 'above') {
          player.bounds.top = -200;
          player.bounds.bottom = 0;
        }
        if (placement === 'below') {
          player.bounds.top = window.innerHeight;
          player.bounds.bottom = window.innerHeight + 200;
        }
        if (placement === 'offscreen-left') {
          player.bounds.left = -300;
          player.bounds.right = 0;
        }
        if (placement === 'offscreen-right') {
          player.bounds.left = window.innerWidth;
          player.bounds.right = window.innerWidth + 300;
        }
        configure('?delay=0');
        stop = init();
        await flush();
        expect(modal()).to.exist;
      });
    });

  ['removed', 'hidden'].forEach((change) => {
    it(`resumes a deferred trigger when the video is ${change}`, async () => {
      const player = addVideo();
      document.body.append(player.video);
      configure('?delay=0');
      stop = init();
      await flush();
      expect(modal()).to.be.null;
      if (change === 'removed') player.video.remove();
      else player.video.hidden = true;
      await flush();
      expect(modal()).to.exist;
    });
  });

  it('guards a video inserted after initialization before the delay expires', async () => {
    configure('?delay=3');
    stop = init();
    await flush();
    const player = addVideo();
    await flush();
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.be.null;
    await moveVideo(player, -200);
    expect(modal()).to.exist;
  });

  it('rechecks videos after fragment loading and reuses the deferred content', async () => {
    configure('?delay=0');
    let resolveResponse;
    fragmentResponse = () => new Promise((resolve) => { resolveResponse = resolve; });
    stop = init();
    await flush();
    expect(resolveResponse).to.be.a('function');
    const player = addVideo();
    resolveResponse(new Response(FRAGMENT_HTML));
    await flush();
    expect(modal()).to.be.null;
    await moveVideo(player, -200);
    expect(modal()).to.exist;
    expect(fetchStub.getCalls().filter(({ args }) => String(args[0]).includes(FRAGMENT_PATH)))
      .to.have.length(1);
  });

  ['video.tv.adobe.com', 'stage-video.tv.adobe.com'].forEach((host) => {
    it(`defers for a ${host} iframe without needing access to its video element`, async () => {
      const player = addIframe(`https://${host}/v/3458790?autoplay=true`);
      expect(document.querySelector('video')).to.be.null;
      configure('?delay=0&operator=or');
      stop = init();
      await flush();
      expect(modal()).to.be.null;
      await moveVideo(player, -199.5);
      expect(modal()).to.be.null;
      await moveVideo(player, -200);
      expect(modal()).to.exist;
    });
  });

  [
    'https://example.com/embed',
    'https://example.com/video.tv.adobe.com/v/3458790',
    'https://video.tv.adobe.com.example.com/v/3458790',
    'about:blank',
    'http://[',
  ].forEach((src) => {
    it(`does not block on an unrelated iframe: ${src}`, async () => {
      addIframe(src);
      configure('?delay=0');
      stop = init();
      await flush();
      expect(modal()).to.exist;
    });
  });

  it('detects a player iframe whose source is assigned after initialization', async () => {
    const player = addIframe('about:blank');
    configure('?delay=3');
    stop = init();
    await flush();
    player.source.value = 'https://video.tv.adobe.com/v/3458790';
    player.iframe.setAttribute('src', 'about:blank#player');
    await flush();
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.be.null;
    await moveVideo(player, -200);
    expect(modal()).to.exist;
  });

  it('releases an iframe guard when its source is no longer an Adobe TV player', async () => {
    const player = addIframe();
    configure('?delay=0');
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    player.source.value = 'about:blank';
    player.iframe.setAttribute('src', 'about:blank#closed');
    await flush();
    expect(modal()).to.exist;
  });

  it('rechecks Adobe TV iframe visibility after fragment loading', async () => {
    configure('?delay=0');
    let resolveResponse;
    fragmentResponse = () => new Promise((resolve) => { resolveResponse = resolve; });
    stop = init();
    await flush();
    const player = addIframe();
    resolveResponse(new Response(FRAGMENT_HTML));
    await flush();
    expect(modal()).to.be.null;
    await moveVideo(player, -200);
    expect(modal()).to.exist;
  });

  it('keeps a directly authored content-fragment preview inline', () => {
    document.querySelector('main').insertAdjacentHTML('beforeend', AUTHORED_BLOCK);
    const block = document.querySelector('.max26-login-prompt');
    initBlock(block);
    expect(block.isConnected).to.be.true;
    expect(block.closest('.fragment')).to.be.null;
    expect(block.hidden).to.be.false;
    expect(modal()).to.be.null;
  });

  it('does not start another trigger when decorating detached modal content', async () => {
    const fragment = createTag('div', {
      class: 'fragment',
      'data-path': `${FRAGMENT_PATH}?delay=0`,
    });
    fragment.innerHTML = AUTHORED_BLOCK;
    initBlock(fragment.querySelector('.max26-login-prompt'));
    await flush();
    expect(fragment.hidden).to.be.false;
    expect(modal()).to.be.null;
  });

  it('does not hide or reopen fragment content that is already inside a dialog', async () => {
    const dialog = createTag('div', { class: 'dialog-modal' });
    const fragment = createTag('div', {
      class: 'fragment',
      'data-path': `${FRAGMENT_PATH}?delay=0`,
    });
    fragment.innerHTML = AUTHORED_BLOCK;
    dialog.append(fragment);
    document.body.append(dialog);
    initBlock(fragment.querySelector('.max26-login-prompt'));
    await flush();
    expect(fragment.hidden).to.be.false;
    expect(document.querySelectorAll('.dialog-modal')).to.have.length(1);
    expect(document.querySelector('.modal-curtain')).to.be.null;
  });

  it('opens through the treatment insertScript entry point', async () => {
    configure('?delay=0');
    const script = createTag('script', { src: new URL('../../../libs/mep/evnt027/insertScript.js', import.meta.url).href });
    try {
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
      await flush();
      expect(modal()).to.exist;
    } finally {
      script.remove();
      window.dispatchEvent(new Event('pagehide'));
    }
  });

  [375, 1280].forEach((width) => {
    it(`opens a fixed shared modal over page content at ${width}px`, async () => {
      const originalViewport = { width: window.innerWidth, height: window.innerHeight };
      try {
        await setViewport({ width, height: 800 });
        document.querySelector('main').prepend(createTag('div', { style: 'height: 1800px' }, 'Normal page content'));
        const pageHeight = document.documentElement.scrollHeight;
        configure('?delay=0');
        stop = init();
        await flush();
        const modalStyle = document.head.querySelector('link[href$="/c2/blocks/modal/modal.css"]');
        expect(modalStyle).to.exist;
        if (!modalStyle.sheet) {
          await new Promise((resolve, reject) => {
            modalStyle.addEventListener('load', resolve, { once: true });
            modalStyle.addEventListener('error', reject, { once: true });
          });
        }
        const dialog = modal();
        const curtain = document.querySelector('.modal-curtain.is-open');
        expect(dialog.parentElement).to.equal(document.body);
        expect(dialog.getAttribute('role')).to.equal('dialog');
        expect(dialog.getAttribute('aria-modal')).to.equal('true');
        expect(getComputedStyle(dialog).position).to.equal('fixed');
        expect(getComputedStyle(curtain).position).to.equal('fixed');
        expect(Number(getComputedStyle(dialog).zIndex))
          .to.be.above(Number(getComputedStyle(curtain).zIndex));
        const bounds = dialog.getBoundingClientRect();
        expect(bounds.width).to.be.above(0);
        expect(bounds.top).to.be.at.least(0);
        expect(bounds.bottom).to.be.at.most(window.innerHeight);
        expect(document.documentElement.scrollHeight).to.be.closeTo(pageHeight, 1);
        expect(document.documentElement.classList.contains('disable-scroll')).to.be.true;
        expect(dialog.querySelector('.dialog-close')).to.exist;
      } finally {
        await setViewport(originalViewport);
      }
    });
  });

  ['and', null].forEach((operator) => {
    ['delay', 'target'].forEach((first) => {
      it(`waits for both conditions with ${operator ?? 'default AND'} when ${first} is first`, async () => {
        configure(`?delay=3&showAfter=session-details${operator ? `&operator=${operator}` : ''}`);
        stop = init();
        if (first === 'delay') await clock.tickAsync(3000);
        else await reachTarget();
        await flush();
        expect(modal()).to.be.null;
        if (first === 'delay') await reachTarget();
        else await clock.tickAsync(3000);
        await flush();
        expect(modal()).to.exist;
      });
    });
  });

  ['delay', 'target'].forEach((first) => {
    it(`opens on the ${first} condition alone with OR`, async () => {
      configure('?delay=3&showAfter=session-details&operator=or');
      stop = init();
      if (first === 'delay') await clock.tickAsync(3000);
      else await reachTarget();
      await flush();
      expect(modal()).to.exist;
      if (first === 'target') expect(performance.now()).to.equal(0);
    });
  });

  it('checks an already-reached target immediately without waiting for the OR delay', async () => {
    configure('?delay=3&showAfter=session-details&operator=or');
    targetTop = -20;
    stop = init();
    await flush();
    expect(modal()).to.exist;
    expect(performance.now()).to.equal(0);
  });

  ['and', 'or'].forEach((operator) => {
    it(`does not invent an immediate delay for a target-only ${operator} trigger`, async () => {
      configure(`?showAfter=session-details&operator=${operator}`);
      stop = init();
      await flush();
      expect(modal()).to.be.null;
      await reachTarget();
      expect(modal()).to.exist;
    });
  });

  it('treats an explicitly authored zero delay as satisfied in OR', async () => {
    configure('?delay=0&showAfter=session-details&operator=or');
    stop = init();
    await flush();
    expect(modal()).to.exist;
  });

  it('looks up literal class names rather than treating them as selectors', async () => {
    target.className = 'session:details.2026';
    configure('?showAfter=session%3Adetails.2026');
    stop = init();
    await reachTarget();
    expect(modal()).to.exist;
  });

  it('accepts an optional leading dot on the class name', async () => {
    configure('?showAfter=.session-details');
    stop = init();
    await reachTarget();
    expect(modal()).to.exist;
  });

  it('does not match an element with only the requested ID', async () => {
    target.className = '';
    target.id = 'session-details';
    configure('?showAfter=session-details');
    stop = init();
    await reachTarget();
    expect(modal()).to.be.null;
  });

  it('uses the first matching class instance', async () => {
    const laterTarget = createTag('section', { class: 'session-details' }, 'Later section');
    document.querySelector('main').append(laterTarget);
    sinon.stub(laterTarget, 'getBoundingClientRect').returns({ top: 0 });
    configure('?showAfter=session-details');
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    await reachTarget();
    expect(modal()).to.exist;
  });

  [2, 9].forEach((nth) => {
    it(`uses the ${nth}th matching class instance without changing entry behavior`, async () => {
      targetTop = -targetHeight;
      for (let index = 2; index < nth; index += 1) addTarget(-200);
      const later = addTarget(window.innerHeight);
      configure(`?showAfter=.session-details&showAfterNth=${nth}`);
      stop = init();
      await flush();
      expect(modal()).to.be.null;
      later.bounds.top -= 1;
      later.bounds.bottom -= 1;
      window.dispatchEvent(new Event('scroll'));
      await flush();
      expect(modal()).to.exist;
    });
  });

  it('waits for a missing nth instance to be inserted without using an earlier match', async () => {
    targetTop = -targetHeight;
    configure('?showAfter=session-details&showAfterNth=2&showAfterMode=passed');
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    addTarget(-200);
    await flush();
    expect(modal()).to.exist;
  });

  it('waits until the whole target has passed the viewport top', async () => {
    configure('?showAfter=session-details&showAfterMode=passed');
    stop = init();
    for (const top of [window.innerHeight - targetHeight, 0, -targetHeight + 0.5]) {
      targetTop = top;
      window.dispatchEvent(new Event('scroll'));
      await flush();
      expect(modal()).to.be.null;
    }
    targetTop = -targetHeight;
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(modal()).to.exist;
  });

  it('checks an already-passed target immediately at a restored scroll position', async () => {
    configure('?showAfter=session-details&showAfterMode=passed');
    targetTop = -targetHeight - 1;
    stop = init();
    await flush();
    expect(modal()).to.exist;
    expect(performance.now()).to.equal(0);
  });

  it('does not treat a hidden target as passed', async () => {
    configure('?showAfter=session-details&showAfterMode=passed');
    targetTop = -targetHeight;
    target.hidden = true;
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    target.hidden = false;
    window.dispatchEvent(new Event('resize'));
    await flush();
    expect(modal()).to.exist;
  });

  it('supports an explicit entry mode without changing its threshold', async () => {
    configure('?showAfter=session-details&showAfterMode=enter');
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    await reachTarget();
    expect(modal()).to.exist;
  });

  ['and', 'or'].forEach((operator) => {
    ['delay', 'target'].forEach((first) => {
      it(`combines the passed condition with ${operator.toUpperCase()} when ${first} is first`, async () => {
        configure(`?delay=3&showAfter=session-details&showAfterMode=passed&operator=${operator}`);
        stop = init();
        if (first === 'delay') await clock.tickAsync(3000);
        else {
          targetTop = -targetHeight;
          window.dispatchEvent(new Event('scroll'));
        }
        await flush();
        expect(!!modal()).to.equal(operator === 'or');
        if (operator === 'or') return;
        if (first === 'delay') {
          targetTop = -targetHeight;
          window.dispatchEvent(new Event('scroll'));
        } else await clock.tickAsync(3000);
        await flush();
        expect(modal()).to.exist;
      });
    });
  });

  it('rechecks the passed condition after fragment loading', async () => {
    configure('?showAfter=session-details&showAfterMode=passed');
    let resolveResponse;
    fragmentResponse = () => new Promise((resolve) => { resolveResponse = resolve; });
    targetTop = -targetHeight;
    stop = init();
    await flush();
    expect(resolveResponse).to.be.a('function');
    targetTop = 0;
    resolveResponse(new Response(FRAGMENT_HTML));
    await flush();
    expect(modal()).to.be.null;
    targetTop = -targetHeight;
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(modal()).to.exist;
  });

  it('does not open for a hidden target', async () => {
    configure('?showAfter=session-details');
    target.hidden = true;
    targetTop = 0;
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    target.hidden = false;
    await reachTarget();
    expect(modal()).to.exist;
  });

  it('waits until the target top crosses the viewport edge', async () => {
    configure('?showAfter=session-details');
    targetTop = window.innerHeight;
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    await reachTarget();
    expect(modal()).to.exist;
  });

  ['and', 'or'].forEach((operator) => {
    it(`handles a missing target with ${operator.toUpperCase()}`, async () => {
      configure(`?delay=3&showAfter=missing&operator=${operator}`);
      stop = init();
      await clock.tickAsync(3000);
      await flush();
      expect(!!modal()).to.equal(operator === 'or');
    });
  });

  it('checks targets inserted after initialization', async () => {
    configure('?showAfter=session-details');
    target.remove();
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    targetTop = 0;
    document.querySelector('main').append(target);
    await flush();
    expect(modal()).to.exist;
  });

  it('preserves legacy delay and selector metadata', async () => {
    metadata('max26-login-prompt-delay', '3');
    metadata('max26-login-prompt-scroll-target', '.session-details');
    stop = init();
    await reachTarget();
    expect(modal()).to.be.null;
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.exist;
  });

  it('supports passed mode with a legacy selector target', async () => {
    metadata('max26-login-prompt-scroll-target', '.session-details');
    configure('?showAfterMode=passed');
    stop = init();
    await reachTarget();
    expect(modal()).to.be.null;
    targetTop = -targetHeight;
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(modal()).to.exist;
  });

  it('gives URL parameters precedence over legacy metadata', async () => {
    metadata('max26-login-prompt-delay', '120');
    metadata('max26-login-prompt-scroll-target', '#missing');
    configure('?delay=3&showAfter=session-details');
    stop = init();
    await reachTarget();
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.exist;
  });

  it('defers either OR condition while another dialog is open', async () => {
    configure('?delay=3&showAfter=session-details&operator=or');
    const other = createTag('div', { class: 'dialog-modal' });
    document.body.append(other);
    stop = init();
    await reachTarget();
    await clock.tickAsync(3000);
    expect(modal()).to.be.null;
    other.remove();
    window.dispatchEvent(new Event('milo:modal:closed'));
    await flush();
    expect(modal()).to.exist;
  });

  it('defers an OR trigger while the document is hidden', async () => {
    configure('?delay=0&showAfter=session-details&operator=or');
    visibility = 'hidden';
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    visibility = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    await flush();
    expect(modal()).to.exist;
  });

  it('rechecks conditions after the fragment loads', async () => {
    configure('?delay=3&showAfter=session-details&operator=or');
    let resolveResponse;
    fragmentResponse = () => new Promise((resolve) => { resolveResponse = resolve; });
    targetTop = 0;
    stop = init();
    await flush();
    expect(resolveResponse).to.be.a('function');
    targetTop = window.innerHeight + 1;
    resolveResponse(new Response(FRAGMENT_HTML));
    await flush();
    expect(modal()).to.be.null;
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.exist;
  });

  it('suppresses dismissed visitors and persists a subsequent close', async () => {
    configure('?delay=0');
    localStorage.setItem(DISMISSED_KEY, 'true');
    expect(init()).to.be.null;
    localStorage.removeItem(DISMISSED_KEY);
    stop = init();
    await flush();
    expect(modal()).to.exist;
    modal().querySelector('.dialog-close').click();
    expect(localStorage.getItem(DISMISSED_KEY)).to.equal('true');
    expect(init()).to.be.null;
  });

  it('guards repeated initialization and cancels a stopped trigger', async () => {
    configure('?delay=3');
    stop = init();
    expect(init()).to.equal(stop);
    stop();
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.be.null;
  });

  [
    'delay=-1', 'delay=', 'delay=NaN', 'delay=Infinity',
    'operator=xor', 'operator=', 'showAfter=', 'showAfter=%23session-details',
    'showAfter=session%20details', 'showAfter=.',
    'showAfterNth=2', 'showAfter=session-details&showAfterNth=',
    'showAfter=session-details&showAfterNth=0', 'showAfter=session-details&showAfterNth=-1',
    'showAfter=session-details&showAfterNth=1.5', 'showAfter=session-details&showAfterNth=1e2',
    'showAfter=session-details&showAfterNth=9007199254740993',
    'showAfter=session-details&showAfterNth=Infinity',
    'showAfter=session-details&showAfterNth=%202',
    'showAfterMode=passed', 'showAfter=session-details&showAfterMode=',
    'showAfter=session-details&showAfterMode=exit',
  ].forEach((query) => {
    it(`rejects invalid authoring: ${query}`, () => {
      configure(`?${query}`);
      expect(() => init()).to.throw(Error);
    });
  });
});
