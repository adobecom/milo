import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/c2/blocks/explore-card/explore-card.js');

describe('explore-card', () => {
  describe('single viewport', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/single-viewport.html' });
      init(document.querySelector('.explore-card'));
    });

    it('adds explore-card-container class to first row', () => {
      expect(document.querySelector('.explore-card-container')).to.exist;
    });

    it('adds explore-card-background class to background div', () => {
      expect(document.querySelector('.explore-card-background')).to.exist;
    });

    it('adds explore-card-content class to content div', () => {
      expect(document.querySelector('.explore-card-content')).to.exist;
    });

    it('wraps content in a link container when a link is present', () => {
      expect(document.querySelector('.explore-card-link-container')).to.exist;
    });

    it('does not stamp data-viewport attributes', () => {
      expect(document.querySelector('[data-viewport]')).to.not.exist;
    });
  });

  describe('multi viewport', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/multi-viewport.html' });
      init(document.querySelector('.explore-card'));
    });

    it('keeps all viewport containers in the DOM', () => {
      const viewportDivs = document.querySelectorAll('[data-viewport]');
      expect(viewportDivs.length).to.equal(2);
    });

    it('stamps data-viewport="mobile" on the mobile container', () => {
      expect(document.querySelector('[data-viewport="mobile"]')).to.exist;
    });

    it('stamps data-viewport="desktop" on the desktop container', () => {
      expect(document.querySelector('[data-viewport="desktop"]')).to.exist;
    });

    it('removes the delimiter label rows', () => {
      // delimiter rows contain only "mobile" or "desktop" text — they should be gone
      const allDivText = [...document.querySelectorAll('.explore-card > div')]
        .map((d) => d.textContent.trim().toLowerCase());
      expect(allDivText.some((t) => t === 'mobile' || t === 'desktop')).to.be.false;
    });

    it('decorates content inside each viewport container', () => {
      expect(document.querySelectorAll('.explore-card-container').length).to.equal(2);
    });
  });

  describe('multi viewport with classes', () => {
    let originalMatchMedia;

    before(async () => {
      // Mock matchMedia so the mobile query matches
      originalMatchMedia = window.matchMedia;
      window.matchMedia = (query) => ({
        matches: query.includes('width < 1024px'),
        addEventListener: () => {},
      });
      document.body.innerHTML = await readFile({ path: './mocks/multi-viewport-classes.html' });
      init(document.querySelector('.explore-card'));
    });

    after(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('applies the viewport-specific class to el when the viewport matches', () => {
      const el = document.querySelector('.explore-card');
      expect(el.classList.contains('dark')).to.be.true;
    });
  });
});
