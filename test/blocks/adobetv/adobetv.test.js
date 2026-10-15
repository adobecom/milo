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
    beforeEach(() => {
      window.fetch = stub().resolves({ ok: true, json: () => Promise.resolve({}) });
    });

    it('keeps an MPC player URL with a playback hash as the MPC player', async () => {
      const wrapper = document.querySelector('#mpcPlayerAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      expect(wrapper.querySelector('iframe').src).to.equal('https://video.tv.adobe.com/v/332632#_autoplay');
    });

    it('renders a poster with a play button for an MPC player URL with a poster', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      expect(wrapper.querySelector('video')).to.be.null;
      expect(wrapper.querySelector('.mpc-poster img').getAttribute('src')).to.equal('poster.jpg');
      const button = wrapper.querySelector('.mpc-poster button.consonant-play-btn');
      expect(button.getAttribute('aria-label')).to.equal('Play Demo video');
      await new Promise((r) => { setTimeout(r, 100); });
      expect(button.getAttribute('aria-label')).to.equal('play motion Demo video');
    });

    it('swaps the poster for an autoplaying MPC iframe on play', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      wrapper.querySelector('.mpc-poster button').click();
      const iframe = wrapper.querySelector('iframe');
      expect(wrapper.querySelector('.mpc-poster')).to.be.null;
      expect(wrapper.querySelector('a')).to.be.null;
      expect(iframe.src).to.equal('https://video.tv.adobe.com/v/111111?autoplay=true');
      expect(iframe.getAttribute('allow')).to.include('autoplay');
      expect(document.activeElement).to.equal(iframe);
    });

    it('plays a poster that was cloned after decoration', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      const clone = wrapper.cloneNode(true);
      clone.id = 'mpcPlayerPosterClone';
      wrapper.after(clone);
      clone.querySelector('.mpc-poster button').click();
      expect(clone.querySelector('.mpc-poster')).to.be.null;
      expect(clone.querySelector('iframe').src).to.include('autoplay=true');
      expect(wrapper.querySelector('.mpc-poster')).to.exist;
    });

    it('renders an autoplay MPC MP4 outside background blocks as a native video', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      const source = await waitForElement('#mpcMp4Autoplay video source');
      expect(source.getAttribute('src')).to.include('images-tv.adobe.com/mpcv3/1229/clip');
    });

    it('loads an authored ?autoplay=true player paused with autoplay pending', async () => {
      const wrapper = document.querySelector('#mpcPlayerQueryAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      const iframe = wrapper.querySelector('iframe');
      expect(iframe.src).to.equal('https://video.tv.adobe.com/v/444444?end=replay');
      expect(iframe.getAttribute('allow')).to.include('autoplay');
      expect(iframe.dataset.autoplayPending).to.equal('true');
    });

    describe('authored ?autoplay=true on load', () => {
      const setup = async (selector, position) => {
        const wrapper = document.querySelector(selector);
        wrapper.style.cssText = `position: fixed; left: 0; width: 300px; top: ${position}`;
        await init(wrapper.querySelector('a'));
        const iframe = wrapper.querySelector('iframe');
        // Same-origin document so postMessage can be spied on.
        const loaded = new Promise((r) => { iframe.addEventListener('load', r, { once: true }); });
        iframe.src = 'about:blank';
        await loaded;
        const postMessage = stub(iframe.contentWindow, 'postMessage');
        await new Promise((r) => { setTimeout(r, 100); });
        window.dispatchEvent(new MessageEvent('message', {
          origin: 'https://video.tv.adobe.com',
          source: iframe.contentWindow,
          data: { type: 'mpcStatus', state: 'load' },
        }));
        return { wrapper, iframe, postMessage };
      };

      it('plays a player that is in view when it loads', async () => {
        const { iframe, postMessage } = await setup('#mpcPlayerQueryAutoplay', '0');
        expect(iframe.dataset.autoplayPending).to.be.undefined;
        expect(postMessage.calledWith({ type: 'mpcAction', action: 'play' })).to.be.true;
      });

      it('leaves a player paused when it loads out of view, even after scrolling in', async () => {
        const { wrapper, iframe, postMessage } = await setup('#mpcPlayerPosterQueryAutoplay', '-2000px');
        expect(iframe.dataset.autoplayPending).to.be.undefined;
        wrapper.style.cssText = 'position: fixed; left: 0; width: 300px; top: 0';
        await new Promise((r) => { setTimeout(r, 100); });
        expect(postMessage.called).to.be.false;
      });
    });

    it('skips the poster for a poster with ?autoplay=true and waits for view to play', async () => {
      const wrapper = document.querySelector('#mpcPlayerPosterQueryAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('.mpc-poster')).to.be.null;
      expect(wrapper.querySelector('video')).to.be.null;
      const iframe = wrapper.querySelector('iframe');
      expect(iframe.src).to.equal('https://video.tv.adobe.com/v/888888?end=replay');
      expect(iframe.getAttribute('allow')).to.include('autoplay');
      expect(iframe.dataset.autoplayPending).to.equal('true');
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
});
