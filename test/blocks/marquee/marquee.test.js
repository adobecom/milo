import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/marquee/marquee.js');
const video = await readFile({ path: './mocks/video.html' });
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
  });

  describe('supports media credits', () => {
    it('has a media credit with text content', () => {
      const mediaCredit = marquees[8].querySelector('.media-credit .body-s');
      expect(mediaCredit).to.exist;
      expect(mediaCredit.textContent.trim()).to.have.lengthOf.above(0);
    });
  });

  describe('supports buttons ', () => {
    it('has adapted button sizes', () => {
      const button = marquees[14].querySelector('a.con-button');
      expect(Array.from(button.classList).includes('button-xl')).to.equal(true);
    });

    it('creates an action area', () => {
      const pTags = marquees[14].querySelectorAll('p');
      expect(Array.from(pTags[2].classList).includes('action-area')).to.equal(true);
      expect(Array.from(pTags[3].classList).includes('supplemental-text')).to.equal(true);
    });
  });

  describe('supports videos', () => {
    before(() => {
      document.body.innerHTML = video;
    });

    it('in background, single', () => {
      const marquee = document.getElementById('single-background');
      init(marquee);
      expect(marquee.querySelector('.background video')).to.exist;
    });

    it('in background, multiple', () => {
      const marquee = document.getElementById('multiple-background');
      init(marquee);
      expect(marquee.querySelectorAll('.background video').length).to.equal(3);
    });

    it('in foreground', () => {
      const marquee = document.getElementById('foreground');
      init(marquee);
      expect(marquee.querySelector('.foreground video')).to.exist;
    });
  });
});
