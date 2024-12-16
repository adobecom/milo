// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import './spectrum.js';
import '../src/merch-offer.js';
import '../src/merch-offer-select.js';
import '../src/merch-quantity-select.js';

import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import mas from './mas.js';


runTests(async () => {
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await mas();
    
    describe('merch-card web component', () => {
        it('should exist in the HTML document', async () => {
            expect(document.querySelector('merch-card[variant="pricing-widget"]')).to.exist;
        });
    });
});
