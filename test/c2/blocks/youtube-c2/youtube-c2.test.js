import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init, { controlPlayback, getVideoId, readConfig } from '../../../../libs/c2/blocks/youtube-c2/youtube-c2.js';

const ID = 'dQw4w9WgXcQ';

const POSTER = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

function makeBlock(rows) {
  const el = document.createElement('div');
  el.className = 'youtube-c2';
  el.innerHTML = rows.map(([key, value]) => `<div><div>${key}</div><div>${value}</div></div>`).join('');
  document.body.append(el);
  return el;
}

describe('youtube-c2', () => {
  afterEach(() => {
    document.querySelectorAll('.youtube-c2').forEach((el) => el.remove());
  });

  describe('getVideoId', () => {
    it('accepts IDs and common YouTube URLs', () => {
      [
        ID,
        `https://www.youtube.com/watch?v=${ID}&t=10`,
        `https://youtu.be/${ID}?si=abc`,
        `https://m.youtube.com/watch?v=${ID}`,
        `https://www.youtube.com/embed/${ID}`,
        `https://www.youtube.com/live/${ID}`,
        `https://www.youtube.com/shorts/${ID}`,
        `https://www.youtube-nocookie.com/embed/${ID}`,
      ].forEach((value) => expect(getVideoId(value), value).to.equal(ID));
    });

    it('rejects other hosts and malformed IDs', () => {
      [
        '',
        undefined,
        'not a video',
        `https://evil.com/watch?v=${ID}`,
        'https://www.youtube.com/watch?v=short',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ"><script>',
      ].forEach((value) => expect(getVideoId(value), String(value)).to.be.null);
    });
  });

  it('reads the video from a link or plain text', () => {
    const fromLink = makeBlock([['Video', `<a href="https://youtu.be/${ID}">watch</a>`]]);
    expect(getVideoId(readConfig(fromLink).video)).to.equal(ID);
    const fromText = makeBlock([['video', ` https://www.youtube.com/watch?v=${ID} `]]);
    expect(getVideoId(readConfig(fromText).video)).to.equal(ID);
  });

  it('renders a click-to-play poster with an accessible name', () => {
    const el = makeBlock([['video', ID], ['title', 'Product keynote']]);
    init(el);
    const poster = el.querySelector('button.youtube-c2-poster');
    expect(poster.getAttribute('aria-label')).to.equal('Play video: Product keynote');
    expect(poster.querySelector('img').getAttribute('src')).to.contain(`/vi/${ID}/hqdefault.jpg`);
    expect(poster.querySelector('img').getAttribute('alt')).to.equal('');
    expect(el.querySelector('iframe')).to.be.null;
  });

  it('uses an authored poster image', () => {
    const el = makeBlock([['video', ID], ['poster', `<picture><img src="${POSTER}" alt="Poster"></picture>`]]);
    init(el);
    const img = el.querySelector('.youtube-c2-poster img');
    expect(img.getAttribute('src')).to.equal(POSTER);
    expect(img.getAttribute('alt')).to.equal('');
  });

  it('loads an unmuted, autoplaying player on click', () => {
    const el = makeBlock([['video', ID], ['title', 'Keynote'], ['controls', 'false']]);
    init(el);
    el.querySelector('.youtube-c2-poster').click();
    const iframe = el.querySelector('iframe.youtube-c2-frame');
    const src = new URL(iframe.src);
    expect(src.origin).to.equal('https://www.youtube-nocookie.com');
    expect(src.pathname).to.equal(`/embed/${ID}`);
    expect(src.searchParams.get('autoplay')).to.equal('1');
    expect(src.searchParams.has('mute')).to.be.false;
    expect(src.searchParams.get('controls')).to.equal('0');
    expect(iframe.title).to.equal('Keynote');
  });

  it('honors mute on click', () => {
    const el = makeBlock([['video', ID], ['mute', 'true']]);
    init(el);
    el.querySelector('.youtube-c2-poster').click();
    expect(new URL(el.querySelector('iframe').src).searchParams.get('mute')).to.equal('1');
  });

  it('autoplays muted without a poster', () => {
    const el = makeBlock([['video', ID], ['autoplay', 'true']]);
    init(el);
    expect(el.querySelector('.youtube-c2-poster')).to.be.null;
    const { searchParams } = new URL(el.querySelector('iframe').src);
    expect(searchParams.get('autoplay')).to.equal('1');
    expect(searchParams.get('mute')).to.equal('1');
  });

  it('reserves a chat panel and loads live chat when the video starts', () => {
    const el = makeBlock([['video', ID], ['chat', 'true']]);
    init(el);
    const chat = el.querySelector('.youtube-c2-stream.has-chat .youtube-c2-chat');
    expect(chat.querySelector('.youtube-c2-chat-placeholder')).to.exist;
    el.querySelector('.youtube-c2-poster').click();
    const src = new URL(chat.querySelector('iframe').src);
    expect(src.href).to.contain(`https://www.youtube.com/live_chat?v=${ID}`);
    expect(src.searchParams.get('embed_domain')).to.equal(window.location.hostname);
  });

  it('removes the block when the video is missing or invalid', () => {
    const el = makeBlock([['video', 'https://example.com/video']]);
    init(el);
    expect(el.isConnected).to.be.false;
  });

  describe('playback during a smooth scroll', () => {
    const YT_ORIGIN = 'https://www.youtube-nocookie.com';

    function report(iframe, data) {
      window.dispatchEvent(new MessageEvent('message', { origin: YT_ORIGIN, source: iframe.contentWindow, data: JSON.stringify(data) }));
    }

    it('toggles playback through the YouTube iframe API', () => {
      const iframe = document.createElement('iframe');
      document.body.append(iframe);
      const post = sinon.stub(iframe.contentWindow, 'postMessage');
      const player = controlPlayback(iframe);

      report(iframe, { event: 'onStateChange', info: 1 });
      player.toggle();
      expect(JSON.parse(post.lastCall.args[0]).func).to.equal('pauseVideo');
      expect(post.lastCall.args[1]).to.equal(YT_ORIGIN);
      player.toggle();
      expect(JSON.parse(post.lastCall.args[0]).func).to.equal('playVideo');

      report(iframe, { event: 'infoDelivery', info: { playerState: 2 } });
      player.toggle();
      expect(JSON.parse(post.lastCall.args[0]).func).to.equal('playVideo');

      window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', source: iframe.contentWindow, data: JSON.stringify({ event: 'onStateChange', info: 1 }) }));
      player.toggle();
      expect(JSON.parse(post.lastCall.args[0]).func).to.equal('pauseVideo');
      iframe.remove();
    });

    it('pauses the video when it is pressed while the page is gliding', () => {
      const el = makeBlock([['video', ID]]);
      init(el);
      el.querySelector('.youtube-c2-poster').click();
      const iframe = el.querySelector('iframe');
      const post = sinon.stub(iframe.contentWindow, 'postMessage');
      report(iframe, { event: 'onStateChange', info: 1 });

      const video = el.querySelector('.youtube-c2-video');
      video.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }));
      expect(post.called).to.be.false;

      document.documentElement.classList.add('lenis-smooth');
      video.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }));
      document.documentElement.classList.remove('lenis-smooth');
      expect(JSON.parse(post.lastCall.args[0]).func).to.equal('pauseVideo');
    });
  });
});
