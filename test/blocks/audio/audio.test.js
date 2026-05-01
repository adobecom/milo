import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
const { default: init } = await import('../../../libs/blocks/audio/audio.js');

describe('audio block', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: [] }),
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders audio player for mp3 link', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    expect(block.querySelector('.audio-player')).to.exist;
    expect(block.querySelector('audio')).to.exist;
    expect(block.querySelector('.audio-play-btn')).to.exist;
    expect(block.querySelector('.audio-progress')).to.exist;
  });

  it('sets correct src for mp3 audio', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const audio = block.querySelector('audio');
    expect(audio.getAttribute('src')).to.include('sample.mp3');
  });

  it('renders audio player for wav link', async () => {
    const block = document.querySelector('.audio.wav');
    await init(block);
    const audio = block.querySelector('audio');
    expect(audio).to.exist;
    expect(audio.getAttribute('src')).to.include('sample.wav');
  });

  it('does nothing if no link is found', async () => {
    const block = document.querySelector('.audio.no-link');
    const originalHTML = block.innerHTML;
    await init(block);
    expect(block.innerHTML).to.equal(originalHTML);
  });

  it('does nothing for non-audio file extensions', async () => {
    const block = document.querySelector('.audio.invalid-ext');
    const originalHTML = block.innerHTML;
    await init(block);
    expect(block.innerHTML).to.equal(originalHTML);
  });

  it('play button has accessible label and aria-pressed', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const playBtn = block.querySelector('.audio-play-btn');
    expect(playBtn.getAttribute('aria-label')).to.be.a('string').and.not.empty;
    expect(playBtn.getAttribute('aria-pressed')).to.equal('false');
    expect(playBtn.getAttribute('type')).to.equal('button');
  });

  it('adds is-playing class and updates aria-pressed on play event', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const playBtn = block.querySelector('.audio-play-btn');
    const audio = block.querySelector('audio');

    audio.dispatchEvent(new Event('play'));
    expect(playBtn.getAttribute('aria-pressed')).to.equal('true');
    expect(playBtn.classList.contains('is-playing')).to.be.true;
  });

  it('removes is-playing class and resets aria-pressed on pause event', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const playBtn = block.querySelector('.audio-play-btn');
    const audio = block.querySelector('audio');

    audio.dispatchEvent(new Event('play'));
    audio.dispatchEvent(new Event('pause'));
    expect(playBtn.getAttribute('aria-pressed')).to.equal('false');
    expect(playBtn.classList.contains('is-playing')).to.be.false;
  });

  it('resets state on ended event', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const playBtn = block.querySelector('.audio-play-btn');
    const audio = block.querySelector('audio');
    const progress = block.querySelector('.audio-progress');

    audio.dispatchEvent(new Event('play'));
    audio.dispatchEvent(new Event('ended'));
    expect(playBtn.classList.contains('is-playing')).to.be.false;
    expect(playBtn.getAttribute('aria-pressed')).to.equal('false');
    expect(progress.value).to.equal('0');
  });

  it('displays formatted duration on loadedmetadata', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const audio = block.querySelector('audio');
    const durationEl = block.querySelector('.audio-duration');

    Object.defineProperty(audio, 'duration', { value: 125, configurable: true });
    audio.dispatchEvent(new Event('loadedmetadata'));
    expect(durationEl.textContent).to.equal('2:05');
  });

  it('updates current time display on timeupdate', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const audio = block.querySelector('audio');
    const currentTimeEl = block.querySelector('.audio-current-time');

    Object.defineProperty(audio, 'duration', { value: 90, configurable: true });
    Object.defineProperty(audio, 'currentTime', { value: 65, configurable: true });
    audio.dispatchEvent(new Event('timeupdate'));
    expect(currentTimeEl.textContent).to.equal('1:05');
  });

  it('initializes time displays as 0:00', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    expect(block.querySelector('.audio-current-time').textContent).to.equal('0:00');
    expect(block.querySelector('.audio-duration').textContent).to.equal('0:00');
  });

  it('player has region role for accessibility', async () => {
    const block = document.querySelector('.audio.mp3');
    await init(block);
    const player = block.querySelector('.audio-player');
    expect(player.getAttribute('role')).to.equal('region');
    expect(player.getAttribute('aria-label')).to.exist;
  });
});
