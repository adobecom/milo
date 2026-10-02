import { expect } from '@esm-bundle/chai';
import { isZoomed, onZoomChange, ZOOM_RATIO_THRESHOLD } from '../../libs/utils/zoom-detect.js';

describe('zoom-detect', () => {
  const originalScreen = window.screen;
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  function setViewport({ screenW, screenH, innerW, innerH }) {
    Object.defineProperty(window, 'screen', {
      value: { width: screenW, height: screenH },
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', { value: innerW, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: innerH, configurable: true });
  }

  afterEach(() => {
    Object.defineProperty(window, 'screen', { value: originalScreen, configurable: true });
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true });
  });

  describe('isZoomed', () => {
    it('returns false for a normal mobile device (screen ~ inner)', () => {
      setViewport({ screenW: 390, screenH: 844, innerW: 390, innerH: 844 });
      expect(isZoomed()).to.equal(false);
    });

    it('returns false for a narrow desktop window (only width narrowed)', () => {
      setViewport({ screenW: 1920, screenH: 1080, innerW: 600, innerH: 1080 });
      expect(isZoomed()).to.equal(false);
    });

    it('returns true when both dimensions are shrunk past the threshold', () => {
      setViewport({ screenW: 1366, screenH: 768, innerW: 300, innerH: 168 });
      expect(isZoomed()).to.equal(true);
    });

    it('respects a custom threshold', () => {
      setViewport({ screenW: 1366, screenH: 768, innerW: 1000, innerH: 560 });
      expect(isZoomed(1.1)).to.equal(true);
      expect(isZoomed(2)).to.equal(false);
    });

    it('returns false when screen dimensions are unavailable', () => {
      setViewport({ screenW: 0, screenH: 0, innerW: 300, innerH: 168 });
      expect(isZoomed()).to.equal(false);
    });

    it('exports the default threshold', () => {
      expect(ZOOM_RATIO_THRESHOLD).to.equal(1.3);
    });
  });

  describe('onZoomChange', () => {
    it('invokes the callback immediately and on resize, and cleans up', () => {
      setViewport({ screenW: 1920, screenH: 1080, innerW: 1920, innerH: 1080 });
      const calls = [];
      const cleanup = onZoomChange((zoomed) => calls.push(zoomed));
      expect(calls).to.deep.equal([false]);

      setViewport({ screenW: 1366, screenH: 768, innerW: 300, innerH: 168 });
      window.dispatchEvent(new Event('resize'));
      expect(calls).to.deep.equal([false, true]);

      cleanup();
      window.dispatchEvent(new Event('resize'));
      expect(calls).to.deep.equal([false, true]);
    });
  });
});
