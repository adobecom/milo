import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  isAboveFold,
  setLazyImg,
  restoreSrcset,
  observeBlock,
} from '../../libs/utils/lazy-load.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makePicture({ srcset = 'image.webp 800w', src = 'image.jpg' } = {}) {
  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.setAttribute('srcset', srcset);
  const img = document.createElement('img');
  img.src = src;
  picture.append(source, img);
  return { picture, source, img };
}

// ---------------------------------------------------------------------------
// isAboveFold
// ---------------------------------------------------------------------------
describe('isAboveFold', () => {
  let stub;

  afterEach(() => {
    if (stub) stub.restore();
  });

  it('returns true when element top is within 1.5× window.innerHeight', () => {
    const el = document.createElement('div');
    stub = sinon.stub(el, 'getBoundingClientRect').returns({ top: 0 });
    // window.innerHeight is typically 768 in jsdom; 0 < 768 * 1.5 = 1152
    expect(isAboveFold(el)).to.be.true;
  });

  it('returns true when element top equals the threshold', () => {
    const el = document.createElement('div');
    const threshold = window.innerHeight * 1.5 - 1;
    stub = sinon.stub(el, 'getBoundingClientRect').returns({ top: threshold });
    expect(isAboveFold(el)).to.be.true;
  });

  it('returns false when element top is beyond 1.5× window.innerHeight', () => {
    const el = document.createElement('div');
    const beyond = window.innerHeight * 1.5 + 100;
    stub = sinon.stub(el, 'getBoundingClientRect').returns({ top: beyond });
    expect(isAboveFold(el)).to.be.false;
  });
});

// ---------------------------------------------------------------------------
// setLazyImg
// ---------------------------------------------------------------------------
describe('setLazyImg', () => {
  it('sets loading=lazy and decoding=async on the img', () => {
    const { img } = makePicture();
    setLazyImg(img);
    expect(img.getAttribute('loading')).to.equal('lazy');
    expect(img.getAttribute('decoding')).to.equal('async');
  });

  it('removes srcset from sibling source elements and stores it in data-srcset', () => {
    const { picture, source, img } = makePicture({ srcset: 'hero.webp 1200w' });
    document.body.append(picture);
    setLazyImg(img);
    expect(source.hasAttribute('srcset')).to.be.false;
    expect(source.getAttribute('data-srcset')).to.equal('hero.webp 1200w');
    picture.remove();
  });

  it('does not throw when img has no parent picture', () => {
    const img = document.createElement('img');
    img.src = 'standalone.jpg';
    expect(() => setLazyImg(img)).to.not.throw();
    expect(img.getAttribute('loading')).to.equal('lazy');
  });

  it('does not duplicate data-srcset if source has no srcset', () => {
    const picture = document.createElement('picture');
    const source = document.createElement('source'); // no srcset
    const img = document.createElement('img');
    picture.append(source, img);
    setLazyImg(img);
    expect(source.hasAttribute('data-srcset')).to.be.false;
  });
});

// ---------------------------------------------------------------------------
// restoreSrcset
// ---------------------------------------------------------------------------
describe('restoreSrcset', () => {
  it('restores srcset from data-srcset and removes data-srcset', () => {
    const { picture, source, img } = makePicture({ srcset: 'hero.webp 1200w' });
    document.body.append(picture);
    setLazyImg(img);       // withholds srcset
    restoreSrcset(img);    // restores it
    expect(source.getAttribute('srcset')).to.equal('hero.webp 1200w');
    expect(source.hasAttribute('data-srcset')).to.be.false;
    picture.remove();
  });

  it('does not throw when img has no parent picture', () => {
    const img = document.createElement('img');
    expect(() => restoreSrcset(img)).to.not.throw();
  });
});

// ---------------------------------------------------------------------------
// observeBlock
// ---------------------------------------------------------------------------
describe('observeBlock', () => {
  let OriginalIntersectionObserver;

  beforeEach(() => {
    OriginalIntersectionObserver = window.IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = OriginalIntersectionObserver;
  });

  it('calls decorateFn when the element intersects', (done) => {
    let capturedCallback;
    window.IntersectionObserver = class {
      constructor(cb, opts) {
        capturedCallback = cb;
        this.opts = opts;
      }

      observe() {}

      disconnect() {}
    };

    const el = document.createElement('div');
    const decorateFn = sinon.spy();
    observeBlock(el, decorateFn);

    // Simulate intersection
    capturedCallback([{ isIntersecting: true, target: el }], { disconnect: () => {} });

    setTimeout(() => {
      expect(decorateFn.calledOnce).to.be.true;
      done();
    }, 0);
  });

  it('does not call decorateFn when element is not intersecting', () => {
    let capturedCallback;
    window.IntersectionObserver = class {
      constructor(cb) { capturedCallback = cb; }

      observe() {}

      disconnect() {}
    };

    const el = document.createElement('div');
    const decorateFn = sinon.spy();
    observeBlock(el, decorateFn);

    capturedCallback([{ isIntersecting: false, target: el }], { disconnect: () => {} });
    expect(decorateFn.called).to.be.false;
  });

  it('uses rootMargin of 200px', () => {
    let capturedOpts;
    window.IntersectionObserver = class {
      constructor(cb, opts) { capturedOpts = opts; }

      observe() {}

      disconnect() {}
    };

    const el = document.createElement('div');
    observeBlock(el, () => {});
    expect(capturedOpts.rootMargin).to.equal('200px');
  });
});
