import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { getConfig, updateConfig, setConfig } from '../../../libs/utils/utils.js';

const documentHTML = await readFile({ path: './mocks/body.html' });
setConfig({});
const { default: init } = await import('../../../libs/blocks/adobetv/adobetv.js');

describe('adobetv autoblock', () => {
  let ogFetch;

  beforeEach(() => {
    document.body.innerHTML = documentHTML;
    ogFetch = window.fetch;
    window.fetch = stub().returns(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: [
            { captions: 'fre_fr', geos: 'be_fr,ch_fr,fr,lu_fr,ca_fr' },
            { captions: 'ger', geos: 'at,ch_de,lu_de,de' },
          ],
        }),
      }),
    );
  });

  afterEach(() => {
    window.fetch = ogFetch;
    updateConfig({ captionsKey: undefined, locale: { prefix: 'en' } });
  });

  it('creates video block', async () => {
    const wrapper = document.body.querySelector('.adobe-tv');
    const a = wrapper.querySelector(':scope > a');

    await init(a);
    const iframe = await waitForElement('.adobe-tv iframe');
    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(iframe).to.be.exist;
  });

  it('adobetv as bg', async () => {
    const wrapper = document.body.querySelector('#adobetvAsBg');
    const a = wrapper.querySelector(':scope a[href*=".mp4"]');

    await init(a);
    const video = await waitForElement('#adobetvAsBg video');
    expect(wrapper.querySelector(':scope a[href*=".mp4"]')).to.be.null;
    expect(video).to.be.exist;
  });

  it('creates video with captions localized', async () => {
    const wrapper = document.body.querySelector('.adobe-tv-captions');
    const a = wrapper.querySelector(':scope > a');
    const config = getConfig();
    updateConfig({ ...config, atvCaptionsKey: 'test', locale: { prefix: 'de' } });
    await init(a);
    const iframe = await waitForElement('.adobe-tv-captions iframe');
    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(iframe).to.be.exist;
    expect(iframe.src).to.equal('https://video.tv.adobe.com/v/3410934t1?captions=ger%2Ceng');
  });

  it('creates video with captions localized but no captions key', async () => {
    const wrapper = document.body.querySelector('.adobe-tv-captions');
    const a = wrapper.querySelector(':scope > a');
    const config = getConfig();
    updateConfig({ ...config, locale: { prefix: 'de' } });
    await init(a);
    const iframe = await waitForElement('.adobe-tv-captions iframe');
    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(iframe).to.be.exist;
    expect(iframe.src).to.equal('https://video.tv.adobe.com/v/3410934t1?captions=eng');
  });

  it('creates video with captions localized but no mapping', async () => {
    const wrapper = document.body.querySelector('.adobe-tv-captions');
    const a = wrapper.querySelector(':scope > a');
    const config = getConfig();
    updateConfig({ ...config, locale: { prefix: 'in' } });
    await init(a);
    const iframe = await waitForElement('.adobe-tv-captions iframe');
    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(iframe).to.be.exist;
    expect(iframe.src).to.equal('https://video.tv.adobe.com/v/3410934t1?captions=eng');
  });

  describe('MPC player', () => {
    let foundation;

    beforeEach(() => {
      window.fetch = stub().resolves({ ok: true, json: () => Promise.resolve({}) });
      updateConfig({ ...getConfig(), locale: { prefix: '', ietf: 'en-US', contentRoot: '' } });
      foundation = document.createElement('meta');
      foundation.name = 'foundation';
      foundation.content = 'c2';
      document.head.append(foundation);
    });

    afterEach(() => foundation.remove());

    it('keeps an MPC player URL with a playback hash as the MPC player', async () => {
      const wrapper = document.querySelector('#mpcPlayerAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      expect(wrapper.querySelector('iframe').src).to.equal('https://video.tv.adobe.com/v/332632#_autoplay');
    });

    it('renders a poster with a play button for an MPC player URL with a poster', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      expect(!!wrapper.querySelector('iframe')).to.be.false;
      expect(!!wrapper.querySelector('video')).to.be.false;
      expect(!!wrapper.querySelector('a'), 'anchor removed').to.be.false;
      const poster = wrapper.querySelector('.mpc-poster');
      expect(poster.dataset.href).to.equal('https://video.tv.adobe.com/v/111111');
      const img = poster.querySelector('img');
      expect(img.getAttribute('src')).to.equal('poster.jpg');
      expect(img.getAttribute('role')).to.equal('none');
      const button = poster.querySelector('button.consonant-play-btn');
      expect(button.getAttribute('aria-label')).to.equal('Play Demo video');
      expect(button.hasAttribute('tabindex')).to.be.false;
      await new Promise((r) => { setTimeout(r, 100); });
      expect(button.getAttribute('aria-label')).to.equal('play video Demo video');
    });

    it('keeps players out of the tab order inside an aria-hidden container', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      wrapper.setAttribute('aria-hidden', 'true');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('.mpc-poster button')?.getAttribute('tabindex')).to.equal('-1');

      const plain = document.querySelector('#mpcPlayerPlain');
      plain.setAttribute('aria-hidden', 'true');
      await init(plain.querySelector('a'));
      expect(plain.querySelector('iframe')?.getAttribute('tabindex')).to.equal('-1');
    });

    it('plays an autoplaying MPC iframe inside the poster on play', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      wrapper.querySelector('.mpc-poster button').click();
      const poster = wrapper.querySelector('.mpc-poster');
      const iframe = poster.querySelector('.milo-video iframe');
      expect(poster.classList.contains('is-playing')).to.be.true;
      expect(!!poster.querySelector('button'), 'play button removed').to.be.false;
      expect(!!wrapper.querySelector('a'), 'anchor removed').to.be.false;
      expect(iframe.src).to.equal('https://video.tv.adobe.com/v/111111?autoplay=true');
      expect(iframe.getAttribute('allow')).to.include('autoplay');
      expect(document.activeElement === iframe, 'iframe focused').to.be.true;
    });

    it('keeps the poster box size when the player replaces it outside base-card', async () => {
      await new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/libs/blocks/adobetv/adobetv.css';
        link.onload = resolve;
        document.head.append(link);
      });
      const wrapper = document.querySelector('#mpcPlayerPoster');
      wrapper.className = 'news';
      wrapper.style.width = '300px';
      await init(wrapper.querySelector('a'));
      const poster = wrapper.querySelector('.mpc-poster');
      poster.querySelector('img').style.aspectRatio = '1 / 1';
      const before = poster.querySelector('picture').getBoundingClientRect();

      poster.querySelector('button').click();

      const player = wrapper.querySelector('.milo-video').getBoundingClientRect();
      expect(Math.round(player.width)).to.equal(Math.round(before.width));
      expect(Math.round(player.height)).to.equal(Math.round(before.height));
      expect(Math.round(poster.getBoundingClientRect().height)).to.equal(Math.round(before.height));
    });

    it('pauses a player that starts playing inside hidden C2 content', async () => {
      const wrapper = document.querySelector('#mpcPlayerPlain');
      wrapper.setAttribute('aria-hidden', 'true');
      await init(wrapper.querySelector('a'));
      const iframe = wrapper.querySelector('iframe');
      const sent = [];
      iframe.contentWindow.postMessage = (msg) => sent.push(msg);

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://video.tv.adobe.com',
        source: iframe.contentWindow,
        data: { type: 'mpcStatus', state: 'play', id: '888888' },
      }));

      expect(sent.some((msg) => msg.action === 'pause'), 'pause sent').to.be.true;
    });

    it('does not pull focus into a player whose container was hidden during the caption lookup', async () => {
      updateConfig({ ...getConfig(), atvCaptionsKey: 'test', locale: { prefix: 'fr', ietf: 'fr-FR', contentRoot: '' } });
      const wrapper = document.querySelector('#mpcPlayerPosterCaptions');
      await init(wrapper.querySelector('a'));
      wrapper.querySelector('.mpc-poster button').click();
      wrapper.setAttribute('aria-hidden', 'true');
      const next = document.createElement('button');
      document.body.append(next);
      next.focus();

      const iframe = await waitForElement('#mpcPlayerPosterCaptions iframe');

      expect(document.activeElement === iframe, 'iframe focused').to.be.false;
      expect(document.activeElement === next, 'focus stays on Next').to.be.true;
      next.remove();
    });

    it('does not pull focus into a player scrolled away during the caption lookup', async () => {
      updateConfig({ ...getConfig(), atvCaptionsKey: 'test', locale: { prefix: 'fr', ietf: 'fr-FR', contentRoot: '' } });
      const wrapper = document.querySelector('#mpcPlayerPosterCaptions');
      await init(wrapper.querySelector('a'));
      wrapper.querySelector('.mpc-poster button').click();
      wrapper.style.cssText = 'position: absolute; top: 5000px;';

      const iframe = await waitForElement('#mpcPlayerPosterCaptions iframe');

      expect(document.activeElement === iframe, 'iframe focused').to.be.false;
      wrapper.style.cssText = '';
    });

    it('plays a poster that was cloned after decoration', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      const clone = wrapper.cloneNode(true);
      clone.id = 'mpcPlayerPosterClone';
      wrapper.after(clone);
      clone.querySelector('.mpc-poster button').click();
      expect(clone.querySelector('iframe')?.src).to.include('autoplay=true');
      expect(!!wrapper.querySelector('iframe'), 'original untouched').to.be.false;
      expect(!!wrapper.querySelector('.mpc-poster button'), 'original button kept').to.be.true;
    });

    it('renders an autoplay MPC MP4 outside background blocks as a native video', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      const source = await waitForElement('#mpcMp4Autoplay video source');
      expect(source.getAttribute('src')).to.include('images-tv.adobe.com/mpcv3/1229/clip');
    });

    it('renders a plain MPC MP4 link as a native video with controls', async () => {
      const wrapper = document.querySelector('#mpcMp4Plain');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      expect(wrapper.querySelector('video').hasAttribute('controls')).to.be.true;
    });

    it('passes an authored ?autoplay=true through to the MPC player unchanged', async () => {
      const wrapper = document.querySelector('#mpcPlayerQueryAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      const iframe = wrapper.querySelector('iframe');
      expect(iframe.src).to.equal('https://video.tv.adobe.com/v/444444?autoplay=true&end=replay');
      expect(iframe.getAttribute('allow')).to.equal('encrypted-media; fullscreen');
    });

    it('skips the poster for a poster with ?autoplay=true and keeps the authored params', async () => {
      const wrapper = document.querySelector('#mpcPlayerPosterQueryAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('.mpc-poster')).to.be.null;
      expect(wrapper.querySelector('video')).to.be.null;
      const iframe = wrapper.querySelector('iframe');
      expect(iframe.src).to.equal('https://video.tv.adobe.com/v/888888?autoplay=true&end=replay');
      expect(document.activeElement).to.not.equal(iframe);
    });

    it('keeps an MPC player URL without a playback hash in a marquee as the MPC player', async () => {
      const wrapper = document.querySelector('#mpcPlayerMarquee');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      expect(wrapper.querySelector('iframe').src).to.equal('https://video.tv.adobe.com/v/777777');
    });

    it('keeps a plain MPC player link as the iframe player', async () => {
      const wrapper = document.querySelector('#mpcPlayerPlain');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      expect(wrapper.querySelector('iframe').src).to.equal('https://video.tv.adobe.com/v/888888');
    });

    it('tracks MPC play state on the iframe that sent it', async () => {
      const wrapper = document.querySelector('#mpcPlayerPlain');
      const dupe = wrapper.cloneNode(true);
      dupe.removeAttribute('id');
      wrapper.after(dupe);
      await init(wrapper.querySelector('a'));
      await init(dupe.querySelector('a'));
      const iframe = wrapper.querySelector('iframe');
      const other = dupe.querySelector('iframe');
      const send = (source, data, origin = 'https://video.tv.adobe.com') => window
        .dispatchEvent(new MessageEvent('message', { origin, source, data }));

      send(iframe.contentWindow, { state: 'play' }, 'https://evil.example');
      expect(iframe.getAttribute('data-playing')).to.be.null;
      send(iframe.contentWindow, { type: 'mpcStatus', state: 'play', id: '888888' });
      expect(iframe.getAttribute('data-playing')).to.equal('true');
      expect(other.getAttribute('data-playing')).to.be.null;
      send(iframe.contentWindow, { type: 'mpcStatus', state: 'pause', id: 888888 });
      expect(iframe.getAttribute('data-playing')).to.equal('false');
      dupe.remove();
    });

    const nextFrames = () => new Promise((r) => {
      requestAnimationFrame(() => requestAnimationFrame(r));
    });
    // Positions the wrapper so `fraction` of `el` shows at the bottom of the viewport.
    const showFraction = async (wrapper, el, fraction) => {
      const offset = el.getBoundingClientRect().top - wrapper.getBoundingClientRect().top;
      const { height } = el.getBoundingClientRect();
      wrapper.style.top = `${window.innerHeight - offset - height * fraction}px`;
      await nextFrames();
    };
    const sendPlay = (iframe, state = 'play') => window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://video.tv.adobe.com',
      source: iframe.contentWindow,
      data: { type: 'mpcStatus', state },
    }));

    it('holds an authored autoplay player until 80% of it is visible', async () => {
      const wrapper = document.querySelector('#mpcPlayerQueryAutoplay');
      wrapper.style.cssText = 'position: absolute; top: 5000px; width: 300px;';
      await init(wrapper.querySelector('a'));
      const iframe = wrapper.querySelector('iframe');
      const sent = [];
      // Like the real player, report the new state back.
      iframe.contentWindow.postMessage = (msg) => {
        sent.push(msg.action);
        sendPlay(iframe, msg.action);
      };
      await nextFrames();

      sendPlay(iframe);
      await nextFrames();
      expect(sent.join(), 'held offscreen').to.equal('pause');

      await showFraction(wrapper, iframe, 0.7);
      expect(sent.join(), 'still held at 70%').to.equal('pause');

      await showFraction(wrapper, iframe, 0.9);
      expect(sent.join(), 'plays at 80%+').to.equal('pause,play');
      wrapper.style.cssText = '';
    });

    it('pauses a reader-started player once it drops below 80% visible', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      wrapper.style.cssText = 'position: absolute; top: 0; width: 300px;';
      await init(wrapper.querySelector('a'));
      wrapper.querySelector('.mpc-poster button').click();
      const iframe = wrapper.querySelector('iframe');
      const sent = [];
      iframe.contentWindow.postMessage = (msg) => sent.push(msg.action);
      await nextFrames();
      sendPlay(iframe);
      await nextFrames();

      await showFraction(wrapper, iframe, 0.85);
      expect(sent.join(), 'keeps playing at 85%').to.equal('');

      await showFraction(wrapper, iframe, 0.7);
      expect(sent.join(), 'paused below 80%').to.equal('pause');
      wrapper.style.cssText = '';
    });

    it('keeps a started poster player paused when it was scrolled away before it loaded', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      wrapper.style.cssText = 'position: absolute; top: 0; width: 300px;';
      await init(wrapper.querySelector('a'));
      wrapper.querySelector('.mpc-poster button').click();
      const iframe = wrapper.querySelector('iframe');
      const sent = [];
      iframe.contentWindow.postMessage = (msg) => sent.push(msg.action);
      await nextFrames();

      wrapper.style.top = '5000px';
      await nextFrames();
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://video.tv.adobe.com',
        source: iframe.contentWindow,
        data: { type: 'mpcStatus', state: 'play', id: '111111' },
      }));
      await nextFrames();
      expect(sent.join(), 'paused offscreen').to.equal('pause');

      wrapper.style.top = '0px';
      await nextFrames();
      expect(sent.join(), 'stays paused until the user resumes').to.equal('pause');
      wrapper.style.cssText = '';
    });

    it('pauses an autoplay MPC MP4 offscreen and keeps it paused until the user resumes', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      wrapper.style.cssText = 'position: absolute; top: 0; width: 300px; height: 200px;';
      const parent = wrapper.querySelector('a').parentElement;
      await init(wrapper.querySelector('a'));
      const video = parent.querySelector('video');
      const calls = [];
      let paused = false;
      Object.defineProperty(video, 'paused', { get: () => paused });
      video.pause = () => { paused = true; calls.push('pause'); };
      video.play = () => { paused = false; calls.push('play'); };
      video.dispatchEvent(new Event('playing'));
      await nextFrames();
      expect(calls.length, 'playing in view').to.equal(0);

      wrapper.style.top = '5000px';
      await nextFrames();
      expect(calls.join(), 'paused offscreen').to.equal('pause');
      expect(video.hasAttribute('data-user-paused')).to.be.true;
      const control = parent.querySelector('.pause-play-wrapper, .play-pause-button');
      expect(control.getAttribute('aria-pressed')).to.equal('false');

      wrapper.style.top = '0px';
      await nextFrames();
      expect(calls.join(), 'stays paused in view').to.equal('pause');
      wrapper.style.cssText = '';
    });

    it('pauses an autoplay MPC MP4 whose media starts after it was scrolled offscreen', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      wrapper.style.cssText = 'position: absolute; top: 0; width: 300px; height: 200px;';
      const parent = wrapper.querySelector('a').parentElement;
      await init(wrapper.querySelector('a'));
      const video = parent.querySelector('video');
      const calls = [];
      let paused = true;
      Object.defineProperty(video, 'paused', { get: () => paused });
      Object.defineProperty(video, 'readyState', { get: () => 4 });
      video.pause = () => { paused = true; calls.push('pause'); };
      video.play = () => { paused = false; calls.push('play'); };
      await nextFrames();

      wrapper.style.top = '5000px';
      await nextFrames();
      paused = false;
      video.dispatchEvent(new Event('playing'));
      expect(calls.join(), 'paused once media starts offscreen').to.equal('pause');
      expect(video.hasAttribute('data-user-paused')).to.be.true;
      const control = parent.querySelector('.pause-play-wrapper, .play-pause-button');
      expect(control.getAttribute('aria-pressed')).to.equal('false');

      wrapper.style.top = '0px';
      await nextFrames();
      control.click();
      video.dispatchEvent(new Event('playing'));
      expect(calls.join(), 'explicit resume plays').to.equal('pause,play');
      expect(control.getAttribute('aria-pressed')).to.equal('true');
      wrapper.style.cssText = '';
    });

    it('starts an autoplay MPC MP4 that began below the fold when it first scrolls into view', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      wrapper.style.cssText = 'position: absolute; top: 5000px; width: 300px; height: 200px;';
      const parent = wrapper.querySelector('a').parentElement;
      await init(wrapper.querySelector('a'));
      const video = parent.querySelector('video');
      const calls = [];
      let paused = true;
      Object.defineProperty(video, 'paused', { get: () => paused });
      video.pause = () => { paused = true; calls.push('pause'); };
      video.play = () => { paused = false; calls.push('play'); };
      await nextFrames();

      paused = false;
      video.dispatchEvent(new Event('playing'));
      expect(calls.join(), 'held offscreen').to.equal('pause');
      expect(video.hasAttribute('data-user-paused'), 'not a user pause').to.be.false;

      wrapper.style.top = '0px';
      await nextFrames();
      expect(calls.join(), 'plays on first view').to.equal('pause,play');

      wrapper.style.top = '5000px';
      await nextFrames();
      expect(calls.join(), 'paused after being seen').to.equal('pause,play,pause');
      expect(video.hasAttribute('data-user-paused'), 'stays paused').to.be.true;
      wrapper.style.cssText = '';
    });

    it('starts an autoplay MPC MP4 at 80% visible and pauses it once it drops below 80%', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      wrapper.style.cssText = 'position: absolute; top: 5000px; width: 300px;';
      const parent = wrapper.querySelector('a').parentElement;
      await init(wrapper.querySelector('a'));
      const video = parent.querySelector('video');
      const calls = [];
      let paused = true;
      Object.defineProperty(video, 'paused', { get: () => paused });
      video.pause = () => { paused = true; calls.push('pause'); };
      video.play = () => { paused = false; calls.push('play'); };
      await nextFrames();
      paused = false;
      video.dispatchEvent(new Event('playing'));
      expect(calls.join(), 'held offscreen').to.equal('pause');

      await showFraction(wrapper, video, 0.7);
      expect(calls.join(), 'still held at 70%').to.equal('pause');
      await showFraction(wrapper, video, 0.9);
      expect(calls.join(), 'plays at 80%+').to.equal('pause,play');
      await showFraction(wrapper, video, 0.85);
      expect(calls.join(), 'keeps playing at 85%').to.equal('pause,play');
      await showFraction(wrapper, video, 0.7);
      expect(calls.join(), 'paused below 80%').to.equal('pause,play,pause');
      expect(video.hasAttribute('data-user-paused'), 'stays paused').to.be.true;
      wrapper.style.cssText = '';
    });

    it('plays a held autoplay MPC MP4 right away when the reader presses Play', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      wrapper.style.cssText = 'position: absolute; top: 5000px; width: 300px;';
      const parent = wrapper.querySelector('a').parentElement;
      await init(wrapper.querySelector('a'));
      const video = parent.querySelector('video');
      const calls = [];
      let paused = true;
      Object.defineProperty(video, 'paused', { get: () => paused });
      Object.defineProperty(video, 'readyState', { get: () => 4 });
      video.pause = () => { paused = true; calls.push('pause'); };
      video.play = () => { paused = false; calls.push('play'); };
      await showFraction(wrapper, video, 0.5);
      paused = false;
      video.dispatchEvent(new Event('playing'));
      expect(calls.join(), 'held at 50%').to.equal('pause');

      parent.querySelector('.pause-play-wrapper, .play-pause-button').click();
      video.dispatchEvent(new Event('playing'));
      expect(calls.join(), 'reader Play is not held').to.equal('pause,play');
      wrapper.style.cssText = '';
    });

    it('pauses an MPC MP4 with controls once it drops below 80% visible', async () => {
      const wrapper = document.querySelector('#mpcMp4Plain');
      wrapper.style.cssText = 'position: absolute; top: 0; width: 300px;';
      await init(wrapper.querySelector('a'));
      const video = wrapper.querySelector('video');
      const calls = [];
      let paused = false;
      Object.defineProperty(video, 'paused', { get: () => paused });
      video.pause = () => { paused = true; calls.push('pause'); };
      await nextFrames();

      await showFraction(wrapper, video, 0.85);
      expect(calls.join(), 'keeps playing at 85%').to.equal('');
      await showFraction(wrapper, video, 0.7);
      expect(calls.join(), 'paused below 80%').to.equal('pause');
      wrapper.style.cssText = '';
    });

    it('keeps an overlay poster below the block copy but its play button clickable', async () => {
      await Promise.all(['/libs/styles/consonant-play-button.css', '/libs/blocks/adobetv/adobetv.css']
        .map((href) => new Promise((resolve) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.onload = resolve;
          document.head.append(link);
        })));
      const wrapper = document.querySelector('#mpcPlayerPoster');
      wrapper.className = 'side-by-side';
      wrapper.style.cssText = 'position: relative; width: 400px;';
      const media = wrapper.querySelector('div');
      media.style.cssText = 'position: absolute; inset: 0;';
      const copy = document.createElement('h3');
      copy.textContent = 'Overlay heading';
      copy.style.cssText = 'position: relative; z-index: 1; margin: 0; height: 40px;';
      wrapper.append(copy);
      await init(wrapper.querySelector('a'));
      const poster = wrapper.querySelector('.mpc-poster');
      poster.querySelector('img').style.aspectRatio = '1 / 1';
      const button = poster.querySelector('button');
      button.style.cssText = 'position: absolute; left: 150px; top: 150px; width: 96px; height: 96px;';

      const h = copy.getBoundingClientRect();
      const b = button.getBoundingClientRect();
      const atCopy = document.elementFromPoint(h.x + 10, h.y + h.height / 2);
      const atButton = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      expect(copy.contains(atCopy), 'heading visible').to.be.true;
      expect(button.contains(atButton), 'play button clickable').to.be.true;

      button.focus();
      expect(getComputedStyle(button).outlineStyle, 'focus outline').to.equal('solid');
    });

    it('tracks MPC play state on a cloned player iframe', async () => {
      const wrapper = document.querySelector('#mpcPlayerPlain');
      await init(wrapper.querySelector('a'));
      const clone = wrapper.cloneNode(true);
      clone.removeAttribute('id');
      wrapper.after(clone);
      const cloneIframe = clone.querySelector('iframe');
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://video.tv.adobe.com',
        source: cloneIframe.contentWindow,
        data: { type: 'mpcStatus', state: 'play', id: '888888' },
      }));
      expect(cloneIframe.getAttribute('data-playing')).to.equal('true');
      expect(wrapper.querySelector('iframe').getAttribute('data-playing')).to.be.null;
      clone.remove();
    });
  });

  describe('C1 pages', () => {
    beforeEach(() => {
      window.fetch = stub().resolves({ ok: true, json: () => Promise.resolve({}) });
    });

    it('keeps an MPC MP4 outside background blocks as the iframe player', async () => {
      const wrapper = document.querySelector('#mpcMp4Plain');
      await init(wrapper.querySelector('a'));
      expect(!!wrapper.querySelector('video'), 'native video').to.be.false;
      expect(wrapper.querySelector('iframe')?.src).to.include('images-tv.adobe.com/mpcv3/1229/clip');
    });

    it('ignores the poster and renders the MPC iframe player', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      expect(!!wrapper.querySelector('.mpc-poster'), 'poster').to.be.false;
      expect(wrapper.querySelector('iframe')?.src).to.equal('https://video.tv.adobe.com/v/111111');
    });

    it('leaves a player that starts offscreen playing, as on stage', async () => {
      const nextFrames = () => new Promise((r) => {
        requestAnimationFrame(() => requestAnimationFrame(r));
      });
      const wrapper = document.querySelector('#mpcPlayerPlain');
      wrapper.style.cssText = 'position: absolute; top: 5000px;';
      await init(wrapper.querySelector('a'));
      const iframe = wrapper.querySelector('iframe');
      const sent = [];
      iframe.contentWindow.postMessage = (msg) => sent.push(msg.action);
      await nextFrames();

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://video.tv.adobe.com',
        source: iframe.contentWindow,
        data: { type: 'mpcStatus', state: 'play', id: '888888' },
      }));
      await nextFrames();
      wrapper.style.top = '0px';
      await nextFrames();

      expect(sent.join(), 'no pause or play sent').to.equal('');
      wrapper.style.cssText = '';
    });
  });
});
