import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadStyle } from '../../../libs/utils/utils.js';
import { delay } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, getScrollerPropertyValues, hideNavigation } = await import('../../../libs/blocks/action-scroller/action-scroller.js');
const variants = ['navigation'];

const loadStyles = (path) => new Promise((resolve) => {
  loadStyle(`../../../../libs/${path}`, resolve);
});

describe('action scrollers', () => {
  before(async () => {
    await Promise.all([
      loadStyles('../../../libs/styles/styles.css'),
      loadStyles('../../../libs/blocks/action-scroller/action-scroller.css'),
      loadStyles('../../../libs/blocks/section-metadata/section-metadata.css'),
    ]);
  });

  const actionScroller = document.querySelectorAll('.action-scroller:not(.utility):not(.no-links)');
  actionScroller.forEach((scroller) => {
    init(scroller);

    const variantIndex = variants.findIndex((v) => scroller.classList.contains(v));
    const variant = variantIndex >= 0 ? variants[variantIndex] : 'default';

    describe(`action scroller ${variant}`, () => {
      it('has action scroller', () => {
        expect(scroller).to.exist;
      });

      if (variant === variants[0]) {
        it('has a previous button', () => {
          const prev = scroller.querySelector('.previous');
          expect(prev).to.exist;
        });

        it('has a next button', () => {
          const next = scroller.querySelector('.next');
          expect(next).to.exist;
        });

        it('can scroll next', async () => {
          const scrollArea = scroller.querySelector('.scroller');
          const nextBtn = scroller.querySelector('.next-button');
          nextBtn.click();
          await delay(200);
          const scrolled = scrollArea.scrollLeft > 0;
          expect(scrolled).to.be.true;
        });
        it('can scroll previous', async () => {
          const scrollArea = scroller.querySelector('.scroller');
          const prevBtn = scroller.querySelector('.previous-button');
          const initScrollPos = scrollArea.scrollLeft;
          prevBtn.click();
          await delay(200);
          const scrolledBack = initScrollPos > scrollArea.scrollLeft;
          expect(scrolledBack).to.be.true;
        });
      }
    });
  });

  describe('action scroller a11y (WCAG 1.3.2)', () => {
    let noLinksEl;
    let noLinksScroller;
    let linkedEl;
    let linkedScroller;

    before(() => {
      noLinksEl = document.querySelector('.action-scroller.no-links');
      init(noLinksEl);
      noLinksScroller = noLinksEl.querySelector('.scroller');

      linkedEl = document.querySelector('.action-scroller.navigation.grid-align-end');
      linkedScroller = linkedEl.querySelector('.scroller');
    });

    it('scroller without links does not have tabindex', () => {
      expect(noLinksScroller.hasAttribute('tabindex')).to.be.false;
    });

    it('visual scroller is hidden from AT to avoid scroll-clipping issues', () => {
      expect(noLinksScroller.getAttribute('aria-hidden')).to.equal('true');
    });

    it('a sr-only paragraph is appended with all image names for single-pass AT reading', () => {
      const srP = noLinksEl.querySelector('p.sr-only');
      expect(srP).to.exist;
      expect(srP.textContent).to.equal('LinkedIn, Dropbox, Slack, Google');
    });

    it('nav buttons are present and focusable for keyboard users', () => {
      const prevBtn = noLinksEl.querySelector('.previous-button');
      const nextBtn = noLinksEl.querySelector('.next-button');
      expect(prevBtn).to.exist;
      expect(nextBtn).to.exist;
      expect(prevBtn.getAttribute('tabindex')).to.not.equal('-1');
      expect(nextBtn.getAttribute('tabindex')).to.not.equal('-1');
    });

    it('images in link-free items load eagerly so alt text is in the accessibility tree', () => {
      expect(noLinksScroller.querySelectorAll('img[loading="lazy"]').length).to.equal(0);
      expect(noLinksScroller.querySelectorAll('img[loading="eager"]').length).to.be.greaterThan(0);
    });

    it('images in linked items also load eagerly so NVDA announces "graphic" consistently', () => {
      expect(linkedScroller.querySelectorAll('img[loading="lazy"]').length).to.equal(0);
      expect(linkedScroller.querySelectorAll('img[loading="eager"]').length).to.be.greaterThan(0);
    });
  });

  describe('Helper functions', () => {
    it('Should return element style properties', () => {
      const el = document.querySelector('.action-scroller.utility');
      init(el);
      const scroller = el.querySelector('.scroller');
      const {
        itemWidth,
        columns,
        gridGap,
        scrollDistance,
        padding,
      } = getScrollerPropertyValues(scroller);
      expect(itemWidth).to.equal(210);
      expect(columns).to.equal(3);
      expect(gridGap).to.equal(32);
      expect(padding).to.equal(50);
      expect(scrollDistance).to.equal(itemWidth + gridGap);
    });
    it('Should hide navigation when action items fit the container', () => {
      const el = document.querySelector('.action-scroller.utility');
      init(el);
      const scroller = el.querySelector('.scroller');
      const shouldHide = hideNavigation(scroller);
      expect(shouldHide).to.be.true;
    });
    it('Should show navigation when action items don\'t fit the container', () => {
      const el = document.querySelector('.action-scroller.utility');
      init(el);
      el.style.width = '300px';
      const scroller = el.querySelector('.scroller');
      const shouldHide = hideNavigation(scroller);
      expect(shouldHide).to.be.false;
    });
    it('Should show navigation when scroller has display none and action items don\'t fit the container', () => {
      window.innerWidth = 300;
      const el = document.querySelector('.action-scroller.utility');
      el.style.display = 'none';
      init(el);
      const scroller = el.querySelector('.scroller');
      const shouldHide = hideNavigation(scroller);
      expect(shouldHide).to.be.false;
    });
  });
});
