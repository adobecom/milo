// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';
import { mockConfig } from './mocks/config.js';

import { appendMiloStyles, delay } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import mas from './mas.js';

const skipTests = sessionStorage.getItem('skipTests');

runTests(async () => {
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await mas();
    
    describe('merch-card web component', () => {
      it('should exist in the HTML document', async () => {
          expect(document.querySelector('merch-card[variant="ccd-slice"]')).to.exist;
      });

      it('should display a CTA', async () => {
          const ccdSliceCard = document.querySelector(
            'merch-card[variant="ccd-slice"]',
          );
          const shadowRoot = ccdSliceCard.shadowRoot;
          const cta = ccdSliceCard.querySelector('.con-button');
          expect(cta).to.exist;
      });
  
      it('should have correct attributes for the ccd-slice wide card', async () => {
          const ccdSliceWideCard = document.querySelector('merch-card[variant="ccd-slice"][size="wide"]');
          expect(ccdSliceWideCard.getAttribute('variant')).to.equal('ccd-slice');
          expect(ccdSliceWideCard.getAttribute('size')).to.equal('wide');
      });
  
      it('should display a CTA in the ccd-slice wide card', async () => {
          const ccdSliceWideCard = document.querySelector('merch-card[variant="ccd-slice"][size="wide"]');
          const cta = ccdSliceWideCard.querySelector('.con-button');
          expect(cta).to.exist;
      });
    });

});
