import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { getConfig, updateConfig, setConfig } from '../../../libs/utils/utils.js';

const documentHTML = await readFile({ path: './mocks/body.html' });
setConfig({});
const { default: init } = await import('../../../libs/blocks/adobetv/adobetv.js');
const { pickMpcMp4 } = await import('../../../libs/utils/decorate.js');

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

  describe('MPC as native video', () => {
    const mpcJson = {
      sources: [
        { format: 'playlist', width: 0, src: 'https://images-tv.adobe.com/x/playlist.m3u8' },
        { format: 'mpeg-ts', width: 1920, src: 'https://images-tv.adobe.com/x/1920.m3u8' },
        { format: 'mpeg4', width: 960, labelid: 6, src: 'https://images-tv.adobe.com/x/960.mp4' },
        { format: 'mpeg4', width: 854, labelid: 5, src: 'https://images-tv.adobe.com/x/854.mp4' },
      ],
    };

    beforeEach(() => {
      window.fetch = stub().resolves({ ok: true, json: () => Promise.resolve(mpcJson) });
    });

    it('renders an autoplay MPC player URL as a native video with an MP4 source', async () => {
      const wrapper = document.querySelector('#mpcPlayerAutoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      const video = wrapper.querySelector('video');
      expect(video.hasAttribute('autoplay')).to.be.true;
      expect(video.hasAttribute('loop')).to.be.true;
      expect(video.dataset.videoSource).to.be.undefined;
      const source = await waitForElement('#mpcPlayerAutoplay video source');
      expect(source.getAttribute('src')).to.match(/\.mp4$/);
      expect(video.dataset.videoSource).to.equal(source.getAttribute('src'));
      expect(window.fetch.calledWith('https://video.tv.adobe.com/v/332632?format=json')).to.be.true;
    });

    it('renders an MPC player URL authored with a poster as a native video', async () => {
      const wrapper = document.querySelector('#mpcPlayerPoster');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      expect(wrapper.querySelector('video[controls]')).to.exist;
      await waitForElement('#mpcPlayerPoster video source');
    });

    it('renders an autoplay MPC MP4 outside background blocks as a native video', async () => {
      const wrapper = document.querySelector('#mpcMp4Autoplay');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('iframe')).to.be.null;
      const source = await waitForElement('#mpcMp4Autoplay video source');
      expect(source.getAttribute('src')).to.include('images-tv.adobe.com/mpcv3/1229/clip');
    });

    it('maps MPC query params onto the native video', async () => {
      const wrapper = document.querySelector('#mpcPlayerParams');
      await init(wrapper.querySelector('a'));
      const video = wrapper.querySelector('video');
      expect(video.hasAttribute('autoplay')).to.be.true;
      expect(video.hasAttribute('loop')).to.be.true;
      expect(wrapper.querySelector('.pause-play-wrapper')).to.be.null;
      const source = await waitForElement('#mpcPlayerParams video source');
      expect(source.getAttribute('src')).to.equal('https://images-tv.adobe.com/x/854.mp4#t=3');
      expect(video.muted).to.be.true;
    });

    it('plays once when MPC autoplay has no end=replay', async () => {
      const wrapper = document.querySelector('#mpcPlayerOnce');
      await init(wrapper.querySelector('a'));
      const video = wrapper.querySelector('video');
      expect(video.hasAttribute('autoplay')).to.be.true;
      expect(video.hasAttribute('loop')).to.be.false;
    });

    it('lets an authored Milo hash win over MPC query params', async () => {
      const wrapper = document.querySelector('#mpcPlayerHashWins');
      await init(wrapper.querySelector('a'));
      const video = wrapper.querySelector('video');
      expect(video.hasAttribute('autoplay')).to.be.true;
      expect(video.hasAttribute('loop')).to.be.true;
    });

    it('mutes a click-to-play MPC video with hasaudio=0', async () => {
      const wrapper = document.querySelector('#mpcPlayerNoAudio');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video[controls]')).to.exist;
      await waitForElement('#mpcPlayerNoAudio video source');
      expect(wrapper.querySelector('video').muted).to.be.true;
    });

    it('fetches MPC data once per video id', async () => {
      const wrapper = document.querySelector('#mpcPlayerShared');
      const [a1, a2] = wrapper.querySelectorAll('a');
      await init(a1);
      await init(a2);
      await waitForElement('#mpcPlayerShared div:last-child video source');
      await waitForElement('#mpcPlayerShared div:first-child video source');
      const calls = window.fetch.getCalls().filter((c) => c.args[0].includes('555555'));
      expect(calls.length).to.equal(1);
    });

    it('keeps a plain MPC player link as the iframe player', async () => {
      const wrapper = document.querySelector('#mpcPlayerPlain');
      await init(wrapper.querySelector('a'));
      expect(wrapper.querySelector('video')).to.be.null;
      expect(wrapper.querySelector('iframe').src).to.equal('https://video.tv.adobe.com/v/888888');
    });

    it('logs and leaves the video without a source when MPC data fails', async () => {
      const ogLana = window.lana;
      window.lana = { log: stub() };
      window.fetch = stub().resolves({ ok: false, status: 404 });
      const wrapper = document.querySelector('#mpcPlayerFail');
      await init(wrapper.querySelector('a'));
      await new Promise((resolve) => { setTimeout(resolve, 100); });
      expect(wrapper.querySelector('video source')).to.be.null;
      expect(window.lana.log.calledOnce).to.be.true;
      window.lana = ogLana;
    });
  });

  describe('pickMpcMp4', () => {
    const sources = [
      { format: 'mpeg4', width: 960, src: 'https://x/960.mp4' },
      { format: 'mpeg-ts', width: 1920, src: 'https://x/1920.m3u8' },
      { format: 'mpeg4', width: 640, src: 'https://x/640.mp4' },
    ];

    it('picks the smallest MP4 that covers the target width', () => {
      expect(pickMpcMp4(sources, 700)).to.equal('https://x/960.mp4');
      expect(pickMpcMp4(sources, 300)).to.equal('https://x/640.mp4');
    });

    it('falls back to the largest MP4, ignoring HLS', () => {
      expect(pickMpcMp4(sources, 4000)).to.equal('https://x/960.mp4');
    });

    it('returns undefined without MP4 renditions', () => {
      expect(pickMpcMp4([sources[1]], 100)).to.be.undefined;
    });

    it('prefers the MP4 matching the MPC quality label', () => {
      const withLabels = [{ ...sources[0], labelid: 6 }, { ...sources[2], labelid: 3 }];
      expect(pickMpcMp4(withLabels, 4000, '3')).to.equal('https://x/640.mp4');
    });
  });
});
