import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/action-item/action-item.js');
const variants = ['float-button', 'float-icon'];

describe('action item blocks', () => {
  const actionItems = document.querySelectorAll('.action-item');
  actionItems.forEach((actionItem) => {
    init(actionItem);

    const variantIndex = variants.findIndex((v) => actionItem.classList.contains(v));
    const variant = variantIndex >= 0 ? variants[variantIndex] : 'default';

    describe(`action item ${variant}`, () => {
      it('has an image', () => {
        const image = actionItem.querySelector('.main-image');
        expect(image).to.exist;
      });

      it('has an link', () => {
        const link = actionItem.querySelector('a');
        expect(link).to.exist;
      });

      it('has text', () => {
        const text = actionItem.querySelector('p');
        expect(text).to.exist;
      });

      if (variant === variants[0]) {
        it('has floated button', () => {
          const button = actionItem.querySelector('.con-button');
          expect(button).to.exist;
        });
      }

      if (variant === variants[1]) {
        it('has floated icon', () => {
          const icon = actionItem.querySelector('.floated-icon');
          expect(icon).to.exist;
        });
      }
    });
  });
});
