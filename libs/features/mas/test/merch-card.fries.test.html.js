import { html } from '@esm-bundle/chai';
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

export default async () => {
    return runTests(async () => {
        mockIms();
        mockLana();
        await mockFetch(withWcs);
        await mas();

        describe('merch-card web component for fries', () => {
            let merchCard;
            beforeEach(() => {
                merchCard = document.querySelector(
                    'merch-card[variant="fries"]#7a679b0a-512a-4129-9e47-9cbfa3a185da',
                );
            });

            it('should be registered and exist', async () => {
                expect(merchCard).to.exist;
            });

            it('should display the components in the expected places', async () => {
                expect(merchCard.querySelector('[slot="icons"]')).to.exist;
                expect(merchCard.querySelector('[slot="badge"]')).to.exist;
                expect(merchCard.querySelector('[slot="trial-badge"]')).to.exist;
                expect(merchCard.querySelector('[slot="heading-xxs"]')).to.exist;
                expect(merchCard.querySelector('[slot="body-s"]')).to.exist;
                expect(merchCard.querySelector('[slot="price"]')).to.exist;
                expect(merchCard.querySelector('[slot="cta"]')).to.exist;
            });

            it('should apply border-color attribute correctly', async () => {
                expect(merchCard.style.getPropertyValue(
                    '--merch-card-custom-border-color',
                )).to.equal('var(--spectrum-gray-300)');
            });

            it('should apply background-color attribute correctly', async () => {
                const backgroundCard = document.getElementById(
                    'fries-card-background-color',
                );
                expect(backgroundCard.getAttribute('background-color')).to.equal(
                    'spectrum-seafoam-100',
                );
                expect(
                    backgroundCard.style.getPropertyValue(
                        '--merch-card-custom-background-color',
                    ),
                ).to.equal('var(--spectrum-seafoam-100)');
            });

            it('should have proper buttons with correct styling', async () => {
                const ctaButton = merchCard.querySelector(
                    '.spectrum-Button--primary',
                );
                expect(ctaButton).to.exist;
                expect(
                    ctaButton.querySelector('.spectrum-Button-label')
                        .textContent,
                ).to.equal('1-month free trial');
            });
        });
    });
}; 
