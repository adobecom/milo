import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor } from '../../helpers/waitfor.js';
import { setConfig, loadArea, loadStyle } from '../../../libs/utils/utils.js';

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

describe('hero-marquee video loading', () => {
  let main;

  const bgMobile = () => main.querySelector('.background .mobile-only');
  const bgDesktop = () => main.querySelector('.background .desktop-only');
  const fgAsset = () => main.querySelector('.foreground .asset');

  beforeEach(async () => {
    window.lana = { log: sinon.stub() };
    setConfig(config);
    document.body.innerHTML = await readFile({ path: './mocks/video.html' });
    main = document.querySelector('main');
  });

  afterEach(async () => {
    sinon.restore();
    await setViewport({ width: 1280, height: 800 });
  });

  it('only creates videos (and poster requests) for media shown on mobile', async () => {
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);

    expect(bgMobile().querySelector('video').getAttribute('poster')).to.include('#bg-mobile');
    expect(bgDesktop().querySelector('video')).to.be.null;
    expect(bgDesktop().querySelector('a.video.link-block')).to.exist;
    expect(fgAsset().querySelector('video')).to.be.null;
    expect(fgAsset().querySelector('a.video.link-block')).to.exist;
    expect(main.querySelectorAll('video')).to.have.lengthOf(1);
  });

  it('creates hidden videos once the viewport shows them', async () => {
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);
    await setViewport({ width: 1400, height: 800 });

    await waitFor(() => bgDesktop().querySelector('video') && fgAsset().querySelector('video'), 1500);
    expect(bgDesktop().querySelector('video').getAttribute('poster')).to.include('#bg-desktop');
    expect(bgDesktop().querySelector('video').hasAttribute('disablepictureinpicture')).to.be.true;
    expect(fgAsset().querySelector('video').getAttribute('poster')).to.include('#fg');
    expect(bgMobile().querySelectorAll('video')).to.have.lengthOf(1);
  });

  it('skips the mobile background video on desktop', async () => {
    await setViewport({ width: 1400, height: 800 });
    await loadArea(main);

    expect(bgMobile().querySelector('video')).to.be.null;
    expect(bgDesktop().querySelector('video')).to.exist;
    expect(fgAsset().querySelector('video')).to.exist;
  });

  it('keeps the media-cover position for a video created later', async () => {
    main.querySelector('.hero-marquee').classList.add('media-cover', 'media-cover-left');
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);

    // media-cover + media-cover-left leaves an empty first wrapper; the asset is in the last one.
    const media = [...main.querySelectorAll('.foreground-media')].pop();
    expect(media.querySelector('video')).to.be.null;
    await setViewport({ width: 1400, height: 800 });
    await waitFor(() => media.querySelector('video'), 1500);
    expect(media.style.getPropertyValue('--media-cover-position')).to.equal('left');
  });

  it('leaves videos to the video autoblock when MEP swaps the hero-marquee code', async () => {
    setConfig({ ...config, mep: { blocks: { 'hero-marquee': '/libs/mep/ace1052/hero-marquee' } } });
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);

    expect(main.querySelectorAll('video')).to.have.lengthOf(3);
    expect(main.querySelector('a.video.link-block')).to.be.null;
  });
});

describe('hero-marquee video loading matches the CSS', () => {
  const widths = [375, 599, 600, 601, 1199, 1200, 1400];
  let fixture;

  before(async () => {
    window.lana = { log: sinon.stub() };
    fixture = await readFile({ path: './mocks/video.html' });
    await new Promise((resolve) => { loadStyle('/libs/styles/styles.css', resolve); });
  });

  after(async () => {
    sinon.restore();
    await setViewport({ width: 1280, height: 800 });
  });

  ['media-hidden-mobile', 'media-hidden-tablet'].forEach((hiddenClass) => {
    it(`creates a video exactly when the CSS shows it (${hiddenClass})`, async function test() {
      this.timeout(20000);
      setConfig(config);
      /* eslint-disable no-restricted-syntax, no-await-in-loop */
      for (const width of widths) {
        document.body.innerHTML = fixture;
        const main = document.querySelector('main');
        main.querySelector('.hero-marquee').classList.replace('media-hidden-mobile', hiddenClass);
        await setViewport({ width, height: 800 });
        await loadArea(main);
        main.querySelectorAll('a.video.link-block').forEach((a) => {
          expect(a.checkVisibility(), `${width}px: ${a.textContent} is unloaded but shown`).to.be.false;
        });
        main.querySelectorAll('video').forEach((video) => {
          expect(video.checkVisibility(), `${width}px: created video is hidden`).to.be.true;
        });
      }
      /* eslint-enable no-restricted-syntax, no-await-in-loop */
    });
  });
});
