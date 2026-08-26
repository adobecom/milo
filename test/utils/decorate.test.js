/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import { setBackgroundFocus, decorateBlockText, getButtonType, decoratePictures } from '../../libs/utils/decorate.js';

describe('setBackgroundFocus', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should set objectPosition from data-focal coordinates', () => {
    container.innerHTML = '<picture><img data-title="data-focal:25,75"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('25% 75%');
    expect(img.dataset.title).to.be.undefined;
  });

  it('should handle 0,0 coordinates', () => {
    container.innerHTML = '<picture><img data-title="data-focal:0,0"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('0% 0%');
  });

  it('should handle 100,100 coordinates', () => {
    container.innerHTML = '<picture><img data-title="data-focal:100,100"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('100% 100%');
  });

  it('should do nothing if pic is null', () => {
    expect(() => setBackgroundFocus(null)).to.not.throw();
  });

  it('should do nothing if pic is undefined', () => {
    expect(() => setBackgroundFocus(undefined)).to.not.throw();
  });

  it('should do nothing if no img inside picture', () => {
    container.innerHTML = '<picture></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    expect(pic.innerHTML).to.equal('');
  });

  it('should do nothing if img has no data-title', () => {
    container.innerHTML = '<picture><img></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('');
  });

  it('should do nothing if data-title does not include data-focal', () => {
    container.innerHTML = '<picture><img data-title="some-other-value"></picture>';
    const pic = container.querySelector('picture');
    setBackgroundFocus(pic);
    const img = pic.querySelector('img');
    expect(img.style.objectPosition).to.equal('');
    expect(img.dataset.title).to.equal('some-other-value');
  });

  it('should remove data-title after processing', () => {
    container.innerHTML = '<picture><img data-title="data-focal:50,50"></picture>';
    const pic = container.querySelector('picture');
    const img = pic.querySelector('img');
    expect(img.dataset.title).to.equal('data-focal:50,50');
    setBackgroundFocus(pic);
    expect(img.dataset.title).to.be.undefined;
  });
});

describe('Get button type', () => {
  it('Should return outline for <em><strong> CTA', async () => {
    const ctaParent = document.createElement('em');
    const cta = document.createElement('strong');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    ctaParent.appendChild(cta);
    const type = getButtonType(cta);
    expect(type).to.equal('outline');
  });
  it('Should return outline for <strong><em> CTA', async () => {
    const ctaParent = document.createElement('strong');
    const cta = document.createElement('em');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    ctaParent.appendChild(cta);
    const type = getButtonType(cta);
    expect(type).to.equal('outline');
  });
  it('Should return blue for <strong> CTA', async () => {
    const cta = document.createElement('strong');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    const type = getButtonType(cta);
    expect(type).to.equal('blue');
  });
  it('Should return outline for <em> CTA', async () => {
    const cta = document.createElement('em');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    const type = getButtonType(cta);
    expect(type).to.equal('outline');
  });
  it('Should return blue for <a> CTA', async () => {
    const cta = document.createElement('a');
    cta.innerHTML = '<strong>CTA</strong>';
    const type = getButtonType(cta);
    expect(type).to.equal('blue');
  });
});

describe('decorateBlockText — elContainsText with custom elements', () => {
  if (!customElements.get('mas-field')) {
    customElements.define('mas-field', class extends HTMLElement {});
  }

  it('adds body class to p containing a non-hidden custom element (mas-field)', () => {
    const el = document.createElement('div');
    el.innerHTML = '<h2>Heading</h2><p><mas-field field="ctas"></mas-field></p>';
    decorateBlockText(el, ['m', 'm', 'm']);
    expect(el.querySelector('p').classList.contains('body-m')).to.be.true;
  });

  it('does not add body class to p containing only a hidden custom element', () => {
    const el = document.createElement('div');
    el.innerHTML = '<h2>Heading</h2><p><aem-fragment hidden></aem-fragment></p>';
    decorateBlockText(el, ['m', 'm', 'm']);
    expect(el.querySelector('p').classList.contains('body-m')).to.be.false;
  });

  it('still adds body class to p with plain text', () => {
    const el = document.createElement('div');
    el.innerHTML = '<h2>Heading</h2><p>Some description text</p>';
    decorateBlockText(el, ['m', 'm', 'm']);
    expect(el.querySelector('p').classList.contains('body-m')).to.be.true;
  });
});

