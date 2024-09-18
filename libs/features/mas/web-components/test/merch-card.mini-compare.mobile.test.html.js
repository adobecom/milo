// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';
import { mockConfig } from './mocks/config.js';

import '../src/merch-offer.js';
import '../src/merch-offer-select.js';
import '../src/merch-quantity-select.js';

import { appendMiloStyles, toggleMobile } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import mas from './mas.js';

runTests(async () => {
    await toggleMobile();
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await mas();
    describe('[mobile] merch-card web component with mini-compare variant', () => {
        it('[mobile] mini-compare-chart should have same body slot heights', async () => {
            const miniCompareCharts = document.querySelectorAll(
                'merch-card[variant="mini-compare-chart"]',
            );
            await Promise.all(
                [...miniCompareCharts].flatMap((card) => {
                    return [
                        card.updateComplete,
                        ...[...card.querySelectorAll('[data-wcs-osi]')].map(
                            (osi) => osi.onceSettled(),
                        ),
                    ];
                }),
            );
            const [card1Slots, card2Slots, card3Slots] = [
                ...miniCompareCharts,
            ].map((miniCompareChart) => {
                const heights = [
                    'slot[name="heading-m"]',
                    'slot[name="body-m"]',
                    'slot[name="heading-m-price"]',
                    'slot[name="price-commitment"]',
                    'slot[name="offers"]',
                    'slot[name="promo-text"]',
                    'slot[name="callout-content"]',
                    'footer',
                ]
                    .map((selector) =>
                        Math.round(
                            window.getComputedStyle(
                                miniCompareChart.shadowRoot.querySelector(
                                    selector,
                                ),
                            ).height,
                        ),
                    )
                    .join(',');
                return heights;
            });
            expect(card1Slots).to.not.contain('auto');
            expect(card1Slots).to.equal(card2Slots);
            expect(card2Slots).to.equal(card3Slots);
        });

        it('[mobile] mini-compare-chart should remove empty rows', async () => {
            const miniCompareChart = document.querySelector(
                'merch-card[variant="mini-compare-chart"]',
            );
            miniCompareChart?.variantLayout?.removeEmptyRows();
            expect(true, 'removing empty lines do not fail').to.be.true; // TODO improve the assertion
        });
    });
});
