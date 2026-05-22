import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

window.ResizeObserver = function MockRO() {
  this.observe = sinon.stub();
  this.disconnect = sinon.stub();
};

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const { default: init } = await import('../../../../libs/c2/blocks/logo-ticker/logo-ticker.js');

describe('logo-ticker', () => {
  describe('early return', () => {
    it('does not modify the element when no .icon elements are present', () => {
      const el = document.querySelector('.logo-ticker-no-icons');
      const originalChildCount = el.children.length;
      init(el);
      expect(el.children.length).to.equal(originalChildCount);
    });
  });

  describe('init with logos', () => {
    let el;
    let track;

    before(() => {
      el = document.querySelector('.logo-ticker:not(.logo-ticker-no-icons)');
      init(el);
      track = el.querySelector('.logo-ticker-track');
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

      it('each logo set clones all original icons', () => {
        const sets = track.querySelectorAll('.logo-ticker-set');
        sets.forEach((set) => {
          expect(set.querySelectorAll('span.icon').length).to.equal(9);
        });
      });

      it('does not create a play/pause toggle button', () => {
        expect(el.querySelector('.logo-ticker-toggle')).to.be.null;
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

    describe('syncTrackMetrics', () => {
      it('adds is-static when set content fits within the container', () => {
        // In a test environment with no CSS, offsetWidth and clientWidth are 0
        // so setWidth (0) + 2*gap (0) <= containerWidth (0) is true → is-static
        expect(track.classList.contains('is-static')).to.be.true;
      });
    });
  });
});
