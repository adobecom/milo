import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/aside/aside.js');

const types = ['simple', 'split', 'inline', 'notification', 'promobar'];

describe('aside', () => {
  const asides = document.querySelectorAll('.aside');
  asides.forEach((aside) => {
    init(aside);

    const typeIndex = types.findIndex((v) => aside.classList.contains(v));
    const type = typeIndex >= 0 ? types[typeIndex] : 'default';

    describe(`aside ${type}`, () => {
      const isInline = type === 'inline';

      if (type !== 'notification') {
        it('has a heading', () => {
          const heading = aside.querySelector('[class^=heading-]');
          expect(heading).to.exist;
        });

        it('icon has a wrapper', () => {
          const icon = aside.querySelector('.text picture, .promo-text picture');
          if (icon) {
            expect(icon.closest('.icon-area')).to.exist;
          }
        });

        it('has a body', () => {
          const body = aside.querySelector('[class^=body-]');
          expect(body).to.exist;
        });

        it('button has a wrapper', () => {
          const button = aside.querySelector('.text .con-button, .promo-text .con-button');
          if (button) {
            expect(button.closest('p')).to.exist;
          }
        });

        if (aside.classList.contains('icon-stack')) {
          it('Has icon stack area', () => {
            const iconStack = aside.querySelector('ul.icon-stack-area');
            expect(iconStack).to.exist;
          });
        }

        if (aside.classList.contains('aspect-ratio')) {
          it('Has aspect ratio set', () => {
            let aspectRatios = '';
            if (aside.classList.contains('aspect-ratio-three')) {
              aspectRatios = aside.querySelector('.mobile-square.tablet-standard.desktop-wide');
              expect(aspectRatios).to.exist;
            } else if (aside.classList.contains('aspect-ratio-two')) {
              aspectRatios = aside.querySelector('.mobile-standard.tablet-wide');
              expect(aspectRatios).to.exist;
            } else if (aside.classList.contains('aspect-ratio-one')) {
              aspectRatios = aside.querySelector('.mobile-standard');
              expect(aspectRatios).to.exist;
            }
          });
        }
      }

      if (type === 'default' || type === isInline) {
        it('has an image', () => {
          const image = aside.querySelector('.image');
          expect(image).to.exist;
        });
      }

      if (type === types[1]) {
        it('has a background image or video', () => {
          const body = aside.querySelector('.split-image');
          expect(body).to.exist;
        });
      }

      if (type === 'promobar') {
        it('has viewport content', () => {
          const viewportContent = aside.querySelectorAll('.promo-text');
          expect(viewportContent.length).to.equal(3);
        });

        if (aside.classList.contains('popup')) {
          it('has promo close button', () => {
            const closeBtn = aside.querySelector('.promo-close');
            expect(closeBtn).to.exist;
          });

          if (aside.classList.contains('mobile-promo-only')) {
            it('has empty tablet block hidden', () => {
              const tabletBlock = aside.querySelector('.tablet-up.hide-block');
              expect(tabletBlock).to.exist;
            });

            it('has empty desktop block hidden', () => {
              const desktopBlock = aside.querySelector('.tablet-up.hide-block');
              expect(desktopBlock).to.exist;
            });
          }

          it('close button click closes the popup', () => {
            const closeBtn = aside.querySelector('.promo-close');
            closeBtn.click();
            expect(aside.closest('.section').classList.contains('close-sticky-section')).to.be.true;
          });
        }
      }
    });
  });
});
