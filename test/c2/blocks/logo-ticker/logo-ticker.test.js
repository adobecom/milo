import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// Required by parsePlaceholderJson in placeholders.js
window.mph = {};

// Capture the IntersectionObserver callback so tests can trigger it
let ioCallback;
window.IntersectionObserver = function MockIO(cb) {
  ioCallback = cb;
  this.observe = sinon.stub();
  this.disconnect = sinon.stub();
};

// ResizeObserver is exercised by init; no callback capture needed
window.ResizeObserver = function MockRO() {
  this.observe = sinon.stub();
  this.disconnect = sinon.stub();
};

// Suppress expected external-fetch console errors from the placeholder fallback path.
// customFetch in utils.js calls bare `fetch` (not window.fetch), so sinon cannot
// intercept it; logo-ticker catches the failure and falls back to default labels.
window.lana = { log: sinon.stub() };

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const { default: init } = await import('../../../../libs/c2/blocks/logo-ticker/logo-ticker.js');

describe('logo-ticker', () => {
  describe('early return', () => {
    it('does not modify the element when no .icon elements are present', async () => {
      const el = document.querySelector('.logo-ticker-no-icons');
      const originalChildCount = el.children.length;
      await init(el);
      expect(el.children.length).to.equal(originalChildCount);
    });
  });

  describe('init with logos', () => {
    let el;
    let track;
    let toggle;

    before(async () => {
      el = document.querySelector('.logo-ticker:not(.logo-ticker-no-icons)');
      await init(el);
      track = el.querySelector('.logo-ticker-track');
      toggle = el.querySelector('.logo-ticker-toggle');
    });

    describe('track structure', () => {
      it('creates a .logo-ticker-track element', () => {
        expect(track).to.exist;
      });

      it('creates exactly two .logo-ticker-set children', () => {
        const sets = track.querySelectorAll('.logo-ticker-set');
        expect(sets.length).to.equal(2);
      });

      it('first set does not have aria-hidden', () => {
        const firstSet = track.querySelector('.logo-ticker-set');
        expect(firstSet.hasAttribute('aria-hidden')).to.be.false;
      });

      it('second set has aria-hidden="true"', () => {
        const sets = track.querySelectorAll('.logo-ticker-set');
        expect(sets[1].getAttribute('aria-hidden')).to.equal('true');
      });

      it('track has role="image"', () => {
        expect(track.getAttribute('role')).to.equal('image');
      });

      it('track aria-label comes from the second child of the block', () => {
        expect(track.getAttribute('aria-label').trim()).to.equal('Trusted by Google, OpenAI, Runway, Pika');
      });

      it('track starts with is-offscreen class', () => {
        expect(track.classList.contains('is-offscreen')).to.be.true;
      });

      it('each logo set clones all original icons', () => {
        const sets = track.querySelectorAll('.logo-ticker-set');
        sets.forEach((set) => {
          expect(set.querySelectorAll('span.icon').length).to.equal(9);
        });
      });
    });

    describe('SVG recoloring', () => {
      it('sets fill on each svg element', () => {
        track.querySelectorAll('svg').forEach((svg) => {
          expect(svg.getAttribute('fill')).to.equal('var(--s2a-color-content-default)');
        });
      });

      it('overrides colored fill attributes on svg children', () => {
        const coloredNodes = track.querySelectorAll('[fill]:not([fill="none"]):not(svg)');
        coloredNodes.forEach((node) => {
          expect(node.getAttribute('fill')).to.equal('var(--s2a-color-content-default)');
        });
      });

      it('leaves fill="none" attributes untouched', () => {
        const noneNodes = track.querySelectorAll('[fill="none"]');
        expect(noneNodes.length).to.be.greaterThan(0);
        noneNodes.forEach((node) => {
          expect(node.getAttribute('fill')).to.equal('none');
        });
      });
    });

    describe('toggle button', () => {
      it('creates a .logo-ticker-toggle button', () => {
        expect(toggle).to.exist;
        expect(toggle.tagName).to.equal('BUTTON');
      });

      it('toggle is aria-pressed="true" by default (playing)', () => {
        expect(toggle.getAttribute('aria-pressed')).to.equal('true');
      });

      it('toggle icon wrap has is-playing class by default', () => {
        const iconWrap = toggle.querySelector('.logo-ticker-toggle-icon');
        expect(iconWrap.classList.contains('is-playing')).to.be.true;
      });

      it('play icon and pause icon are both present', () => {
        expect(toggle.querySelector('.play-icon')).to.exist;
        expect(toggle.querySelector('.pause-icon')).to.exist;
      });

      describe('click to pause', () => {
        before(() => toggle.click());

        it('adds is-paused class to track', () => {
          expect(track.classList.contains('is-paused')).to.be.true;
        });

        it('removes is-playing from icon wrap', () => {
          const iconWrap = toggle.querySelector('.logo-ticker-toggle-icon');
          expect(iconWrap.classList.contains('is-playing')).to.be.false;
        });

        it('sets aria-pressed to "false"', () => {
          expect(toggle.getAttribute('aria-pressed')).to.equal('false');
        });

        describe('click again to play', () => {
          before(() => toggle.click());

          it('removes is-paused from track', () => {
            expect(track.classList.contains('is-paused')).to.be.false;
          });

          it('restores is-playing on icon wrap', () => {
            const iconWrap = toggle.querySelector('.logo-ticker-toggle-icon');
            expect(iconWrap.classList.contains('is-playing')).to.be.true;
          });

          it('sets aria-pressed back to "true"', () => {
            expect(toggle.getAttribute('aria-pressed')).to.equal('true');
          });
        });
      });
    });

    describe('IntersectionObserver', () => {
      it('removes is-offscreen when the element is intersecting', () => {
        ioCallback([{ isIntersecting: true }]);
        expect(track.classList.contains('is-offscreen')).to.be.false;
      });

      it('adds is-offscreen back when element leaves viewport', () => {
        ioCallback([{ isIntersecting: false }]);
        expect(track.classList.contains('is-offscreen')).to.be.true;
      });
    });

    describe('syncTrackMetrics', () => {
      it('sets --logo-ticker-distance CSS custom property on track', () => {
        expect(track.style.getPropertyValue('--logo-ticker-distance')).to.not.equal('');
      });

      it('adds is-static when set content fits within the container', () => {
        // In a test environment with no CSS, offsetWidth and clientWidth are 0
        // so setWidth (0) + 2*gap (0) <= containerWidth (0) is true → is-static
        expect(track.classList.contains('is-static')).to.be.true;
      });
    });

    describe('placeholder labels', () => {
      // In the test environment the placeholder fetch fails gracefully and
      // the block falls back to the built-in default labels.
      it('toggle aria-label is set when playing (defaults to "Pause")', () => {
        const iconWrap = toggle.querySelector('.logo-ticker-toggle-icon');
        if (!iconWrap.classList.contains('is-playing')) toggle.click();
        const label = toggle.getAttribute('aria-label');
        expect(label).to.be.a('string').and.have.length.above(0);
      });

      it('toggle aria-label changes when paused', () => {
        const playingLabel = toggle.getAttribute('aria-label');
        toggle.click(); // pause
        const pausedLabel = toggle.getAttribute('aria-label');
        expect(pausedLabel).to.be.a('string').and.not.equal(playingLabel);
        toggle.click(); // restore
      });

      it('play icon img has a non-empty alt attribute', () => {
        const alt = toggle.querySelector('.play-icon').getAttribute('alt');
        expect(alt).to.be.a('string').and.have.length.above(0);
      });

      it('pause icon img has a non-empty alt attribute', () => {
        const alt = toggle.querySelector('.pause-icon').getAttribute('alt');
        expect(alt).to.be.a('string').and.have.length.above(0);
      });
    });
  });
});
