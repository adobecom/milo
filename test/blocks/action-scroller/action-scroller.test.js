import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/action-scroller/action-scroller.js');
const variants = ['navigation'];

describe('action scrollers', () => {
  const actionScroller = document.querySelectorAll('.action-scroller');
  actionScroller.forEach((scroller) => {
    init(scroller);

    const variantIndex = variants.findIndex((v) => scroller.classList.contains(v));
    const variant = variantIndex >= 0 ? variants[variantIndex] : 'default';

    describe(`action scroller ${variant}`, () => {
      it('has action items', () => {
        const actions = scroller.querySelectorAll('.action-item');
        expect(actions).to.be.an('array');
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
      }
    });
  });
});
