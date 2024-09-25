// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import '../src/merch-offer.js';
import '../src/merch-offer-select.js';
import '../src/merch-quantity-select.js';

import { appendMiloStyles } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import mas from './mas.js';

const skipTests = sessionStorage.getItem('skipTests');

runTests(async () => {
  mockIms();
  mockLana();
  await mockFetch(withWcs);
  await mas();
  if (skipTests !== null) {
    appendMiloStyles();
    return;
  };

  describe('merch-card web component', () => {
    it('product should have same body slot heights', async () => {
      const products = document.querySelectorAll(
        'merch-card[variant="product"]',
      );
      await Promise.all(
        [...products].flatMap((card) => {
          return [
            card.updateComplete,
            ...[...card.querySelectorAll('[data-wcs-osi]')].map(
              (osi) => osi.onceSettled(),
            ),
          ];
        }),
      );

      const [card1Slots, card2Slots, card3Slots] = [
        ...products,
      ].map((product) => {
        const heights = [
          'slot[name="heading-xs"]',
          'slot[name="body-xxs"]',
          'slot[name="body-xs"]',
          'slot[name="callout-content"]',
          'slot[name="body-lower"]',
        ]
          .map((selector) => {
            const el =
              product.shadowRoot.querySelector(selector);
            if (!el) return 0;
            return parseInt(window.getComputedStyle(el).height);
          })
          .join(',');
        return heights;
      });
      expect(card1Slots).to.not.contain('auto');
      expect(card1Slots).to.equal(card2Slots);
      expect(card2Slots).to.equal(card3Slots);
    });
  });
});
