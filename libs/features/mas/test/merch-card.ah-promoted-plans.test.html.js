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

// eslint-disable-next-line import/no-default-export
export default async () => {
    return runTests(async () => {
        mockIms();
        mockLana();
        await mockFetch(withWcs);
        await mas();

        describe('merch-card web component for ah-promoted-plans', () => {
            it('should be registered and exist', async () => {
                expect(
                    document.querySelector(
                        'merch-card[variant="ah-promoted-plans"]',
                    ),
                ).to.exist;
            });

            it('should display the components in the expected places', async () => {
                const merchCard = document.querySelector(
                    'merch-card[variant="ah-promoted-plans"]',
                );

                expect(merchCard.querySelector('[slot="heading-xxxs"]')).to
                    .exist;
                expect(merchCard.querySelector('[slot="body-xxs"]')).to.exist;
                expect(merchCard.querySelector('[slot="price"]')).to.exist;
                expect(merchCard.querySelector('[slot="cta"]')).to.exist;
            });

            it('should apply border-color attribute correctly', async () => {
                const normalBorderCard = document.getElementById(
                    'c802c222-a573-42ed-a217-301daf2e05d2',
                );
                expect(normalBorderCard.getAttribute('border-color')).to.equal(
                    'spectrum-gray-200',
                );
                expect(
                    normalBorderCard.style.getPropertyValue(
                        '--merch-card-custom-border-color',
                    ),
                ).to.equal('var(--spectrum-gray-200)');
            });

            it('should apply gradient-border attribute for gradient borders', async () => {
                const gradientBorderCard = document.getElementById(
                    '031e2f50-5cbc-4e4b-af9b-c63f0e4f2a93',
                );
                expect(
                    gradientBorderCard.getAttribute('gradient-border'),
                ).to.equal('true');
                expect(
                    gradientBorderCard.getAttribute('border-color'),
                ).to.include('linear-gradient');
                expect(
                    gradientBorderCard.style.getPropertyValue(
                        '--merch-card-custom-border-color',
                    ),
                ).to.equal('');
            });

            it('should have proper buttons with correct styling', async () => {
                const acrobatCard = document.getElementById(
                    'c802c222-a573-42ed-a217-301daf2e05d2',
                );
                const primaryButton = acrobatCard.querySelector(
                    '.spectrum-Button--primary',
                );
                const secondaryButton = acrobatCard.querySelector(
                    '.spectrum-Button--secondary',
                );

                expect(primaryButton).to.exist;
                expect(secondaryButton).to.exist;
                expect(
                    primaryButton.querySelector('.spectrum-Button-label')
                        .textContent,
                ).to.equal('Buy now');

                const creativeCloudCard = document.getElementById(
                    '031e2f50-5cbc-4e4b-af9b-c63f0e4f2a93',
                );
                const accentButton = creativeCloudCard.querySelector(
                    '.spectrum-Button--accent',
                );

                expect(accentButton).to.exist;
                expect(
                    accentButton.querySelector('.spectrum-Button-label')
                        .textContent,
                ).to.equal('Buy now');
            });
        });
    });
};
