import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../libs/c2/blocks/roller-carousel/roller-carousel.js';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const realMatchMedia = window.matchMedia.bind(window);

function forceReducedMotion(matches) {
  window.matchMedia = (q) => {
    if (q !== REDUCED_MOTION) return realMatchMedia(q);
    return { matches, addEventListener() {}, removeEventListener() {} };
  };
}

async function loadBlock(mock, { reducedMotion = false } = {}) {
  document.body.innerHTML = await readFile({ path: `./mocks/${mock}.html` });
  const block = document.querySelector('.roller-carousel');
  forceReducedMotion(reducedMotion);
  init(block);
  return block;
}

const names = (nodes) => [...nodes].map((n) => n.textContent);

describe('C2 roller carousel', () => {
  afterEach(() => {
    window.matchMedia = realMatchMedia;
    document.body.innerHTML = '';
  });

  describe('scroll roller', () => {
    it('replaces authored rows with a background layer and a sized scroll wrapper', async () => {
      const block = await loadBlock('default');
      const [bg, scrollWrapper] = block.children;
      expect(block.children).to.have.length(2);
      expect(bg.className).to.equal('rcc-bg');
      expect(bg.getAttribute('aria-hidden')).to.equal('true');
      expect(scrollWrapper.className).to.equal('rcc-scroll-wrapper');
      expect(scrollWrapper.style.height).to.include('100dvh').and.include('800px');
      const sticky = scrollWrapper.querySelector(':scope > .rcc-sticky');
      const content = sticky.querySelector(':scope > .rcc-content');
      expect([...content.children].map((c) => c.className))
        .to.deep.equal(['rcc-left', 'rcc-media-wrapper']);
      expect(block.classList.contains('rcc-reduced-motion')).to.be.false;
    });

    it('decorates the eyebrow and heading into the header', async () => {
      const block = await loadBlock('default');
      const header = block.querySelector('.rcc-header');
      const [eyebrow, heading] = header.children;
      expect(eyebrow.tagName).to.equal('P');
      expect(eyebrow.className).to.equal('rcc-eyebrow eyebrow');
      expect(eyebrow.textContent).to.equal('Creative Cloud');
      expect(heading.tagName).to.equal('H2');
      expect(heading.className).to.equal('rcc-heading heading-2');
      expect(heading.textContent).to.equal('Apps for every idea');
      const left = block.querySelector('.rcc-left');
      const expectedParent = block.classList.contains('rcc-reflow') ? block : left;
      expect(header.parentElement).to.equal(expectedParent);
    });

    it('lists named apps only, with the first one active', async () => {
      const block = await loadBlock('default');
      const items = block.querySelectorAll('.rcc-carousel .rcc-list-wrapper > ul.rcc-list > li');
      expect(names(items)).to.deep.equal(['Photoshop', 'Lightroom', 'Premiere Pro', 'After Effects']);
      items.forEach((item, i) => {
        expect(item.classList.contains('rcc-item')).to.be.true;
        expect(item.classList.contains('heading-2')).to.be.true;
        expect(item.classList.contains('is-active')).to.equal(i === 0);
      });
    });

    it('shows the first app category above a hidden divider', async () => {
      const block = await loadBlock('default');
      const wrapper = block.querySelector('.rcc-carousel > .rcc-category-wrapper');
      const label = wrapper.querySelector('span.rcc-category.heading-6');
      expect(label.textContent).to.equal('Photo');
      expect(wrapper.querySelector('.rcc-divider').getAttribute('aria-hidden')).to.equal('true');
    });

    it('builds one background slide per app with an overlay', async () => {
      const block = await loadBlock('default');
      const slides = [...block.querySelectorAll('.rcc-bg > .rcc-bg-slide')];
      expect(slides).to.have.length(4);
      slides.forEach((slide, i) => {
        expect(slide.classList.contains('is-active')).to.equal(i === 0);
        expect(slide.lastElementChild.className).to.equal('rcc-bg-overlay');
      });
      expect(slides.map((s) => s.querySelector('img')?.alt))
        .to.deep.equal(['Photoshop artwork', 'Lightroom artwork', 'Premiere artwork', undefined]);
    });

    it('builds media slides with SVG, picture, and missing icons', async () => {
      const block = await loadBlock('default');
      const slides = [...block.querySelectorAll('.rcc-media-wrapper > .rcc-media-slide')];
      expect(slides).to.have.length(4);
      expect(slides.map((s) => s.classList.contains('is-active'))).to.deep.equal([true, false, false, false]);

      const [ps, lr, pr, ae] = slides;
      expect(ps.querySelector(':scope > picture img').alt).to.equal('Photoshop artwork');
      const svgIcon = ps.querySelector('.rcc-media-icon > img');
      expect(svgIcon.alt).to.equal('Photoshop icon');
      expect(svgIcon.getAttribute('src')).to.match(/Smock_GlobeOutline_18_N\.svg$/);

      expect(lr.querySelector(':scope > picture img').alt).to.equal('Lightroom artwork');
      expect(lr.querySelector('.rcc-media-icon > picture img').alt).to.equal('Lightroom icon');

      expect(pr.querySelector(':scope > picture img').alt).to.equal('Premiere artwork');
      expect(pr.querySelector('.rcc-media-icon')).to.be.null;
      expect(ae.children).to.have.length(0);
    });

    it('loads the first slides eagerly and deprioritises the rest', async () => {
      const block = await loadBlock('default');
      const firstBg = block.querySelector('.rcc-bg-slide img');
      expect(firstBg.getAttribute('loading')).to.equal('eager');
      expect(firstBg.getAttribute('fetchpriority')).to.equal('high');
      block.querySelectorAll('.rcc-media-slide:first-child img').forEach((img) => {
        expect(img.getAttribute('loading')).to.equal('eager');
        expect(img.hasAttribute('fetchpriority')).to.be.false;
      });
      const rest = [
        ...block.querySelectorAll('.rcc-bg-slide:not(:first-child) img'),
        ...block.querySelectorAll('.rcc-media-slide:not(:first-child) img'),
      ];
      expect(rest).to.have.length(5);
      rest.forEach((img) => {
        expect(img.getAttribute('fetchpriority')).to.equal('low');
        expect(img.hasAttribute('loading')).to.be.false;
      });
    });

    it('uses an empty category label when apps are authored without categories', async () => {
      const block = await loadBlock('no-category');
      expect(block.querySelector('.rcc-category').textContent).to.equal('');
      expect(names(block.querySelectorAll('.rcc-item'))).to.deep.equal(['Express', 'Acrobat']);
      expect(block.querySelector('.rcc-scroll-wrapper').style.height)
        .to.include('100dvh').and.include('400px');
      expect(block.querySelector('.rcc-eyebrow')).to.be.null;
      expect(block.querySelector('h3').className).to.equal('rcc-heading heading-2');
    });
  });

  describe('reduced motion', () => {
    it('renders a static background and grouped list instead of the roller', async () => {
      const block = await loadBlock('default', { reducedMotion: true });
      expect(block.classList.contains('rcc-reduced-motion')).to.be.true;
      expect([...block.children].map((c) => c.className)).to.deep.equal(['rcc-bg', 'rcc-rm-content']);
      expect(block.querySelector('.rcc-scroll-wrapper')).to.be.null;
      const slides = block.querySelectorAll('.rcc-bg-slide');
      expect(slides).to.have.length(1);
      expect(slides[0].classList.contains('is-active')).to.be.true;
      const img = slides[0].querySelector('img');
      expect(img.alt).to.equal('Photoshop artwork');
      expect(img.getAttribute('loading')).to.equal('eager');
      expect(img.getAttribute('fetchpriority')).to.equal('high');
      expect(block.querySelector('.rcc-rm-content > .rcc-header .rcc-heading').textContent)
        .to.equal('Apps for every idea');
    });

    it('groups apps under labelled category headings', async () => {
      const block = await loadBlock('default', { reducedMotion: true });
      const list = block.querySelector('.rcc-rm-list');
      expect([...list.children].map((c) => c.tagName)).to.deep.equal(['DIV', 'UL', 'DIV', 'UL']);
      expect(names(list.querySelectorAll('.rcc-rm-category > h3.rcc-category.heading-6')))
        .to.deep.equal(['Photo', 'Video']);
      list.querySelectorAll('.rcc-rm-category .rcc-divider').forEach((d) => {
        expect(d.getAttribute('aria-hidden')).to.equal('true');
      });
      const groups = [...list.querySelectorAll('ul.rcc-rm-group')];
      expect(groups.map((g) => g.getAttribute('aria-label'))).to.deep.equal(['Photo', 'Video']);
      expect(names(groups[0].querySelectorAll('li.rcc-rm-item'))).to.deep.equal(['Photoshop', 'Lightroom']);
      expect(names(groups[1].querySelectorAll('li.rcc-rm-item'))).to.deep.equal(['Premiere Pro', 'After Effects']);
    });

    it('uses a single unlabelled group when no categories are authored', async () => {
      const block = await loadBlock('no-category', { reducedMotion: true });
      const groups = block.querySelectorAll('.rcc-rm-group');
      expect(groups).to.have.length(1);
      expect(groups[0].hasAttribute('aria-label')).to.be.false;
      expect(names(groups[0].children)).to.deep.equal(['Express', 'Acrobat']);
      expect(block.querySelector('.rcc-rm-category')).to.be.null;
      expect(block.querySelector('.rcc-bg-slide img').alt).to.equal('Express artwork');
    });
  });

  describe('no-op authoring', () => {
    ['single-row', 'no-apps'].forEach((mock) => {
      it(`leaves the authored rows untouched for ${mock}`, async () => {
        document.body.innerHTML = await readFile({ path: `./mocks/${mock}.html` });
        const block = document.querySelector('.roller-carousel');
        const before = block.innerHTML;
        forceReducedMotion(false);
        init(block);
        expect(block.innerHTML).to.equal(before);
        expect(block.querySelector('[class^="rcc-"]')).to.be.null;
        expect(block.classList.contains('rcc-reduced-motion')).to.be.false;
      });
    });
  });
});
