import { expect } from '@esm-bundle/chai';
import { fitsInViewport, viewportHeight } from '../../libs/utils/viewport-fit.js';

describe('viewport-fit', () => {
  const root = document.documentElement;

  function setClientHeight(value) {
    Object.defineProperty(root, 'clientHeight', { value, configurable: true });
  }

  afterEach(() => {
    delete root.clientHeight;
  });

  it('reads the layout viewport height', () => {
    setClientHeight(659);
    expect(viewportHeight()).to.equal(659);
  });

  it('falls back to innerHeight when clientHeight is unavailable', () => {
    setClientHeight(0);
    expect(viewportHeight()).to.equal(window.innerHeight);
  });

  it('fits when top + height is within the viewport', () => {
    setClientHeight(700);
    expect(fitsInViewport(540, 145)).to.be.true;
    expect(fitsInViewport(555, 145)).to.be.true;
  });

  it('does not fit when top + height exceeds the viewport', () => {
    setClientHeight(325);
    expect(fitsInViewport(540, 145)).to.be.false;
    expect(fitsInViewport(326)).to.be.false;
  });
});
