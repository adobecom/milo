import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor } from '../../helpers/waitfor.js';
import { setConfig, loadArea, loadStyle } from '../../../libs/utils/utils.js';

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

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
    await new Promise((resolve) => { loadStyle('/libs/styles/styles.css', resolve); });
  });

  after(async () => {
    sinon.restore();
    await setViewport({ width: 1280, height: 800 });
  });

  ['media-hidden-mobile', 'media-hidden-tablet'].forEach((hiddenClass) => {
    it(`sets a poster exactly when the CSS shows the video (${hiddenClass})`, async function test() {
      this.timeout(20000);
      setConfig(config);
      /* eslint-disable no-restricted-syntax, no-await-in-loop */
      for (const width of widths) {
        document.body.innerHTML = fixture;
        const main = document.querySelector('main');
        main.querySelector('.hero-marquee').classList.replace('media-hidden-mobile', hiddenClass);
        await setViewport({ width, height: 800 });
        await loadArea(main);
        main.querySelectorAll('video').forEach((el) => {
          const label = `${width}px: ${el.dataset.videoSource}`;
          expect(el.hasAttribute('poster'), label).to.equal(el.checkVisibility());
        });
      }
      /* eslint-enable no-restricted-syntax, no-await-in-loop */
    });
  });
});
