/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/aside/aside.js');
const types = ['simple', 'split', 'inline'];

describe('aside', () => {
  const asides = document.querySelectorAll('.aside');
  asides.forEach((aside) => {
    init(aside);

    const typeIndex = types.findIndex((v) => aside.classList.contains(v));
    const type = typeIndex >= 0 ? types[typeIndex] : 'default';

    describe(`aside ${type}`, () => {
      const isInline = type === 'inline';

      it('has a heading', () => {
        const heading = aside.querySelector('[class^=heading-]');
        expect(heading).to.exist;
      });

      it('has a body', () => {
        const body = aside.querySelector('[class^=body-]');
        expect(body).to.exist;
      });

      if (type === 'default' || type === isInline) {
        it('has an image', () => {
          const image = aside.querySelector('.image');
          expect(image).to.exist;
        });
      }

      if (type === types[1]) {
        it('has a background image', () => {
          const body = aside.querySelector('.background');
          expect(body).to.exist;
        });
      }
    });
  });
});
