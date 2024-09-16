// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';
import { mockConfig } from './mocks/config.js';

import '../src/merch-offer.js';
import '../src/merch-offer-select.js';
import '../src/merch-quantity-select.js';

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
    if (skipTests !== null) {
        appendMiloStyles();
        return;
    }
    describe('merch-card web component', () => {
        it('should exist in the HTML document', async () => {
            expect(document.querySelector('merch-card')).to.exist;
        });

        it('should display an action menu on hover for catalog variant', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            catalogCard.dispatchEvent(
                new MouseEvent('mouseover', { bubbles: true }),
            );
            await delay(100);
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');
            const actionMenuContent = shadowRoot.querySelector(
                '.action-menu-content',
            );
            expect(actionMenu.classList.contains('invisible')).to.be.true;
            expect(actionMenuContent.classList.contains('hidden')).to.be.true;
            expect(actionMenu).to.exist;
            expect(actionMenuContent).to.exist;
        });

        it('should display some content when action is clicked for catalog variant', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            catalogCard.dispatchEvent(
                new MouseEvent('mouseover', { bubbles: true }),
            );
            await delay(100);        
            const actionMenu = catalogCard.shadowRoot.querySelector('.action-menu');
            const actionMenuContent = catalogCard.shadowRoot.querySelector(
                '.action-menu-content',
            );
            await actionMenu.click();
            await delay(100);
            expect(actionMenuContent.classList.contains('hidden')).to.be.false;
        });
    });

});
