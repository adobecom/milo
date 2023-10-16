import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/marquee/marquee.js');
const { default: videoBLock } = await import('../../../libs/blocks/video/video.js');
const video = await readFile({ path: './mocks/video.html' });
const multipleIcons = await readFile({ path: './mocks/multiple-icons.html' });
describe('marquee', () => {
  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach((marquee) => {
    init(marquee);
  });
  describe('default marquee medium dark', () => {
    it('has a heading-xl', () => {
      const heading = marquees[0].querySelector('.heading-xl');
      expect(heading).to.exist;
    });
    it('has a supporting image', () => {
      const image = marquees[0].querySelector('.foreground .image img');
      expect(image).to.exist;
    });
    it('is dark by default', () => {
      const dark = marquees[1].classList.contains('dark');
      expect(dark).to.be.true;
    });
  });

  describe('second marquee small', () => {
    it('has an icon-area', () => {
      const iconArea = marquees[1].querySelector('.icon-area');
      expect(iconArea).to.exist;
    });
    it('wraps the picture in a link if provided', () => {
      const picture = marquees[1].querySelector('.foreground .image a picture');
      expect(picture).to.exist;
    });
  });

  describe('supports media credits', () => {
    it('has a media credit with text content', () => {
      const mediaCredit = document.getElementById('media-credit-text').querySelector('.media-credit .body-s');
      expect(mediaCredit).to.exist;
      expect(mediaCredit.textContent.trim()).to.have.lengthOf.above(0);
    });

    it('has a media credit with element content', () => {
      const mediaCredit = document.getElementById('media-credit-element').querySelector('.media-credit').firstElementChild;
      expect(mediaCredit).to.exist;
    });
  });

  describe('supports videos', () => {
    before(() => {
      document.body.innerHTML = video;
    });

    it('in background, single', async () => {
      const marquee = document.getElementById('single-background');
      init(marquee);
      videoBLock(document.querySelector('#single-background a[href*=".mp4"]'));
      const videoEl = await waitForElement('#single-background .background video');
      expect(videoEl).to.exist;
      document.getElementById('single-background').remove();
    });

    it('in background, multiple', async () => {
      const marquee = document.getElementById('multiple-background');
      init(marquee);
      document.querySelectorAll('#multiple-background a[href*=".mp4"]').forEach((videoLink) => videoBLock(videoLink));
      await waitForElement('#multiple-background .background video');
      expect(marquee.querySelectorAll('.background video').length).to.equal(1);
      document.getElementById('multiple-background').remove();
    });

    it('in foreground', async () => {
      const marquee = document.getElementById('foreground');
      init(marquee);
      videoBLock(document.querySelector('#foreground a[href*=".mp4"]'));
      await waitForElement('#foreground video');
      expect(marquee.querySelector('.foreground video')).to.exist;
    });
  });

  describe('supports multiple icons', () => {
    before(() => {
      document.body.innerHTML = multipleIcons;
    });

    it('using img', () => {
      const marquee = document.getElementById('using-images');
      init(marquee);
      expect(marquee.querySelector('.icon-area-multiple')).to.exist;
    });

    it('using svg', () => {
      const marquee = document.getElementById('using-svgs');
      init(marquee);
      expect(marquee.querySelector('.icon-area-multiple')).to.exist;
    });
  });
});