describe('decoratePictures', () => {
  function createPicture(imgWidth = 4096) {
    const pic = document.createElement('picture');
    pic.innerHTML = `
      <source type="image/webp" srcset="./original.webp?width=600&format=webply" media="(min-width: 600px)">
      <source type="image/webp" srcset="./original.webp?width=750&format=webply">
      <img loading="lazy" alt="" src="./image.jpg?width=750&format=jpg" width="${imgWidth}" height="100">
    `.trim();
    return pic;
  }

  function srcsetParams(source) {
    const srcset = source.getAttribute('srcset') || '';
    try {
      return new URL(srcset).searchParams;
    } catch {
      const qi = srcset.indexOf('?');
      return new URLSearchParams(qi >= 0 ? srcset.slice(qi + 1) : '');
    }
  }

  let area;

  beforeEach(() => {
    area = document.createElement('div');
    document.body.appendChild(area);
  });

  afterEach(() => {
    area.remove();
  });

  it('does nothing for missing/invalid options', () => {
    expect(() => decoratePictures(null, 'product')).to.not.throw();

    const pic = createPicture();
    area.appendChild(pic);

    [null, '', ',  ,', '1x, product, off', 'unknown'].forEach((opts) => {
      decoratePictures(area, opts);
      expect(pic.classList.contains('large-image-decorated'), `should be inert for options: ${JSON.stringify(opts)}`).to.be.false;
    });
  });

  it('product option: adds webp classes, creates webply sources prepended largest-first', () => {
    const pic = createPicture(4096);
    area.appendChild(pic);
    const originalSources = [...pic.querySelectorAll('source')];
    decoratePictures(area, 'product');

    expect(pic.classList.contains('large-image-decorated')).to.be.true;
    expect(pic.classList.contains('webp-1')).to.be.true;

    const newSources = [...pic.querySelectorAll('source')].filter((s) => !originalSources.includes(s));
    expect(newSources.length).to.equal(5);
    newSources.forEach((s) => {
      expect(s.getAttribute('type')).to.equal('image/webp');
      expect(srcsetParams(s).get('format')).to.equal('webply');
    });

    // Largest rendition first, mobile last among new sources, then originals
    expect(srcsetParams(newSources[0]).get('width')).to.equal('1920');
    const mobileSrc = newSources.at(-1);
    expect(mobileSrc.getAttribute('media')).to.be.null;
    expect(srcsetParams(mobileSrc).get('width')).to.equal('500');

    // Media attributes on intermediate breakpoints
    expect(newSources.find((s) => srcsetParams(s).get('width') === '768').getAttribute('media')).to.equal('(min-width: 768px)');
    expect(newSources.find((s) => srcsetParams(s).get('width') === '1280').getAttribute('media')).to.equal('(min-width: 1280px)');

    // New sources come before the original ones in the DOM
    const allSources = [...pic.querySelectorAll('source')];
    expect(allSources.indexOf(originalSources[0])).to.equal(5);
  });

  it('photography option: adds avif classes and creates avif sources', () => {
    const pic = createPicture();
    area.appendChild(pic);
    const originalSources = [...pic.querySelectorAll('source')];
    decoratePictures(area, 'photography');

    expect(pic.classList.contains('large-image-decorated')).to.be.true;
    expect(pic.classList.contains('avif-1')).to.be.true;

    const newSources = [...pic.querySelectorAll('source')].filter((s) => !originalSources.includes(s));
    expect(newSources.length).to.be.greaterThan(0);
    newSources.forEach((s) => {
      expect(s.getAttribute('type')).to.equal('image/avif');
      expect(srcsetParams(s).get('format')).to.equal('avif');
    });
  });

  it('size multipliers: 2x and 3x scale rendition widths and set the correct class', () => {
    const getNewSources = (pic, originalSources) => [...pic.querySelectorAll('source')]
      .filter((s) => !originalSources.includes(s));

    const pic2x = createPicture(4096);
    area.appendChild(pic2x);
    const orig2x = [...pic2x.querySelectorAll('source')];
    decoratePictures(area, '2x, product');
    expect(pic2x.classList.contains('webp-2')).to.be.true;
    const mobile2x = getNewSources(pic2x, orig2x).find((s) => !s.getAttribute('media'));
    expect(srcsetParams(mobile2x).get('width')).to.equal('1000');

    const pic3x = createPicture(4096);
    area.appendChild(pic3x);
    const orig3x = [...pic3x.querySelectorAll('source')];
    decoratePictures(area, '3x, product');
    expect(pic3x.classList.contains('webp-3')).to.be.true;
    const mobile3x = getNewSources(pic3x, orig3x).find((s) => !s.getAttribute('media'));
    expect(srcsetParams(mobile3x).get('width')).to.equal('1500');
  });

  it('rendition count matches image width: 1 for 600px, 2 for 1000px, 5 for 4096px', () => {
    [[600, 1, ['500']], [1000, 2, ['500', '768']], [4096, 5, null]].forEach(([imgWidth, count, widths]) => {
      const pic = createPicture(imgWidth);
      area.appendChild(pic);
      const originalSources = [...pic.querySelectorAll('source')];
      decoratePictures(area, 'product');
      const newSources = [...pic.querySelectorAll('source')].filter((s) => !originalSources.includes(s));
      expect(newSources.length, `expected ${count} renditions for ${imgWidth}px`).to.equal(count);
      if (widths) {
        expect(newSources.map((s) => srcsetParams(s).get('width')).sort()).to.deep.equal(widths);
      }
      pic.remove();
    });
  });

  it('skips ineligible pictures: already decorated, no sources, no img, non-numeric width', () => {
    // Already decorated
    const decorated = createPicture(4096);
    decorated.classList.add('large-image-decorated');
    area.appendChild(decorated);
    const countBefore = decorated.querySelectorAll('source').length;

    // No sources
    const noSources = document.createElement('picture');
    noSources.innerHTML = '<img loading="lazy" alt="" src="./image.jpg" width="4096" height="100">';
    area.appendChild(noSources);

    // No img
    const noImg = document.createElement('picture');
    noImg.innerHTML = '<source type="image/webp" srcset="./image.webp?format=webply">';
    area.appendChild(noImg);

    // Non-numeric width
    const nanWidth = createPicture('not-a-number');
    area.appendChild(nanWidth);

    decoratePictures(area, 'product');

    expect(decorated.querySelectorAll('source').length).to.equal(countBefore);
    expect(noSources.classList.contains('large-image-decorated')).to.be.false;
    expect(noImg.classList.contains('large-image-decorated')).to.be.false;
    expect(nanWidth.classList.contains('large-image-decorated')).to.be.false;
  });
});
