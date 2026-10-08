import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor } from '../../helpers/waitfor.js';
import { setConfig, loadArea, loadStyle } from '../../../libs/utils/utils.js';
import { decorateAnchorVideo } from '../../../libs/utils/decorate.js';

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

before(async () => {
  await new Promise((resolve) => { loadStyle('/libs/styles/styles.css', resolve); });
});

describe('hero-marquee video posters', () => {
  let main;

  const video = (selector) => main.querySelector(`${selector} video`);
  const bgMobile = () => video('.background .mobile-only');
  const bgDesktop = () => video('.background .desktop-only');
  const fg = () => video('.foreground .asset');

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

  it('only sets posters for media shown on mobile', async () => {
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);

    expect(bgMobile().getAttribute('poster')).to.include('#bg-mobile');
    expect(bgDesktop().hasAttribute('poster')).to.be.false;
    expect(bgDesktop().dataset.hmPoster).to.include('#bg-desktop');
    expect(fg().hasAttribute('poster')).to.be.false;
    expect(fg().dataset.hmPoster).to.include('#fg');
  });

  it('sets hidden posters once the viewport shows them', async () => {
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);
    await setViewport({ width: 1400, height: 800 });

    await waitFor(() => bgDesktop().hasAttribute('poster') && fg().hasAttribute('poster'), 1500);
    expect(bgDesktop().getAttribute('poster')).to.include('#bg-desktop');
    expect(fg().getAttribute('poster')).to.include('#fg');
    expect(main.querySelector('video[data-hm-poster]')).to.be.null;
  });

  it('skips the mobile background poster on desktop', async () => {
    await setViewport({ width: 1400, height: 800 });
    await loadArea(main);

    expect(bgMobile().hasAttribute('poster')).to.be.false;
    expect(bgDesktop().getAttribute('poster')).to.include('#bg-desktop');
    expect(fg().getAttribute('poster')).to.include('#fg');
  });

  it('restores a deferred poster once visible even if hero-marquee code never runs', async () => {
    const a = main.querySelector('a[href*="media_fg"]');
    main.firstElementChild.classList.add('section');
    main.querySelector('.hero-marquee').className = 'hero-marquee';
    decorateAnchorVideo({ src: a.href, anchorTag: a });
    const el = main.querySelector('video');
    expect(el.hasAttribute('poster')).to.be.false;

    await waitFor(() => el.hasAttribute('poster'), 1500);
    expect(el.getAttribute('poster')).to.include('#fg');
  });

  it('keeps posters as-is when MEP swaps the hero-marquee code', async () => {
    setConfig({ ...config, mep: { blocks: { 'hero-marquee': '/libs/mep/ace1052/hero-marquee' } } });
    await setViewport({ width: 375, height: 800 });
    await loadArea(main);

    expect(main.querySelectorAll('video[poster]')).to.have.lengthOf(3);
    expect(main.querySelector('video[data-hm-poster]')).to.be.null;
  });
});

describe('hero-marquee video posters match the CSS', () => {
  const widths = [375, 599, 600, 601, 1199, 1200, 1400];
  let fixture;

  before(async () => {
    window.lana = { log: sinon.stub() };
    fixture = await readFile({ path: './mocks/video.html' });
  });

  after(async () => {
    sinon.restore();
    await setViewport({ width: 1280, height: 800 });
  });

  const addTabletBg = (block) => {
    const desktop = block.querySelector(':scope > div:first-child > div:last-child');
    const tablet = desktop.cloneNode(true);
    const a = tablet.querySelector('a');
    a.href = a.href.replace('bg-desktop', 'bg-tablet');
    a.textContent = 'media_bg-tablet.mp4';
    a.dataset.videoPoster = a.dataset.videoPoster.replaceAll('#bg-desktop', '#bg-tablet');
    desktop.before(tablet);
  };

  [
    { hiddenClass: 'media-hidden-mobile' },
    { hiddenClass: 'media-hidden-tablet' },
    { hiddenClass: 'media-hidden-mobile', threeBg: true },
    { hiddenClass: 'media-hidden-mobile', cover: true },
    { hiddenClass: 'media-hidden-tablet', cover: true },
    { hiddenClass: 'media-hidden-tablet-tablet' },
    { hiddenClass: 'media-hidden-tablet-tablet', cover: true },
  ].forEach(({ hiddenClass, threeBg, cover }) => {
    const name = [hiddenClass, threeBg && '3 bg cells', cover && 'media-cover'].filter(Boolean).join(', ');
    it(`sets a poster exactly when the CSS shows the video (${name})`, async function test() {
      this.timeout(20000);
      setConfig(config);
      /* eslint-disable no-restricted-syntax, no-await-in-loop */
      for (const width of widths) {
        document.body.innerHTML = fixture;
        const main = document.querySelector('main');
        const block = main.querySelector('.hero-marquee');
        block.classList.replace('media-hidden-mobile', hiddenClass);
        if (cover) block.classList.add('media-cover');
        if (threeBg) addTabletBg(block);
        await setViewport({ width, height: 800 });
        await loadArea(main);
        expect(main.querySelectorAll('video')).to.have.lengthOf(threeBg ? 4 : 3);
        expect(!!main.querySelector('.foreground-media video')).to.equal(!!cover);
        main.querySelectorAll('video').forEach((el) => {
          const label = `${width}px: ${el.dataset.videoSource}`;
          expect(el.hasAttribute('poster'), label).to.equal(el.checkVisibility());
        });
      }
      /* eslint-enable no-restricted-syntax, no-await-in-loop */
    });
  });
});
